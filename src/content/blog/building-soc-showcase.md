---
title: "SOC Showcase: What a Security Operations Center Actually Looks Like"
pubDate: 2025-01-29
updatedDate: 2026-02-16
tags: ["soc", "cybersecurity", "react", "tailwind", "dashboard", "framer-motion"]
---



If you've never been inside a Security Operations Center, you probably imagine a dark room with giant screens and people typing really fast. That's... not wrong, actually. But there's a lot more going on.

I deployed a full SOC stack in my college lab. 30+ open-source tools, real traffic, real alerts. SOC Showcase is a frontend dashboard demo that visualizes the tools, architecture, workflows, and case timelines of that setup. It's the "here's what this actually looks like" project.

## Five Things a SOC Dashboard Needs to Show

Before I wrote any code, I had to figure out what the dashboard actually needed to communicate. It came down to five things.

**Tooling.** A SOC runs on tools: SIEM, EDR, threat intel feeds, ticketing systems, forensic utilities. The dashboard needs to show what's in the stack and how the pieces relate.

**Architecture.** How do those tools connect? Where does data flow from endpoints to the SIEM? How do alerts get routed? A list of tool names doesn't capture this.

**Metrics.** Mean time to detect, mean time to respond, alert volumes, false positive rates. Numbers tell you whether the SOC is working.

**Case timelines.** A phishing email arrives, gets flagged, gets investigated, leads to a credential reset, ends in a post-incident report. Showing that lifecycle gives a concrete sense of SOC work.

**Pipeline.** How alerts move from detection through triage, investigation, response, and closure. The operational backbone.

## Frontend Only, On Purpose

No backend, no API, no database. Everything renders client-side with static data. The goal was never to build a real SOC tool (that would need actual data sources). The goal was a compelling visualization of what a SOC looks like.

React with TypeScript, Tailwind CSS, Framer Motion for animations, Lucide for icons.

Tailwind was the right call here. SOC dashboards are visually dense. Lots of cards, grids, status indicators, data-heavy layouts. Utility classes let me iterate on spacing and density fast without jumping to separate CSS files. For a project where I'm constantly tweaking visual alignment, that speed mattered.

## The Component Library That Did the Heavy Lifting

Six shared components power all five variants.

**AnimatedDataFlow** is the showstopper. Animated particles move along SVG paths between SOC components, representing data flowing from endpoints to collectors to the SIEM to analyst workstations. This single component communicates "living system" better than any paragraph of text.

**ArchitectureGraph** renders the technical architecture as an interactive node graph. Tools are nodes, data flows are edges. You can see how the SIEM connects to log sources, how EDR feeds into the alert queue, where threat intel gets consumed.

**CaseTimeline** displays incidents as vertical timelines with timestamped events. Each event has a type (alert, triage, investigation, action, resolution). I included realistic sample cases: a phishing campaign, a suspicious login from unexpected geography, malware on a developer workstation.

**MetricCard** is the simplest but one of the most important. One metric, one label, a trend indicator, optional sparkline. Mean time to detect dropping from 45 minutes to 12 minutes tells a story. The card makes it visible at a glance.

**PipelineStage** shows the IR pipeline as a horizontal flow. Each stage shows its name, item count, and status. It answers the question every SOC manager asks multiple times per shift: "Where is our work right now?"

**ToolCard** represents a single tool with its name, category, status, and role. Cards are grouped by function: detection, analysis, response, reporting.

## Five Variants, Same Bones

All five variants follow one layout: Hero, Tools, Architecture, Cases, Pipeline, About. Single-page vertical scroll, each section at least a full viewport height. This mimics the "war room monitor" feel of real SOC dashboards while allowing more depth.

The variants differ in color palette, typography, animation intensity, and card styling. Some are dark with neon accents (the stereotypical SOC look). Others use cleaner, lighter designs. The point: SOC tools don't have to look like they were designed in 2005.

One component library, five thin styling layers. Changes to core components propagate everywhere.

## Reduced Motion Support

SOC Showcase has a lot of animation. Flowing particles, counter transitions, scroll-triggered reveals, pulsing indicators. For anyone with vestibular disorders or motion sensitivity, that's a problem.

Every animated component respects `prefers-reduced-motion`. Particles stop, counters show final values immediately, transitions switch to simple fades. The dashboard stays fully functional. It just stops moving.

Not hard to implement, but it required thinking about it from the start. Framer Motion supports reduced-motion detection at the component level. The key was making sure every animation had a fallback, not just the obvious ones.

## The Feature That Got the Strongest Reaction

The ArchitectureGraph and AnimatedDataFlow work together to answer a question that comes up in every SOC maturity assessment: "How do your tools integrate?"

Saying "I use Wazuh and TheHive" is one thing. Showing the data flow from agents on endpoints, through a log collector, into the SIEM, where correlation rules generate alerts that feed into the analyst queue... that's different.

When I showed this to security professionals, the architecture visualization consistently got the strongest reaction. People who build SOCs immediately got it.

## What I Took Away

Dashboards are harder than they look. The React components and CSS grid are the easy part. The hard part is information design: what to show, how much, and how to organize it so a glance gives you the right information in the right order.

Animation in data-heavy interfaces walks a fine line. Too little feels dead. Too much is distracting. The right amount communicates activity and draws attention to changes without overwhelming anyone.

Building five variants of the same dashboard forced me into clean component architecture. It made me separate what was truly shared from what was variant-specific. That discipline is worth more than the dashboard itself.

The whole project is on my GitHub.
