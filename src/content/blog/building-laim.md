---
title: "LAIM: I Got Tired of the Spreadsheet Dying"
pubDate: 2025-01-20
updatedDate: 2026-02-16
tags: ["python", "fastapi", "networking", "asset-management", "homelab"]
---



Every network admin has the spreadsheet. Hostname, IP, MAC address, model, location, notes. It works fine when you have ten devices.

I manage 4 classrooms at Polk State College. About 200 devices. Cisco Catalyst switches, Palo Alto firewalls, UniFi wireless. The spreadsheet stopped working a long time ago.

Someone forgets to update a row after a swap. Someone else copies the file locally and makes edits that never sync back. Before long you're spending more time maintaining the spreadsheet than managing the actual network.

So I built LAIM (Lightweight Asset Inventory Manager). It's what the spreadsheet wanted to be when it grew up.

## The Real Problem

Spreadsheets aren't connected to anything. They don't know when a device goes offline, when a new switch shows up, or when a MAC address moves ports. They're static records in a dynamic environment.

I needed something that could pull live data from the tools I already use: LibreNMS for monitoring and Netdisco for layer 2 discovery. Not an enterprise CMDB with a six-figure price tag. Just something that knows what's on my network and stays current.

## The Stack

Python with FastAPI for the backend. FastAPI gives you automatic OpenAPI docs, async support, and solid performance without Django's overhead. SQLAlchemy as the ORM with Alembic for migrations. JWT auth from day one because even in a lab, good habits matter.

For the frontend, I went with Jinja2 server-rendered templates instead of a JavaScript framework. Deliberate choice. LAIM is a tool for network admins, not a consumer web app. Server-rendered pages load fast, work reliably, and don't need a separate build pipeline. Tables, forms, basic filtering. Jinja2 handles all of that without the complexity tax of React.

## What It Does

Straightforward CRUD for network assets: hostname, IP, MAC, device type, location, manufacturer, model, firmware, notes. Every asset gets a full audit trail.

MAC address validation turned out to be more important than I expected. When you're importing hundreds of devices, one typo in a MAC address cascades into problems when you cross-reference with switch port tables. LAIM validates and normalizes on input.

Bulk CSV import was non-negotiable. I had years of spreadsheet data. Re-entering it manually would have defeated the entire purpose. The import tool maps columns, validates each row, and reports what succeeded and what failed. Export to CSV works too, for reporting or migration.

## The Integration Layer (Where It Gets Good)

This is where LAIM stops being a fancy database and starts being useful.

LibreNMS already knows every device it monitors: hostnames, IPs, system descriptions, uptime. Netdisco knows layer 2 topology: which MACs are on which switch ports, VLAN assignments, neighbor relationships. LAIM pulls from both and reconciles everything into a single inventory.

The sync runs on a schedule or on demand. New devices get created automatically. Existing records get updated. Conflicts get flagged for manual review instead of silently overwritten. That last part took some thought to get right.

SNMP discovery adds another layer. LAIM can walk subnets to find devices that aren't in LibreNMS or Netdisco yet. This catches the unmanaged switches, printers, and IoT devices that appear on networks without anyone documenting them.

## Deployment

I run LAIM in a Proxmox LXC container at the college. Also supports Docker for portability. The LXC setup script handles dependencies, virtual environment, systemd services, and Alembic migrations. About five minutes on a fresh container.

## What I Learned

The hardest part was data quality. When you aggregate device information from multiple sources, inconsistencies are guaranteed. LibreNMS reports a hostname as "sw-core-01" while Netdisco sees "sw-core-01.lab.local." Building matching heuristics that work without manual intervention took more iteration than any other feature.

Integrating with LibreNMS and Netdisco APIs forced me to understand how those platforms store and expose data. Writing the SNMP discovery module meant diving into MIB trees and understanding how different vendors implement standard OIDs. I learned more about practical network administration building this tool than I did from any textbook.

The best design decision: building for myself first. Every feature came from a real workflow pain point. That made design decisions easy because I was always the first user testing against real scenarios.

## What's Next

Future plans: REST API for external integrations, RBAC for team environments, a network diagram generator from topology data. Also exploring Ansible integration so LAIM can serve as a lightweight inventory source for automation playbooks.

Source is on [my GitHub](https://github.com/sneas). Built for people who need to know what's on their network without enterprise CMDB overhead.
