---
title: "I Migrated Our Entire Infrastructure from Hyper-V to Proxmox. Here's Everything I Learned."
pubDate: 2026-02-28
description: "Domain controllers, file servers, network monitoring, imaging, WiFi controllers. All of it moved from Microsoft to open source. No downtime. No data loss. Here's the complete playbook."
tags: ["proxmox", "hyper-v", "migration", "infrastructure", "active-directory", "sysadmin"]
---

## Why We Left Hyper-V

Broadcom acquired VMware and started charging $350/core/year for VCF licensing. They killed the VMware IT Academy program entirely. The institution moved from vSphere to Hyper-V as a cost-saving measure, but I'd already done a VMware to Proxmox migration on my own infrastructure at that point. That migration opened my eyes to how good Proxmox actually is.

It's more lightweight. The web UI gives you more granular control than Hyper-V Manager ever did. Snapshots, live migration, ZFS, LXC containers, and full KVM virtualization all in one platform. Completely free. No per-socket licensing, no Windows Server dependency, no CALs. One less thing Microsoft gets to hold over your budget.

Hyper-V felt heavy by comparison. Limited Linux VM support, clunky management (RDP into the host just to touch anything), and tight coupling to Windows Server licensing. Once I'd seen what Proxmox could do, going back to Hyper-V felt like a downgrade.

The question was never "should we migrate?" It was "how do we migrate production Active Directory, network monitoring, file servers, and imaging infrastructure without breaking anything?"

## The Domain Controller Leapfrog

This was the part that scared me most. Domain controllers are the heartbeat of a Windows network. Every authentication, every group policy, every DNS lookup flows through them. Get this wrong and the whole campus goes dark.

The conventional wisdom is clear: **never V2V a domain controller.** Converting a DC's virtual disk risks USN rollback, which permanently corrupts the AD replication database. There's no recovery path short of rebuilding the entire domain.

Instead, I used what I call the "leapfrog" method. We had two DCs: DC1 and DC2, both on Hyper-V.

**Step 1:** Transfer all five FSMO roles to DC2. Verify DHCP scopes, DNS zones, and AD replication are healthy. DC2 is now running the show.

**Step 2:** Delete DC1. Build a fresh Windows Server VM on Proxmox. Promote it to domain controller. AD replication syncs everything from DC2 automatically.

**Step 3:** Transfer all FSMO roles to the new DC1 on Proxmox. Verify everything.

**Step 4:** Delete DC2 on Hyper-V. Build fresh on Proxmox. Promote. AD replicates from DC1.

Both domain controllers are now on Proxmox. Zero downtime. Zero data loss. The whole process was honestly easier than I expected because AD replication just works when you let it do its job.

The PowerShell for the FSMO transfer is one command:

```powershell
Move-ADDirectoryServerOperationMasterRole -Identity "NEW-DC1" `
  -OperationMasterRole SchemaMaster, DomainNamingMaster, `
  PDCEmulator, RIDMaster, InfrastructureMaster
```

Always verify with `repadmin /showrepl` after each promotion and transfer. If replication shows errors, stop and fix them before proceeding.

## Linux VM Migration: The V2V Process

For Linux VMs (LibreNMS, Netdisco, Switchmap), I used direct disk conversion. The process:

1. **Create a "shell" VM** in Proxmox. Set the OS type, match the BIOS to the source Hyper-V generation (Gen 1 = SeaBIOS, Gen 2 = OVMF UEFI), but **do not create a hard drive.** The disk list should be empty.

2. **SCP the VHDX** from the Hyper-V host to Proxmox:
```powershell
scp "C:\Path\To\Disk.vhdx" root@PROXMOX_IP:/var/lib/vz/dump/
```

3. **Import and attach** on the Proxmox side:
```bash
qm importdisk 102 /var/lib/vz/dump/Netdisco.vhdx local-lvm
```

Then in the GUI: Hardware > double-click Unused Disk 0 > add as SCSI. Set boot order to prioritize scsi0.

**Post-migration gotchas:**
- Network interface names change (eth0 becomes ens18). Update your netplan config.
- Install `qemu-guest-agent` so Proxmox can see the VM's IP and gracefully shut it down.
- LibreNMS needed a full permissions reset. Run `validate.php` as the librenms user and follow every instruction it gives you.
- Netdisco needed its database host changed to localhost in `deployment.yml` and a session cookie key added to prevent crashes.

## Killing DFS, Simplifying Drive Maps

The old environment used a DFS namespace to abstract file server paths. For a single-server environment, DFS adds complexity that provides no benefit: 30-minute referral TTL, client cache issues, and another layer to troubleshoot when users can't access files.

I ripped it out and replaced it with Group Policy Preferences drive mappings using item-level targeting:

- **X:\** mapped for faculty and staff, pointing to the full file server
- **Y:\** mapped for students, pointing to the student folders only

Security group membership determines which mapping a user gets. No login scripts, no DFS, no namespace caching. If a user is in the Faculty-Staff group, they get X:\. If they're in the Students group, they get Y:\. Simple.

## UniFi Controller: Windows VM to LXC Container

This one was almost comical. The UniFi controller was running on a Windows 11 VM inside Hyper-V. To manage the WiFi, you had to RDP into the Hyper-V host, then log into the Windows VM from there. No SSH. No remote management. Just nested RDP sessions.

The migration:

1. Export the UniFi backup (.unf file) from the Windows controller
2. Create an LXC container on Proxmox using the official UniFi template
3. Upload the .unf backup and restore

All WAP configurations, SSIDs, and client data came over intact. WiFi was back up in minutes. And now it runs in a lightweight container instead of a full Windows 11 VM. The resource savings alone made it worthwhile.

## Replacing SCCM with FOG Project

Microsoft SCCM is powerful but absurdly heavy for an educational lab environment. It needs Windows Server, SQL Server, per-device licensing, and significant infrastructure just to image workstations.

[FOG Project](https://github.com/FOGProject/) does everything we actually need: PXE boot imaging, hardware inventory, and centralized workstation management. It runs on Linux, costs nothing, and the web UI is straightforward.

### The Golden Image Pipeline

I build golden images as Proxmox VMs (not on physical hardware) so I can snapshot before Sysprep. This is critical because if Sysprep fails, you cannot simply run it again. The only recovery is reverting to a snapshot.

**Phase 1: Audit Mode.** Install Windows 11, press `Ctrl+Shift+F3` at the OOBE region screen. This drops you into the built-in Administrator account before any user setup. Strip all the bloatware (Candy Crush, Spotify, etc.) with PowerShell. Staged Appx packages are the number one cause of silent Sysprep failures.

**Phase 2: Unattend.xml.** Create an answer file that handles BypassNRO (Windows 11's forced internet requirement), skips privacy screens, and creates a local admin account. Post-deployment script deletes the file so credentials don't persist on disk.

**Phase 3: Sysprep and Capture.** Snapshot the VM, run `sysprep.exe /generalize /oobe /shutdown /unattend:C:\Windows\Panther\unattend.xml`, then capture with FOG. Never power the VM on between Sysprep and capture.

### Per-Classroom Deployment

Each classroom has different hardware, so I maintain separate images per room. Every workstation is registered in FOG via CSV import (hostname + MAC address), grouped by classroom. When a room needs reimaging, I select the group, schedule a deploy task, and FOG uses Partclone to push the image. Partclone only writes used blocks, so imaging is fast even on large drives.

The FOG agent runs on every workstation with a dedicated `fog-service` Active Directory service account. DHCP points PXE boot to the FOG server using `snponly.efi` for UEFI network boot. A machine needing reimaging just needs to PXE boot and everything happens automatically.

## What I'd Do Differently

**Document interface names before migration.** Every Linux VM had a different post-migration network issue because the interface name changed. A quick `ip link show` before the migration would have saved debugging time.

**Test Sysprep on a throwaway VM first.** My first Sysprep attempt failed because of a leftover Xbox app. Always run through the full golden image pipeline once as a dry run before committing to your production image.

## The Result

Every production workload is now running on Proxmox. Two domain controllers, network monitoring (LibreNMS, Netdisco, Switchmap), a Samba AD file server, FOG imaging, and UniFi controller. All on open-source infrastructure. The Hyper-V hosts are decommissioned.

Total licensing cost: $0.

The migration took planning and careful execution, but none of it was technically complex. The hardest part was convincing myself that AD replication would actually work as advertised. It did.
