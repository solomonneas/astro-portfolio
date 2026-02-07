---
title: "FortiLogForge Social Media Drafts"
project: "fortilogforge"
---

## LinkedIn

How do you practice analyzing firewall logs when you do not have production traffic? You generate your own.

I built FortiLogForge, a Fortinet log generator and analyzer that creates realistic FortiGate-style logs for training and analysis practice. It uses Fortinet's actual key=value log format, supports multiple log types (traffic, event, UTM), and includes a full dashboard for visualizing patterns.

The problem it solves: security students and junior analysts need hands-on experience with real log formats, but production logs are sensitive and home labs do not generate enough interesting traffic.

Tech stack:
- Python FastAPI backend with configurable generation profiles
- SQLite for structured log storage and fast querying
- React + TypeScript + Tailwind frontend with 5 dashboard variants
- Docker deployment with nginx reverse proxy
- Export to raw text, CSV, or JSON for use with other analysis tools

Each dashboard variant emphasizes a different analysis style: real-time flow, SOC overview, threat focus, raw log viewer, and summary reporting.

Building the generation engine meant understanding what attacks actually look like in firewall logs. Brute force, port scans, data exfiltration: each has a distinct pattern you can learn to recognize.

Source on GitHub: [link]

#CyberSecurity #Fortinet #LogAnalysis #Python #React #SecurityTraining

---

## Twitter/X

Built FortiLogForge: generates realistic Fortinet firewall logs for training + analysis practice.

Proper key=value format, configurable attack scenarios, 5 dashboard variants, export to raw/CSV/JSON.

Because you should not need a production network to learn log analysis.

🔗 [link]

---

## Mastodon

I needed to practice Fortinet log analysis but my home lab does not generate enough interesting traffic. So I built FortiLogForge.

It generates realistic FortiGate logs using the actual key=value format, with configurable scenarios for normal traffic, port scans, brute force attempts, and more. Logs get stored in SQLite and displayed through a React dashboard with five visual variants.

The generation profiles let you control traffic ratios and attack patterns, so you can create specific training scenarios. Export to raw text and you can feed the logs into Splunk, Graylog, or grep.

Python/FastAPI backend, React/TypeScript/Tailwind frontend, Docker deployment. Source on GitHub.

#infosec #fortinet #security #python #homelab

---

## Bluesky

How do you learn firewall log analysis without production traffic?

Built FortiLogForge: generates realistic Fortinet logs with configurable attack scenarios, stores them in SQLite, and visualizes patterns through 5 dashboard variants.

Python FastAPI + React TypeScript. Docker deployment. Source on GitHub: [link]

---

## Substack Teaser

Fortinet devices use a key=value log format that looks simple but contains layers of information about what is happening on your network. Learning to read those logs quickly, spotting the brute force attempt hidden in normal HTTPS traffic, is a skill that takes practice.

I built FortiLogForge to create that practice environment. It generates realistic FortiGate logs with configurable traffic patterns and attack scenarios, then provides a dashboard for analysis.

In the full post, I break down the Fortinet log format, explain how I built generation profiles that produce realistic attack patterns, and share what I learned about thinking like an attacker to build better training data.

Read the full build log on my blog: [link]
