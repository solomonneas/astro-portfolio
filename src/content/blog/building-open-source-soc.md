---
title: "I'm a Lab Assistant. So I Built My Own SOC."
pubDate: 2025-12-01
updatedDate: 2026-02-16
tags: ["security", "soc", "wazuh", "thehive", "cortex", "siem", "open-source"]
---



Commercial SIEM solutions cost hundreds of thousands of dollars. Splunk, Microsoft Sentinel, IBM QRadar. They're powerful, but their licensing models assume you have an enterprise budget.

I'm a lab assistant at a community college. I don't have an enterprise budget. So I built the whole thing myself with open-source tools.

## What's In the Stack

This isn't a toy demo. It's a production-grade Security Operations Center running in a college lab environment:

**Wazuh** (SIEM/XDR): The detection engine. Host-based intrusion detection, log aggregation, file integrity monitoring, vulnerability assessment. Running on Ubuntu 24.04 with dedicated indexer, server, and dashboard components.

**TheHive** (Incident Response): Case management. Wazuh triggers an alert, TheHive tracks the investigation through resolution. Observable extraction, playbook execution, the whole workflow.

**Cortex** (Observable Analysis): The automation layer. Feed it an IP, hash, or domain and it queries VirusTotal, AbuseIPDB, MISP, and dozens of other analyzers automatically. Turns 30 minutes of manual OSINT into 30 seconds.

**MISP** (Threat Intelligence): Ingests feeds, shares IOCs between organizations, provides context for everything Wazuh detects.

**Zeek + Suricata** (Network Monitoring): Zeek for network metadata and protocol analysis, Suricata for signature-based IDS. Different approaches, complementary coverage.

## The Ubuntu 22.04 Gotcha

Here's something the docs don't tell you loudly enough: TheHive and Cortex need Ubuntu 22.04 LTS specifically because of Cassandra and Elasticsearch dependencies.

Both are JVM-based. They grab heap memory at startup and never let go. You have to tune `-Xms` and `-Xmx` flags carefully. Too little and they crash. Too much and they starve everything else on the box.

Jammy gives you OpenSSL 3.0 and the 5.15 kernel, which matter for running current Java versions. LTS support until 2032 means I'm not chasing distro upgrades on critical security infrastructure.

## Making Everything Talk to Everything

Installing individual tools is the easy part. The real work is integration:

- Wazuh alerts flow into TheHive cases via webhooks
- TheHive observables go to Cortex for analysis (native integration)
- Cortex queries MISP for threat intelligence (analyzer config)
- Zeek and Suricata logs ship to the Wazuh indexer via Filebeat

Every integration point is a potential failure. Every one has its own auth model, API versioning quirks, and config syntax. I spent more time on integration than installation by a factor of probably 3x.

## Where It Stands

The infrastructure is deployed and operational. Wazuh is collecting logs, TheHive is tracking cases, Cortex is analyzing observables. Next phase: expanding agent deployment and tuning detection rules to cut down false positives.

This is what defense looks like when you can't write a six-figure check. Late nights, documentation rabbit holes, and the satisfaction of watching your own SOC detect its first real threat.

[View the full SOC architecture →](/projects/designing-and-building-an-open-source-soc)
