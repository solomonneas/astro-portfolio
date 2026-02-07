---
title: "LAIM Social Media Drafts"
project: "laim"
---

## LinkedIn

I got tired of managing network device inventory in spreadsheets that were always out of date, so I built something better.

LAIM (Lightweight Asset Inventory Manager) is a full-stack asset management tool I built with Python, FastAPI, and SQLAlchemy. It syncs directly with LibreNMS and Netdisco to pull live device data into a single inventory, complete with SNMP discovery, bulk CSV import, MAC validation, and backup/restore.

The key insight: network admins already have device data scattered across monitoring tools. LAIM brings it together automatically instead of asking humans to manually keep spreadsheets current.

Technical highlights:
- FastAPI backend with JWT auth and Alembic migrations
- Server-rendered Jinja2 frontend (fast, reliable, no JS framework overhead)
- Scheduled sync with LibreNMS and Netdisco APIs
- SNMP discovery for finding undocumented devices
- Docker and Proxmox LXC deployment options

Built this for my home lab, but the problem it solves exists in every network team I have talked to.

Source on GitHub: [link]

#NetworkEngineering #Python #FastAPI #HomeLab #AssetManagement #NetAdmin

---

## Twitter/X

Built LAIM: a Lightweight Asset Inventory Manager that syncs with LibreNMS + Netdisco so you never have to manually update a network device spreadsheet again.

Python/FastAPI backend, Jinja2 frontend, SNMP discovery, bulk CSV import, scheduled sync.

Because spreadsheets are not a CMDB.

🔗 [link]

---

## Mastodon

I built a tool called LAIM (Lightweight Asset Inventory Manager) to replace the spreadsheet I was using to track devices in my home lab.

It syncs with LibreNMS and Netdisco on a schedule, does SNMP discovery to find undocumented devices, validates MAC addresses, and supports bulk CSV import for migrating existing data.

Backend is Python/FastAPI with SQLAlchemy. Frontend is server-rendered Jinja2 templates because not everything needs to be a React app.

Runs in Docker or a Proxmox LXC container. Source is on GitHub if you want to try it.

#networking #python #homelab #sysadmin #opensource

---

## Bluesky

Spreadsheets are not asset management. Built LAIM to sync device inventory from LibreNMS + Netdisco automatically.

Python FastAPI backend, Jinja2 frontend, SNMP discovery, bulk import, scheduled sync. Runs in Docker or Proxmox LXC.

If you manage network devices and are tired of stale spreadsheets, check it out: [link]

---

## Substack Teaser

Every network admin has "the spreadsheet." The one that supposedly tracks every device on the network but is always three changes behind reality.

I built LAIM to kill the spreadsheet. It pulls device data from LibreNMS and Netdisco automatically, discovers undocumented devices via SNMP, and keeps a single source of truth for your network inventory.

In the full post, I walk through the architecture decisions (why Jinja2 over React, why SQLAlchemy with Alembic), the integration challenges of reconciling data from multiple sources, and what I learned about data quality when aggregating network device information.

Read the full build log on my blog: [link]
