# Social Media Content: Hyper-V to Proxmox Migration

## LinkedIn Post 1: The Migration Story

I migrated an entire college network from Microsoft Hyper-V to Proxmox VE.

Active Directory domain controllers. Network monitoring. File servers. WiFi controllers. Workstation imaging.

Zero downtime. Zero data loss. $0 in licensing.

Here's what I learned:

1. Never V2V a domain controller. Build fresh, let AD replication do its job. The "leapfrog" method works flawlessly.

2. DFS namespaces are overkill for single-server environments. Ripped it out, replaced with GPO drive maps. Simpler, faster, more transparent.

3. SCCM is wildly over-engineered for lab imaging. FOG Project does everything we actually needed for free.

4. The UniFi controller was trapped in a Windows 11 VM that required two layers of RDP to reach. Now it runs in an LXC container I can SSH into directly.

5. Always snapshot before Sysprep. If it fails (it will, at least once), you cannot simply run it again.

The hardest part wasn't the technology. It was trusting that AD replication would actually work as advertised.

It did.

Full writeup on my blog (link in comments).

#Proxmox #Infrastructure #SysAdmin #ActiveDirectory #OpenSource

---

## LinkedIn Post 2: The FOG Project Deep Dive

I replaced Microsoft SCCM with an open-source tool called FOG Project.

Same result. Zero licensing cost.

Here's the setup for a college with multiple classrooms, each with different hardware:

Golden images built as Proxmox VMs (snapshots before Sysprep = safety net)

Per-classroom images because each room has different Dell models

CSV import of every workstation's hostname + MAC address

PXE boot via snponly.efi, DHCP points to the FOG server

Partclone pushes only used blocks (60GB Windows on a 256GB drive doesn't transfer 256GB)

FOG agent on every machine talks to a dedicated fog-service AD account

Reimaging a classroom: select the group, schedule the task, walk away.

The Sysprep pipeline has three phases:
1. Audit Mode (Ctrl+Shift+F3) to strip bloatware before imaging
2. Unattend.xml with BypassNRO for Windows 11's forced internet requirement  
3. Capture to FOG, never power on between Sysprep and capture

SCCM needs Windows Server + SQL Server + licensing + infrastructure complexity.

FOG needs one Linux VM.

Sometimes simpler is better.

#FOGProject #Imaging #SysAdmin #Education #OpenSource

---

## LinkedIn Post 3: The Domain Controller Take

Unpopular opinion: migrating Active Directory domain controllers between hypervisors is easy.

Everyone treats it like defusing a bomb. It's not.

The leapfrog method:
- Transfer FSMO roles to DC2
- Delete DC1, rebuild on new hypervisor
- Promote, let AD replicate
- Transfer roles back
- Delete DC2, rebuild on new hypervisor
- Promote, AD replicates again

Both DCs on the new platform. Zero downtime. The whole process took less time than writing this post.

The one hard rule: never convert a DC's virtual disk between hypervisors. USN rollback will permanently corrupt your AD database. Build fresh every time.

AD replication has been rock-solid since Windows Server 2003. Trust it.

#ActiveDirectory #DomainController #Proxmox #SysAdmin

---

## Twitter/X Thread: Migration Highlights

**Tweet 1:**
Migrated an entire college network from Hyper-V to Proxmox.

Domain controllers, file servers, monitoring, imaging, WiFi.

Zero downtime. $0 licensing.

Here's the thread 🧵

**Tweet 2:**
Domain Controllers: the "leapfrog" method.

Transfer FSMO roles to DC2 → delete DC1 → rebuild on Proxmox → promote → transfer roles back → rebuild DC2.

Both DCs on Proxmox. AD replication handles everything. Never V2V a DC.

**Tweet 3:**
Linux VMs: VHDX → QCOW2 conversion.

Create empty shell VM in Proxmox, SCP the disk, import with `qm importdisk`.

Every VM had the same post-migration issue: network interface renamed from eth0 to ens18. Check netplan configs.

**Tweet 4:**
Killed the DFS namespace.

Single-server environment doesn't need DFS. Replaced with GPO Preferences drive maps:
- X:\ for faculty (full server)
- Y:\ for students (student folders only)

Item-level targeting by security group. Done.

**Tweet 5:**
UniFi controller was running on a Windows 11 VM inside Hyper-V.

To manage WiFi: RDP → Hyper-V host → open VM console → open browser → UniFi UI.

Now: LXC container. SSH directly. Backup/restore took 10 minutes.

**Tweet 6:**
Replaced SCCM with FOG Project for workstation imaging.

Golden images built as Proxmox VMs (snapshots before Sysprep).

Per-classroom images, CSV-imported hosts, PXE boot via snponly.efi, Partclone for block-level imaging.

$0.

**Tweet 7:**
Sysprep tip: always snapshot before running it.

If it fails (usually because of leftover Appx packages like Candy Crush or Spotify), you cannot run it again.

Only recovery: revert to snapshot.

Strip all staged provisioned packages FIRST.

**Tweet 8:**
Full writeup with commands, configs, and troubleshooting on my blog:

solomonneas.dev/blog/hyperv-to-proxmox-migration-guide

---

## Twitter/X Standalone Posts

**Post A:**
The UniFi controller was in a Windows 11 VM that required two layers of RDP to reach.

Now it's an LXC container I can SSH into.

Migration: export .unf backup → create container → restore.

10 minutes.

**Post B:**
Sysprep fails silently if staged Appx packages are present.

Candy Crush. Spotify. Xbox.

Remove them in Audit Mode BEFORE running Sysprep.

Remove-AppxProvisionedPackage is the one that matters, not just Remove-AppxPackage.

**Post C:**
FOG Project + Partclone is underrated.

Block-level imaging that only transfers used sectors. A 60GB Windows install on a 256GB drive doesn't transfer 256GB.

CSV import your hosts, group by classroom, one-click deploy.

github.com/FOGProject/

**Post D:**
"Should I use DFS for my file server?"

If you have one file server: no.

GPO Preferences with item-level targeting by security group is simpler, more transparent, and easier to troubleshoot.

DFS is for multi-server namespaces. Not single-server environments.
