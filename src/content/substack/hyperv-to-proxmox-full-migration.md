---
title: "The Complete Hyper-V to Proxmox Migration: Domain Controllers, Imaging, and Eliminating Microsoft Dependencies"
pubDate: 2026-02-28
description: "A detailed walkthrough of migrating an entire educational institution's infrastructure from Microsoft Hyper-V to Proxmox VE, including Active Directory, SCCM replacement, and UniFi controller migration."
tags: ["proxmox", "hyper-v", "migration", "active-directory", "fog-project", "infrastructure"]
---

## The Problem

Here's the situation I inherited: a college network department running Hyper-V for virtualization, SCCM for workstation imaging, a DFS namespace for file sharing, and a UniFi controller buried inside a Windows 11 VM that you could only reach by RDP'ing into the Hyper-V host first. Every layer was a Microsoft dependency, and every dependency was a licensing cost.

Then Broadcom acquired VMware and started charging $350/core/year for VCF licensing. They killed the VMware IT Academy program entirely. The institution had already moved from vSphere to Hyper-V as a cost-saving measure, but the broader message was clear: commercial hypervisor licensing is unpredictable. Open source isn't.

This post documents the full migration. Not the theory. The actual process, with the commands I ran, the problems I hit, and the decisions I made along the way.

## Scoping the Migration

Before touching anything, I mapped every workload on Hyper-V:

| Workload | Type | Migration Strategy |
|----------|------|-------------------|
| DC1, DC2 | Active Directory Domain Controllers | Leapfrog (rebuild, never V2V) |
| LibreNMS, Netdisco, Switchmap | Linux network monitoring | VHDX to QCOW2 conversion |
| File Server | Windows file shares | Full rebuild on Samba AD |
| UniFi Controller | WiFi management | Backup/restore to LXC |
| SCCM | Workstation imaging | Replace with FOG Project |

The key principle: **no V2V for domain controllers.** USN rollback is not a theoretical risk. It's a guaranteed corruption event if you convert a DC's virtual disk between hypervisors. Every other workload could be converted or rebuilt.

## Domain Controllers: The Leapfrog

Active Directory replication is one of those technologies that sysadmins both rely on and distrust. It's been rock-solid since Windows Server 2003, but because the failure mode is catastrophic (corrupted AD database, no recovery), everyone treats it like it's fragile.

The leapfrog method exploits the fact that AD replication is, in fact, reliable:

**Round 1: Move DC1 to Proxmox**

With DC1 and DC2 both on Hyper-V, I transferred all five FSMO roles to DC2:

```powershell
Move-ADDirectoryServerOperationMasterRole -Identity "DC2" `
  -OperationMasterRole SchemaMaster, DomainNamingMaster, `
  PDCEmulator, RIDMaster, InfrastructureMaster
```

Then verified everything was healthy:

```powershell
# Check replication
repadmin /showrepl

# Check FSMO holders
netdom query fsmo

# Verify DNS
dcdiag /test:dns /v
```

With DC2 confirmed as the sole FSMO holder, I deleted DC1, built a fresh Windows Server VM on Proxmox, promoted it, and let AD replication sync everything from DC2. Checked DHCP scopes, DNS zones, and computer objects. All present.

**Round 2: Move DC2 to Proxmox**

Transferred FSMO roles back to the new DC1 on Proxmox. Verified. Deleted DC2 on Hyper-V, built fresh on Proxmox, promoted. AD replicated from DC1.

Both domain controllers now live on Proxmox. The entire process caused zero authentication disruptions because at every step, at least one healthy DC was available.

## Linux VM Conversion

For Linux VMs, the process is mechanical but has specific gotchas.

**Creating the Shell VM**

In Proxmox, create a VM but match the BIOS to the Hyper-V source:
- Hyper-V Gen 1 = SeaBIOS in Proxmox
- Hyper-V Gen 2 = OVMF (UEFI) in Proxmox, q35 machine type

Critical: **do not create a hard drive.** The disk list should be completely empty. You're creating a chassis, not a full VM.

**Transferring the Disk**

From the Hyper-V host (PowerShell):
```powershell
scp "C:\Hyper-V\VMs\Netdisco\disk.vhdx" root@proxmox:/var/lib/vz/dump/
```

On Proxmox:
```bash
qm importdisk 102 /var/lib/vz/dump/disk.vhdx local-lvm
```

Then in the Proxmox GUI: Hardware > double-click Unused Disk 0 > Add as SCSI. Set boot order to prioritize scsi0.

**Post-Migration Issues**

Every Linux VM had the same two problems:

1. **Network interface rename.** Hyper-V uses `eth0`, Proxmox's VirtIO driver presents as `ens18`. Fix: update `/etc/netplan/*.yaml` with the new interface name, run `netplan apply`.

2. **Missing QEMU Guest Agent.** Without it, Proxmox can't see the VM's IP or gracefully shut it down. Fix: `apt install qemu-guest-agent && systemctl enable --now qemu-guest-agent`.

Application-specific issues:
- **LibreNMS:** Permissions completely broken after disk transfer. Run `validate.php` as the librenms user and follow every single instruction. It knows exactly what's wrong.
- **Netdisco:** Database connection refused (hardcoded IP instead of localhost), plus a missing session cookie key that caused silent crashes. Both fixes in `~/environments/deployment.yml`.

## Eliminating DFS

The old file sharing setup used a DFS namespace. For anyone unfamiliar: DFS creates a virtual path (`\\domain\dfs\folder`) that redirects to the actual server. The idea is that you can swap servers without changing user drive mappings.

In practice, for a single-server environment, DFS just adds a caching layer that causes confusion. Clients cache the DFS referral for 30 minutes. If you change the target, users don't see the change until their cache expires. You can flush it manually with `dfsutil /pktflush`, but that requires touching every client.

I replaced it with Group Policy Preferences drive mappings:

- **X:\** for faculty and staff (mapped to the full file server, item-level targeted to the Faculty-Staff security group)
- **Y:\** for students (mapped to student folders only, item-level targeted to the Students security group)

GPO Preferences are visible in `gpresult` reports, apply at policy refresh (not just login), and you can target by security group without writing conditional batch scripts. Simpler, more transparent, easier to troubleshoot.

## UniFi Controller: The RDP Nesting Problem

The UniFi controller situation was a perfect example of unnecessary complexity. It was running on a Windows 11 VM inside Hyper-V. To manage the campus WiFi:

1. RDP into the Hyper-V host
2. Open Hyper-V Manager
3. Connect to the Windows 11 VM's console
4. Open a browser inside that VM
5. Navigate to the UniFi controller web UI

No SSH access to the host. No direct network access to the VM. Just nested remote desktop sessions.

The fix was trivial:

1. Export the UniFi backup (.unf) from the Windows controller UI
2. Create an LXC container on Proxmox using the official UniFi template
3. Upload the backup and restore

Every WAP configuration, SSID, client record, and network setting transferred cleanly. The controller is now running in a lightweight container that I can SSH into directly. The Windows 11 VM consumed 4GB of RAM for what is essentially a Java web application. The LXC container uses a fraction of that.

## Replacing SCCM with FOG Project

SCCM (System Center Configuration Manager) is Microsoft's enterprise deployment platform. It handles OS imaging, software distribution, patch management, and compliance reporting. It's also massively over-engineered for a college lab environment that needs to reimage classrooms between semesters.

[FOG Project](https://github.com/FOGProject/) is an open-source alternative that handles exactly what we need: PXE boot imaging, host inventory, and group-based deployment. It runs on a single Linux VM.

### Building the Golden Image

The golden image process is straightforward: prep a reference machine, Sysprep it, capture with FOG.

**Debloat.** Install Windows 11 on a reference machine, then run [Chris Titus Tech's Windows Utility](https://github.com/ChrisTitusTech/winutil) to strip all the preinstalled garbage. Candy Crush, Spotify, Xbox, telemetry services. The tool handles both installed and provisioned Appx packages, which matters because leftover staged provisioned packages are the number one cause of silent Sysprep failures. If Sysprep gives you a cryptic error, check for leftover Appx packages first.

**Unattend.xml.** Windows 11 forces you to connect to the internet during OOBE. The `BypassNRO` registry key skips this requirement. I drop an answer file at `C:\Windows\Panther\unattend.xml` that handles the bypass and automates OOBE setup after the image gets deployed to a workstation.

**Sysprep and Capture.** Once the machine is configured:

```
C:\Windows\System32\Sysprep\sysprep.exe /generalize /oobe /shutdown /unattend:C:\Windows\Panther\unattend.xml
```

The machine shuts down. Do NOT power it back on. Go to the FOG web GUI, schedule a Capture task for this host, then PXE boot the machine. FOG captures the sysprepped image as-is, frozen at OOBE.

When the image deploys to a workstation later, the unattend.xml automates OOBE setup, the FOG service agent kicks in for background management, and AD auto-join handles domain membership. No manual touch required at the workstation.

### Per-Classroom Deployment

Each classroom has different hardware (different Dell models across different building renovations), so I maintain a separate image per room. Every workstation is registered in FOG via CSV import: hostname, MAC address, classroom group, assigned image.

When a classroom needs reimaging, I select the group in FOG and schedule a deploy task. The workstations PXE boot using `snponly.efi` (DHCP Option 66 points to the FOG server, Option 67 specifies the boot file). FOG uses Partclone for the actual imaging, which only transfers used disk blocks. A 60GB Windows installation on a 256GB drive doesn't transfer 256GB.

The FOG agent runs on every workstation in the background, communicating with the server through a dedicated `fog-service` Active Directory service account. This allows FOG to inventory hardware, push tasks, and manage hosts without requiring manual interaction.

## Results

Every production workload is now running on Proxmox VE. Two domain controllers, three network monitoring tools, a Samba AD file server, FOG imaging, and a UniFi controller. All on open-source infrastructure.

| Metric | Before | After |
|--------|--------|-------|
| Hypervisor licensing | Per-socket | $0 |
| Imaging platform | SCCM (licensed) | FOG Project (free) |
| WiFi management | Nested RDP | Direct SSH/web |
| File sharing | DFS namespace | GPO drive maps |
| DC management | Single Hyper-V host | Proxmox cluster |

The migration required careful planning, especially for the domain controllers. But none of it was technically beyond what a competent sysadmin can handle. The hardest part is trusting that AD replication works. It does.
