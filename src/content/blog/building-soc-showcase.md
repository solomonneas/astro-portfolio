---
title: "Building SOC Showcase: Designing a Security Operations Center Dashboard Demo"
pubDate: 2025-01-29
tags: ["soc", "cybersecurity", "react", "tailwind", "dashboard", "framer-motion"]
---

Security Operations Centers are the nerve center of any serious cybersecurity program. They are where alerts flow in, analysts triage threats, incidents get escalated, and the overall security posture of an organization gets monitored in real time. But if you have never worked in a SOC, it can be hard to understand what actually happens inside one. SOC Showcase is my attempt to change that: a frontend dashboard demo that visualizes the tools, architecture, workflows, and case timelines of a modern SOC.

## What Makes a Good SOC Dashboard

Before writing any code, I spent time thinking about what a SOC dashboard actually needs to communicate. The answer broke down into five categories.

First, tooling. A SOC runs on tools: SIEM platforms, EDR agents, threat intelligence feeds, ticketing systems, forensic utilities. A dashboard needs to show what tools are in the stack and how they relate to each other.

Second, architecture. How do those tools connect? Where does data flow from endpoints to the SIEM? How do alerts get routed to analysts? Architecture visualization gives context that a list of tool names cannot provide.

Third, metrics. Mean time to detect, mean time to respond, alert volumes, false positive rates, case closure rates. Numbers tell the story of whether the SOC is working.

Fourth, case timelines. Individual incidents have lifecycles. A phishing email arrives, gets flagged, gets investigated, leads to credential reset, ends in a post-incident report. Showing this timeline gives a concrete sense of what SOC work looks like day to day.

Fifth, pipeline. The incident response pipeline itself: how alerts move from detection through triage, investigation, response, and closure. This is the operational backbone of the SOC.

SOC Showcase addresses all five.

## The Tech Stack

This is a frontend-only project. No backend, no API, no database. Everything is rendered client-side with static data. The goal was not to build a real SOC tool (that would require actual data sources and integrations) but to build a compelling visualization of what a SOC looks like.

The stack is React with TypeScript, styled with Tailwind CSS. Animations use Framer Motion. Icons come from Lucide. It is a straightforward modern frontend stack, chosen for speed of development and visual polish.

I went with Tailwind because SOC dashboards are visually dense. There are lots of cards, grids, status indicators, and data-heavy layouts. Tailwind's utility classes let me iterate on layout and spacing quickly without context-switching to separate CSS files. For a project where I was constantly tweaking visual density and alignment, that speed mattered.

Framer Motion handles the animations: data flow visualizations, metric counter transitions, timeline reveals, and section entry animations. Animations in a dashboard context serve a functional purpose beyond aesthetics. They guide the eye, indicate data freshness, and create a sense of activity that makes static data feel alive.

## Shared Component Library

The real engineering work in SOC Showcase is in the shared component library. I built six core components that all five variants use.

**AnimatedDataFlow** is the most visually striking. It renders animated particles moving along paths between SOC components, representing data flowing from endpoints to collectors to the SIEM to analyst workstations. The particles follow SVG paths with configurable speed, color, and density. This single component does more to communicate "this is a living system" than any amount of static text could.

**ArchitectureGraph** renders the SOC's technical architecture as an interactive node graph. Tools and systems are nodes. Data flows and integrations are edges. Users can see how the SIEM connects to log sources, how the EDR feeds into the alert queue, and where threat intelligence gets consumed. It is not a full network diagram tool, but it communicates the architecture clearly.

**CaseTimeline** displays individual security incidents as vertical timelines with timestamped events. Each event has a type (alert, triage, investigation, action, resolution), an icon, and a description. Scrolling through a case timeline gives you the narrative of an incident from detection to closure. I included realistic sample cases: a phishing campaign, a suspicious login from an unexpected geography, and a malware detection on a developer workstation.

**MetricCard** is the simplest component but one of the most important. It displays a single metric with a label, value, trend indicator, and optional sparkline. SOC dashboards live and die by their metrics. Mean time to detect dropping from 45 minutes to 12 minutes tells a story. A metric card makes that story visible at a glance.

**PipelineStage** visualizes the incident response pipeline as a horizontal flow of stages. Each stage shows its name, a count of items currently in that stage, and a status indicator. The pipeline view answers the question "where is our work right now?" that every SOC manager asks multiple times per shift.

**ToolCard** represents a single tool in the SOC stack with its name, category, status, and a brief description of its role. Tool cards are arranged in grids, grouped by function: detection, analysis, response, and reporting.

## Five Variants, One Layout Flow

All five variants follow the same single-page scrolling layout: Hero, Tools, Architecture, Cases, Pipeline, About. The sections scroll vertically with each section taking up at least a full viewport height. This was a deliberate design choice. SOC dashboards in the real world are typically single-screen displays. A scrolling layout mimics that "war room monitor" feel while allowing more depth than a single static screen.

The variants differ in color palette, typography, animation intensity, card styling, and section transitions. Some are dark-themed with neon accent colors, mimicking the stereotypical SOC aesthetic. Others use cleaner, lighter designs that feel more like modern SaaS dashboards. The variety demonstrates that SOC tools do not have to look like they were designed in 2005.

Each variant shares the same component library, which means changes to the core components propagate to all variants. This architecture kept the codebase manageable. Instead of five separate dashboards, I have one component library and five thin styling layers on top.

## Reduced-Motion Accessibility

One thing I was deliberate about was reduced-motion support. SOC Showcase has a lot of animation: flowing particles, counter transitions, scroll-triggered reveals, pulsing status indicators. For users with vestibular disorders or motion sensitivity, all of that movement can cause discomfort or nausea.

Every animated component in SOC Showcase respects the `prefers-reduced-motion` media query. When reduced motion is enabled, particles stop flowing, counters display their final values immediately, and section transitions switch from animated reveals to simple fades or instant appearance. The dashboard remains fully functional and informative. It just removes the motion.

This was not difficult to implement, but it required thinking about it from the start. Framer Motion makes it relatively easy by supporting reduced-motion detection at the component level. The key was making sure every animation had a reduced-motion fallback, not just the obvious ones.

## Tool Integration Visualization

The ArchitectureGraph and AnimatedDataFlow components work together to answer a question that comes up in every SOC maturity assessment: "How do your tools integrate?" It is one thing to say "we use Splunk and CrowdStrike." It is another to show the data flow from CrowdStrike agents on endpoints, through a log collector, into Splunk, where correlation rules generate alerts that feed into the analyst queue.

SOC Showcase's architecture view makes these integrations visible. Even with sample data, it communicates the concept of a connected security stack versus a collection of disconnected tools. During conversations with security professionals about the project, this visualization consistently got the strongest reaction. People who build and manage SOCs immediately recognized the value of being able to show integration flows visually.

## What I Learned

SOC Showcase taught me that dashboards are harder than they look. The technical implementation is straightforward. React components, CSS grid, some animations. The hard part is information design: deciding what to show, how much to show, and how to organize it so that someone glancing at the screen gets the right information in the right order.

I also learned that animation in data-heavy interfaces walks a fine line. Too little, and the dashboard feels static and lifeless. Too much, and it becomes distracting. The right amount of animation communicates activity and draws attention to important changes without overwhelming the viewer.

Building five variants of the same dashboard was a useful exercise in component architecture. It forced me to think about what was truly shared versus what was variant-specific. The result is a clean separation between data, logic, and presentation that makes the codebase easy to extend.

SOC Showcase is on my GitHub. Whether you are studying for a security role, presenting SOC concepts to stakeholders, or just curious what a Security Operations Center looks like from the inside, check it out.
