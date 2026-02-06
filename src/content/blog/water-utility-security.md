---
title: "America's Water Systems Are Dangerously Vulnerable"
pubDate: 2025-10-20
tags: ["critical-infrastructure", "ics", "scada", "water-security", "ot-security", "research"]
---

In February 2021, someone accessed the water treatment plant in Oldsmar, Florida via TeamViewer and tried to increase sodium hydroxide levels to 11,100 ppm-111 times the normal concentration. Lye at those levels would cause severe chemical burns to anyone who drank the water.

An operator noticed the mouse moving on its own and stopped the attack in real-time.

In November 2023, Iranian-linked hackers (CyberAv3ngers) compromised a Unitronics PLC at a Pennsylvania water authority using default credentials. In January 2024, Russian-linked actors caused a water tank overflow in Muleshoe, Texas by manipulating SCADA systems.

These weren't sophisticated attacks. They exploited the most basic failures: default passwords, internet-exposed control systems, and no network segmentation.

## The Scale of the Problem

The United States has over 50,000 community water and wastewater systems serving 324 million people-97% of the population. The daily economic impact of nationwide water disruption would exceed $43.5 billion.

And here's the terrifying part: **70% of these systems don't meet basic cybersecurity requirements.**

90% of water systems serve fewer than 10,000 people. These small utilities often have zero dedicated IT staff, let alone security professionals. The operator who runs the pumps is usually the same person managing the network.

## Who's Targeting Water Systems?

Three major threat actors have demonstrated capability and intent:

**Volt Typhoon (China)** - State-sponsored APT focused on pre-positioning for wartime disruption. They're not attacking now; they're establishing persistent access for potential future conflict over Taiwan.

**APT44/Sandworm (Russia)** - GRU unit with a proven track record of attacking critical infrastructure. Responsible for Ukraine power grid attacks and NotPetya.

**CyberAv3ngers (Iran)** - IRGC-affiliated group conducting opportunistic attacks against Israeli-made PLCs. The Pennsylvania attack specifically targeted Unitronics devices because of their Israeli origin.

## The Vulnerability Landscape

The same issues appear repeatedly:

**Authentication Failures**
- Default credentials on PLCs and HMIs (the Pennsylvania attack)
- Shared passwords among operators
- No MFA on remote access (the Oldsmar attack used TeamViewer with weak authentication)

**Network Architecture Problems**
- Flat networks with no IT/OT segmentation
- SCADA systems directly connected to the internet
- No firewalls between business networks and control systems

**Maintenance Gaps**
- Unpatched PLCs running firmware from 2015
- Windows XP still controlling pumps
- Legacy protocols (Modbus, DNP3) with no authentication mechanisms

**Monitoring Blind Spots**
- No logging on OT networks
- No intrusion detection
- Operators wouldn't know they're compromised until something physically breaks

## What Needs to Happen

The mitigations aren't complicated. They're just not implemented:

1. **Change default credentials immediately** - Every PLC, HMI, router, and switch
2. **Implement MFA on all remote access** - TeamViewer, VPN, anything externally accessible
3. **Segment OT from IT networks** - Control systems should not be one hop from email servers
4. **Disable unnecessary remote access** - If you don't need TeamViewer, uninstall it
5. **Enable logging and monitoring** - You can't detect attacks you're not watching for

CISA offers free assessments for critical infrastructure. EPA is the designated Sector Risk Management Agency under NSM-22. The resources exist-the challenge is getting small utilities to use them.

The next Oldsmar might not have an alert operator watching the screen.

[Read the full security assessment →](/projects/securing-us-water-and-wastewater-utilities)
