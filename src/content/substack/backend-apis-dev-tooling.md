---
title: "Three Local APIs That Stopped My AI Agent from Wasting Money"
description: "Code Search, Prompt Library, and Agent Intel. All local, all free per query, all solving the same problem: my agent kept ignoring what I'd already built."
pubDate: 2026-02-28
tags: ["backend", "api", "local-first", "dev-tools", "fastapi", "ai-agent"]
---

# Three Local APIs That Stopped My AI Agent from Wasting Money

I watched my agent write a code review prompt from scratch. A good one, actually. Detailed, well-structured, covered all the right categories. It took about 4,000 tokens of Opus output to generate.

The problem: I already had that exact prompt in my Prompt Library. Polished through weeks of iteration. Sitting on localhost:5202, waiting to be used. The agent didn't check. It just wrote a new one.

That's 4,000 tokens of Opus ($0.30 in output costs) to recreate something that already existed locally for free. Multiply that by every task where the agent reinvents instead of reuses, and you start to understand why I built enforcement rules.

But the enforcement rules came second. First, I had to build the APIs worth enforcing.

## Code Search (Port 5204)

This one changed my workflow more than any other tool I've built.

Before Code Search, finding something across my codebase meant one of three bad options. Grep through files manually. Ask the agent to grep (burning expensive Opus tokens on mechanical file scanning). Or just guess where something lived and read files until I stumbled on it.

I have 40+ repos in my workspace. Grepping across all of them is slow and produces walls of output that still need human interpretation. Asking Opus to do it costs $15 per million input tokens, which is absurd for what amounts to string matching.

Code Search runs nomic-embed-text through Ollama to generate embeddings for every indexed file. It also uses qwen2.5:14b to create natural language summaries. Both models run on my local GPU. The index lives in SQLite. The server is FastAPI managed by PM2.

```bash
# Hybrid search: keyword + semantic, merged results
curl -s -X POST http://localhost:5204/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "authentication middleware", "mode": "hybrid", "limit": 10}'
```

Three modes: `hybrid` (default, best results), `code` (raw text matching, fast), and `summary` (searches the AI-generated descriptions, great for "what does X do?" questions).

The index rebuilds nightly at 4am via cron. Manual re-index when needed:

```bash
curl -X POST http://localhost:5204/api/index?summarize=true
```

The whole thing is SQLite, FastAPI, and two Ollama models. No Postgres. No Redis. No infrastructure that needs babysitting. Total RAM footprint when idle: maybe 60MB.

## Prompt Library (Port 5202)

The code review incident wasn't a one-time thing. I kept catching the agent writing prompts from scratch for tasks where I had polished templates. Research prompts, architecture review prompts, content creation prompts. All generated fresh every time, all costing tokens, all slightly worse than what I'd already refined through actual use.

The Prompt Library stores templates with categories, tags, and version history. Currently holds 19+ templates spanning code review, content creation, research, architecture planning, and security analysis.

```bash
# List everything
curl -s http://localhost:5202/api/prompts | python3 -c "
import sys, json
for p in json.load(sys.stdin):
    print(f'{p[\"id\"]}: {p[\"title\"]} [{p[\"category\"]}]')
"

# Fetch a specific template
curl -s http://localhost:5202/api/prompts/code-review-checklist
```

Each template has been refined through real use. The code review prompt didn't start perfect. It started generic, then I added categories for security, performance, and error handling after noticing what the initial version missed. That iteration is worth preserving. Regenerating from scratch throws it away.

The version control matters too. When I update a prompt, the old version sticks around. If a change makes things worse, I roll back. Try that with a prompt your agent wrote on the fly and already forgot.

## Agent Intel (Port 8005)

This one solves a subtler problem. My agent has opinions, and those opinions drift between sessions.

Ask Opus about caching strategies on Monday and you get one answer. Ask on Wednesday with different context loaded and you get a slightly different answer. Both are reasonable. Neither is anchored to what we've already decided works for our specific setup.

Agent Intel is the ground truth. Before answering questions about best practices, architecture patterns, or technical decisions, the agent checks what we've already established. Past decisions, preferred approaches, lessons learned the hard way.

```bash
curl -s http://localhost:8005/api/agent-intel
```

It lives on the same port as the Dev Tools API because they're part of the same FastAPI service. The Dev Tools API also handles the social content pipeline (draft, review, publish through API endpoints that sync with Postiz for scheduling) and project metadata.

The value of Agent Intel is consistency. I don't want my agent giving me different architecture advice every time based on whatever its training data feels like surfacing that day. I want it to check what we've already decided, then build on that. The curated knowledge is almost always more relevant than the model's general training.

## Why These Have to Be Local

Every one of these APIs runs on my machine. FastAPI backends, SQLite databases, Ollama for ML work. All managed by PM2 with auto-restart.

**Zero marginal cost.** My agent hits Code Search dozens of times per session. If those were cloud API calls, even at pennies each, the bill would add up over weeks. Locally, it's CPU cycles I'm already paying for through my electricity bill.

**Speed.** Localhost returns in single-digit milliseconds. No DNS resolution, no TLS handshake, no cross-region routing. The agent checks Prompt Library before writing a prompt and the overhead is invisible. Maybe 5ms round trip.

**Privacy.** I index proprietary code, store internal decision rationale, and keep infrastructure details in these databases. Port numbers, API tokens, architecture decisions, salary negotiation notes. None of that should touch a third-party server.

**No outages.** No rate limits, no pricing changes, no "service degraded" banners. PM2 auto-restarts crashed processes. `pm2 resurrect` brings everything back after a reboot. If my machine is on, the APIs work.

## The Enforcement Problem

Building APIs isn't enough. I learned this the hard way over several weeks of watching the agent ignore perfectly good local resources in favor of doing things from scratch.

The fix was `LOCAL_FIRST_RULES.md`, a rules file injected into every agent session through an OpenClaw bootstrap hook. The rules are blunt:

1. Before any codebase question: hit Code Search.
2. Before writing any prompt: check Prompt Library.
3. Before answering knowledge questions: check Agent Intel.
4. Before any file scanning: delegate to the cheap model, not Opus.

These aren't suggestions. The rules document explicitly pre-empts the agent's rationalizations: "Even for 'general knowledge' topics like caching, design patterns, best practices: CHECK FIRST. No exceptions."

I had to add that line because the agent kept deciding it "already knew" the answer and skipping Agent Intel. It did know the answer, usually. But Agent Intel's answer was better because it reflected our specific decisions, not generic training data.

## The Stack

```
Runtime:     Python 3 + FastAPI
Database:    SQLite (per service)
ML:          Ollama (nomic-embed-text + qwen2.5:14b)
Process Mgmt: PM2
OS:          Ubuntu on WSL2
```

No Docker. No Kubernetes. No cloud services. No monthly bills beyond electricity.

Three commands to start everything:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 list
```

Total resource footprint across all services when idle: roughly 200MB of RAM. The GPU activates during indexing and embedding operations, then goes back to sleep.

## Key Takeaways

1. Local APIs eliminate per-query costs for operations your agent does constantly. Code search, prompt lookup, and knowledge retrieval should be free at the point of use.
2. SQLite plus FastAPI is enough for single-user dev tooling. If you're running Postgres for a personal knowledge base, you're over-engineering it.
3. Build enforcement rules, not suggestions. APIs only save money if the agent actually uses them. Left to its own judgment, it won't.
4. Version your prompts. The iteration history of a good prompt is more valuable than the prompt itself. Regenerating from scratch throws away that work.
5. The best dev tools run when your machine runs. No accounts, no API keys, no billing surprises, no third-party dependencies.
