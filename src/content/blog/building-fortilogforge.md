---
title: "Building FortiLogForge: A Fortinet Log Generator and Analyzer"
pubDate: 2025-01-27
tags: ["python", "fastapi", "react", "fortinet", "security", "log-analysis"]
---

Learning to analyze firewall logs is one of those skills that sounds straightforward until you try to practice it. In a production environment, Fortinet devices generate thousands of log entries per hour. In a home lab, you might see a handful of entries per day, and most of them are routine traffic. I built FortiLogForge to bridge that gap: a tool that generates realistic Fortinet-style logs and provides a dashboard for analyzing them.

## Why Synthetic Logs Matter

If you are studying for a security certification or preparing for a SOC role, you need to develop pattern recognition for log data. You need to look at a firewall log and quickly identify anomalies, correlate events, and understand what traffic patterns mean. That takes practice, and practice requires data.

Using production logs for training has obvious problems. They contain sensitive information, they require access to enterprise environments, and you cannot control what scenarios they contain. You cannot say "give me a brute force attack mixed with normal traffic" and expect production logs to cooperate.

FortiLogForge solves this by generating logs that follow Fortinet's actual format while letting you control the scenarios. Want to see what a port scan looks like in FortiGate logs? Generate one. Want to practice spotting data exfiltration among legitimate HTTPS traffic? Configure that scenario and analyze away.

## Understanding the Fortinet Log Format

Fortinet devices use a key=value log format that looks deceptively simple. A typical entry might read:

```
date=2025-02-07 time=14:23:01 logid="0000000013" type="traffic" subtype="forward" level="notice" srcip=192.168.1.105 srcport=52341 dstip=203.0.113.50 dstport=443 action="accept" policyid=5 service="HTTPS" duration=45 sentbyte=12480 rcvdbyte=89320
```

Every field is a key=value pair, sometimes quoted, sometimes not. The format is consistent but the fields vary by log type. Traffic logs have source and destination details. Event logs have administrative actions. UTM logs contain threat detection data. Each category has its own set of required and optional fields.

Building the log parser meant mapping out these variations. I referenced Fortinet's log message documentation and analyzed sample outputs to catalog which fields appear in which log types. The parser handles quoted values, nested fields, and the various date/time formats Fortinet uses across different firmware versions.

## Architecture

The backend runs on Python with FastAPI. The log generation engine uses configurable templates for different log types: traffic (forward, local, sniffer), event (system, user, router), and UTM (virus, webfilter, IPS, application control). Each template defines the required fields and valid value ranges for that log type.

Generation profiles let you define traffic patterns. A "normal business day" profile might produce 80% HTTPS traffic, 10% DNS, 5% email, and 5% miscellaneous. An "attack scenario" profile could overlay port scanning, brute force attempts, or command and control callbacks on top of normal traffic. You control the ratio, timing, and source/destination distributions.

Generated logs are stored in SQLite. I chose SQLite because the data is analytical, not transactional. There are no concurrent write concerns, and SQLite's simplicity keeps the deployment lightweight. The database stores parsed log fields in structured columns, which makes querying fast without needing to re-parse the raw text every time.

The dashboard API exposes endpoints for log statistics, time-series data, field distributions, and filtered queries. You can ask for "all denied traffic in the last hour grouped by source IP" and get structured JSON back.

Export functionality lets you pull logs in raw text format (matching what a real FortiGate would produce), CSV, or JSON. The raw text export is particularly useful because you can feed it into other tools like Splunk, Graylog, or even grep to practice with different analysis workflows.

## The Frontend

The frontend uses React with TypeScript, Vite for bundling, and Tailwind CSS for styling. I built five visual variants of the dashboard, each emphasizing different aspects of log analysis.

The first variant focuses on real-time flow, displaying logs as they are generated with color coding by severity and type. The second variant is a traditional SOC dashboard with charts showing traffic volume over time, top sources and destinations, and action distributions. The third is a threat-focused view highlighting denied traffic, UTM events, and anomaly indicators. The fourth provides a raw log viewer with powerful filtering for hands-on analysis. The fifth is a summary view designed for reporting, with aggregate statistics and trend indicators.

Having multiple variants was not just a design exercise. Different analysis tasks call for different views. When you are hunting for a specific event, the raw viewer with filters is ideal. When you are looking for patterns over time, the SOC dashboard charts are more useful. Building all five taught me a lot about data visualization and how the same underlying data tells different stories depending on how you present it.

## Docker Deployment

The whole stack runs in Docker with three containers: the FastAPI backend, the React frontend served by nginx, and a shared volume for the SQLite database. Docker Compose ties everything together with a single command.

Nginx serves the built React app and proxies API requests to the backend. This mirrors how you would deploy a real application and avoids CORS complications during development. The nginx configuration also handles gzip compression and cache headers for the static frontend assets.

## What I Learned

The biggest takeaway was how much structure exists in firewall logs once you understand the format. Fortinet's key=value approach is actually elegant. It is human-readable, machine-parseable, and extensible. New fields can appear in firmware updates without breaking existing parsers.

Building the generation engine taught me to think like an attacker. To generate realistic attack logs, I had to understand what those attacks look like at the network level. A brute force attempt produces a specific pattern: many connections from one source to one destination on the same port, with short durations and small byte counts. A port scan looks different: one source, one destination, many ports. Encoding these patterns into generation profiles required understanding the attacks themselves.

I also gained appreciation for log volume challenges. Even in my small lab simulations, generating a few hours of realistic traffic produced thousands of entries. Searching, filtering, and aggregating that data efficiently required careful database indexing and query optimization. Scale that up to an enterprise environment and you start to understand why SIEM platforms are such complex (and expensive) pieces of infrastructure.

## Moving Forward

FortiLogForge is already useful as a training tool, but I have plans to expand it. Adding support for other vendor log formats (Palo Alto, Cisco ASA) would make it a more general-purpose training platform. I also want to add scenario-based exercises: present a set of generated logs and ask the user to identify the attack type, source, and timeline. That would turn it from a generator into a full training curriculum.

The source is available on my GitHub. If you are learning Fortinet log analysis or building a security training lab, it might save you some time.
