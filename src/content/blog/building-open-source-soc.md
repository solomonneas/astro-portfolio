---
title: "Building a Full-Stack SOC with Open Source Tools"
pubDate: 2025-12-01
tags: ["security", "soc", "wazuh", "thehive", "cortex", "siem", "open-source"]
---

Commercial SIEM solutions cost hundreds of thousands of dollars. Splunk, Microsoft Sentinel, IBM QRadar—they're powerful, but their licensing models assume enterprise budgets. What if you need the same capabilities for education, research, or a smaller organization?

You build it yourself.

## The Architecture

This isn't a toy deployment. It's a production-grade Security Operations Center built entirely on open-source components:

**Wazuh** (SIEM/XDR) - The core detection engine. Host-based intrusion detection, log aggregation, file integrity monitoring, vulnerability assessment. Running on Ubuntu 24.04 with dedicated indexer, server, and dashboard components.

**TheHive** (Incident Response) - Case management platform. When Wazuh triggers an alert, TheHive tracks the investigation through resolution. Observable extraction, playbook execution, team collaboration.

**Cortex** (Observable Analysis) - The automation layer. Feed an IP, hash, or domain to Cortex and it queries VirusTotal, AbuseIPDB, MISP, and dozens of other analyzers automatically. Turns 30 minutes of manual OSINT into 30 seconds.

**MISP** (Threat Intelligence) - Threat intelligence platform. Ingests feeds, shares IOCs between organizations, provides context for everything Wazuh detects.

**Zeek + Suricata** (Network Security Monitoring) - Zeek for network metadata and protocol analysis, Suricata for signature-based IDS. Different approaches, complementary coverage.

## Why Ubuntu 22.04 for TheHive and Cortex?

Here's something the documentation doesn't emphasize enough: TheHive and Cortex run on Ubuntu 22.04 LTS ("Jammy Jellyfish") specifically for compatibility with Cassandra and Elasticsearch dependencies.

Both are JVM-based applications. They allocate heap memory at startup and don't release it. You need to tune `-Xms` and `-Xmx` flags carefully—give them too little and they crash, too much and they starve other services.

Jammy provides OpenSSL 3.0 and the 5.15 Linux kernel, which are crucial for running current Java versions. The LTS support until 2032 means you're not constantly chasing distribution upgrades on critical security infrastructure.

## The Integration Challenge

The real work isn't installing individual tools—it's making them talk to each other:

- Wazuh alerts → TheHive cases (via webhook integration)
- TheHive observables → Cortex analysis (native integration)
- Cortex queries → MISP threat intelligence (analyzer configuration)
- Zeek/Suricata logs → Wazuh indexer (Filebeat shipping)

Each integration point is a potential failure. Each has its own authentication model, API versioning concerns, and configuration syntax.

## Current Status

The infrastructure is deployed and operational. Wazuh is collecting logs, TheHive is tracking cases, Cortex is analyzing observables. The next phase is expanding agent deployment and tuning detection rules to reduce false positives.

This is what defense looks like when you can't write a six-figure check: late nights, documentation diving, and the satisfaction of watching your own SOC detect its first real threat.

[View the full SOC architecture →](/projects/designing-and-building-an-open-source-soc)
