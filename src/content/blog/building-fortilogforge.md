---
title: "FortiLogForge: Because You Can't Learn Log Analysis Without Logs"
pubDate: 2025-01-27
updatedDate: 2026-02-16
tags: ["python", "fastapi", "react", "fortinet", "security", "log-analysis"]
---



You can read about firewall logs all day. You won't understand them until you've stared at a thousand lines of key=value pairs trying to find the one that matters.

That's the problem. If you're studying for a SOC role or a security cert, you need reps. Real reps. But production logs are off limits (sensitive data, access requirements, no control over scenarios). And your home lab generates maybe twelve boring entries a day.

So I built FortiLogForge. It generates realistic Fortinet-style logs and gives you a dashboard to analyze them.

## Why Synthetic Logs?

You can't walk up to a production firewall and say "give me a brute force attack mixed with normal traffic." That's not how it works.

FortiLogForge lets you do exactly that. Want to see what a port scan looks like in FortiGate logs? Generate one. Want to practice spotting data exfiltration buried in legitimate HTTPS traffic? Configure the scenario and start digging.

Using production logs for training is a non-starter anyway. Sensitive data, access problems, zero control over what you're looking at. Synthetic logs with controllable scenarios are just better for learning.

## The Fortinet Log Format

Fortinet's key=value format looks simple until you try to parse it reliably:

```
date=2025-02-07 time=14:23:01 logid="0000000013" type="traffic" subtype="forward" level="notice" srcip=192.168.1.105 srcport=52341 dstip=203.0.113.50 dstport=443 action="accept" policyid=5 service="HTTPS" duration=45 sentbyte=12480 rcvdbyte=89320
```

Some values are quoted, some aren't. Fields change depending on log type (traffic, event, UTM). Date formats shift between firmware versions. I had to map all these variations from Fortinet's documentation and real sample outputs before the parser could handle everything reliably.

Honestly, the format is elegant once you understand it. Human-readable, machine-parseable, extensible. New fields can appear in firmware updates without breaking existing parsers.

## How It Works

Python with FastAPI on the backend. The generation engine uses configurable templates for each log type: traffic (forward, local, sniffer), event (system, user, router), and UTM (virus, webfilter, IPS, application control).

The interesting part is generation profiles. A "normal business day" profile produces 80% HTTPS, 10% DNS, 5% email, 5% miscellaneous. An "attack scenario" profile layers port scanning or C2 callbacks on top of normal traffic. You control the ratios, timing, and distributions.

SQLite for storage. No concurrent write concerns for this use case, and it keeps deployment dead simple. Parsed fields go into structured columns so queries are fast without re-parsing raw text every time.

Export works in raw text (matching real FortiGate output), CSV, or JSON. The raw text export is key because you can feed it into Splunk, Graylog, or even grep to practice different analysis workflows.

## Five Dashboard Variants

I built five visual variants of the frontend (React, TypeScript, Tailwind), each suited for a different analysis task:

1. Real-time flow with color-coded log entries as they generate
2. Traditional SOC dashboard with traffic charts and distributions
3. Threat-focused view highlighting denied traffic and UTM events
4. Raw log viewer with powerful filtering for hands-on analysis
5. Summary view for reporting with aggregate stats and trends

Different tasks need different views. Hunting a specific event? Raw viewer with filters. Looking for patterns over time? SOC dashboard charts. Building all five taught me how the same data tells completely different stories depending on presentation.

## What Building This Taught Me

To generate realistic attack logs, I had to understand what attacks look like at the network level. A brute force attempt: many connections from one source to one destination on the same port, short durations, small byte counts. A port scan: one source, one destination, many ports. Encoding those patterns forced me to actually understand the attacks, not just recognize the names.

I also got a real appreciation for log volume. A few hours of simulated traffic produces thousands of entries. Searching, filtering, and aggregating that data efficiently took careful indexing and query optimization. Scale that to enterprise and you start understanding why SIEM platforms cost what they do.

## What's Next

I want to add support for Palo Alto and Cisco ASA log formats to make it a more general training platform. Also planning scenario-based exercises: present a set of logs, ask the user to identify the attack type, source, and timeline. Turn it from a generator into a full training tool.

Source is on [my GitHub](https://github.com/sneas). If you're learning Fortinet log analysis, it might save you some time.
