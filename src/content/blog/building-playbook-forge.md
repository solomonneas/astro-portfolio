---
title: "Playbook Forge: Because Nobody Reads the Binder at 2 AM"
pubDate: 2025-01-31
updatedDate: 2026-02-21
tags: ["incident-response", "python", "react", "typescript", "cybersecurity", "fastapi", "nist", "soar"]
---



Every security team has incident response playbooks. Most of them live in Word docs, PDF binders, or wikis that nobody opens until something is already on fire.

When a breach happens at 2 AM, scrolling through 40 pages to find the next step is not a plan. That's why I built Playbook Forge: it takes written incident response procedures and turns them into interactive visual flowcharts you can actually execute step by step.

## The Problem with Text-Based Playbooks

NIST SP 800-61 lays out a four-phase incident response lifecycle: Preparation, Detection and Analysis, Containment/Eradication/Recovery, and Post-Incident Activity. Good teams build playbooks around this. The playbooks define who does what, when to escalate, and how decisions branch by incident type and severity.

Writing the playbook isn't the hard part. Making it usable under pressure is.

A wall of text works fine during a Tuesday afternoon tabletop exercise. It falls apart at 3 AM when you need to know whether to isolate a host or call the CISO first. A flowchart turns sequential text into a decision tree you can follow in real time. That's a fundamentally different tool.

## Two Halves, One Workflow

Python FastAPI backend handles parsing, storage, and AI generation. React frontend handles visualization and execution.

The backend ingests playbooks in two formats: Markdown and Mermaid. Most teams write procedures as numbered lists with headers for each phase. The parser reads document structure, identifies phase boundaries from headers, extracts steps from list items, and detects decision points from conditional language ("if," "when," "depending on"). Then it builds a graph with nodes and edges for the frontend.

Mermaid support was a natural addition since a lot of technical teams already use it in their docs. If someone already has a Mermaid flowchart for their IR procedure, Playbook Forge ingests it directly.

The backend also handles full CRUD with SQLite and SQLAlchemy. Playbooks persist, get versioned, and can be categorized by type: Vulnerability Response, Incident Response, Threat Hunting. No more lost procedures.

## Custom Nodes in ReactFlow

The frontend is where it gets interesting. ReactFlow handles rendering, and I built five custom node types:

**Phase nodes** represent NIST lifecycle sections. Big, visually distinct containers that give you immediate orientation. One glance tells you whether you're in Detection, Containment, or Recovery.

**Step nodes** are individual actions. "Collect network logs," "notify the incident commander," "document initial findings." The atomic units.

**Decision nodes** are branch points. "Is the affected system production-critical?" goes two different ways. Diamond shapes, standard flowchart convention.

**Execute nodes** mark actions requiring external tools or system interaction. Running a forensic script, triggering a firewall rule change, sending an automated notification.

**Merge nodes** bring branching paths back together after a decision.

Auto-layout uses a dagre-based algorithm so parsed playbooks arrange themselves in a readable top-to-bottom flow without manual positioning. You can still drag nodes around if you want.

## Execution Engine

This is what turned Playbook Forge from a visualization tool into something you actually run during an incident.

The execution engine lets you step through a playbook in real time. Each step gets a status: pending, in progress, completed, skipped. Timestamps track when each action was taken. Decision nodes pause and wait for input before branching. The full execution history is saved so you can review what happened, who did what, and how long each phase took.

Post-incident reviews become trivial. Instead of trying to reconstruct a timeline from Slack messages and memory, you have a timestamped record of every step.

## AI Playbook Generation

Describe an incident in plain English, and Playbook Forge generates a complete playbook with phases, steps, decisions, and execution nodes. It's not magic. It maps your description against NIST 800-61 patterns and produces a structured starting point.

The generated playbooks aren't perfect out of the box. They're drafts. But they cut the initial authoring time from hours to minutes, and you can edit the result in the visual editor before saving it to your library.

MCP (Model Context Protocol) hooks are built in for AI-assisted execution, so the tool can integrate with AI agents that help analysts work through complex procedures.

## SOAR Integration

The built-in action library connects to real response platforms. This isn't a standalone diagram tool anymore. It's a lightweight SOAR engine.

When a playbook step says "isolate the host," you can wire that to an actual API call. When it says "check reputation," it can query your threat intel platforms. The gap between "what the playbook says to do" and "actually doing it" gets smaller.

## Export and Sharing

Playbooks export to Markdown, Mermaid, and JSON. Import works the same way, including bulk import for teams migrating existing procedure libraries. Share links let you hand a playbook to someone without giving them access to the full system. Print CSS makes hard copies readable if someone still wants a binder (I won't judge).

## Five Visual Themes

SOC, Analyst, Terminal, Command, Cyber. Different color schemes, typography, layout density. What works on a large monitor in a SOC might not work on a laptop during field response.

Keyboard shortcuts switch between them instantly. No page reload, no settings menu. Hit a number key and the whole interface re-skins.

## Why I Actually Built This

The deeper reason is accessibility. Not visual accessibility (though the themes do consider contrast). I mean making incident response knowledge accessible to people who need it most.

Junior analysts, new team members, small organizations without dedicated IR staff. A flowchart communicates hierarchy, sequence, and decision logic in ways prose can't match. You trace a path through a flowchart in seconds. The same path through a document takes minutes of careful reading.

NIST 800-61 is an excellent framework, but it's written for people who already understand the concepts. Playbook Forge bridges the gap between the framework and the humans executing procedures. Turning the abstract lifecycle into concrete visual steps, with a real execution engine behind them, helps teams actually follow their playbooks instead of just having them.

## What I Learned

The gap between documentation and usability is where most teams struggle. The knowledge exists. It's written down. But the format makes it unusable when it matters most.

Text parsing, even semi-structured text, is messier than you'd expect. Real-world playbook documents have edge cases I never would have anticipated.

Building the execution engine changed the entire tool. A static flowchart is nice. A flowchart you can run, track, and review is a different category of useful.

ReactFlow is excellent for this use case. The custom node system is flexible enough for domain-specific concepts without fighting the framework. FastAPI continues to be my go-to for Python APIs. Type hints, automatic validation, built-in docs. And adding SQLite persistence with SQLAlchemy was straightforward enough that there was no reason to leave playbooks as ephemeral artifacts.

Playbook Forge is on [my GitHub](https://github.com/solomonneas/playbook-forge). If your team has incident response playbooks gathering dust on a shared drive, try running one through it. Seeing your procedures as a live, executable flowchart might change how you think about them.
