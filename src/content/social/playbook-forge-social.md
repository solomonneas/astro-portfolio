# Playbook Forge - Social Media Drafts

## LinkedIn

Incident response playbooks are critical. But let's be honest: most of them sit in shared drives as Word documents that nobody opens until something goes wrong. By then, the last thing you need is to scroll through 40 pages of procedures under pressure.

I built Playbook Forge to solve this. It is a tool that transforms written IR playbooks into interactive, visual flowcharts. You upload a Markdown or Mermaid file describing your incident response procedures, and it parses the document into a flowchart with custom node types: Phase, Step, Decision, Execute, and Merge. The result is a visual decision tree you can actually follow during an incident.

The backend is Python with FastAPI, handling Markdown and Mermaid parsing into graph structures. The frontend uses React, TypeScript, and ReactFlow to render interactive flowcharts with auto-layout, drag-and-drop repositioning, and zoom/pan navigation. I built five visual variants with a custom hash router to demonstrate different design approaches for the same underlying tool.

The project is grounded in the NIST SP 800-61 incident response lifecycle. The four phases (Preparation, Detection and Analysis, Containment/Eradication/Recovery, and Post-Incident Activity) map directly to the Phase node type. Every playbook rendered in Playbook Forge shows where you are in the NIST lifecycle at a glance.

If you work in security operations, incident response, or GRC, I would love to hear your thoughts. The project is open source on my GitHub. Link in comments.

## Twitter/X

🧵 I built Playbook Forge: a tool that turns incident response playbooks into interactive visual flowcharts. Here is why and how. (1/6)

Most IR playbooks are Word docs or PDFs. During an incident at 2 AM, nobody wants to scroll through 40 pages to find the right step. Visual flowcharts fix this. Upload Markdown or Mermaid, get an interactive decision tree. (2/6)

Built on Python FastAPI (backend parsing) + React/TypeScript/ReactFlow (frontend visualization). Custom node types: Phase, Step, Decision, Execute, and Merge. Each maps to a specific concept in incident response workflows. (3/6)

The parser handles real-world playbook formatting: headers become phases, list items become steps, conditional language ("if," "when") triggers decision nodes. It is not perfect with messy docs, but structured Markdown parses cleanly. (4/6)

Grounded in NIST SP 800-61. The four-phase IR lifecycle (Preparation, Detection/Analysis, Containment/Eradication/Recovery, Post-Incident Activity) maps directly to Phase nodes. You always know where you are in the framework. (5/6)

Five visual variants, custom hash router, auto-layout with dagre. Open source on my GitHub. If your IR playbooks are gathering dust in a shared drive, give Playbook Forge a try. Link in bio. (6/6)

## Mastodon

Just shipped Playbook Forge: a tool for turning incident response playbooks (Markdown or Mermaid) into interactive visual flowcharts.

Backend: Python FastAPI with custom parsers that extract phases, steps, and decision points from document structure.

Frontend: React + TypeScript + ReactFlow with five custom node types (Phase, Step, Decision, Execute, Merge) and dagre-based auto-layout.

The Markdown parser works in three passes: structural identification, element classification based on keywords/patterns, and graph construction. Conditional language in the text ("if," "depending on") triggers decision node creation.

Built around NIST SP 800-61's four-phase lifecycle. Five visual variants with a custom hash router.

The hardest part was not rendering. It was parsing. Real-world playbook documents are wildly inconsistent in formatting, and building a parser that handles the variations gracefully took more iteration than the entire frontend.

Source on GitHub. Would appreciate feedback from anyone working IR or building security tooling.

#infosec #incidentresponse #python #react #cybersecurity #nist #opensource

## Bluesky

Built a thing: Playbook Forge turns your incident response playbooks (Markdown/Mermaid files) into interactive visual flowcharts. No more scrolling through 40-page Word docs during an incident.

Python FastAPI backend parses the docs, React + ReactFlow frontend renders them with custom node types. Five visual variants, auto-layout, fully open source.

Check it out on my portfolio: solomonneas.dev

## Substack Teaser

**Your incident response playbook is useless at 2 AM.**

Not because the content is bad. Because a 40-page Word document is the wrong format for a crisis. You need a visual decision tree you can follow step by step, not a wall of text to skim under pressure.

I built Playbook Forge to fix that. Upload a Markdown or Mermaid file, get an interactive flowchart with decision branches, phase markers, and execution steps. All grounded in the NIST SP 800-61 lifecycle.

Read the full build breakdown, including the three-pass parsing architecture and why I built custom ReactFlow node types, on solomonneas.dev.
