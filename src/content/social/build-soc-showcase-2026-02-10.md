---
title: "I Built a One-Command SOC Deployment for Proxmox"
published: false
---

# I Built a One-Command SOC Deployment for Proxmox

Every security professional knows the pain: you want to learn Wazuh, Zeek, Suricata, and TheHive, but getting them installed and integrated takes longer than actually using them.

So I built the S³ Stack: a one-liner bash installer that deploys a full Security Operations Center on Proxmox VE. Whiptail menus let you pick components, choose LXC or VM deployment, set resource presets, and configure networking. Then `integrate.sh` wires everything together: log forwarding, webhooks, rule feeds, the works.

The companion project, SOC Showcase, visualizes the entire architecture with animated data flow pipelines and interactive component diagrams. It is both a learning tool and a portfolio piece.

One command. Six open-source security tools. Full integration. Running on a $200 used Dell Optiplex.

Full build log: [link to blog post]

If you run a homelab or teach cybersecurity, I would love to hear how you handle SOC tool deployment.
