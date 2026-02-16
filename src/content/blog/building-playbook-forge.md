---
title: "Playbook Forge: Because Nobody Reads the Binder at 2 AM"
pubDate: 2025-01-31
updatedDate: 2026-02-16
tags: ["incident-response", "python", "react", "cybersecurity", "fastapi", "nist"]
---



Every security team has incident response playbooks. Most of them live in Word docs, PDF binders, or wikis that nobody opens until something is already on fire.

When a breach happens at 2 AM, scrolling through 40 pages to find the next step is not a plan. That's why I built Playbook Forge: it takes written incident response procedures and turns them into interactive visual flowcharts.

## The Problem with Text-Based Playbooks

NIST SP 800-61 lays out a four-phase incident response lifecycle: Preparation, Detection and Analysis, Containment/Eradication/Recovery, and Post-Incident Activity. Good teams build playbooks around this. The playbooks define who does what, when to escalate, and how decisions branch by incident type and severity.

Writing the playbook isn't the hard part. Making it usable under pressure is.

A wall of text works fine during a Tuesday afternoon tabletop exercise. It falls apart at 3 AM when you need to know whether to isolate a host or call the CISO first. A flowchart turns sequential text into a decision tree you can follow in real time. That's a fundamentally different tool.

## Two Halves

Python FastAPI backend handles parsing. React frontend handles visualization.

The backend ingests playbooks in two formats: Markdown and Mermaid. Most teams write procedures as numbered lists with headers for each phase. The parser reads document structure, identifies phase boundaries from headers, extracts steps from list items, and detects decision points from conditional language ("if," "when," "depending on"). Then it builds a graph with nodes and edges for the frontend.

Mermaid support was a natural addition since a lot of technical teams already use it in their docs. If someone already has a Mermaid flowchart for their IR procedure, Playbook Forge ingests it directly.

FastAPI's automatic OpenAPI docs were a bonus. I could test parsing endpoints straight from the browser during development.

## Custom Nodes in ReactFlow

The frontend is where it gets interesting. ReactFlow handles rendering, and I built five custom node types:

**Phase nodes** represent NIST lifecycle sections. Big, visually distinct containers that give you immediate orientation. One glance tells you whether you're in Detection, Containment, or Recovery.

**Step nodes** are individual actions. "Collect network logs," "notify the incident commander," "document initial findings." The atomic units.

**Decision nodes** are branch points. "Is the affected system production-critical?" goes two different ways. Diamond shapes, standard flowchart convention.

**Execute nodes** mark actions requiring external tools or system interaction. Running a forensic script, triggering a firewall rule change, sending an automated notification.

**Merge nodes** bring branching paths back together after a decision.

Auto-layout uses a dagre-based algorithm so parsed playbooks arrange themselves in a readable top-to-bottom flow without manual positioning. You can still drag nodes around if you want.

## Parsing Was the Hard Part

The visualization was straightforward. The parsing was not.

Written playbooks are wildly inconsistent. Some teams use strict numbered lists. Others mix bullet points with paragraphs. Decision points might be explicit ("If X, then Y") or buried in prose ("For production systems, prioritize..."). Nested procedures, cross-references, inline notes. It's messy.

I built the Markdown parser in three layers. First pass: identify structural elements (headers, lists, paragraphs). Second pass: classify each element as phase, step, decision, or annotation using keywords and patterns. Third pass: build the graph by connecting nodes and creating branches at decision points.

It's not perfect. Ambiguous language still trips it up, and heavily narrative playbooks with few structural markers are tough. But for reasonably structured Markdown, it produces clean, accurate flowcharts.

## Five Variants

Five visual variants, same core parsing and rendering logic. Different color schemes, typography, layout density, component styling. What works on a large monitor in a SOC might not work on a laptop during field response.

I used a custom hash router instead of React Router. Hash routing keeps everything client-side with no server-side route handling needed. Switching between variants is instant, no page reload.

## Why I Actually Built This

The deeper reason is accessibility. Not visual accessibility (though the variants do consider contrast). I mean making incident response knowledge accessible to people who need it most.

Junior analysts, new team members, small organizations without dedicated IR staff. A flowchart communicates hierarchy, sequence, and decision logic in ways prose can't match. You trace a path through a flowchart in seconds. The same path through a document takes minutes of careful reading.

NIST 800-61 is an excellent framework, but it's written for people who already understand the concepts. Playbook Forge bridges the gap between the framework and the humans executing procedures. Turning the abstract lifecycle into concrete visual steps helps teams actually follow their playbooks instead of just having them.

## What I Learned

The gap between documentation and usability is where most teams struggle. The knowledge exists. It's written down. But the format makes it unusable when it matters most.

Text parsing, even semi-structured text, is messier than you'd expect. Real-world playbook documents have edge cases I never would have anticipated.

ReactFlow is excellent for this use case. The custom node system is flexible enough for domain-specific concepts without fighting the framework. And FastAPI continues to be my go-to for Python APIs. Type hints, automatic validation, built-in docs. Hard to beat.

Playbook Forge is on my GitHub. If your team has incident response playbooks gathering dust on a shared drive, try running one through it. Seeing your procedures as a flowchart might change how you think about them.
