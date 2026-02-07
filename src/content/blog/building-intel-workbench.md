---
title: "Building Intel Workbench: Structured Analysis with the ACH Method"
pubDate: 2025-02-07
tags: ["cybersecurity", "intelligence-analysis", "react", "typescript", "ACH"]
---

There is a reason intelligence agencies do not let analysts go with their gut. Gut instinct is fast, confident, and frequently wrong. Not because analysts are bad at their jobs, but because the human brain is wired with cognitive biases that systematically distort how we evaluate evidence. We anchor on the first hypothesis we encounter. We seek out information that confirms what we already believe. We give too much weight to vivid, recent events and too little to base rates. These are not character flaws. They are features of human cognition, and they are devastating in intelligence analysis where the stakes are high and the data is ambiguous.

The Analysis of Competing Hypotheses method was developed by Richards Heuer at the CIA specifically to counteract these biases. I built Intel Workbench to make ACH accessible, interactive, and practical for cybersecurity analysts and students learning structured analytic techniques.

## What ACH Actually Is

ACH is deceptively simple in concept. You list all reasonable hypotheses that could explain the situation. You list all the evidence and arguments relevant to those hypotheses. Then you build a matrix: for each piece of evidence, you assess its consistency or inconsistency with each hypothesis. The key insight, and this is what makes ACH different from intuitive analysis, is that you do not pick the hypothesis with the most supporting evidence. You eliminate the hypothesis with the most inconsistent evidence.

This inversion matters. Our natural tendency is to build a case for our preferred explanation. We collect confirming evidence, and the more we find, the more confident we become. ACH forces you to do the opposite: focus on what would disprove each hypothesis. The surviving hypothesis is not the one you proved right. It is the one you could not prove wrong.

Heuer demonstrated through decades of work at the CIA that this approach consistently outperforms intuitive analysis, especially in situations with incomplete information, deception, and high ambiguity. Those three words describe basically every interesting problem in cybersecurity.

## Building the Workbench

Intel Workbench is a frontend-only application built with React, TypeScript, Zustand for state management, and Tailwind CSS for styling. I deliberately kept it client-side only. Sensitive analysis should not require sending hypotheses and evidence to a remote server. Everything runs in the browser, and analysis sessions can be exported and imported as JSON files for persistence and sharing.

The core interface is the ACH matrix. Hypotheses run across the columns, evidence runs down the rows, and each cell contains a consistency rating. I implemented a five-point scale: Strongly Consistent, Consistent, Neutral, Inconsistent, Strongly Inconsistent. Each rating can include a confidence weight that reflects how reliable or significant that piece of evidence is. A forensic artifact from a disk image gets weighted differently than an unconfirmed tip from an anonymous source.

Building the matrix interaction was the most interesting UI challenge. The matrix needs to be immediately readable at a glance, but also support detailed annotation when the analyst wants to document their reasoning for a specific cell. I solved this with a color-coded heat map for quick scanning combined with expandable cells for notes. Green cells (consistent) and red cells (inconsistent) create an instant visual pattern that makes it obvious which hypotheses are well-supported and which are under strain.

## Weighted Scoring and Sensitivity Analysis

Basic ACH gives you a qualitative result: you eyeball the matrix and identify which hypothesis has the least red. Intel Workbench goes further with quantitative scoring. Each consistency rating maps to a numeric value, and evidence weights multiply those values to produce a weighted score per hypothesis. The hypothesis scores are displayed as a ranked bar chart alongside the matrix.

But scoring alone is not enough. One of the most important things I built was sensitivity analysis. This feature lets the analyst ask: "What if I am wrong about this piece of evidence?" You can toggle individual evidence items or change their ratings, and the scoring updates in real time. If removing a single piece of evidence flips the ranking, that tells you your conclusion is fragile. It depends too heavily on one data point. If the ranking stays stable across multiple evidence changes, your conclusion is robust.

This is directly applicable to cybersecurity incident analysis. When you are attributing an intrusion to a specific threat actor, sensitivity analysis tells you which pieces of evidence are load-bearing for your attribution. If the entire case rests on a single IP overlap and that IP turns out to be shared infrastructure, you need to know that before you brief leadership.

## Five Visual Variants

I built five different visual variants of the interface to explore different approaches to presenting the same analytical data. Some variants emphasize the matrix view with dense information display for experienced analysts. Others use a more guided workflow that walks the user through hypothesis creation, evidence gathering, and rating step by step. The guided approach works better for training and for analysts who are new to ACH.

Building multiple variants also taught me practical lessons about component architecture in React. The analytical logic, state management, and data models are shared across all variants. Only the presentation layer changes. Zustand made this clean: the store holds the analysis state, and each variant consumes and displays that state differently. Swapping between variants does not lose any data or analysis progress.

## Why This Matters for Cybersecurity

Structured analytic techniques are becoming more important in cybersecurity, not less. As threat landscapes get more complex and adversaries invest in deception, the cost of bias-driven analysis goes up. Incident responders who anchor on the first hypothesis ("it is probably ransomware") may miss indicators that the ransomware is a smokescreen for data exfiltration. Threat analysts who seek confirming evidence for their preferred attribution may ignore signs that the campaign is actually a false flag operation.

ACH does not eliminate these risks, but it makes them visible. When you are forced to explicitly rate every piece of evidence against every hypothesis, the gaps in your reasoning become obvious. When you run sensitivity analysis and discover your conclusion depends on a single unverified claim, that changes how you communicate your findings.

## What I Learned

Intel Workbench deepened my understanding of both structured analysis and frontend state management. On the analysis side, implementing ACH from scratch forced me to engage with the methodology at a level that reading about it never achieved. Decisions like how to handle neutral evidence, whether to weight evidence reliability separately from evidence significance, and how to visualize uncertainty all required understanding the analytical principles, not just the mechanical process.

On the technical side, Zustand proved to be an excellent choice for complex, interconnected state. The ACH matrix creates deeply nested state relationships where changing one cell's rating affects hypothesis scores, sensitivity calculations, and multiple visual elements simultaneously. Zustand's simple API handled this gracefully without the boilerplate overhead of more complex state management solutions.

The biggest lesson was about cognitive humility. Building a tool designed to counteract bias made me more aware of how pervasive bias is in everyday analysis. I catch myself anchoring, confirming, and overweighting vivid evidence far more often now. The tool is useful, but the mindset shift that came from building it might be more valuable.
