---
title: "America's Water Infrastructure Is Held Together by Default Passwords"
pubDate: 2025-10-20
updatedDate: 2026-02-16
tags: ["critical-infrastructure", "ics", "scada", "water-security", "ot-security", "research"]
---



Someone accessed the Oldsmar, Florida water treatment plant via TeamViewer and cranked sodium hydroxide to 11,100 ppm. That's 111x normal levels. Lye at that concentration causes severe chemical burns.

An operator noticed the mouse moving on its own and stopped it.

That's the security model for critical infrastructure: hope someone's watching.

## It Keeps Happening

November 2023: Iranian-linked hackers (CyberAv3ngers) compromised a Unitronics PLC at a Pennsylvania water authority. The attack vector? Default credentials. Out of the box, unchanged, sitting on the internet.

January 2024: Russian-linked actors caused a water tank overflow in Muleshoe, Texas by manipulating SCADA systems.

None of these were sophisticated. Default passwords, internet-exposed control systems, zero segmentation. Script-kiddie level access to systems that control what comes out of your tap.

## The Numbers Are Terrifying

The US has over 50,000 community water systems serving 324 million people. Daily economic impact of nationwide water disruption: $43.5 billion.

70% of these systems don't meet basic cybersecurity requirements.

90% serve fewer than 10,000 people. These small utilities have zero dedicated IT staff, let alone security professionals. The person running the pumps is usually the same person "managing" the network. I put that in quotes because managing often means "it's plugged in and working."

## Who's Doing This

Three threat actors with demonstrated capability:

**Volt Typhoon (China)** is pre-positioning for wartime disruption. They're not attacking now. They're establishing persistent access for a potential future conflict over Taiwan. Think of it as planting explosives you don't detonate yet.

**APT44/Sandworm (Russia)** has a proven track record of hitting critical infrastructure. Ukraine power grid. NotPetya. They know how to break things that matter.

**CyberAv3ngers (Iran)** is IRGC-affiliated, conducting opportunistic attacks against Israeli-made PLCs. The Pennsylvania attack specifically targeted Unitronics devices because of their Israeli origin. Geopolitics in your water system.

## The Same Problems Everywhere

Every assessment finds the same issues:

**Authentication**: Default creds on PLCs and HMIs. Shared passwords among operators. No MFA on remote access. The Oldsmar attacker used TeamViewer with weak authentication. That's it.

**Network architecture**: Flat networks. SCADA systems on the internet. No firewalls between business and control systems.

**Maintenance**: Unpatched PLCs running 2015 firmware. Windows XP still controlling pumps. Legacy protocols (Modbus, DNP3) with zero authentication.

**Monitoring**: No logging on OT networks. No intrusion detection. Operators wouldn't know they're compromised until something physically breaks or overflows.

## The Fixes Aren't Hard. They're Just Not Done.

1. **Change default credentials.** Every PLC, HMI, router, switch. Today.
2. **MFA on all remote access.** TeamViewer, VPN, anything externally reachable.
3. **Segment OT from IT.** Control systems should not be one hop from email servers.
4. **Kill unnecessary remote access.** If you don't need TeamViewer, uninstall it.
5. **Turn on logging.** You can't detect what you're not watching for.

CISA offers free assessments. EPA is the designated Sector Risk Management Agency under NSM-22. The resources exist. The challenge is getting small utilities with no budget and no staff to actually use them.

The next Oldsmar might not have an alert operator watching the screen.

[Read the full security assessment →](/projects/securing-us-water-and-wastewater-utilities)
