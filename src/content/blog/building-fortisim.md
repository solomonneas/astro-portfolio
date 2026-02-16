---
title: "FortiSim: Mess Up Firewall Rules Without Burning Down the Network"
pubDate: 2025-01-25
updatedDate: 2026-02-16
tags: ["networking", "firewall", "fortinet", "react", "typescript", "simulation"]
---



Fortinet hardware is expensive. Misconfiguring a production firewall is the kind of mistake that gets you a meeting with your boss's boss. And textbooks can only teach you so much about firewall rules before you need to actually watch traffic hit a ruleset and see what happens.

So I built FortiSim. A browser-based Fortinet firewall rule simulator. Create policies, define zones, simulate traffic flows, catch rule conflicts. All without touching a real FortiGate.

## Firewall Rules Are Sneaky

A rule that looks correct by itself can be completely overridden by a higher-priority rule you forgot about. Two policies can conflict in ways you won't notice until a very specific traffic pattern exposes the problem at 2 AM on a Saturday.

In production environments, firewall audits regularly find rules added years ago for a temporary project that nobody removed. Rules that duplicate each other. Rules that contradict each other, with the conflict hidden because one is shadowed by a higher-priority match.

These aren't theoretical problems. They're among the most common root causes of both security gaps and connectivity issues in enterprise networks. FortiSim makes them visible before they become incidents.

## Zones Matter

Fortinet uses zone-based policy enforcement. Traffic doesn't just have a source IP and destination IP. It enters through an interface assigned to a security zone and exits through another. A policy allowing HTTP from "LAN" to "WAN" is fundamentally different from the same policy going "DMZ" to "WAN," even if the IP addresses overlap.

FortiSim implements this faithfully. You define interfaces, assign them to zones, build policies referencing zone pairs. Simulate a traffic flow by specifying ingress interface, source address, destination address, port, and protocol. The simulator evaluates against your ruleset in priority order, just like a real FortiGate.

I was careful about this part. Getting zone evaluation wrong in a simulator teaches incorrect mental models. That's worse than no model at all.

## Conflict Detection (The Best Part)

This is the feature I'm most proud of. FortiSim performs static analysis on your entire ruleset and catches three categories of problems.

**Shadow rules:** A broad rule higher in the list completely covers a more specific rule below it. The specific rule never fires. Example: rule 5 allows all TCP from LAN to WAN. Rule 12 denies SSH from LAN to WAN. Rule 12 is dead. Someone thinks SSH is blocked. It isn't.

**Redundant rules:** Two policies overlap and have the same action. Not dangerous, but they add complexity, slow evaluation, and make auditing harder. Flagged as low-severity.

**Conflicting rules:** Two rules match overlapping traffic but specify different actions. The actual behavior depends entirely on priority ordering. FortiSim shows you exactly which traffic patterns are affected so you can verify the priority produces the right outcome.

The detection engine computes the intersection of traffic selectors between all rule pairs. It scales quadratically with rule count, but for learning and lab environments, performance is fine. A 50-rule set means 1,225 pairwise comparisons. Try doing that manually.

## Traffic Flow Simulation

The simulator walks a packet through your ruleset top to bottom. When it finds a match, it reports which rule matched, the action taken, and the full evaluation path: every rule checked, whether it matched, and why or why not.

The "why not" information is the real value. When traffic gets unexpectedly denied, the question is usually "which rule did I think would match, and why didn't it?" FortiSim answers directly. Rule 7 didn't match because the destination port was outside the service definition. Rule 3 didn't match because the source was in a different subnet.

I also added batch simulation. Define multiple traffic flows, run them all at once, verify expected behaviors still hold after modifying the ruleset. It's basically a unit test suite for firewall rules.

## All Client-Side

FortiSim is React, TypeScript, and Tailwind. The entire application runs in the browser. No backend. Rule engine, conflict detection, traffic simulation, all client-side. This keeps it fast, private, and deployable as a static site.

The data model mirrors FortiOS concepts: address objects, service objects, interfaces, zones, policies. Policies reference objects by name, same as FortiOS CLI config. The mental model you build in FortiSim transfers directly to real FortiGate administration.

## What I Learned

Understanding networking concepts well enough to simulate them is a completely different level of knowledge than understanding them well enough to configure them. Implementing the rule evaluation engine required precise knowledge of how match criteria interact, how priority resolves ambiguity, and how implicit rules affect the overall security posture.

The conflict detection work showed me why firewall auditing tools exist as a commercial product category. Manual rule review doesn't scale. Even 50 rules create 1,225 combinations to check. Automation isn't optional.

Most importantly, I internalized Fortinet's architecture by building a simulator of it. Zone-based security, policy evaluation order, conflict patterns. These concepts transfer to any firewall management role, not just Fortinet.
