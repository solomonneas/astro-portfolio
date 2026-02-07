---
title: "Building FortiSim: A Fortinet Firewall Rule Simulator"
pubDate: 2025-02-07
tags: ["networking", "firewall", "fortinet", "react", "typescript", "simulation"]
---

Learning firewall administration from textbooks has a fundamental problem: you can memorize syntax and concepts all day, but you will not understand how firewall rules actually behave until you watch traffic hit a ruleset and see what happens. Fortinet hardware is expensive. Lab environments are limited. And the cost of misconfiguring a production firewall is exactly the kind of mistake you want to make in a simulator, not on a live network.

I built FortiSim to bridge that gap: a browser-based Fortinet firewall rule simulator that lets you create policies, define zones and interfaces, simulate traffic flows, and identify rule conflicts before they cause real problems.

## Why Simulate Firewall Rules?

The obvious answer is practice without consequences. But there is a deeper reason. Firewall rulesets are deceptively complex. A policy that looks correct in isolation can be completely overridden by a higher-priority rule. Two policies can conflict in ways that are not apparent until a specific traffic pattern exposes the issue. As rulesets grow over time, accumulated rules create dead zones where policies exist but never match any traffic, wasting processing cycles and obscuring the actual security posture.

In production environments, firewall audits regularly uncover rules that were added years ago for a temporary project and never removed. Rules that duplicate each other. Rules that contradict each other, with the conflict hidden because one is shadowed by a higher-priority match. These issues are not theoretical. They are among the most common root causes of both security gaps and connectivity problems in enterprise networks.

FortiSim makes these problems visible. You build a ruleset, simulate traffic, and the tool shows you exactly which rule matched, why it matched, and whether any other rules in the set are shadowed, redundant, or conflicting.

## Zone-Based Policy Model

Fortinet firewalls use a zone-based architecture for policy enforcement. Traffic does not just have a source IP and destination IP. It enters through a specific interface assigned to a specific security zone, and it exits through another. A policy that allows HTTP traffic from the "LAN" zone to the "WAN" zone is fundamentally different from one that allows the same traffic from "DMZ" to "WAN," even if the IP addresses overlap.

FortiSim implements this zone model faithfully. You define interfaces, assign them to zones, and build policies that reference zone pairs. When you simulate a traffic flow, you specify the ingress interface, source address, destination address, destination port, and protocol. The simulator evaluates the traffic against the ruleset in priority order, matching on zone, address, service, and action, just like a real FortiGate appliance would.

Getting this right required careful study of how FortiOS processes traffic. The evaluation order, the implicit deny at the bottom of every ruleset, the distinction between zone-based and interface-based policies. These details matter because getting them wrong in a simulator teaches incorrect mental models that are worse than no model at all.

## Conflict Detection

This is the feature I am most proud of. FortiSim performs static analysis on your entire ruleset to identify three categories of problems.

**Shadow rules** occur when a broad rule higher in the policy list completely covers a more specific rule below it. The specific rule will never match any traffic because the broad rule catches everything first. For example, if rule 5 allows all TCP traffic from LAN to WAN, and rule 12 denies SSH traffic from LAN to WAN, rule 12 is shadowed. It exists in the config but has zero effect. In a real environment, this means someone thought they were blocking SSH and they are not.

**Redundant rules** are policies that overlap with another rule and produce the same action. They are not harmful in the same way shadow rules are, since the security outcome is the same. But they add complexity, slow down rule evaluation, and make the ruleset harder to audit. FortiSim flags these as low-severity findings.

**Conflicting rules** are the most dangerous category. Two rules that match overlapping traffic but specify different actions (one allows, one denies). The actual behavior depends entirely on which rule has higher priority. FortiSim identifies these conflicts and shows you exactly which traffic patterns are affected, so you can verify whether the priority ordering produces the intended behavior.

The conflict detection engine works by computing the intersection of traffic selectors between all rule pairs. Two rules conflict if their source zones, source addresses, destination zones, destination addresses, services, and schedules all overlap. This pairwise comparison scales quadratically with the number of rules, but for the ruleset sizes you encounter in learning and lab environments, performance is not an issue.

## Traffic Flow Evaluation

The traffic simulator walks a packet through the ruleset from top to bottom, evaluating each rule's match criteria in order. When it finds a match, it reports which rule matched, the action taken (allow, deny, or other configured actions), and displays the full evaluation path: every rule that was checked, whether it matched or not, and why.

The "why not" information is just as valuable as the "why." When traffic is unexpectedly denied, the real question is usually "which rule did I think would match this traffic, and why did it not?" FortiSim answers this directly. You can see that rule 7 did not match because the destination port was outside the service definition, or that rule 3 did not match because the source address was in a different subnet than the rule's address object.

I also added batch simulation, where you can define multiple traffic flows and run them all against the ruleset simultaneously. This is useful for regression testing: define your expected traffic patterns, modify the ruleset, and verify that all your expected behaviors still hold. It is the firewall equivalent of a unit test suite.

## Technical Implementation

FortiSim is built with React, TypeScript, and Tailwind CSS. The entire application runs client-side with no backend. The rule engine, conflict detection, and traffic simulation all execute in the browser. This keeps the tool fast, private, and deployable as a static site.

The data model mirrors FortiOS concepts: address objects, service objects, interface definitions, zone assignments, and firewall policies. Policies reference these objects by name, just like FortiOS CLI configuration. This intentional alignment means the mental model you build in FortiSim transfers directly to real FortiGate administration.

State management uses React's built-in hooks and context. The ruleset state is the source of truth, and both the conflict analysis and traffic simulation derive their results from it reactively. Modify a rule, and the conflict analysis updates immediately. Run a simulation, and the evaluation path renders in real time.

## What I Learned

FortiSim taught me that understanding networking concepts deeply enough to simulate them is a completely different level of knowledge than understanding them well enough to configure them. Implementing the rule evaluation engine required precise understanding of how match criteria interact, how priority ordering resolves ambiguity, and how implicit rules affect the overall security posture.

The conflict detection work gave me a practical understanding of why firewall auditing tools exist as a commercial product category. Manual rule review does not scale. Even a modest ruleset of 50 rules creates 1,225 pairwise combinations to check for conflicts. Automation is not optional.

Most importantly, FortiSim gave me hands-on experience with Fortinet's architecture and policy model without requiring access to physical hardware. The concepts I internalized by building the simulator, zone-based security, policy evaluation order, rule conflict patterns, these are directly applicable to real FortiGate administration and will transfer to any role that involves firewall management.
