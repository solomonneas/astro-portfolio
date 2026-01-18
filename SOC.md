Here is a comprehensive technical breakdown of the SOC architecture, components, and interaction logic, sanitized of specific IP addresses and VLAN identifiers for generic use.

--------------------------------------------------------------------------------
SOC Technical Architecture and Interaction Breakdown
1. High-Level Infrastructure
The SOC is hosted on a Proxmox virtualized environment using Ubuntu Linux VMs. The network topology relies on a strict separation between the SOC infrastructure and the monitored networks (Classrooms/Labs) using VLAN segmentation and Access Control Lists (ACLs).
Virtualization & Networking
• Hypervisor: Proxmox VE 9.2.1 running on physical hardware.
• Network Transport:
    ◦ Physical Layer: A Linux Bond aggregates multiple 1G NICs using LACP (802.3ad) for redundancy and throughput.
    ◦ Virtual Layer: A VLAN-aware Linux Bridge (vmbr0) handles tagging. VMs are tagged at the hypervisor level, meaning the Guest OS sees untagged traffic on its primary interface.
• Access Control (ACLs): A Cisco switch manages Inter-VLAN routing. Ingress traffic to the SOC management network is strictly limited by ACLs to specific ports (e.g., Agent communication, Web UI access).

--------------------------------------------------------------------------------
2. Component Inventory (The "Stack")
Component
OS
Key Software
Role
Wazuh Server
Ubuntu 24.04
Wazuh Manager, Filebeat
SIEM Core, Log Aggregation, Alerting
Wazuh Indexer
Ubuntu 24.04
Wazuh Indexer (Elasticsearch fork)
Database/Storage for SIEM data
Wazuh Dashboard
Ubuntu 24.04
Wazuh Dashboard (Kibana fork)
Web User Interface for SIEM
TheHive 5
Ubuntu 22.04
TheHive, Cassandra, Elasticsearch
Incident Response (Case Management)
Cortex
Ubuntu 22.04
Cortex, Docker
Observable Analysis Engine
MISP
Ubuntu 24.04
MISP 2.5, MariaDB, Redis
Threat Intelligence Platform (TIP)
NIDS
Ubuntu 24.04
Suricata, Zeek, Wazuh Agent
Network Intrusion Detection Sensor

--------------------------------------------------------------------------------
3. Component Logic & Interactions
A. The Nervous System: Wazuh (SIEM/XDR)
Function: Central log collection, correlation, file integrity monitoring, and alert generation.
1. Ingestion:
    ◦ Agents: Endpoints in monitored networks send logs via TCP/1514 to the Wazuh Manager.
    ◦ NIDS: The Network Sensor sends Zeek and Suricata logs (in JSON format) via the Wazuh Agent installed locally on the NIDS VM.
2. Processing: The Manager decodes logs, correlates them against rules (e.g., MITRE ATT&CK), and triggers alerts.
3. Storage: Data is shipped via HTTPS/9200 to the Wazuh Indexer for long-term storage and indexing.
4. Visualization: The Wazuh Dashboard queries the Indexer via HTTPS/9200 to display analytics to the analyst.
B. The Brain: TheHive (Incident Response)
Function: The central hub where analysts manage alerts, create cases, and coordinate responses.
1. Backend Storage:
    ◦ Cassandra: Stores case data, tasks, and logs.
    ◦ Elasticsearch (Local): Provides indexing and search capabilities for cases. This requires specific X-Pack security configurations and role mappings (thehive_role) to function.
2. Wazuh Integration (Alert Ingestion):
    ◦ A custom Python script (custom-w2thive.py) runs on the Wazuh Manager.
    ◦ When Wazuh triggers an alert matching a specific threshold, this script converts the alert to JSON and POSTs it to TheHive’s API on port 9000.
    ◦ This automatically creates an "Alert" in TheHive, which analysts can promote to a "Case".
3. Cluster Logic: Configured as a "Cluster of One" using Akka/Pekko actor providers to prevent the service from shutting down due to looking for missing cluster peers.
C. The Muscle: Cortex (Analysis Engine)
Function: Performs active analysis on "observables" (IPs, Hashes, Domains) extracted from cases in TheHive.
1. Interaction: TheHive connects to Cortex via API on port 9001.
2. Analyzers:
    ◦ Scripts (often Python) running inside Docker containers on the Cortex VM query external services (e.g., AbuseIPDB, VirusTotal).
    ◦ Flow: TheHive sends an observable (e.g., 1.1.1.1) → Cortex runs the Analyzer → Cortex returns the report to TheHive.
3. Configuration: Requires the Cortex-Analyzers repository to be cloned locally and the user cortex to have permissions to execute Docker containers.
D. The Memory: MISP (Threat Intelligence)
Function: Stores Indicators of Compromise (IoCs) and correlates them against known threat feeds.
1. Interaction with TheHive:
    ◦ TheHive pulls data from MISP via API (Port 80/443) to enrich cases.
    ◦ SSL Configuration: Due to self-signed certificates, TheHive is configured with ssl.loose.acceptAnyCertificate = true to allow connection to MISP.
    ◦ Push/Pull: TheHive can import events from MISP as alerts, and analysts can export case data back to MISP to share intel.
2. Interaction with Cortex:
    ◦ Cortex utilizes a specific MISP Analyzer to query the MISP database for observables found during an investigation (e.g., "Have we seen this hash before?").
E. The Eyes: NIDS (Network Detection)
Function: Monitors raw network traffic via a mirror port (SPAN) for signatures and anomalies.
1. Software Stack:
    ◦ Suricata: Signature-based intrusion detection. Logs alerts to eve.json.
    ◦ Zeek: Protocol analysis and metadata logging. Explicitly configured to output JSON logs (replacing default TSV) to ensure compatibility with Wazuh.
2. Integration:
    ◦ The Wazuh Agent installed on the NIDS VM reads the local JSON logs from Suricata and Zeek.
    ◦ It ships these logs to the Wazuh Manager for correlation and alerting.

--------------------------------------------------------------------------------
4. Data Flow Pipelines
Pipeline 1: Endpoint Intrusion (e.g., PowerShell Attack)
1. Detection: Wazuh Agent on a workstation detects suspicious PowerShell execution (e.g., MITRE T1059.001).
2. Transport: Log is sent to the Wazuh Manager via TCP 1514.
3. Alerting: Manager correlates the event and triggers a High Severity Alert.
4. Escalation: The custom-w2thive.py script on the Manager pushes the alert to TheHive via API.
5. Response: Analyst promotes the Alert to a Case in TheHive.
6. Enrichment: Analyst extracts IP/Hash observables and triggers Cortex Analyzers (e.g., querying VirusTotal).
Pipeline 2: Network Threat (e.g., Malware C2)
1. Sniffing: NIDS VM receives mirrored traffic on a promiscuous interface.
2. Logging:
    ◦ Suricata matches a malware signature.
    ◦ Zeek logs the connection metadata.
    ◦ Both write to local JSON files.
3. Ingestion: Wazuh Agent on the NIDS reads the JSON files and sends them to the Wazuh Manager.
4. Correlation: Wazuh Manager generates an alert based on the NIDS input.
5. Intelligence Check: Cortex or TheHive queries MISP to check if the destination IP is a known Indicator of Compromise.

--------------------------------------------------------------------------------
5. Key Configuration Nuances
• VLAN Tagging: Tags are stripped by the Proxmox Bridge (vmbr0) before reaching the VM. The Guest OS network interface is standard (e.g., ens18) and does not require internal VLAN tagging.
• TheHive & Elasticsearch: TheHive 5 uses Elasticsearch 8.x, which mandates X-Pack security. A specific thehive_role must be created in Elasticsearch to allow TheHive to manage its indices.
• Zeek JSON: Zeek's default logging is Tab Separated Values (TSV). A local policy (@load policy/tuning/json-logs.zeek) must be applied to force JSON output for proper parsing by the Wazuh Agent.
• LVM Resizing: Ubuntu VMs often default to using only half the available disk space. The Logical Volume (LVM) must be manually extended (lvextend) and the filesystem resized to utilize the full virtual disk.
• MISP Connectivity: Connecting TheHive to MISP requires manual generation of an authKey in MISP and specific configuration in TheHive's application.conf to bridge the two systems.