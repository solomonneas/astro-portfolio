---
title: "MockWatchtower Social Media Drafts"
project: "mockwatchtower"
---

## LinkedIn

I wanted to know what it takes to build a NOC dashboard from scratch. Not use one. Build one.

MockWatchtower is a real-time network monitoring dashboard that polls LibreNMS, Netdisco, Proxmox, and speedtest data, then displays everything on an interactive topology map with live updates via WebSockets.

What I learned building it:

WebSockets change everything. REST polling works, but pushing updates the instant a device goes down makes the dashboard feel alive. Connection resilience (automatic reconnection with state reconciliation) was harder than the initial implementation.

ReactFlow is powerful for network topology. Custom nodes show device type, hostname, and status at a glance. Edges reflect link state and utilization. The whole layout is draggable and configurable via YAML.

Multi-source data normalization is the real challenge. LibreNMS, Netdisco, and Proxmox each report status differently. Building a unified model that the frontend can consume without caring about the source required more design work than expected.

Tech stack:
- Python FastAPI with WebSocket support
- React + TypeScript + ReactFlow topology canvas
- Zustand for state management
- YAML-driven topology and data source configuration
- Port grid visualization for switch interfaces
- Demo mode for portfolio showcase

The demo mode was important. Anyone can see the dashboard in action without needing access to my lab infrastructure.

Source on GitHub: [link]

\#NetworkEngineering #Monitoring #WebSocket #React #Python #NOC #HomeLab

---

## Twitter/X

Built MockWatchtower: a NOC-style monitoring dashboard from scratch.

Real-time WebSocket updates, ReactFlow topology map, multi-source polling (LibreNMS + Netdisco + Proxmox), port grid visualization, alert system.

Includes demo mode so you can see it live without my lab.

🔗 [link]

---

## Mastodon

I built a NOC-style network monitoring dashboard called MockWatchtower. It polls LibreNMS, Netdisco, and Proxmox for device status and displays everything on an interactive topology map that updates in real time via WebSockets.

The frontend uses React with ReactFlow for the topology canvas. Custom nodes show device status at a glance, and edges change color based on link state. Zustand handles state management to keep re-renders efficient with frequent updates.

My favorite feature is the port grid: for switches, it shows a visual grid of every port colored by status, with hover details showing connected device, VLAN, and throughput. 

It has a demo mode that simulates a live network with status changes, outages, and recovery, so anyone can see it in action without access to real infrastructure.

Python FastAPI backend, YAML configuration for topology and data sources. Source on GitHub.

#networking #monitoring #react #python #homelab #noc

---

## Bluesky

What does it take to build a NOC dashboard from scratch?

MockWatchtower: real-time network monitoring with WebSocket updates, ReactFlow topology map, multi-source polling, port grid visualization, and a demo mode for portfolio showcase.

Python FastAPI + React TypeScript. Source on GitHub: [link]

---

## Substack Teaser

Walk into any Network Operations Center and the first thing you see is the wall of screens: topology maps with colored status indicators, traffic graphs, alert tickers. Those dashboards look complex, but what does it actually take to build one?

I built MockWatchtower to find out. It polls real network infrastructure (LibreNMS, Netdisco, Proxmox), pushes updates to the browser via WebSockets, and renders an interactive topology map with ReactFlow.

In the full post, I cover the WebSocket architecture (including connection resilience), how ReactFlow handles interactive network topology, the challenge of normalizing data from multiple monitoring sources, and why I built a demo mode that simulates a live network for portfolio visitors.

Read the full build log on my blog: [link]
