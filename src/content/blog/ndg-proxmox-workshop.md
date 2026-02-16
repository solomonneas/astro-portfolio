---
title: "3 Days, 18 Hours: What I Learned at NDG's Proxmox Workshop"
pubDate: 2025-07-10
updatedDate: 2026-02-16
tags: ["training", "proxmox", "netlab", "workshop", "certification", "virtualization"]
---



Network Development Group runs intensive workshops for institutions migrating to Proxmox VE for NETLAB+ environments. With Broadcom killing VMware's educational licensing, the timing was perfect. I signed up.

Three days. Eighteen hours. Hands-on labs in NDG's training environment. Here's what stuck.

## Day by Day

**Day 1: Infrastructure foundations.** Hardware requirements, storage architecture, network topology design. The critical distinction between management servers and user servers. Why NDG recommends 15TB NVMe drives (spoiler: linked clones eat space fast).

**Day 2: Clustering and VM management.** Proxmox clustering deep dive, HA configuration, Proxmox Backup Server integration. The surprisingly complex world of SPICE remote access for copy/paste functionality. That last one sounds trivial until students can't paste commands into their lab VMs.

**Day 3: NETLAB+ deployment.** NDG's post-install scripts, deployment scenarios, VM distribution, and automation through the Python SDK.

## Things I Didn't Know Before

**RAID controllers are bottlenecks at scale.** NDG recommends HBA mode (IT mode) for direct drive access. ZFS isn't officially supported because they've seen too many institutions get burned by the complexity.

**Linked clones can't span storage pools.** Master images and their clones must live on the same storage in Proxmox. That's why the massive NVMe requirement. You need room for masters AND all the clones on one pool.

**Windows 11 needs CPU type set to 'Host'.** VirtIO drivers need to be pre-installed or injected via WinRE before first boot. Miss this and you're reimaging the whole thing.

**Install TMUX first.** Before anything else. When your SSH connection drops during a 45-minute cluster operation, you'll be glad your session kept running. This tip alone was worth showing up.

## Three Paths to Proxmox

1. **Fresh install.** Blow away VMware, start clean, download everything from NDG. Simplest if you can afford the downtime.
2. **VMware migration.** Keep your physical pod configs (PDUs, routers, switches), migrate the NETLAB+ database, swap the hypervisor layer. More complex but preserves your existing topology.
3. **Hybrid.** Run both simultaneously during transition. NDG doesn't recommend it. The complexity rarely justifies the benefit.

## What I Used Immediately

Within weeks, I was deploying a 6-node Proxmox cluster at Polk State College using exactly what I learned:

- Dedicated 10G cluster network (Day 1 recommendation)
- NETLAB1/NETLAB2/NETLAB3 storage naming convention
- Preallocation disabled on all NETLAB storage
- LACP bonding on gigabit interfaces
- PBS on separate hardware for backups

Eighteen hours of training, a certificate of completion, and the confidence to deploy production infrastructure knowing the patterns are battle-tested across hundreds of institutions. That last part mattered more than the certificate.

[View full workshop details and certificate →](/projects/ndg-proxmox-workshop)
