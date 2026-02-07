---
title: "Building MockWatchtower: A Live NOC Dashboard Demo"
pubDate: 2025-01-22
tags: ["react", "typescript", "tailwind", "framer-motion", "portfolio", "networking"]
---

I built Watchtower as a real NOC dashboard for my college lab. It pulls live data from LibreNMS, Netdisco, and Proxmox. It works great, but there's a problem: nobody can see it unless they're on my network. So I built MockWatchtower, a fully self-contained demo version that runs anywhere, no infrastructure required.

## The Demo Problem

Portfolio projects that need backend infrastructure are invisible to recruiters. You can write a beautiful README, add screenshots, describe the architecture. But nothing beats clicking a link and seeing the thing actually work. MockWatchtower solves that by simulating an entire SMB network environment with realistic data, status changes, and alert patterns. Same frontend, same topology canvas, same real-time updates. Just powered by simulation instead of real devices.

## Simulating a Real Network

The demo simulates a Meridian Financial Group campus network. I chose a fictional mid-size company because it gives enough complexity to be interesting without being overwhelming. The topology includes core switches, distribution layer, access switches, firewalls, servers, wireless controllers, and endpoints across multiple buildings.

Every device has a realistic profile: hostname following a naming convention, correct interface counts for the hardware model, appropriate VLAN assignments, and plausible traffic patterns. A core switch pushes more traffic than an access switch. A firewall shows UTM inspection metrics. The wireless controller reports client counts that fluctuate throughout the day.

Status changes follow patterns too. Devices don't just randomly flip between up and down. The simulation models scenarios: a switch in Building C goes down, and the devices behind it follow. An interface starts showing CRC errors before it goes down completely. A server's CPU usage climbs gradually before triggering an alert. These cascading patterns are what make the demo feel real rather than random.

## Interactive Topology

The topology canvas is built with ReactFlow. Each device is a custom node component showing hostname, device type icon, and a color-coded status indicator. You can pan, zoom, and drag devices around. Clicking a node opens a detail panel with metrics, interface status, and recent alerts.

The layout reflects actual network hierarchy. Core devices sit at the top, distribution in the middle, access at the edges. Connections between nodes show link status and can display bandwidth utilization. When a device goes down in the simulation, its node pulses red and the connected links dim, giving you immediate visual feedback without reading any text.

I spent time getting the edge routing right. In a real NOC dashboard, messy overlapping lines make the topology useless. ReactFlow's edge routing handles most cases, but I added custom path logic for situations where connections would overlap or cross unnecessarily.

## The Port Grid

One of my favorite features is the switch port grid. Open the detail panel for any switch and you see a visual grid mimicking the physical port layout. Each port is color-coded: green for up, red for down, orange for errors, gray for admin disabled. Hover over a port and you see the connected device, VLAN, speed, and current throughput.

In the real Watchtower, this data comes from LibreNMS and Netdisco APIs. In MockWatchtower, the simulation generates it. But the visual is identical. It's the kind of feature that makes network engineers nod because they immediately understand what they're looking at. No explanation needed.

## Alert System

The alert ticker runs across the top of the dashboard. Alerts come in three severities: critical (pulsing red), warning (steady amber), and informational (blue). The simulation generates alerts that match the network scenarios. When that Building C switch goes down, you see a critical alert for the device, followed by warning alerts for the downstream devices losing connectivity.

Alerts are also logged in a filterable table. You can filter by severity, device, time range, or acknowledgment status. It's basic incident management, enough to show the concept without building a full ticketing system.

## Five Visual Variants

Like all my portfolio projects, MockWatchtower ships with five distinct visual themes. Each one completely changes the look while keeping the same functionality:

1. **NOC Command** uses the classic dark theme with green accents that you'd see in an actual operations center
2. **Arctic Monitor** goes light and clean with blue tones, optimized for well-lit environments
3. **Cyber Grid** leans into the cyberpunk aesthetic with neon highlights on dark backgrounds
4. **Blueprint** takes inspiration from engineering drawings with a technical, schematic feel
5. **Sunset Ops** uses warm amber and orange tones for a distinctive look that's easy on the eyes during long shifts

A theme picker in the top bar lets you switch instantly. Theme preference persists in localStorage.

## What It Demonstrates

MockWatchtower isn't just a pretty dashboard. It demonstrates specific skills that matter for infrastructure and security roles:

Real-time data visualization with WebSocket-style updates. Interactive topology mapping with ReactFlow. State management with Zustand for complex, frequently updating data. Responsive design that works on tablets (because NOC dashboards increasingly live on mounted tablets). Network domain knowledge reflected in realistic device modeling and alert patterns.

The demo runs at [mockwatchtower.vercel.app](https://mockwatchtower.vercel.app) if you want to see it in action. Source is on GitHub.
