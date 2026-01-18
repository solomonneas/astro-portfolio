# NETLABS Environment Migration: VMware to Proxmox VE Infrastructure Redesign

## Executive Summary

This document provides comprehensive technical documentation for the complete migration of the NETLABS network infrastructure from VMware ESXi to Proxmox Virtual Environment (VE) deployed across six Lenovo ThinkSystem SR630 servers. The project encompasses hypervisor migration, 10 Gigabit PCIe network interface card installation, network infrastructure redesign with dedicated management VLAN on unmanaged 10G switching equipment, Proxmox cluster configuration, and comprehensive network port documentation. Additionally, this project demonstrates significant cost avoidance through the elimination of VMware licensing expenses following Broadcom's discontinuation of free educational licensing models.

---

## Project Overview

### Background and Strategic Context

The decision to migrate from VMware to Proxmox VE was driven by fundamental changes in VMware's licensing and support policies following Broadcom's acquisition in 2023. Broadcom discontinued the VMware IT Academy and Academic Software License programs effective August 15, 2024, eliminating the free licensing that had previously supported educational institutions and creating a financial burden incompatible with educational IT budgets.

### Project Scope

**Infrastructure Components:**
- Six Lenovo ThinkSystem SR630 series servers with Intel processors and high-capacity memory
- Installation of 10 Gigabit PCIe network interface cards on all hosts
- Network cable infrastructure deployment and documentation
- Proxmox VE hypervisor installation across all hosts
- Proxmox cluster formation with dedicated cluster networking
- Management network segregation on dedicated unmanaged 10G switching equipment
- Comprehensive port mapping and network topology documentation
- Virtual machine workload migration from VMware ESXi environments

**Objectives:**
- Eliminate VMware licensing dependency and associated recurring costs
- Increase inter-node communication bandwidth through 10G network segregation
- Reduce management network latency bottleneck from legacy 1 Gbps infrastructure
- Maintain educational laboratory functionality and scalability
- Implement enterprise-grade clustering and high-availability capabilities
- Document network architecture for future expansion and troubleshooting

---

## The VMware Licensing Crisis: Context and Implications

### Broadcom's Acquisition and Policy Changes

In November 2023, Broadcom completed its $61 billion acquisition of VMware, marking a significant inflection point for organizations dependent on VMware technology. Within weeks of the acquisition, Broadcom announced fundamental changes to VMware's licensing and support models that would reshape the economics of virtualized infrastructure for educational institutions and smaller organizations.

### Key Licensing Changes

**Perpetual Licensing Discontinued**
Prior to Broadcom's acquisition, VMware offered perpetual licenses allowing organizations to purchase software once and maintain it indefinitely with optional support renewals. This model was particularly valuable for educational institutions operating under IT Academy programs. Broadcom immediately discontinued perpetual license sales and announced that existing perpetual licenses would receive no further support or updates after their initial renewal contracts expired.

**Transition to Subscription-Only Model**
All VMware products now operate exclusively on subscription basis with 1, 3, or 5-year commitment terms. Subscriptions are calculated on a per-physical-core basis rather than the previous per-CPU socket model, creating substantially higher costs for modern processors with high core counts.

**72-Core Minimum Purchase Requirement**
Beginning April 10, 2025, Broadcom raised the minimum purchase requirement from 16 cores to 72 cores per product instance. This means even small deployments with servers containing fewer cores must purchase licenses for 72 cores. A server with 8 cores, for example, would be licensed for 72 cores—representing a 900% over-provisioning tax on smaller deployments.

**Elimination of Free Tier**
VMware's free ESXi hypervisor, previously available for non-production laboratory environments and educational use, has been completely discontinued. No zero-cost hypervisor tier exists under Broadcom's model; every core running VMware infrastructure must generate subscription revenue.

**Support Cost Escalation**
Annual maintenance and support fees have increased from approximately 22% of license value to 25-30% of license value. Over a five-year deployment lifecycle, support costs can equal or exceed the initial software license investment.

**VMware IT Academy Termination**
On August 2, 2024, Broadcom terminated the VMware IT Academy and Academic Software License programs, which had provided educational institutions with free or heavily discounted access to VMware products for teaching and laboratory purposes. The last day to renew VMware IT Academy access occurred on August 15, 2024, with all services ending completely on August 15, 2025. This represented a complete elimination of educational licensing pathways that had been fundamental to technical education for decades.

### Cost Impact Analysis: NETLABS Infrastructure

The NETLABS environment comprises six Lenovo ThinkSystem SR630 series servers with the following processor configurations:

| Server | Model | CPU Cores | Memory | Annual VMware Cost (Est.) |
|--------|-------|-----------|--------|--------------------------|
| .20 (.74) | SR630 | 20 | 384 GB | $40,000-$60,000 |
| .21 (.75) | SR630 | 32 | 128 GB | $64,000-$96,000 |
| .22 (.73) | SR630 | 40 | 768 GB | $80,000-$120,000 |
| .23 (.69) | SR630 | 20 | 384 GB | $40,000-$60,000 |
| .24 (.71) | SR630 V2 | 64 | 768 GB | $128,000-$192,000 |
| .25 (.72) | SR630 | 20 | 384 GB | $40,000-$60,000 |
| **Total** | | **196 cores** | **2,816 GB** | **$392,000-$588,000** |

*Note: Broadcom's 72-core minimum means effective licensing of 432 cores (6 servers × 72 cores) at approximately $575-$800 per core annually for vSphere Essentials Plus. Actual costs would reflect the organization's specific chosen product tier.*

### Annual Cost Avoidance with Proxmox VE

**Proxmox VE Licensing Model:**
- Core software: $0 (open-source, AGPLv3 licensed)
- Optional enterprise support: $95-$490 per node annually (optional)
- No per-core, per-CPU, or subscription fees
- No license compliance auditing or true-up requirements
- No minimum purchase commitments

**Cost Comparison:**

| Category | VMware (Broadcom) | Proxmox VE | Annual Savings |
|----------|------------------|-----------|----------------|
| Software Licensing | $248,400-$345,600 | $0 | $248,400-$345,600 |
| Support (Optional) | 25-30% of license value | $0-$2,940 | $56,000-$101,000+ |
| Minimum Purchase Overages | ~$100,000+ | $0 | $100,000+ |
| **Total Annual Cost** | **$344,400-$446,600+** | **$0-$2,940** | **$341,460-$446,600** |

**Five-Year Total Cost of Ownership:**
- VMware: $1,722,000-$2,233,000 (assuming 2% annual increase)
- Proxmox VE: $0-$14,700 (optional support only)
- **Five-Year Savings: $1,707,300-$2,233,000**

This dramatic cost differential represents the financial justification for the infrastructure migration project and highlights the strategic vulnerability of remaining dependent on proprietary, subscription-based hypervisor licensing in educational environments.

---

## Technical Architecture

### Proxmox VE Platform Overview

Proxmox Virtual Environment is an enterprise-class, open-source virtualization platform that combines full virtual machine capabilities with Linux container technology. The platform is built on Debian Linux and uses KVM/QEMU for full virtualization and LXC for operating system-level containerization.

**Core Technical Specifications:**

| Component | Capability |
|-----------|------------|
| **Base Operating System** | Debian GNU/Linux |
| **License** | GNU Affero General Public License v3 (AGPLv3) |
| **Full Virtualization** | KVM/QEMU |
| **Container Virtualization** | Linux Containers (LXC) |
| **Architecture** | x86_64 (Intel/AMD processors) |
| **Maximum RAM per Host** | 128 TiB |
| **Maximum vCPU per VM** | 8192 logical CPUs |
| **Cluster Model** | Distributed (any node can manage, no single master) |

**Feature Comparison: Proxmox VE vs. VMware vSphere**

| Feature | Proxmox VE | VMware vSphere |
|---------|-----------|-----------------|
| **Licensing Cost** | Free (AGPLv3) | Subscription, per-core |
| **Clustering** | Native, distributed | Native, vCenter required |
| **Hypervisor Minimization** | KVM on Linux | Proprietary ESXi |
| **Container Support** | LXC/Docker-compatible | Limited (via third-party) |
| **Storage Options** | LVM, Ceph, ZFS, NFS, iSCSI, GlusterFS | vSAN, iSCSI, NFS, vVols |
| **High Availability** | Yes, cluster-wide | Yes, with vCenter |
| **Live Migration** | Yes, KVM-to-KVM | Yes, vMotion |
| **Storage Live Migration** | Yes | Yes, vSAN/vMotion |
| **Snapshots** | Yes, LVM/ZFS-based | Yes, delta-based |
| **Backup Solution** | Proxmox Backup Server (open-source) | vSphere Data Protection, Nakivo, etc. |
| **API** | REST API, open-source | REST API, vendor-proprietary |
| **GUI Management** | Web-based, full-featured | vSphere Web Client |
| **CLI Management** | Full CLI, bash scripting | esxcli, PowerCLI |
| **Support Model** | Community (free), subscription optional | Mandatory subscription |

### NETLABS Proxmox Infrastructure

#### Server Hardware Configuration

**Server Cluster Composition:**

| DHCP IP | Management IP | Previous ID | Host ID | Model | CPUs | Memory | Storage | Role |
|---------|---------------|------------|---------|-------|------|--------|---------|------|
| 10.2.70.20 | — | .74 | host20 | ThinkSystem SR630 | 20 cores | 384 GB | NVMe + Storage | Management/Primary |
| 10.2.70.21 | — | .75 | host21 | ThinkSystem SR630 | 32 cores | 128 GB | NVMe | Lab Services |
| 10.2.70.22 | — | .73 | host22 | ThinkSystem SR630 | 40 cores | 768 GB | NVMe | Lab Services |
| 10.2.70.23 | — | .69 | host23 | ThinkSystem SR630 | 20 cores | 384 GB | NVMe + 15TB | Lab Services |
| 10.2.70.24 | — | .71 | host24 | ThinkSystem SR630 V2 | 64 cores | 768 GB | NVMe | Lab Services (Compute) |
| 10.2.70.25 | — | .72 | host25 | ThinkSystem SR630 | 20 cores | 384 GB | NVMe | Lab Services |

**Total Cluster Resources:**
- Aggregate Compute: 196 CPU cores available for virtual machines
- Aggregate Memory: 2,816 GB (2.75 TB)
- Cluster Architecture: Full mesh, HA-capable

#### Proxmox Cluster Configuration

**Cluster Name:** PVE-NETLAB

**Cluster Characteristics:**
- Six-node cluster with distributed architecture
- No single point of failure for cluster management
- Any node capable of managing cluster operations
- Automatic quorum and recovery mechanisms
- Full API access across all nodes

**Shared Storage Configuration:**

| Storage Pool | Mount Point | Nodes | Purpose | Notes |
|--------------|-------------|-------|---------|-------|
| NETLAB1 | /mnt/pve/NETLAB1 | All 6 nodes | Primary VM storage | Supports live migration |
| NETLAB2 | /mnt/pve/NETLAB2 | All 6 nodes | Secondary VM storage | For distribution |
| NETLAB3 | /mnt/pve/NETLAB3 | Nodes 20-23 | Tertiary VM storage | Educational labs |
| LOCAL | /mnt/pve/local | Each node | Node-local snippets | Configuration storage |

**VM Snapshot Configuration:**
- VMDIST backup server configured on host20
- Golden image restoration capability for laboratory resets
- Automated backup scheduling support
- Proxmox Backup Server integration

---

## Network Architecture and Infrastructure

### Network Design Philosophy

The network redesign addresses fundamental limitations of the previous VMware infrastructure:

1. **Bandwidth Bottleneck Elimination:** Cluster communication previously constrained by 1 Gbps Cisco Catalyst switches and sub-1 Gbps internet connectivity
2. **Management Traffic Segregation:** Dedicated 10G management network reduces interference with production/laboratory traffic
3. **Scalability:** 10G infrastructure enables larger virtual machine deployments and faster inter-node synchronization
4. **Redundancy:** Multiple physical paths and bonding configurations provide resilience

### Network Topology

#### Three-Tier Network Architecture

**Tier 1: 10 Gigabit Management Network (Dedicated)**
- Unmanaged 10G switch (no VLAN support required)
- Dedicated 10G PCIe network interface on each host
- Management VLAN (VLAN 2 or designated management VLAN)
- Purpose: Cluster communication, storage replication, high-priority management traffic
- Bandwidth: 10 Gbps full-duplex between all hosts

**Tier 2: 1 Gigabit Production Network (Cisco Catalyst 2960)**
- Existing legacy infrastructure
- Bonded on-board NIC interfaces on each host
- LACP 802.3ad configuration for load balancing
- Purpose: Virtual machine traffic, external connectivity
- Bandwidth: 1 Gbps aggregate (upstream bottleneck acknowledged)

**Tier 3: Out-of-Band Management (Optional)**
- Bastion host connectivity for emergency access
- IPMI/IDRAC interfaces for hardware-level management
- Physical console port backup

#### Physical Network Interface Configuration

**All Hosts (Standardized Pattern):**

| NIC Type | Quantity | Speed | Purpose | Switch Port | Bonding |
|----------|----------|-------|---------|------------|---------|
| Onboard Gigabit | 4 | 1 Gbps | Production/Lab traffic | Cisco 2960 | LACP bond0 |
| PCIe 10G Cards | 2 | 10 Gbps | Management/Cluster traffic | Unmanaged 10G | ens3f0/ens3f1 bonded |
| Additional PCIe 10G | 2 | 10 Gbps | Reserved/Future | Available | Optional |
| **Total Bandwidth** | **8** | Up to 28 Gbps | — | — | — |

### 10 Gigabit PCIe Network Card Installation

#### Hardware Specifications

All six NETLABS servers have been retrofitted with dual-port 10 Gigabit PCIe network interface cards. These cards provide significantly higher bandwidth for cluster communications compared to legacy onboard gigabit Ethernet.

**Card Details:**
- Form Factor: PCIe 3.0 x8 (dual-port adapters)
- Port Configuration: Two independent 10 Gbps ports per card
- Drivers: Intel x710/Mellanox ConnectX drivers (kernel-native)
- Installation: Single PCIe x8 slot per host
- Power Consumption: Moderate (passive cooling, no additional cooling required)

#### Installation Process Overview

**Pre-Installation:**
1. Powered down all six hosts and verified power stability
2. Opened server chassis and located available PCIe x8 slots
3. Verified slot electrical signaling (Gen 3, sufficient lanes)
4. Inventoried all 10G cards and verified compatibility

**Installation Sequence:**
1. Removed protective slot covers from target PCIe x8 slots
2. Inserted 10G PCIe cards firmly until retention clips engaged
3. Secured mounting brackets with server chassis fasteners
4. Closed server chassis and verified no cable interference
5. Applied labels to identify card for future troubleshooting

**Post-Installation Verification:**
1. Powered up all hosts in staggered sequence
2. Verified device enumeration in Proxmox web interface
3. Confirmed correct driver loading via `lspci` and `ethtool`
4. Tested link status with `ethtool -i <interface>`

#### Network Interface Naming Convention

Proxmox uses consistent naming for hardware interfaces:

| NIC Class | Port 1 | Port 2 | Typical Speed |
|-----------|--------|--------|---------------|
| Onboard GbE | eno1 | eno2 (+ eno3/4) | 1 Gbps |
| 1st 10G Card | ens2f0 | ens2f1 | 10 Gbps |
| 2nd 10G Card | ens3f0 | ens3f1 | 10 Gbps |

*Note: Actual names vary by slot position; use `ip link` or `ethtool` to verify actual mappings after installation.*

### Network Cable Infrastructure

#### Cabling Requirements and Specifications

**Cluster Network (10G Dedicated):**
- Cable Type: Cat6A or higher for 10GBase-T
- Maximum Length: 55 meters (standard 100-meter limit supported)
- Connector Type: RJ45 (8-pin modular)
- Route: Dedicated conduit separate from power cabling
- Labeling: Color-coded (typically red or orange) for 10G identification

**Production Network (1G Legacy):**
- Existing infrastructure (Cisco Catalyst switches)
- Bonded interface redundancy via LACP
- Unterminated spare runs for future expansion

**Cable Runs:**
- Total cable runs: ~24 (4 GbE + 2×10GbE per server × 6 servers)
- All cables labeled at both ends with host identification and port number
- Documentation includes cable tray routes and vault locations
- Color-coded patch panels for rapid identification

### Network Port Documentation and Switch Configuration

#### Port Allocation Matrix

| Host | 10G Mgmt (Cluster) | 10G Cluster | 1G NIC 1 | 1G NIC 2 | 1G NIC 3 | 1G NIC 4 | Cisco Port |
|------|-------------------|-------------|----------|----------|----------|----------|-----------|
| host20 | ens3f0 VLAN x | ens3f1 bond | eno1 | eno2 | eno3 | eno4 | 5/24-27 |
| host21 | ens3f0 VLAN x | ens3f1 bond | eno1 | eno2 | eno3 | eno4 | 2/35-38 |
| host22 | ens3f0 VLAN x | ens3f1 bond | eno1 | eno2 | eno3 | eno4 | 5/30-33 |
| host23 | ens3f0 VLAN x | ens3f1 bond | eno1 | eno2 | eno3 | eno4 | 5/18-21 |
| host24 | ens3f0 VLAN x | ens3f1 bond | eno1 | eno2 | eno3 | eno4 | 2/13-16 |
| host25 | ens3f0 VLAN x | ens3f1 bond | eno1 | eno2 | eno3 | eno4 | 2/29-32 |

*Note: Specific MAC addresses and exact VLAN assignments omitted per data sanitization requirements.*

#### Cisco Catalyst Switch Configuration

**Switch Model:** Cisco Catalyst 2960 series (existing infrastructure)

**Port Configuration:**

| Switch Module | Port Range | Configuration | VLAN | Purpose |
|---------------|-----------|-----------------|------|---------|
| Module 2 | 2/13-20 | Access, tagged | Management | host24 primary cluster |
| Module 2 | 2/21-25 | Trunk (LACP) | Multiple | Aggregate uplink/future |
| Module 2 | 2/29-40 | Access, tagged | Management | host25 + host21 |
| Module 3 | 3/12-18 | Access | Management | Reserved/future |
| Module 5 | 5/1-6 | Reserved | — | Future expansion |
| Module 5 | 5/18-37 | Access, tagged | Management | host23, host22, host20 |

**Trunk Ports:**
- Ports configured with LACP (802.3ad) for active bonding
- STP (Spanning Tree) disabled on bonded ports for faster convergence
- QoS marking for management traffic (CoS=6 or DSCP=48 for highest priority)

#### Unmanaged 10 Gigabit Switch Configuration

**Switch Model:** Ubiquiti or equivalent unmanaged 10G switch

**Characteristics:**
- No VLAN capability (unmanaged layer 2 switch)
- All ports operate in transparent forwarding mode
- No spanning tree or loop detection required (mesh topology naturally non-blocking)
- No configuration required; pure pass-through for 10G traffic

**Port Assignment:**
| Port | Connected Host | Interface | Bandwidth | Notes |
|------|----------------|-----------|-----------|-------|
| 1 | host20 | ens3f0 (cluster mgmt) | 10 Gbps | Primary management |
| 2 | host21 | ens3f0 | 10 Gbps | — |
| 3 | host22 | ens3f0 | 10 Gbps | — |
| 4 | host23 | ens3f0 | 10 Gbps | — |
| 5 | host24 | ens3f0 | 10 Gbps | — |
| 6 | host25 | ens3f0 | 10 Gbps | — |
| 7-8 | Reserved | — | 10 Gbps | Future expansion |

**Network Isolation:**
- 10G management network operates on independent IP subnet (typically 172.16.0.0/24 or similar)
- No VLAN tagging required (unmanaged switch cannot process VLAN tags)
- Pure broadcast domain for cluster communication
- Upstream router may restrict inter-subnet routing for security

### Virtual Network Bridge Configuration

#### Linux Bridge Architecture

Proxmox utilizes Linux bridge technology to create virtual network segments for virtual machines:

**Primary Bridges:**

| Bridge Name | Connected NIC | Purpose | VLAN Support |
|-------------|---------------|---------|--------------|
| vmbr0 | bond0 (all 1G NICs) | VM traffic, external connectivity | Multiple (via vlan tags) |
| vmbr1 | ens3f1 (10G cluster) | Cluster/management traffic | Optional |
| safety_net | eno3/eno4 (optional) | Emergency failover network | Separate segment |

**VLAN Configuration:**
- Individual VM network interfaces can be tagged with VLAN IDs (2-4094)
- Firewall rules applied per-VLAN basis
- Tagged VLAN traffic automatically stripped/added by bridge configuration

#### Linux Bond Configuration (LACP)

**Bond0 Configuration (1 Gigabit Aggregate):**

```
Bond Mode: 802.3ad (LACP - Link Aggregation Control Protocol)
Bonded Slaves: eno1, eno2, eno3, eno4 (all onboard gigabit NICs)
Transmit Hash Policy: Layer 3+4 (source/destination IP + TCP/UDP ports)
Miimon Interval: 100 milliseconds (link detection)
Speed: 4 × 1 Gbps = 4 Gbps aggregate (full-duplex capable)
```

**Benefits:**
- Load balancing across all four gigabit ports
- Automatic failover if any individual link fails
- Negotiated with upstream switch for LACP compatibility
- Transparent to virtual machines (no special configuration required)

#### Network Interface Bonding for 10G Cluster Network

**ens3f0/ens3f1 Configuration (Optional Advanced):**

Advanced deployments may configure bonding on the 10G interfaces for redundancy:

```
Bond Mode: 802.3ad (if dual 10G cards exist on same server)
Slaves: ens3f0, ens3f1
Purpose: High-availability cluster communication
Failover: Automatic if one 10G link fails
```

This configuration ensures cluster traffic survives single-link failure at any host.

---

## Proxmox Cluster Implementation

### Cluster Formation Process

#### Cluster Initialization (host20 - Primary)

**Step 1: Create Cluster**
```
Proxmox GUI: Datacenter → Cluster → Create Cluster
Cluster Name: PVE-NETLAB
Ring 0 Interface: ens3f0 (10G dedicated)
Network Address: 172.16.0.0/24
```

**Step 2: Configure Storage**
- Create directories NETLAB1, NETLAB2, NETLAB3 on all nodes
- Configure as "Shared" storage with "Import" flag (not snippets-only)
- Set preallocation to OFF for all NETLAB directories
- Enable for all cluster nodes in Datacenter storage configuration

#### Node Addition (hosts 21-25)

**For Each Remaining Host:**

1. **On Primary Node (host20):**
   - Datacenter → Cluster → Join Information
   - Copy entire join command (includes cluster token and configuration)

2. **On Target Node (e.g., host21):**
   - Proxmox Shell/SSH
   - Execute complete join command
   ```
   pvecm add <primary_ip> -ringaddr <cluster_ip> -nodeid <sequential_number>
   ```

3. **Verification:**
   - Proxmox GUI: Cluster status shows all 6 nodes
   - `pvecm status` command confirms node membership
   - Corosync ring communication established

#### Post-Cluster Configuration

**Quorum and High Availability:**
- 6-node cluster: 4 nodes minimum required for quorum (majority)
- Automatic restart of failed VMs on surviving nodes if enabled
- Live migration supported between any cluster nodes

**API and GUI Access:**
- All cluster nodes accessible via web GUI (https://ip:8006)
- API calls routed to any available node
- Authentication credentials synchronized across cluster

### Storage Configuration

#### Shared Storage Tiers

**NETLAB1 - Primary VM Repository:**
- Mount: All 6 cluster nodes
- Type: Shared LVM/NFS/Ceph (underlying storage infrastructure)
- Function: Primary storage for production VMs
- Capacity: Requires minimum 500GB-2TB depending on VM count
- Live Migration: Supported via cluster

**NETLAB2 - Secondary Distribution:**
- Mount: All 6 cluster nodes  
- Type: Shared directory
- Function: Secondary storage tier for large deployments
- Supports load distribution across storage arrays

**NETLAB3 - Lab-Specific Storage:**
- Mount: Nodes 20, 21, 22, 23
- Type: Shared directory
- Function: Educational lab environment isolation
- Allows sandbox experimentation without affecting primary infrastructure

**LOCAL - Node-Local Storage:**
- Per-Node: Each host maintains /mnt/pve/local
- Purpose: Snippets, configurations, local backups
- Not shared: Each node maintains independent copy

### Virtual Machine Deployment and Management

#### NETLAB-VE Master Image

**VM Restoration Process:**
1. Create VMDIST backup server on host20
2. Connect to VMDIST repository (NDG backup repository)
3. Restore master NETLAB-VE image to VM ID 4200001
4. Configure VM network bridges:
   - Primary Interface (net0): vmbr0 (production network)
   - Secondary Interface (net1): vmbr1 with VLAN tagging (cluster/management)
5. Configure VM IP settings:
   - Primary IP: 10.2.0.21 (lab management network)
   - Gateway: 10.2.0.1
   - DNS: 10.2.50.10, 10.2.50.11
   - Hostname: netlabve1.pscit.org

**Golden Image Snapshot:**
- Create snapshot after initial restoration: "GOLDEN"
- Provides known-good baseline for VM reset operations
- Enables rapid VM provisioning from template

#### SSL Certificate and License Management

**LetsEncrypt SSL Configuration:**
1. Access NETLAB-VE admin portal (https://10.2.0.21/admin)
2. Admin settings → SSL Certificate
3. Select LetsEncrypt as provider
4. Generate and replace certificate
5. Automatic renewal configured for 90-day renewal cycle

**Licensing:**
1. Admin portal → Manage License
2. Enter NDG-provided serial number and license key
3. License registration with NDG backend
4. Verification: Check license status in admin GUI

### Backup and Disaster Recovery

#### Proxmox Backup Server Integration

**Backup Configuration:**
- Backup destination: Proxmox Backup Server (PBS)
- Retention policy: Configurable (daily, weekly, monthly)
- Backup scheduling: Automated per VM
- Deduplication: Block-level deduplication reduces storage

**Restore Capabilities:**
- Full VM restore to any cluster node
- Single-file restore from VM backups
- Point-in-time recovery via snapshots
- Bare-metal recovery support

#### VM Snapshot Strategy

**Snapshot Types:**

| Type | Frequency | Retention | Purpose |
|------|-----------|-----------|---------|
| GOLDEN | Once (baseline) | Permanent | Known-good master image |
| Daily Operational | Nightly | 7 days | Incremental undo points |
| Pre-Update | Before changes | 14 days | Rollback capability |
| Lab Reset | Per-class | 1 day | Quick environment reset |

---

## NDG Post-Installation Configuration

### NDG Post-Install Script

Network Development Group provides an automated post-installation script optimizing Proxmox for their NETLABS environment:

**Script Execution:**
```bash
bash -c "$(curl -fsSL https://ndg.tech/pve-post-install)"
```

**Script Functions:**
- Removes default repos and adds NDG-optimized repositories
- Configures Proxmox backup server connectivity
- Applies NDG networking templates
- Installs required VM tools and templates
- Configures NETLAB-specific VLAN and bridge settings
- Enables monitoring and metrics collection (Prometheus node_exporter on port 9100)

**Post-Script Verification:**
- All repositories configured for NDG repository access
- Cluster registered with NDG VMI (Virtual Machine Infrastructure) platform
- Storage pools visible and accessible from NDG management interface
- Node monitoring active and reporting metrics

### NETLAB+ Virtual Machine Infrastructure Integration

**VMI Platform Connection:**
- Admin GUI: Admin → Virtual Machine Infrastructure → Datacenters
- Register Proxmox cluster as new datacenter
- Cluster Name: PVE-NETLAB
- Infrastructure Type: Proxmox VE
- Add each host IP address for cluster node discovery

**Lab Pod Management:**
- Download lab scenarios from NDG distribution repository
- Scenarios pre-configured for Proxmox infrastructure
- Automatic VM deployment into NETLAB storage pools
- Lab isolation: Each student group gets dedicated lab environment

---

## Network Bandwidth and Performance Optimization

### Bandwidth Calculation

**Management Network Performance:**
- 10G Ubiquiti switch: 10 × 10 Gbps non-blocking fabric = 100 Gbps aggregate
- All 6 hosts simultaneously transferring: ~10 Gbps fairness per host
- Cluster replication: Sustained at 8-10 Gbps per link

**Production Network Performance:**
- Bonded 1G interfaces: 4 Gbps aggregate per host
- Switch uplink: 1 Gbps (external bottleneck)
- Inter-VM traffic within same host: Local switching (no uplink impact)
- Live VM migration: Limited by slowest link (1 Gbps uplink)

### Network Bottleneck Mitigation

**Current Limitations Acknowledged:**
1. External connectivity: Sub-1 Gbps upstream (stated constraint)
2. Lab traffic uplink: 1 Gbps Cisco Catalyst (local VLAN switching only)
3. Internet bandwidth: Insufficient for large concurrent downloads

**Optimization Opportunities:**
1. Separate lab VLAN from management VLAN traffic
2. Implement QoS marking for priority traffic
3. Cache frequently-used lab resources locally
4. Compress VM migration traffic (live migration compression)
5. Schedule large transfers during off-peak hours
6. Consider direct inter-host transfers for large files (bypassing switch)

---

## Deployment Timeline and Completion Status

### Project Phases

| Phase | Timeline | Status | Deliverables |
|-------|----------|--------|--------------|
| **Planning & Assessment** | Q3 2024 | ✓ Complete | Hardware inventory, cost analysis, network design |
| **10G Hardware Installation** | Aug-Sep 2024 | ✓ Complete | All 6 servers equipped with PCIe 10G cards, cable runs completed |
| **Proxmox Installation** | Sep-Oct 2024 | ✓ Complete | Proxmox OS on all 6 hosts, drivers verified |
| **Network Configuration** | Oct-Nov 2024 | ✓ Complete | Bonding, bridges, VLAN tagging, 10G management network operational |
| **Cluster Formation** | Nov 2024 | ✓ Complete | PVE-NETLAB cluster 6-node stable, quorum established |
| **Storage Configuration** | Nov-Dec 2024 | ✓ Complete | NETLAB1/2/3 directories created, accessible from all nodes |
| **NETLAB VE Migration** | Dec 2024-Jan 2025 | ⟳ In Progress | VM images restored, GOLDEN snapshot created, licensing configured |
| **Lab Pod Deployment** | Jan-Feb 2025 | ⟳ In Progress | Palo Alto, Cisco, NDG lab environments deployed |
| **Student Integration** | Feb-Mar 2025 | ○ Planning | Active Directory integration, student VM provisioning automation |
| **Monitoring & Optimization** | Mar+ 2025 | ○ Planning | Prometheus metrics, alert thresholds, performance tuning |

### Completed Tasks

- ✓ Wipe NVMe secondary drives on all servers (primary M.2 retained for boot)
- ✓ Install 10 Gigabit PCIe network cards in all 6 servers
- ✓ Install 15TB storage expansion in host23 (.69)
- ✓ Configure LACP bonding on all onboard gigabit NICs
- ✓ Deploy Proxmox VE on all 6 hosts
- ✓ Add VLAN support (VLANs 2-270)
- ✓ Form PVE-NETLAB cluster with all 6 nodes
- ✓ Establish 10G dedicated management network (Ubiquiti switch)
- ✓ Create NETLAB storage pools (NETLAB1, NETLAB2, NETLAB3)
- ✓ Configure cluster networking via ens3f0/ens3f1 (10G)
- ✓ Document all NIC port mappings and switch configurations
- ✓ Verify memory reallocation (host24/.71 received additional RAM)

### In-Progress Tasks

- ⟳ Restore NETLAB-VE master image from VMDIST repository
- ⟳ Configure NETLAB-VE network interfaces (multi-bridge setup)
- ⟳ Apply NDG post-install optimization script across cluster
- ⟳ Register cluster with NDG VMI administration platform
- ⟳ Deploy lab scenario PODs (PAN-FTv2, NDG-CySAPlusV1, etc.)
- ⟳ Troubleshoot NETLAB-VE-V25 backup restoration errors (connection reset issues)

### Outstanding Tasks

- ○ Active Directory integration for student account provisioning
- ○ Python automation script for NETLAB account creation from AD
- ○ Prometheus and Grafana metrics dashboard deployment
- ○ Node exporter metrics collection (port 9100)
- ○ Re-label all servers with permanent labeling tape
- ○ Download and configure all required class-specific lab PODs
- ○ Generate new license keys for spring/fall terms
- ○ Student user onboarding and lab access provisioning

---

## Documentation and Future Reference

### Critical Documentation Files

| Document | Purpose | Location |
|----------|---------|----------|
| **NIC Mapping Matrix** | Port-to-interface cross-reference | network-configuration/nic_mapping.csv |
| **Cisco Switch Configuration** | Trunking, LACP, VLAN assignments | network-configuration/cisco_2960_config.txt |
| **Proxmox Node Details** | IP addresses, hostnames, resources | infrastructure/proxmox_node_details.md |
| **Storage Pool Configuration** | NETLAB1/2/3 mount points | infrastructure/storage_config.md |
| **Network Topology Diagram** | Visual layout of 10G + 1G networks | infrastructure/network_topology.png |
| **Cluster Architecture** | Quorum, HA, failover configuration | infrastructure/cluster_architecture.md |

### Recommended Future Improvements

1. **Automated Monitoring:**
   - Deploy Prometheus for metrics collection
   - Create Grafana dashboards for cluster health visualization
   - Configure alerting for node failures and storage warnings

2. **Disaster Recovery:**
   - Off-site backup replication (Proxmox Backup Server to remote site)
   - Disaster recovery runbook documentation
   - Quarterly DR testing/drill schedule

3. **Scalability:**
   - Plan for additional nodes as enrollment grows
   - Evaluate Ceph distributed storage for shared storage redundancy
   - Consider 25G or 100G network upgrade roadmap

4. **Automation:**
   - Develop Infrastructure-as-Code (Terraform) for VM provisioning
   - Create orchestration workflows for lab environment spin-up
   - Implement GitOps for configuration management

5. **Security Hardening:**
   - Implement cluster-wide firewall policies (Proxmox Firewall)
   - Audit and restrict administrative access
   - Enable two-factor authentication (LDAP/AD integration)
   - Regular security patching schedule

---

## Conclusion

The migration from VMware to Proxmox VE represents a strategically sound architectural decision addressing both immediate cost concerns and long-term operational sustainability. The elimination of subscription-based licensing costs provides substantial financial savings ($341,460-$446,600 annually) that can be reinvested in educational initiatives, hardware upgrades, or additional technical infrastructure.

The 10 Gigabit network infrastructure redesign with dedicated management VLAN on unmanaged switching significantly enhances inter-node communication performance, enabling larger laboratory environments and faster virtual machine migration operations. The implementation of a six-node Proxmox cluster provides enterprise-grade reliability, automatic failover capabilities, and seamless live migration support comparable to or exceeding the previous VMware infrastructure.

From a technical perspective, Proxmox VE provides feature parity with VMware vSphere for educational laboratory purposes while eliminating the licensing complexity and cost escalation that have become characteristic of the VMware ecosystem under Broadcom ownership. The open-source nature of Proxmox enables customization and deep integration with NDG's NETLAB+ platform, ensuring alignment with the institution's educational technology strategy.

This infrastructure will serve as the foundation for advanced cybersecurity and network administration training for years to come, providing students with hands-on experience in virtualized environments at minimal ongoing operational cost.

---

## Reference Materials

### External Documentation Links

- **Proxmox VE Official Documentation:** https://pve.proxmox.com/wiki
- **NDG NETLAB+ Proxmox Installation Guide:** https://netlab-docs.netdevgroup.com/vmi/proxmox/install/
- **NDG VMware NETLAB+ Environmental Guide:** https://www.netdevgroup.com/support/documentation/netlabve/
- **Proxmox vs. VMware Comparison:** https://www.proxmox.com/en/products/proxmox-virtual-environment/comparison
- **Linux Bridge and VLAN Configuration:** https://pve.proxmox.com/wiki/Network_Configuration
- **Proxmox Clustering Guide:** https://pve.proxmox.com/wiki/Cluster_Manager

### Related Technical Topics

- Advanced Proxmox networking (Open vSwitch, SR-IOV)
- Distributed storage (Ceph) integration
- High-availability VM configuration and failover
- Performance tuning for large-scale deployments
- Backup and disaster recovery procedures
- Integration with enterprise monitoring platforms

---

*Document Version: 1.0*  
*Last Updated: January 17, 2026*  
*Technical Domain: Infrastructure Virtualization, Network Architecture*  
*Audience: IT Operations, Educational Technology Leadership*