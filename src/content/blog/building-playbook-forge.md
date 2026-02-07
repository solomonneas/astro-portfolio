---
title: "Building Playbook Forge: Turning Incident Response Plans into Visual Flowcharts"
pubDate: 2025-02-07
tags: ["incident-response", "python", "react", "cybersecurity", "fastapi", "nist"]
---

Every security team has incident response playbooks. The problem is that most of them live in Word documents, PDF binders, or wikis that nobody reads until something is already on fire. When a breach happens at 2 AM, the last thing you want is to scroll through a 40-page document trying to figure out what step comes next. That frustration is exactly why I built Playbook Forge: a tool that transforms written incident response procedures into interactive, visual flowcharts.

## Why Incident Response Playbooks Matter

NIST SP 800-61, the Computer Security Incident Handling Guide, lays out a four-phase lifecycle for incident response: Preparation, Detection and Analysis, Containment/Eradication/Recovery, and Post-Incident Activity. Every organization that takes security seriously builds playbooks around this lifecycle. The playbooks define who does what, when escalation happens, and how decisions branch depending on the type and severity of an incident.

The challenge is not writing the playbook. The challenge is making it usable under pressure. A wall of text works fine during a tabletop exercise on a Tuesday afternoon. It falls apart when you are staring at alerts at 3 AM and need to know whether to isolate a host or escalate to the CISO first. Visual flowcharts solve this by turning sequential text into a decision tree you can follow in real time.

## The Architecture

Playbook Forge has two halves: a Python FastAPI backend that handles parsing, and a React frontend that handles visualization.

On the backend, the core job is ingesting playbooks written in two formats: Markdown and Mermaid. Markdown is the more common format. Most teams write their procedures as numbered lists with headers for each phase. The parser reads through the document structure, identifies phase boundaries from headers, extracts individual steps from list items, and detects decision points from conditional language like "if," "when," or "depending on." It then builds a graph structure with nodes and edges that the frontend can render.

Mermaid support was a natural addition. Mermaid is a text-based diagramming language that a lot of technical teams already use in their documentation. If someone has already written a Mermaid flowchart for their IR procedure, Playbook Forge can ingest it directly. The Mermaid parser handles the syntax, extracts node definitions and connections, and maps Mermaid node shapes to Playbook Forge's internal node types.

FastAPI made the backend straightforward. The API exposes endpoints for uploading playbook files, retrieving parsed graph data, and listing available playbooks. FastAPI's automatic OpenAPI documentation was a bonus during development since I could test parsing endpoints directly from the browser.

## Custom Node Types and ReactFlow

The frontend is where things get interesting. I used ReactFlow as the flowchart rendering engine because it gives you full control over node appearance, layout, and interaction. Out of the box, ReactFlow provides basic nodes. For Playbook Forge, I needed something more expressive.

I built five custom node types:

**Phase nodes** represent the major sections of the NIST lifecycle. They are visually distinct, larger containers that group related steps together. When you look at a rendered playbook, the phases give you immediate orientation. You can see at a glance whether you are in Detection, Containment, or Recovery.

**Step nodes** are the individual actions within a phase. "Collect network logs," "notify the incident commander," "document initial findings." These are the atomic units of the playbook.

**Decision nodes** represent branch points. "Is the affected system production-critical?" leads to different paths depending on the answer. These render as diamond shapes, following standard flowchart conventions, so anyone familiar with process diagrams can read them immediately.

**Execute nodes** mark actions that require external tooling or system interaction. Running a forensic script, triggering a firewall rule change, or sending an automated notification. These are visually tagged to indicate they involve doing something beyond just deciding or documenting.

**Merge nodes** bring branching paths back together. After a decision splits the flow into two or more paths, a merge node reunites them at the point where the procedure converges again.

ReactFlow handles the rendering, dragging, zooming, and panning. I implemented auto-layout using a dagre-based algorithm so that parsed playbooks arrange themselves in a readable top-to-bottom flow without manual positioning. Users can still drag nodes around if they want to customize the layout.

## Five Visual Variants

I built five visual variants for Playbook Forge, each with a different design approach. The variants share the same core parsing and rendering logic but differ in color schemes, typography, layout density, and component styling. This was partly a design exercise and partly practical. Different teams have different aesthetic preferences, and what works on a large monitor in a SOC might not work on a laptop during a field response.

The variants use a custom hash router that I implemented instead of React Router. Hash routing keeps everything client-side and avoids the need for server-side route handling. Each variant gets its own hash route, and switching between them is instant with no page reload.

## Parsing Challenges

The hardest part of the project was not the visualization. It was the parsing. Written playbooks are wildly inconsistent. Some teams use strict numbered lists. Others use bullet points mixed with paragraphs. Decision points might be explicit ("If X, then Y") or implicit ("For production systems, prioritize..."). Nested procedures, cross-references to other documents, and inline notes all add complexity.

I handled this by building the Markdown parser in layers. The first pass identifies structural elements: headers, lists, and paragraphs. The second pass classifies each element as a phase, step, decision, or annotation based on keywords and patterns. The third pass builds the graph by connecting nodes in sequence and creating branches at decision points.

It is not perfect. Ambiguous language still trips up the parser sometimes, and heavily narrative playbooks with few structural markers are harder to parse than well-organized ones. But for reasonably structured Markdown, it produces clean, accurate flowcharts.

## Making IR Accessible

The deeper motivation behind Playbook Forge is accessibility. Not in the visual/disability sense (though the variants do consider contrast and readability), but in the sense of making incident response knowledge accessible to people who need it most.

Junior analysts, new team members, and small organizations without dedicated IR staff all benefit from having visual procedures. A flowchart communicates hierarchy, sequence, and decision logic in ways that prose cannot match. You can trace a path through a flowchart in seconds. Tracing the same path through a document takes minutes of careful reading.

NIST SP 800-61 is an excellent framework, but it is written for security professionals who already understand the concepts. Playbook Forge bridges the gap between the framework and the people executing the procedures. By turning the abstract lifecycle into concrete, visual steps, it helps teams actually follow their playbooks instead of just having them.

## What I Learned

Building Playbook Forge reinforced something I keep coming back to: the gap between documentation and usability is where most organizations struggle. The knowledge exists. It is written down. But the format makes it hard to use when it matters most.

On the technical side, I gained a much deeper appreciation for text parsing. Natural language, even semi-structured natural language, is messy. Building a parser that handles real-world playbook documents meant accounting for edge cases I never would have anticipated.

ReactFlow proved to be an excellent library for this use case. The custom node system is flexible enough to represent domain-specific concepts without fighting the framework. And FastAPI continues to be my go-to for Python APIs. The combination of type hints, automatic validation, and built-in docs makes development fast and the resulting API reliable.

Playbook Forge is available on my GitHub. If your team has incident response playbooks gathering dust in a shared drive, give it a try. Seeing your procedures as flowcharts might change how you think about them.
