# SOC Showcase - Social Media Drafts

## LinkedIn

If you have never worked in a Security Operations Center, it can be hard to picture what one actually looks like from the inside. SOC Showcase is a frontend dashboard demo I built to visualize the tools, architecture, workflows, and case timelines of a modern SOC.

The project is built with React, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons. It is entirely frontend, with no backend or live data sources. The goal was not to build a production SOC tool but to create a compelling, interactive visualization of SOC operations that communicates concepts clearly to stakeholders, students, and anyone curious about security operations.

I built six shared components that power all five visual variants: AnimatedDataFlow (particles moving along SVG paths between SOC components), ArchitectureGraph (interactive node graph of tool integrations), CaseTimeline (vertical incident timelines with timestamped events), MetricCard (single-metric displays with trends and sparklines), PipelineStage (horizontal incident response pipeline flow), and ToolCard (individual tool displays grouped by function).

Every variant follows the same scrolling layout: Hero, Tools, Architecture, Cases, Pipeline, About. This mirrors the "war room monitor" feel of real SOC displays while allowing deeper exploration through scrolling. All animations respect the prefers-reduced-motion media query for accessibility.

The component that consistently gets the strongest reaction from security professionals is ArchitectureGraph combined with AnimatedDataFlow. Showing how tools integrate, with animated data flowing between them, communicates the concept of a connected security stack far more effectively than a bullet list of tool names.

## Twitter/X

🧵 Built SOC Showcase: a frontend dashboard demo that visualizes what a Security Operations Center looks like from the inside. React + TypeScript + Tailwind + Framer Motion. Thread on the build: (1/7)

SOC dashboards need to communicate five things: tooling, architecture, metrics, case timelines, and the incident response pipeline. SOC Showcase has dedicated components for each. (2/7)

The AnimatedDataFlow component is my favorite. SVG particles flow along paths between SOC components: endpoints to collectors to SIEM to analyst workstations. One component does more to convey "living system" than paragraphs of text. (3/7)

ArchitectureGraph renders tool integrations as an interactive node graph. Not just "we use Splunk." It shows HOW Splunk connects to log sources, EDR feeds, and the alert queue. Security pros consistently react strongest to this one. (4/7)

CaseTimeline shows real incident narratives: phishing campaigns, suspicious logins, malware detections. Each event has a type, timestamp, and description. Scrolling a timeline gives you the feel of actual SOC work. (5/7)

All animations respect prefers-reduced-motion. Particles stop, counters show final values immediately, reveals switch to simple fades. Full functionality without the motion. Accessibility is not optional. (6/7)

Five visual variants, same scrolling layout (Hero → Tools → Architecture → Cases → Pipeline → About), shared component library. Open source on GitHub. Link in bio. (7/7)

## Mastodon

Shipped SOC Showcase: a frontend-only dashboard demo visualizing Security Operations Center workflows, architecture, and case timelines.

Stack: React + TypeScript + Tailwind + Framer Motion + Lucide. No backend. Static data rendered through six shared components across five visual variants.

Core components:
- AnimatedDataFlow: SVG particle animation along paths between SOC nodes
- ArchitectureGraph: interactive tool integration node graph
- CaseTimeline: vertical incident timelines with typed events
- MetricCard: single-metric display with trend/sparkline
- PipelineStage: horizontal IR pipeline visualization
- ToolCard: tool cards grouped by function (detection/analysis/response/reporting)

All animations respect `prefers-reduced-motion`. Framer Motion makes per-component reduced-motion detection straightforward, but you have to plan for it from the start. Every animation has a fallback.

The hardest part was information design, not code. Deciding what to show, how much, and in what order so a glance communicates the right information. Dashboards are deceptively difficult.

Source on GitHub.

#infosec #soc #securityoperations #react #cybersecurity #dashboard #accessibility

## Bluesky

Built SOC Showcase: a frontend dashboard demo that shows what a Security Operations Center actually looks like from the inside.

Animated data flows, tool architecture graphs, incident timelines, and response pipeline visualization. Five visual variants, all with reduced-motion accessibility support.

React + Tailwind + Framer Motion, no backend. Check it out on solomonneas.dev.

## Substack Teaser

**What does the inside of a Security Operations Center actually look like?**

Not the movie version with green text on black screens. A real one, with SIEM integrations, alert triage pipelines, and case timelines tracking incidents from detection to closure.

I built SOC Showcase to answer that question. It is an interactive frontend dashboard demo with animated data flows, architecture graphs, and incident response pipeline visualizations. Five visual variants, full reduced-motion accessibility, and zero backend complexity.

Read the full breakdown of the component architecture and design decisions on solomonneas.dev.
