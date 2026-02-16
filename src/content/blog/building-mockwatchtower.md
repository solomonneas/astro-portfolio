---
title: "MockWatchtower: Because Nobody's SSHing Into My College Network"
pubDate: 2025-01-22
updatedDate: 2026-02-16
tags: ["react", "typescript", "tailwind", "framer-motion", "portfolio", "networking"]
---



I built Watchtower as a real NOC dashboard for my college lab. It pulls live data from LibreNMS, Netdisco, and Proxmox. It works great.

Nobody can see it.

Nobody's SSHing into my college network to see Watchtower. So I built MockWatchtower: a fully self-contained demo version that runs anywhere. Same frontend, same topology canvas, same real-time updates. Just powered by simulation instead of real devices.

## The Demo Problem

Portfolio projects that need backend infrastructure are invisible to recruiters. You can write a beautiful README, add screenshots, describe the architecture. But nothing beats clicking a link and seeing the thing actually work.

MockWatchtower simulates an entire SMB network environment with realistic data, status changes, and alert patterns. No infrastructure required.

## Making Fake Data Feel Real

The demo simulates a Meridian Financial Group campus network. Fictional mid-size company, enough complexity to be interesting without being overwhelming. Core switches, distribution layer, access switches, firewalls, servers, wireless controllers, endpoints across multiple buildings.

Every device has a realistic profile. Hostnames follow naming conventions. Interface counts match the hardware model. VLANs are assigned correctly. Traffic patterns make sense: a core switch pushes more traffic than an access switch, a firewall shows UTM metrics, a wireless controller reports client counts that fluctuate throughout the day.

The status simulation is what makes it feel real instead of random. A switch in Building C goes down, and the devices behind it follow. An interface shows CRC errors before it fails completely. A server's CPU climbs gradually before triggering an alert. Cascading failures, not coin flips.

## Interactive Topology

Built with ReactFlow. Each device is a custom node showing hostname, type icon, and color-coded status. Pan, zoom, drag. Click a node and get metrics, interface status, recent alerts.

Layout reflects actual network hierarchy. Core at the top, distribution in the middle, access at the edges. Links show status and bandwidth utilization. When a device goes down, its node pulses red and connected links dim. Immediate visual feedback without reading anything.

I spent real time on edge routing. In a NOC dashboard, messy overlapping lines make the topology useless. ReactFlow handles most cases, but I added custom path logic where connections would overlap or cross unnecessarily.

## The Port Grid

Open the detail panel for any switch and you see a visual grid mimicking the physical port layout. Each port is color-coded: green for up, red for down, orange for errors, gray for admin disabled. Hover for connected device, VLAN, speed, throughput.

In real Watchtower, this comes from LibreNMS and Netdisco APIs. In MockWatchtower, the simulation generates it. The visual is identical.

It's the kind of feature that makes network engineers nod. They immediately understand what they're looking at. No explanation needed.

## Alerts

Alert ticker across the top. Three severities: critical (pulsing red), warning (amber), informational (blue). Alerts match the network scenarios. Building C switch goes down, you get a critical alert, followed by warnings for downstream devices losing connectivity.

Filterable alert table for severity, device, time range, acknowledgment status. Basic incident management, enough to show the concept.

## Five Themes

Each one completely changes the look, same functionality underneath:

1. **NOC Command:** Classic dark with green accents. What you'd see in a real operations center.
2. **Arctic Monitor:** Light and clean with blue tones. Built for well-lit environments.
3. **Cyber Grid:** Neon on dark. The cyberpunk one.
4. **Blueprint:** Engineering drawing aesthetic. Technical, schematic feel.
5. **Sunset Ops:** Warm amber and orange. Easy on the eyes during long shifts.

Theme picker in the top bar, preference persists in localStorage.

## What It Proves

MockWatchtower isn't just a pretty dashboard. It demonstrates real-time data visualization with WebSocket-style updates, interactive topology mapping with ReactFlow, state management with Zustand for complex frequently updating data, responsive design for tablet-mounted NOC displays, and network domain knowledge reflected in realistic device modeling.

Check it out at [mockwatchtower.vercel.app](https://mockwatchtower.vercel.app). Source is on GitHub.
