---
title: "18 Hours with NDG: What I Learned at the Proxmox VE 8 Deployment Workshop"
pubDate: 2025-07-10
tags: ["training", "proxmox", "netlab", "workshop", "certification", "virtualization"]
---

Three days. Eighteen hours. One intensive workshop that transformed how I think about educational virtualization infrastructure.

Network Development Group (NDG) runs these workshops specifically for institutions migrating to Proxmox VE for NETLAB+ environments. With Broadcom killing VMware's educational licensing, the timing couldn't have been better.

## The Workshop Structure

**Day 1 - Infrastructure Foundations**: Hardware requirements, storage architecture (why NDG recommends 15TB NVMe drives), network topology design, and the critical distinction between management servers and user servers.

**Day 2 - Clustering & VM Management**: Proxmox clustering deep-dive, High Availability configuration, Proxmox Backup Server integration, and the surprisingly complex world of SPICE remote access for copy/paste functionality.

**Day 3 - NETLAB+ Deployment**: The NDG post-install scripts, deployment scenarios, VM distribution systems, and the automation capabilities through the Python SDK.

## Key Technical Insights

**Storage Architecture**: RAID controllers become bottlenecks at scale. NDG recommends HBA mode (IT mode) for direct drive access. ZFS isn't officially supported due to complexity-they've seen too many institutions get burned by it.

**Linked Clone Limitations**: Proxmox can't span linked clones across different storage pools. Master images and their clones must live on the same storage. That's why the large NVMe requirement-you need room for masters AND all the clones.

**Windows 11 Gotcha**: CPU type MUST be set to 'Host' for Windows 11 VMs. VirtIO drivers need to be pre-installed or injected via WinRE before first boot. Miss this and you're reimaging.

**The TMUX Tip**: Install TMUX before doing anything else. When your SSH connection drops during a 45-minute cluster operation, you'll be glad your session kept running.

## Three Deployment Paths

1. **Fresh Install**: Blow away VMware, start clean, download everything fresh from NDG. Simplest path if you can afford the downtime.

2. **VMware Migration**: Keep your physical pod configurations (PDUs, routers, switches), migrate the NETLAB+ database, swap the hypervisor layer. More complex but preserves your existing lab topology.

3. **Hybrid**: Run both simultaneously during transition. NDG doesn't recommend this-the complexity rarely justifies the benefit.

## What I Applied Immediately

The workshop wasn't abstract theory. Within weeks, I was deploying a 6-node Proxmox cluster at Polk State College using exactly what I learned:

- Dedicated 10G cluster network (Day 1 recommendation)
- NETLAB1/NETLAB2/NETLAB3 storage naming convention
- Preallocation disabled on all NETLAB storage
- LACP bonding on gigabit interfaces
- PBS on separate hardware for backups

## The Certificate

Eighteen hours of intensive training, hands-on labs in NDG's training environment, and a certificate of completion. More importantly: the confidence to deploy production infrastructure knowing the patterns are battle-tested across hundreds of educational institutions.

[View full workshop details and certificate →](/projects/ndg-proxmox-workshop)
