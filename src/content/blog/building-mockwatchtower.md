---
title: "Building MockWatchtower: A NOC-Style Network Monitoring Dashboard"
pubDate: 2025-01-22
tags: ["python", "fastapi", "react", "websocket", "networking", "monitoring", "reactflow"]
---

Walk into any Network Operations Center and the first thing you notice is the wall of screens. Topology maps with green and red indicators. Traffic graphs updating in real time. Alert tickers scrolling across the bottom. These dashboards exist because network teams need to see the state of their infrastructure at a glance. I wanted to build one from scratch. Not a toy demo with hardcoded data, but a real monitoring dashboard that polls actual devices and updates in real time. That project became MockWatchtower.

## What Makes a NOC Dashboard

Before writing any code, I spent time studying what makes NOC dashboards effective. The good ones share a few traits. They aggregate data from multiple sources into a single view. They update continuously without requiring manual refreshes. They surface problems quickly through visual hierarchy: red means something is wrong, and you should not have to read a log file to figure out what.

MockWatchtower targets all three of those principles. It pulls device data from LibreNMS, Netdisco, and Proxmox. It uses WebSocket connections for real-time updates. And it presents everything through an interactive topology map where device status is visible at a glance.

## Backend Architecture

The backend is Python with FastAPI, which has become my go-to for projects like this. FastAPI's native WebSocket support was a major factor in choosing it. REST APIs work well for request-response patterns, but a monitoring dashboard needs to push updates to the browser the moment something changes. Polling a REST endpoint every few seconds would work, but it wastes bandwidth on unchanged data and introduces latency. WebSockets give you a persistent connection where the server sends updates only when they happen.

The polling engine is the core of the backend. It runs on configurable intervals, reaching out to each data source and collecting device status, metrics, and topology information.

LibreNMS provides device up/down status, latency measurements, interface utilization, and alert states. The integration uses the LibreNMS REST API, pulling data for all monitored devices in batch requests to minimize API overhead.

Netdisco contributes layer 2 topology data: which devices are connected to which switch ports, VLAN information, and neighbor relationships discovered through CDP and LLDP. This data is what makes the topology map meaningful. Without it, you just have a list of devices. With it, you can show how they connect.

Proxmox integration adds hypervisor and virtual machine status. In my lab, several network services run as VMs or containers on Proxmox, and knowing their state matters for troubleshooting. If a DNS server VM goes down, the network symptoms look very different from a switch failure, but both show up on the dashboard.

I also integrated a speedtest module that periodically tests WAN connectivity. It is a simple addition, but having historical bandwidth data on the dashboard helps identify ISP issues versus internal network problems.

All data source configurations live in YAML files. Adding a new LibreNMS instance or Proxmox node means adding a few lines to the config, not changing code. The topology layout is also YAML-configured, letting you define device positions, groupings, and connection overrides without touching the frontend.

## Real-Time Updates with WebSockets

The WebSocket implementation follows a pub/sub pattern. When a client connects, it subscribes to updates for specific device groups or the entire topology. The backend maintains a registry of active connections and broadcasts state changes as they occur.

Each WebSocket message carries a typed payload. Device status changes include the device identifier, old status, new status, and timestamp. Metric updates carry the measurement type, value, and unit. Alert messages include severity, source device, and description. The frontend uses these types to route updates to the correct visual components without re-rendering the entire dashboard.

Connection resilience was important to get right. WebSocket connections drop for all sorts of reasons: browser tabs going to sleep, network blips, server restarts. The client implements automatic reconnection with exponential backoff. When it reconnects, it requests a full state snapshot to catch up on anything it missed.

## Frontend: React, TypeScript, and ReactFlow

The frontend is built with React and TypeScript, using ReactFlow as the foundation for the interactive topology canvas. ReactFlow provides a canvas with pan, zoom, node dragging, and edge rendering out of the box. I extended it with custom node components that display device status visually.

Each device on the topology map is a custom ReactFlow node. The node shows the device hostname, an icon representing its type (router, switch, server, firewall), and a status indicator that changes color based on the current state. Clicking a node opens a detail panel with full metrics, recent alerts, and interface status.

Edges between nodes represent physical or logical connections. They change color based on link status and can display bandwidth utilization as a thickness or label. The topology layout loads from the YAML configuration but can be rearranged by dragging nodes, and the positions persist.

Zustand handles state management. I chose it over Redux for its simplicity. The store structure separates device state, topology layout, alert history, and UI preferences into distinct slices. WebSocket messages update the relevant slice, and React components re-render only when their subscribed data changes. This keeps the dashboard responsive even with frequent updates.

The port grid visualization is one of my favorite features. For switches, the detail panel shows a grid of ports mimicking the physical layout of the device. Each port cell is colored by status: green for up, red for down, orange for error state, gray for administratively disabled. Hovering over a port shows the connected device, VLAN, and current throughput. It is a quick way to spot a bad port or an unexpected device on the network.

The alert system aggregates warnings and critical events from all data sources into a unified feed. Alerts appear as a ticker at the top of the dashboard and are also logged in a filterable table. You can acknowledge alerts, add notes, and track resolution. Severity levels control visual priority: critical alerts pulse, warnings display steadily, and informational messages are available but not intrusive.

## Demo Mode

Since MockWatchtower is also a portfolio piece, I built a demo mode that simulates a live network environment. Demo mode generates realistic device status changes, metric fluctuations, and occasional alerts without requiring any actual infrastructure. It uses the same WebSocket pipeline as live mode, so the frontend behavior is identical.

This was important because anyone visiting my portfolio should be able to see the dashboard in action without needing access to my lab. Demo mode cycles through scenarios: normal operation, a simulated device outage, a bandwidth spike, and recovery. It shows off the full range of dashboard capabilities in a self-contained loop.

## Lessons Learned

WebSockets are powerful but demand careful state management. When a client reconnects, you need to reconcile its local state with the server's current state cleanly. Race conditions between REST snapshot requests and incoming WebSocket messages can cause flickering or stale data if you are not careful about ordering.

ReactFlow was an excellent choice for the topology canvas, but customizing it required deep understanding of its rendering pipeline. Custom nodes need to be performant because the canvas re-renders frequently during pan and zoom operations. Memoization and careful prop management made a noticeable difference in smoothness.

Building a multi-source polling system taught me about the challenges of data normalization. LibreNMS reports device status as integers (0, 1, 2). Netdisco uses boolean flags. Proxmox has its own status vocabulary. Normalizing all of these into a consistent model that the frontend can consume without caring about the source was essential and required more thought than I expected.

## Looking Ahead

MockWatchtower is running in my lab and has already helped me catch issues faster than checking individual tool dashboards. Future plans include adding NetFlow visualization for traffic analysis, integrating with ticketing systems for alert escalation, and building a mobile-responsive layout for on-the-go monitoring. The source is on my GitHub if you want to explore it or adapt it for your own network.
