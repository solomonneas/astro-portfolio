# FortiSim Social Media Drafts

## LinkedIn

I built FortiSim, a browser-based Fortinet firewall rule simulator. It lets you create zone-based policies, simulate traffic flows, and detect rule conflicts, all without needing access to physical FortiGate hardware.

Firewall rulesets are deceptively complex. A rule that looks correct in isolation can be completely shadowed by a higher-priority rule. Two rules can conflict in ways that only surface when a specific traffic pattern hits the right combination. Accumulated rules from years of changes create dead policies that never match traffic but obscure the actual security posture. These problems are among the most common root causes of both security gaps and connectivity issues in enterprise networks.

FortiSim addresses this with three core features. Traffic flow simulation walks a packet through the ruleset top to bottom, showing exactly which rule matched, why it matched, and why every other rule did not match. Conflict detection performs static analysis across all rule pairs to identify shadow rules, redundancies, and contradictions. And the zone-based policy model mirrors real FortiOS architecture, so the mental models you build transfer directly to production environments.

The entire application runs client-side with React, TypeScript, and Tailwind CSS. No backend required. The data model intentionally mirrors FortiOS concepts: address objects, service objects, interfaces, zones, and policies that reference them by name.

Full technical write-up: https://solomonneas.dev/blog/building-fortisim

#Networking #Firewall #Fortinet #Cybersecurity #React #TypeScript

---

## Twitter/X Thread

🧵 I built FortiSim, a Fortinet firewall rule simulator that runs entirely in the browser. Here is why simulating firewall rules matters more than you might think.

1/ The problem with learning firewall admin from textbooks: you can memorize syntax all day, but you will not understand rule behavior until you watch traffic hit a ruleset. Fortinet hardware is expensive. Lab access is limited. Misconfigs on production firewalls are not great learning opportunities.

2/ FortiSim lets you build zone-based policies mirroring real FortiOS architecture, simulate traffic flows against your ruleset, and see exactly which rule matched and why.

3/ The conflict detection engine is the feature I am most proud of. It performs static analysis across all rule pairs to find three categories of problems: shadow rules, redundant rules, and conflicting rules.

4/ Shadow rules are the scariest. A broad high-priority rule completely covers a specific lower rule. Someone thought they blocked SSH from LAN to WAN, but a broader "allow all TCP" rule above it catches the traffic first. The block rule exists but does nothing.

5/ FortiSim also shows you WHY a rule did not match. When traffic is unexpectedly denied, the real question is "which rule did I expect to match, and why did it not?" That diagnostic information is as valuable as the match itself.

6/ Built with React + TypeScript + Tailwind. Fully client-side. Zone-based policy model matches real FortiGate concepts so the mental models transfer to production.

7/ Full build story: https://solomonneas.dev/blog/building-fortisim

---

## Mastodon

Shipped FortiSim, a browser-based Fortinet firewall rule simulator with conflict detection and traffic flow evaluation.

The conflict detection engine performs pairwise static analysis across the entire ruleset to identify shadow rules (broad rules that completely cover more specific rules below them), redundancies (overlapping rules with the same action), and contradictions (overlapping rules with different actions where behavior depends on priority ordering).

Traffic simulation walks packets through the ruleset top-to-bottom and reports both the matching rule and the full evaluation path, including why each non-matching rule failed to match. The "why not" diagnostic is often more useful than knowing what matched.

The zone-based policy model mirrors FortiOS architecture: interfaces assigned to zones, policies referencing zone pairs, address objects, and service objects by name. The intentional alignment means mental models transfer directly to real FortiGate administration.

Stack: React + TypeScript + Tailwind. Client-side only. Even a 50-rule set creates 1,225 pairwise combinations for conflict analysis. Manual review does not scale, which is exactly why firewall auditing tools exist as a commercial product category.

Write-up: https://solomonneas.dev/blog/building-fortisim

#infosec #networking #firewall #fortinet #cybersecurity #simulation

---

## Bluesky

Built a Fortinet firewall rule simulator that runs in the browser. Create zone-based policies, simulate traffic flows, and detect shadow rules and conflicts without needing physical hardware. Turns out even 50 rules create 1,225 pairwise combinations to check. No wonder firewall audits find so many surprises.

Blog post: https://solomonneas.dev/blog/building-fortisim

---

## Substack Teaser

**The firewall rule you think is blocking SSH probably is not**

Shadow rules are one of the most common and most dangerous problems in firewall management. A broad rule higher in the policy list silently overrides your carefully crafted specific rule below it. Your config says "deny SSH." The firewall says "I never even saw that rule because rule 5 already allowed all TCP."

I built FortiSim to make these problems visible. It is a Fortinet firewall rule simulator with conflict detection, traffic flow evaluation, and zone-based policy modeling, all running in the browser.

The static analysis engine checks every pair of rules for shadows, redundancies, and contradictions. The traffic simulator shows you exactly which rule matched and, just as importantly, why every other rule did not.

Full build story: https://solomonneas.dev/blog/building-fortisim
