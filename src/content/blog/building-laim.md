---
title: "Building LAIM: A Lightweight Asset Inventory Manager for Network Admins"
pubDate: 2025-01-20
tags: ["python", "fastapi", "networking", "asset-management", "homelab"]
---

If you have ever tried to keep track of every switch, router, access point, and server on a network using spreadsheets, you already know the pain. Devices get added, IPs change, firmware gets updated, and suddenly your "master spreadsheet" is three versions behind reality. I built LAIM (Lightweight Asset Inventory Manager) to solve that problem for myself and, hopefully, for anyone else running a lab or managing a small to midsize network.

## The Problem with Spreadsheets

Every network admin starts the same way. You open Excel or Google Sheets, create columns for hostname, IP, MAC address, model, location, and maybe a notes field. It works fine when you have ten devices. Then you hit fifty. Then a hundred. Someone forgets to update a row after a swap. Someone else copies the file locally and makes edits that never sync back. Before long you are spending more time maintaining the spreadsheet than actually managing the network.

The real issue is that spreadsheets are not connected to anything. They do not know when a device goes offline, when a new switch appears on the network, or when a MAC address changes ports. They are static records in a dynamic environment. I wanted something that could pull live data from the tools I was already using: LibreNMS for monitoring and Netdisco for layer 2 discovery.

## Architecture Decisions

I chose Python with FastAPI for the backend. FastAPI gives you automatic OpenAPI documentation, async support, and solid performance without the overhead of a full framework like Django. For the database layer, I used SQLAlchemy as the ORM with Alembic handling migrations. This combination made it straightforward to evolve the schema over time without losing data.

Authentication uses JWT tokens. Even in a lab environment, I wanted proper auth from the start. It is a good habit and it meant the app was ready for multi-user scenarios from day one.

For the frontend, I went with Jinja2 server-rendered templates instead of a JavaScript framework. This was a deliberate choice. LAIM is a tool for network admins, not a consumer web app. Server-rendered pages load fast, work reliably, and do not require a separate build pipeline. The UI needs to display tables of assets, forms for editing, and some basic filtering. Jinja2 handles all of that cleanly without the complexity of React or Vue.

## Core Features

The heart of LAIM is straightforward CRUD for network assets. You can create, read, update, and delete devices with fields for hostname, IP address, MAC address, device type, location, manufacturer, model, firmware version, and custom notes. Every asset gets a full audit trail so you can see when records were created or modified.

MAC address validation was one of those features I did not think about until I needed it. When you are importing hundreds of devices, typos in MAC addresses cause real problems downstream. LAIM validates MAC format on input and normalizes them to a consistent format. It sounds small, but it saves headaches when you are cross-referencing with switch port tables.

Bulk CSV import was essential. I had existing spreadsheets full of device data, and manually re-entering everything would have defeated the purpose. The import tool handles mapping CSV columns to asset fields, validates each row, and gives you a report of what succeeded and what failed. You can also export everything back to CSV for reporting or migration.

Backup and restore round out the data management features. The system can dump the entire database to a portable format and restore it on another instance. This proved invaluable when I rebuilt my lab environment and needed to migrate LAIM to a new container.

## The Integration Layer

This is where LAIM goes beyond a simple database. The integration layer connects to LibreNMS and Netdisco, pulling device information directly from those platforms.

LibreNMS already knows about every device it monitors: hostnames, IPs, system descriptions, uptime, and more. Netdisco knows about layer 2 topology: which MAC addresses are on which switch ports, VLAN assignments, and neighbor relationships. LAIM pulls from both sources and reconciles the data into a single inventory.

The sync process runs on a configurable schedule. You can also trigger it manually. When LAIM discovers a device in LibreNMS or Netdisco that does not exist in its inventory, it creates a new record. When it finds a match, it updates any fields that have changed. Conflicts are flagged for manual review rather than silently overwritten.

SNMP discovery adds another layer. LAIM can perform targeted SNMP walks against subnets to find devices that might not be in LibreNMS or Netdisco yet. This catches things like unmanaged switches, printers, and IoT devices that tend to appear on networks without anyone documenting them.

## Deployment

I run LAIM in a Proxmox LXC container in my home lab, but the project also supports Docker deployment for portability. The Docker setup uses a single Dockerfile with environment variables for configuration. Database files persist via mounted volumes.

For the LXC deployment, I wrote a setup script that handles dependencies, creates the virtual environment, configures systemd services, and sets up Alembic for database migrations. The whole process takes about five minutes on a fresh container.

## Lessons Learned

Building LAIM taught me more about practical network administration than any textbook. The process of integrating with LibreNMS and Netdisco APIs forced me to understand how those platforms store and expose data. Writing the SNMP discovery module meant diving deep into MIB trees and understanding how different vendors implement standard OIDs.

The most important lesson was about data quality. When you are aggregating device information from multiple sources, inconsistencies are inevitable. LibreNMS might report a hostname as "sw-core-01" while Netdisco sees it as "sw-core-01.lab.local." Handling those mismatches gracefully, building matching heuristics that work without manual intervention, was the hardest part of the project.

I also learned the value of building tools for yourself first. LAIM exists because I needed it. Every feature came from a real workflow pain point. That made design decisions easier because I was always the first user testing against real scenarios.

## What Comes Next

LAIM is functional and running in my lab today. Future plans include a REST API for external integrations, role-based access control for team environments, and a network diagram generator that uses the topology data LAIM collects. I am also exploring integration with Ansible to enable LAIM to serve as a lightweight inventory source for automation playbooks.

If you are a network admin tired of fighting spreadsheets, the source is on my GitHub. It is built for the kind of environment where you need to know what is on your network without the overhead of enterprise CMDB solutions.
