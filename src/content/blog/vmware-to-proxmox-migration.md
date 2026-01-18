---
title: "Escaping Broadcom: Migrating 6 Servers from VMware to Proxmox VE"
pubDate: 2025-08-15
tags: ["infrastructure", "proxmox", "vmware", "migration", "virtualization", "cost-savings"]
---

When Broadcom acquired VMware in November 2023, the writing was on the wall. Within weeks, they discontinued perpetual licenses, moved to subscription-only pricing at $350+ per core, and—most critically for us—terminated the VMware IT Academy program that had provided free educational licensing.

For our 6-node cluster running 196 cores, staying on VMware meant facing roughly **$68,600 annually** in licensing costs. For an educational institution, that's not just expensive—it's untenable.

## The Decision

After evaluating alternatives, Proxmox VE emerged as the clear choice. Same KVM/QEMU hypervisor technology, enterprise clustering capabilities, and a critical advantage: **$0 in licensing fees**. The AGPLv3 license means we own our infrastructure again.

## What I Actually Did

This wasn't a committee project with delegated tasks. I was the workhorse:

- **Physically installed 10 Gigabit PCIe NICs** in all six Lenovo ThinkSystem SR630 servers
- **Ran cable infrastructure** for the dedicated 10G management network
- **Configured LACP bonding (802.3ad)** across all onboard gigabit NICs
- **Built the Proxmox cluster**, broke it learning Corosync, rebuilt it correctly
- **Integrated with NETLAB+** for educational lab delivery
- **Documented every port, cable run, and configuration**

## The Hard Lessons

**The Proxmox 9 Incident**: Upgraded to Proxmox 9 and everything broke. NETLAB+'s packages were built for Debian Bookworm (12), and Proxmox 9 runs on Trixie (13). Library incompatibilities cascaded. Rolled back, pinned to Proxmox 8, learned to always check upstream dependencies.

**Corosync Communication**: The heartbeat of a Proxmox cluster. Misconfigure ring addresses and nodes can't see each other—cluster splits, quorum fails. The dedicated 10G network wasn't a luxury; it was a necessity for stable cluster communication.

**Bonding vs. Etherchannel**: Linux bonding and Cisco Etherchannel are conceptually identical but configured differently on each end. Understanding hash policies and why one NIC was saturated while others sat idle taught me more about networking than any certification course.

## The Numbers

| Metric | VMware (Broadcom) | Proxmox VE |
|--------|-------------------|-----------|
| Annual Cost | ~$68,600 | $0 |
| 5-Year TCO | ~$343,000 | $0 |
| License Model | Per-core subscription | Open source (AGPLv3) |
| Minimum Purchase | 72 cores | None |

**Five-year savings: ~$343,000**

## Current Status

The cluster is fully operational. Six nodes running NETLAB+ lab pods for cybersecurity and networking students. Live migration works. HA failover works. Students don't know or care what hypervisor runs underneath—they just know their labs are available.

The infrastructure that Broadcom thought they could hold hostage is now completely under our control.

[Read the full project documentation →](/projects/vmware-to-proxmox-migration)
