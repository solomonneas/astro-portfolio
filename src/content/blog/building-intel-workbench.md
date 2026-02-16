---
title: "Intel Workbench: Fighting Your Own Brain with Structured Analysis"
pubDate: 2025-02-03
updatedDate: 2026-02-16
tags: ["cybersecurity", "intelligence-analysis", "react", "typescript", "ACH"]
---



Intelligence agencies figured out decades ago that gut instinct is fast, confident, and frequently wrong. The CIA literally built a methodology to fight it.

Not because analysts are bad at their jobs. Because human brains are wired with cognitive biases that systematically distort how we evaluate evidence. We anchor on the first hypothesis we encounter. We seek information that confirms what we already believe. We overweight vivid, recent events and ignore base rates. These aren't character flaws. They're features of human cognition, and they're devastating when the stakes are high and the data is ambiguous.

Richards Heuer developed the Analysis of Competing Hypotheses (ACH) method at the CIA to counteract exactly this. I built Intel Workbench to make ACH accessible, interactive, and practical for cybersecurity analysts and students learning structured analytic techniques.

## ACH in 60 Seconds

The concept is deceptively simple. List all reasonable hypotheses. List all relevant evidence. Build a matrix: for each piece of evidence, rate its consistency with each hypothesis.

Here's the part that makes ACH different from how most people naturally think: you don't pick the hypothesis with the most supporting evidence. You eliminate the hypothesis with the most inconsistent evidence.

That inversion matters. Our natural tendency is to build a case for our favorite explanation. Collect confirming evidence, feel more confident. ACH forces the opposite: focus on what would disprove each hypothesis. The survivor isn't the one you proved right. It's the one you couldn't prove wrong.

Heuer demonstrated over decades at the CIA that this consistently outperforms intuitive analysis, especially with incomplete information, deception, and high ambiguity. Those three words describe basically every interesting problem in cybersecurity.

## The Build

Intel Workbench is frontend-only. React, TypeScript, Zustand for state management, Tailwind CSS. Client-side on purpose. Sensitive analysis shouldn't require sending your hypotheses to a remote server. Everything runs in the browser. Export and import as JSON for persistence and sharing.

The core interface is the ACH matrix. Hypotheses across columns, evidence down rows, consistency ratings in each cell. Five-point scale: Strongly Consistent, Consistent, Neutral, Inconsistent, Strongly Inconsistent. Each rating can carry a confidence weight reflecting how reliable that evidence is. A forensic artifact from a disk image gets weighted differently than an unconfirmed anonymous tip.

The matrix UI was the most interesting challenge. It needs to be readable at a glance but support detailed annotation when an analyst wants to document their reasoning for a specific cell. I solved this with a color-coded heat map (green for consistent, red for inconsistent) combined with expandable cells for notes. The color pattern makes it instantly obvious which hypotheses are under strain.

## Where It Gets Interesting: Sensitivity Analysis

Basic ACH gives you a qualitative result. Eyeball the matrix, spot the least red hypothesis. Intel Workbench goes further with quantitative scoring. Each rating maps to a numeric value, evidence weights multiply those values, and you get a weighted score per hypothesis displayed as a ranked bar chart.

But scoring alone isn't the real feature. Sensitivity analysis is.

It lets you ask: "What if I'm wrong about this piece of evidence?" Toggle individual evidence items, change their ratings, and scoring updates in real time. If removing a single piece of evidence flips the ranking, your conclusion is fragile. It depends too heavily on one data point. If rankings stay stable across multiple changes, your conclusion is robust.

This applies directly to cybersecurity attribution. When you're attributing an intrusion to a specific threat actor and the entire case rests on a single IP overlap that turns out to be shared infrastructure, you need to know that before you brief leadership. Not after.

## Five Variants, One Brain

Five visual variants exploring different approaches to presenting the same analytical data. Some emphasize the matrix view with dense information for experienced analysts. Others use a guided workflow that walks users through hypothesis creation, evidence gathering, and rating step by step. The guided approach works better for training.

The analytical logic, state management, and data models are shared across all variants. Only presentation changes. Zustand made this clean: one store holds the analysis state, each variant consumes it differently. Switching variants doesn't lose any data or progress.

## Why Cybersecurity Needs This

Structured analytic techniques are becoming more important, not less. As threat landscapes get more complex and adversaries invest in deception, the cost of bias-driven analysis goes up.

Incident responders who anchor on "it's probably ransomware" may miss indicators that the ransomware is a smokescreen for data exfiltration. Threat analysts who seek confirming evidence for their preferred attribution may ignore signs of a false flag operation.

ACH doesn't eliminate these risks. It makes them visible. When you're forced to rate every piece of evidence against every hypothesis, the gaps in your reasoning show up. When sensitivity analysis reveals your conclusion depends on one unverified claim, that changes how you communicate your findings.

## What Stuck With Me

Implementing ACH from scratch forced engagement with the methodology at a level that reading about it never achieved. Decisions like how to handle neutral evidence, whether to weight reliability separately from significance, and how to visualize uncertainty all required understanding the analytical principles, not just the mechanical process.

Zustand was the right call for complex, interconnected state. The ACH matrix creates deeply nested state relationships where changing one cell affects hypothesis scores, sensitivity calculations, and multiple visual elements simultaneously. Zustand handled this without the boilerplate of heavier state management libraries.

The biggest lesson was personal. Building a tool designed to counteract bias made me more aware of how pervasive bias is in everyday analysis. I catch myself anchoring, confirming, and overweighting vivid evidence far more often now. The tool is useful, but the mindset shift from building it might be worth more.
