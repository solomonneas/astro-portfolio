---
title: "APT44/Sandworm: The Most Dangerous Hacking Unit You've Never Heard Of"
pubDate: 2025-10-15
updatedDate: 2026-02-16
tags: ["threat-intel", "apt", "russia", "sandworm", "mitre-attack", "malware"]
---



In December 2015, the lights went out across western Ukraine. Not a storm. Not equipment failure. A cyberattack. The first publicly confirmed one to cause a power outage.

That was just the beginning.

GRU Unit 74455. Sandworm. APT44. Whatever you call them, they're the most operationally dangerous state-sponsored cyber threat actor on the planet right now. I spent weeks pulling apart their operations for a full intelligence assessment, and the picture is genuinely unsettling.

## This Isn't Your Typical Espionage Group

Most APTs steal data quietly and go home. Sandworm breaks things. Their mandate includes sabotage, disruption, and influence operations tied directly to Russian military objectives.

The highlight reel:

**2015-2016**: Two separate attacks on Ukraine's power grid. First BLACKENERGY, then INDUSTROYER. Both custom malware frameworks built specifically to manipulate industrial control systems.

**2017**: NotPetya. Looked like ransomware. Was actually a wiper wearing a disguise. $10 billion+ in global damages. Maersk, Merck, FedEx all got hit.

**2018**: Olympic Destroyer at the Pyeongchang Winter Olympics, with false flags pointing at North Korea and China. Clever.

**2022**: AcidRain wiper against Viasat's KA-SAT network. Disrupted satellite comms across Europe on the day Russia invaded Ukraine. That's not coincidence. That's coordination with kinetic military operations.

**2023**: Kyivstar, Ukraine's largest telecom. 24 million subscribers knocked offline.

## How They Operate

I mapped their TTPs across five phases, and the pattern is consistent:

**Living on the Edge.** Initial access through edge infrastructure. VPNs, firewalls, mail gateways. The stuff facing the internet.

**Living off the Land.** Once inside, they use your own tools against you. PowerShell, WMI, scheduled tasks. No custom malware to trigger signatures. Your EDR sees nothing unusual.

**Going for the GPO.** Group Policy abuse for lateral movement. One compromised domain admin and they own your entire Windows environment.

**Disrupt and Deny.** The payload phase. Wipers, ICS manipulation, or coordinated timing with physical military operations.

**Telegraphing Success.** Front personas like CyberArmyofRussia_Reborn and Solntsepek publicly claim attacks. The psychological impact amplifies the technical damage.

## The Malware Arsenal

Sandworm doesn't use commodity tools. Their kit includes CADDYWIPER, NEARMISS, and AcidRain (destructive wipers), INDUSTROYER/INDUSTROYER2 (purpose-built ICS attack frameworks), and CYCLOPS BLINK (botnet targeting network devices).

The operational security on their custom backdoors would make organized crime groups jealous.

## What You Can Actually Do About It

If you're in government, defense, energy, or telecom, assume you're targeted. The mitigations aren't glamorous:

1. **Harden your edge infrastructure.** VPNs, firewalls, mail gateways. That's the front door.
2. **Credential hygiene.** Sandworm loves harvesting creds. MFA isn't optional.
3. **Segment your network.** Flat networks are playgrounds for lateral movement.
4. **Separate OT from IT.** Industrial systems should not be reachable from your corporate network. Period.
5. **Isolate your backups.** Backups are worthless if the wiper can reach them.

The full intelligence assessment includes detailed MITRE ATT&CK mappings, malware family analysis, and the complete front persona ecosystem.

[Read the full intelligence assessment →](/projects/apt44-intelligence-report)
