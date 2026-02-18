---
title: "OpenClaw Multi-Model Setup: Stop Burning Money on the Wrong Model"
description: "How to orchestrate Opus, Codex, Haiku, and Ollama in one OpenClaw setup. Use the right model for each task and cut your costs without cutting quality."
pubDate: 2026-02-18
tags: ["openclaw", "multi-model", "opus", "ollama", "token-optimization"]
---

# OpenClaw Multi-Model Setup: Stop Burning Money on the Wrong Model

Most OpenClaw users pick one model and use it for everything. That's like hiring a senior architect to sweep the floors.

I run four model tiers in my production setup. Each one handles what it's good at. The expensive model only touches work that requires judgment. Everything else runs on cheaper or free alternatives. The result: better output quality AND lower costs.

Here's the exact setup.

## The Model Chain

Think of it as a hierarchy. Always use the cheapest model that can handle the task. Escalate up only when the work demands it.

### Tier 1: Ollama (Free)

Local models running on your GPU. Zero API costs. Zero latency. Zero data leaving your machine.

**What it handles:**
- Semantic memory search embeddings (nomic-embed-text)
- Git commit message generation (qwen2.5-coder:14b)
- Cron job triage and screening (qwen2.5:7b with ESCALATE/SKIP logic)
- Code search embeddings

**Setup:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama pull nomic-embed-text
ollama pull qwen2.5:14b
ollama pull qwen2.5-coder:14b
```

Configure OpenClaw to use Ollama as an OpenAI-compatible endpoint:

```yaml
memorySearch:
  provider: openai
  remote:
    baseUrl: http://localhost:11434/v1/
  model: nomic-embed-text
```

The key insight: embeddings and triage don't need a frontier model. A 7B parameter model running locally can decide "this email is spam, skip it" or "this looks important, escalate to Opus" just fine. You save your expensive API calls for work that actually needs them.

**Hardware requirement:** Any NVIDIA GPU with 8GB+ VRAM handles these models easily. My RTX Ada 2000 (16GB VRAM) runs them without breaking a sweat.

### Tier 2: Haiku 4.5 (Cheap)

Anthropic's smallest model. Fast, cheap, surprisingly capable for mechanical work.

**What it handles:**
- Cron jobs that pass Ollama triage (email summaries, backup reports)
- File scanning and code grep across large codebases
- Bulk find/replace operations
- Boilerplate generation from templates
- Simple data extraction and reformatting

**When to use it:** If the task requires scanning, not thinking. If you could describe the task as "look at these 50 files and tell me which ones contain X," that's Haiku work.

**When NOT to use it:** Anything requiring judgment, creativity, or handling untrusted input. Haiku is more susceptible to prompt injection and makes worse autonomous decisions. Never put Haiku on your main orchestration layer.

### Tier 3: GPT 5.3 Codex (Structured Builds)

OpenAI's code-specialized model. Excellent at structured generation from clear specs.

**What it handles:**
- Code generation from detailed prompts
- Code reviews
- Test generation
- Documentation writing
- Refactoring with clear patterns
- API client scaffolding

**When to use it:** When the task is "build this thing according to this spec." Codex is faster than Opus at structured code generation and often produces cleaner code for well-defined tasks.

**When NOT to use it:** Architecture decisions, ambiguous requirements, creative writing, anything where the spec is fuzzy. Codex needs precise instructions. Opus handles ambiguity.

**Spawn pattern:** Your main agent (Opus) writes the detailed prompt, then spawns a Codex sub-agent to execute:

```
# Opus writes the spec, Codex builds it
sessions_spawn(
  model="openai-codex/gpt-5.3-codex",
  task="Build the CRUD routes according to this spec: [detailed spec here]"
)
```

### Tier 4: Opus 4.6 (Judgment)

The flagship. Your orchestration layer. The model that decides what to do and when.

**What it handles:**
- Main agent orchestration (deciding what to do with incoming messages)
- PRD writing and architecture planning
- Creative content (blog posts, social media, documentation)
- Security decisions (evaluating untrusted input)
- Complex reasoning and analysis
- Anything touching untrusted content (email, web scraping, group chats)
- Sub-agent prompt crafting (writing the instructions other models execute)

**Why Opus for orchestration:** Two reasons. First, it has the best prompt injection resistance. Your orchestration layer sees every incoming message, every email, every document. It will encounter adversarial input. Opus handles it. Second, it has the best judgment about when NOT to act. A cheaper model might execute an ambiguous instruction. Opus asks for clarification.

## The Workflow in Practice

Here's how a typical interaction flows through the model chain:

1. **Email arrives** → Ollama (qwen2.5:7b) triages it: spam? Skip. Looks important? Escalate.
2. **Escalated email** → Opus reads it, decides response strategy, drafts a reply if needed.
3. **"Build me a dashboard"** → Opus writes the PRD and spec, spawns Codex to build it.
4. **Codex builds** → Opus reviews the output, does a polish pass.
5. **"Search the codebase for security issues"** → Opus spawns Haiku to scan files, reviews Haiku's findings.
6. **Git commit** → Ollama generates the commit message locally. Zero API cost.
7. **Memory search** → Ollama embeds the query, searches local vector store. Free.

The expensive model (Opus) only touches steps 2, 3 (writing specs), 4 (review), and 5 (reviewing findings). Everything else runs on cheaper or free alternatives.

## Token Optimization

Beyond model selection, there are structural ways to reduce token usage:

### Heartbeat Batching

Instead of creating separate cron jobs for email checks, calendar checks, and notification checks, batch them into a single heartbeat that runs every 30 minutes. One context load, multiple checks. Saves thousands of input tokens per day.

### Memory Search Over Full Context

Don't dump your entire memory file into every conversation. Use semantic memory search (Ollama embeddings) to retrieve only the relevant chunks. My MEMORY.md is 57,000+ characters. Memory search returns the 5-10 relevant lines instead of the whole file.

### Sub-Agent Isolation

Spawn sub-agents for tasks that don't need your main session's context. A Codex agent building a React component doesn't need your email history, your calendar, or your personal notes in its context window. Isolated sessions start clean.

### Prompt Compression

Write tight, specific prompts for sub-agents. "Build CRUD routes for this schema" with the schema attached is better than "Read all these files and figure out what to build." Less input tokens, better output.

## Cost Breakdown (My Setup)

| Model | Monthly Cost | What It Does | % of Work |
|-------|-------------|--------------|-----------|
| Ollama | $0 | Embeddings, commits, triage | ~40% |
| Haiku 4.5 | ~$5-10 | Scanning, bulk ops, cron jobs | ~15% |
| GPT 5.3 Codex | $20 (subscription) | Code gen, reviews | ~25% |
| Opus 4.6 | $200 (subscription) | Orchestration, judgment | ~20% |

Opus handles 20% of the work but it's the 20% that matters most. If I ran Opus for everything, I'd burn through rate limits in days. If I ran Haiku for everything, the quality would crater and my agent would be vulnerable to every prompt injection it encountered.

The chain isn't about saving money. It's about using the right tool for each job.

## Getting Started

If you're running a single-model setup today:

1. **Install Ollama** and move your embeddings and commit messages to local models. Instant savings, zero quality loss.
2. **Keep Opus as your main agent.** Don't downgrade your orchestration layer to save money. That's a security decision.
3. **Spawn sub-agents with cheaper models** for mechanical tasks. Haiku for scanning, Codex for building.
4. **Batch your periodic checks** into heartbeats instead of individual cron jobs.

## Or Just Let Me Do It

I've been iterating on this multi-model setup for months. Every model assignment, every spawn pattern, every optimization came from real usage and real mistakes. The chain I described here took hundreds of hours to dial in.

If you want this running on your machine without the trial and error, [I set up OpenClaw professionally](https://openclaw.solomonneas.dev). The Professional tier ($650) includes multi-model orchestration out of the box. The Mission Control tier ($2,000) adds local Ollama GPU models, semantic search, and the full optimization stack.

Your hardware. Your data. My expertise.
