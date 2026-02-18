---
title: "How to Set Up OpenClaw on Windows with WSL2 (The Real Guide)"
description: "A complete, battle-tested guide to running OpenClaw on Windows via WSL2. Every gotcha, every fix, every thing the docs don't tell you."
pubDate: 2026-02-18
tags: ["openclaw", "windows", "wsl2", "ai-agent", "setup-guide"]
---

# How to Set Up OpenClaw on Windows with WSL2 (The Real Guide)

I've been running OpenClaw in production on Windows via WSL2 for months. Not a weekend experiment. A real setup with multi-model orchestration, 12+ cron jobs, semantic memory search, and sub-agent pipelines running 24/7.

This is the guide I wish existed when I started. The official docs cover the basics. This covers everything else.

## Why WSL2?

You could run OpenClaw natively on Windows, but WSL2 gives you a proper Linux environment with none of the "works on Linux, breaks on Windows" headaches. Node.js runs natively, file permissions behave normally, and you get systemd for service management. WSL2 ports auto-forward to your Windows host IP, so your phone can reach your agent over the local network.

This is what I run daily. It works.

## Prerequisites

- Windows 10 (build 19041+) or Windows 11
- 8GB RAM minimum, 16GB+ recommended
- Admin access

## Step 1: Enable WSL2

Open PowerShell as Administrator:

```powershell
wsl --install
```

Restart your machine. On reboot, it'll finish installing Ubuntu. Set your username and password when prompted.

Verify you're on WSL2 (not WSL1):

```powershell
wsl -l -v
```

You should see `VERSION 2` next to Ubuntu. If it says 1, convert it:

```powershell
wsl --set-version Ubuntu 2
```

## Step 2: Install Node.js

Inside your WSL Ubuntu terminal:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should be 22.x
```

## Step 3: Install OpenClaw

```bash
sudo npm install -g openclaw
```

Verify:

```bash
openclaw --version
```

## Step 4: Initial Configuration

Run the setup wizard:

```bash
openclaw init
```

This creates `~/.openclaw/` with your config files. The wizard walks you through:
- Choosing your AI provider (Anthropic, OpenAI, etc.)
- Setting up your first chat channel (Telegram, WhatsApp, etc.)
- Creating your workspace at `~/.openclaw/workspace/`

## Step 5: Configure Your Workspace

This is where OpenClaw becomes yours. Create these files in `~/.openclaw/workspace/`:

**SOUL.md** - Your agent's personality. This isn't optional fluff. It's what makes your agent useful instead of generic. Define how it talks, what it prioritizes, what it should never do. Mine is about 60 lines and covers everything from writing style to safety boundaries.

**USER.md** - Context about you. Your timezone, your job, your projects. The more context your agent has, the better its judgment calls.

**AGENTS.md** - Operating procedures. How your agent handles memory, heartbeats, group chats, tool usage. Think of it as the employee handbook.

## Step 6: Set Up Persistence

Your agent needs to survive reboots and terminal closures. Two options:

### Option A: PM2 (Recommended)

```bash
npm install -g pm2
pm2 start "openclaw gateway start" --name openclaw
pm2 save
pm2 startup  # Follow the instructions it prints
```

### Option B: systemd

Create `/etc/systemd/system/openclaw.service`:

```ini
[Unit]
Description=OpenClaw Gateway
After=network.target

[Service]
Type=simple
User=your-username
ExecStart=/usr/bin/openclaw gateway start
Restart=always
RestartSec=10
WorkingDirectory=/home/your-username

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable openclaw
sudo systemctl start openclaw
```

## Step 7: Network Access (Phone to WSL)

This is where most Windows guides stop and most people get stuck. Your phone needs to reach your OpenClaw instance over the local network.

WSL2 ports auto-forward to `localhost` on Windows. But to access from your phone (or any other device on your network), you need Windows to listen on its actual network IP.

Find your Windows host IP:

```powershell
# In PowerShell on Windows
ipconfig
```

Look for your Wi-Fi or Ethernet adapter's IPv4 address (e.g., `192.168.1.100`).

Set up port forwarding (PowerShell as Admin):

```powershell
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=localhost
```

Add a firewall rule:

```powershell
New-NetFirewallRule -DisplayName "OpenClaw" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

Replace `3000` with whatever port OpenClaw is using.

## The Gotchas (The Real Reason You're Reading This)

### Windows Sleep Will Kill Your Agent

This one cost me hours. Windows has a hidden "System Unattended Sleep Timeout" that's separate from your normal sleep settings. Even with sleep disabled and PowerToys Awake running, your machine will still go to sleep after a while.

Fix it in PowerShell as Admin:

```powershell
powercfg /SETACTIVETIMEOUT 0
powercfg /SETDCVALUEINDEX SCHEME_CURRENT SUB_SLEEP UNATTENDSLEEP 0
powercfg /SETACVALUEINDEX SCHEME_CURRENT SUB_SLEEP UNATTENDSLEEP 0
powercfg /S SCHEME_CURRENT
```

Also disable hibernate:

```powershell
powercfg /hibernate off
```

PowerToys Awake is NOT enough. This hidden timeout overrides it.

### VPN/DNS Sinkholing Breaks Claude Code

If you're running Mullvad, Pi-hole, AdGuard, or any DNS sinkholing setup, Claude Code (if you use it alongside OpenClaw) will hang forever trying to reach `statsig.anthropic.com` (telemetry).

Fix: Add to `~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
  }
}
```

### New Ports Need BOTH Proxy AND Firewall

Every time you add a new service on a new port, you need both the `netsh interface portproxy` command AND a firewall rule. Miss either one and your phone can't reach it. I've been bitten by this more times than I'd like to admit.

### WSL CWD Can Go Stale

If you're running a dev server and switch git branches, the working directory Python's `http.server` is using can show `(deleted)`. Just restart the server. This one is subtle and will have you debugging phantom 404s.

### BIND_HOST for Cross-WSL Access

If you're running any API service inside WSL that needs to be accessible from Windows (or your phone), make sure it binds to `0.0.0.0`, not `127.0.0.1`. For FastAPI/Uvicorn:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

For Vite dev servers, use `--host` flag:

```bash
vite --host
```

### Ollama for Local Models

If you want local model support (free embeddings, free commit messages, free triage), install Ollama inside WSL:

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull nomic-embed-text
ollama pull qwen2.5:14b
```

Ollama runs on port 11434 by default. OpenClaw can use it as an OpenAI-compatible endpoint at `http://localhost:11434/v1/`.

## What's Next

Once you're running, you'll want to:
- Set up [security hardening](/blog/openclaw-security-hardening) (nightly audits, encrypted backups, firewall rules)
- Configure [multi-model orchestration](/blog/openclaw-multi-model-setup) (use the right model for each task)
- Build out your SOUL.md and workspace files

Or skip all of this and [let me set it up for you](https://openclaw.solomonneas.dev). I've spent hundreds of hours optimizing my setup so you don't have to figure this out yourself. Three tiers, starting at $200, running on your hardware.
