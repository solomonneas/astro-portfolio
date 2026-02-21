---
title: "A Fiber Cut at 2 PM Taught Me Why I Needed to Build Watchtower"
pubDate: 2025-01-22
updatedDate: 2026-02-21
tags: ["react", "typescript", "fastapi", "librenms", "networking", "noc", "monitoring", "influxdb"]
---



The first time I had to do disaster recovery in Polk State College's Network Systems Engineering Technology (NSET) department, someone cut our fiber.

Not metaphorically. Physically severed. One moment the network was fine, the next moment half the campus dropped. Phones, Wi-Fi, wired connections, servers behind affected switches. All down. And I'm standing in the server room trying to figure out where the failure actually is.

Here's the problem: I had no map.

No physical topology showing which fiber runs connected which buildings. No logical map showing how VLANs were routed across the campus. I knew the network existed. I could ping things when they were up. But I couldn't visualize the path from point A to point B, which meant I couldn't quickly isolate where the break was.

We figured it out eventually. You always do. But it took longer than it should have, and the whole time I kept thinking about the LibreNMS instance I had set up when I first joined the department.

## The Gold Mine in the Server Rack

When I first joined the NSET department, one of the first things I did was deploy LibreNMS. Standard network monitoring. SNMP polling, device discovery, interface stats, uptime tracking. I configured it, pointed it at our infrastructure, and let it run.

And then it just sat there. Polling away in the darkness of the server rack. Collecting data nobody was looking at.

LibreNMS was watching every interface on every switch. It knew which ports were up, which were down, what was connected where, how much bandwidth was flowing through each link. It had months of historical data. It knew the topology better than any of us did.

But during that fiber cut, none of that helped me. Because LibreNMS is a monitoring tool, not an operations tool. It collects data. It doesn't present it in a way that helps you make fast decisions when the building is on fire.

I needed a dashboard that showed me, at a glance: here's your network, here's what's broken, here's what's affected downstream. A NOC dashboard. Not another monitoring backend. A real operational interface.

That's why I built Watchtower.

## What Watchtower Actually Is

Watchtower is a real-time Network Operations Center dashboard. It pulls live data from LibreNMS, Netdisco, and Proxmox, and presents it as an interactive topology with device status, interface utilization, alerts, and historical metrics.

Two modes: production and demo. Production connects to real infrastructure via API. Demo runs simulated data with realistic patterns for deployment on Vercel where nobody can reach my college network.

The stack: React 18 frontend with TypeScript, FastAPI backend, Redis for polling cache, InfluxDB for time-series historical data. WebSocket-driven updates keep everything current without page refreshes.

## Interactive Topology

Built with ReactFlow. Each device is a custom node showing hostname, type icon, and color-coded status. Pan, zoom, drag. Click a node and get metrics, interface status, recent alerts.

Layout reflects actual network hierarchy. Core at the top, distribution in the middle, access at the edges. Links show status and bandwidth utilization. When a device goes down, its node pulses red and connected links dim.

This is what I didn't have during that fiber cut. If Watchtower had existed, I would have opened it, seen exactly which uplinks went dark, traced the path to the affected segment, and known where to send someone with a fusion splicer. Minutes instead of the frustrating guesswork we actually went through.

Port labels are always visible, Packet Tracer style. Ports, speed, interface names right on the topology. Toggle them off in settings if you want a cleaner view, but during an incident you want every piece of information you can get without clicking.

## The Port Grid

Open the detail panel for any switch and you see a visual grid mimicking the physical port layout. Each port is color-coded: green for up, red for down, orange for errors, gray for admin disabled. Hover for connected device, VLAN, speed, throughput.

In production, this comes from LibreNMS and Netdisco APIs. In demo mode, the simulation generates it. The visual is identical.

Network engineers immediately understand what they're looking at. No explanation needed. That instant recognition is the whole point.

## Historical Data with InfluxDB

This was a later addition but it changed everything. InfluxDB stores time-series metrics with three retention tiers: 30 days of raw data, 1 year of hourly aggregates, 5 years of daily rollups.

During that fiber cut, if I'd had historical interface utilization graphs, I could have seen exactly when traffic dropped to zero on specific uplinks and correlated timestamps across devices to pinpoint the failure path. Instead I was checking interfaces one at a time via CLI.

## Alerts and Incident Management

Alert ticker across the top. Three severities: critical (pulsing red), warning (amber), informational (blue). Alerts cascade realistically. A core switch goes down, downstream devices follow with their own warnings.

Filterable alert table for severity, device, time range, acknowledgment status. Basic incident management. Enough to track what's happening and what's been addressed.

## Auth, Settings, and the Rest

JWT authentication with bcrypt. YAML-based topology configuration. Configurable polling intervals, alert thresholds, notification preferences. Settings UI so you're not editing config files during an outage.

The whole thing is about reducing friction during the worst moments. Every click you can eliminate, every piece of context you can surface without navigation, every second you save matters when production is down.

## Demo Mode

Portfolio projects that need backend infrastructure are invisible to recruiters. Nobody's SSHing into my college network to see Watchtower running against real devices.

Demo mode simulates an entire SMB campus network with realistic data, status changes, and alert patterns. Cascading failures, not random coin flips. A switch goes down and everything behind it follows. Interface errors build gradually before a failure. Traffic patterns follow time-of-day curves.

Live at [watchtower.solomonneas.dev](https://watchtower.solomonneas.dev). Same frontend, same topology canvas, same real-time updates. Just powered by simulation instead of real SNMP polls.

## What That Fiber Cut Actually Taught Me

The data was there the whole time. LibreNMS had everything I needed. The problem was presentation. A monitoring tool that collects perfect data but doesn't surface it in an operational context is a gold mine you can't access when you need it most.

Watchtower exists because I stood in a server room during an outage, knowing the answers were sitting in a database ten feet away from me, and I couldn't get to them fast enough.

That's the whole motivation. Not a portfolio piece. Not a demo. A tool I wish I'd had at 2 PM on the worst networking day of my semester.

Source is on [GitHub](https://github.com/solomonneas/watchtower).
