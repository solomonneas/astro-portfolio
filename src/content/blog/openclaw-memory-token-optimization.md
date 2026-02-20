---
title: "From 100K Token Messages to Semantic Search: How I Fixed My AI Agent's Memory"
description: "The real story of building an AI agent memory system. From Kimi K2.5 blowing through tokens to local semantic search with Ollama. Every mistake, every fix."
pubDate: 2026-02-19
tags: ["openclaw", "memory", "tokens", "ollama", "semantic-search", "optimization"]
---

# From 100K Token Messages to Semantic Search: How I Fixed My AI Agent's Memory

Here's something nobody tells you about running an AI agent full-time: the memory problem will eat you alive if you don't solve it early.

I learned this the hard way. This is the story of how my OpenClaw agent went from sending 100,000+ token messages (and burning through API quotas in hours) to a lean semantic memory system that runs locally for free.

## The Dark Ages: Kimi K2.5 and No Guardrails

When I first started running OpenClaw seriously, I was using Kimi K2.5 through the Moonshot API. No message limits. No memory management. No cleanup strategy. Just a growing conversation that got bigger every time the agent did something.

The agent would wake up, load the entire conversation history, and start working. Every tool call, every response, every thought process stayed in context. After a few hours of active use, individual messages were pushing 100K tokens. The context window was a dumpster fire of outdated information, redundant logs, and noise.

The symptoms showed up fast:

**Token burn was insane.** Each message round-trip was costing a fortune because the model had to process the entire session history every time. A simple "what's the weather?" question carried 100K tokens of baggage.

**Quality degraded.** Models get worse at following instructions when you stuff them with irrelevant context. My agent would forget things I told it 20 minutes ago because they were buried under 80K tokens of earlier logs. The "needle in a haystack" problem, except I was creating the haystack myself.

**Sessions became fragile.** Long sessions would randomly break. The model would lose coherence, repeat itself, or start hallucinating about tasks from hours ago that were already done. I'd have to restart fresh, losing all the context I actually needed.

**API limits hit hard.** Moonshot's API had generous limits but we were blowing through them. Some days the agent would hit rate limits by noon. That's not sustainable.

I was essentially running my AI agent the same way most people run ChatGPT: one long conversation that grows forever. Except my agent was doing real work, so the conversation grew 10x faster than a casual chat.

## The First Fix: Handoff Letters (Cute But Wrong)

My first attempt at solving this was "handoff letters." Before resetting a session, the agent would write a summary of everything important: current projects, recent decisions, context about ongoing tasks. Then on restart, it would read the handoff letter to restore context.

This was better than nothing but had serious problems:

**Lossy compression.** The agent decided what was "important" to include. It often got this wrong, keeping detailed notes about irrelevant things and dropping critical context.

**Manual process.** Someone (me or the agent) had to remember to write the handoff letter before a reset. If the session crashed or got force-killed, the letter didn't get written. Context gone.

**Growing letters.** The handoff letters themselves kept growing. After a few cycles, the letter was 5,000+ words of accumulated context, half of which was stale. We were recreating the same problem in a different format.

**No search capability.** Need to find that one decision from three days ago? Read the entire letter. Or all of them.

## The Second Fix: Daily Memory Files (Better, Still Incomplete)

I moved to daily memory files: `memory/YYYY-MM-DD.md`. The agent writes raw logs of what happened each day. On startup, it reads today's file plus yesterday's for recent context.

This was a real improvement:

- Context is date-bounded (you don't load irrelevant old stuff)
- Easy to review and audit
- Natural archiving (old days just sit there, not consuming tokens)

But it still had the "need to find something from last week" problem. And loading even two days of active notes could be 10-20K tokens of context on a busy day.

I also added `MEMORY.md` as a long-term curated memory file. Think of daily files as a journal and MEMORY.md as your actual memory: the distilled lessons, decisions, preferences, and context you want to persist forever. The agent reviews daily files periodically and promotes important things to MEMORY.md.

This two-tier approach works well for recent context. But MEMORY.md grew to 57,000+ characters. Loading the whole thing every session was a waste.

## The Real Fix: Semantic Memory Search with Ollama

The breakthrough was semantic search. Instead of loading entire files into context, the agent searches for what's relevant and loads only those chunks.

Here's how it works:

1. **Embedding model runs locally** on GPU via Ollama (`nomic-embed-text`). Zero API cost.
2. **Memory files get indexed** (MEMORY.md + all daily files + any other .md files in the memory directory).
3. **On query, the agent searches** for semantically relevant chunks. "What did we decide about the API architecture?" returns the 5-10 lines about API architecture, not the entire 57K character file.
4. **Only relevant chunks enter context.** Instead of 57K characters of MEMORY.md, the agent loads maybe 500-1000 characters of exactly what it needs.

The token savings are massive. A query that used to require loading the full memory file now loads a tiny fraction of it. And the results are better because the model isn't distracted by irrelevant context.

### The Setup

OpenClaw has built-in memory search support. Configure it to use Ollama:

```yaml
memorySearch:
  provider: openai
  remote:
    baseUrl: http://localhost:11434/v1/
  model: nomic-embed-text
  fallback: none
```

That's it. Ollama serves an OpenAI-compatible embedding endpoint. The `nomic-embed-text` model is tiny (274M parameters), runs on any GPU, and produces good embeddings for text search.

The agent now calls `memory_search(query="what did we decide about X")` before answering questions about past work. It gets back ranked results with file paths and line numbers. Then it uses `memory_get` to pull just those specific lines.

### What I Tried Before Ollama

Before settling on Ollama, I tried QMD (Quantized Memory Database) as the embedding backend. It loaded 2.2GB models per query, was painfully slow as a subprocess, and consumed ridiculous amounts of RAM. Ollama is faster, lighter, and already running for other tasks (commit messages, cron triage). One process, multiple uses.

## Structured Extraction: The Next Layer

Semantic search solves "find what I already know." But what about extracting structured data from new documents?

I've been testing [LangExtract](https://github.com/google/langextract) (Google's structured extraction library) with local Ollama models. You define what you want to extract (names, dates, dollar amounts, action items) with a few examples, point it at a document, and it pulls structured entities with source grounding.

Tested it with a mock business email through `qwen2.5:14b` on Ollama:

```
[dollar_amount] '$12,500' -> {'context': 'cost for new Cisco switches'}
[dollar_amount] '$3,200'  -> {'context': 'installation cost'}
[deadline] 'February 28th' -> {'urgency': 'firm', 'reason': 'secure discount'}
[person] 'Sarah' -> {'context': 'accounting, needs Q1 reports'}
[organization] 'CrowdStrike' -> {'context': 'security audit provider'}
```

Every entity extracted correctly. All local, zero API cost, 35 seconds on my GPU.

This is the next evolution: not just searching memory but automatically extracting and indexing structured data from every document, email, and report the agent processes. Action items get tracked. Dollar amounts get logged. Deadlines get added to reminders. All without explicit prompting.

## The Token Optimization Stack (Current)

Here's what the full memory and token optimization setup looks like today:

| Layer | What It Does | Token Impact |
|-------|-------------|-------------|
| Semantic memory search | Load only relevant chunks from 57K+ chars of memory | 90-95% reduction |
| Daily memory files | Bounded context per day, not infinite scroll | Predictable daily load |
| Curated MEMORY.md | Long-term distilled context, not raw logs | Compact, high-signal |
| Heartbeat batching | Multiple checks in one context load | 3-5x fewer session starts |
| Sub-agent isolation | Build tasks don't carry personal context | 50-80% less input per sub-agent |
| Local Ollama models | Embeddings, triage, commits on GPU | Zero API tokens |
| Model chain | Right model per task (Haiku scans, Opus thinks) | Cost-optimal per task |

## The Numbers

Before optimization (Kimi K2.5 era):
- Average message: 50-100K tokens
- Sessions per day: 2-3 (forced restarts from limit hits)
- Daily token burn: 500K-1M+ tokens
- Quality: degraded after 30 minutes

After optimization (current):
- Average message: 5-15K tokens
- Sessions per day: 1 main + isolated sub-agents as needed
- Daily token burn: 100-200K tokens on the main model
- Quality: consistent throughout the day

That's a 5-10x reduction in token usage with better output quality. The agent finds information faster, stays coherent longer, and doesn't waste tokens on context it doesn't need.

## Lessons

1. **Conversation history is not memory.** They solve different problems. History is what happened. Memory is what matters. Build a system for each.

2. **Local embeddings are free and good enough.** You don't need OpenAI's embedding API. Ollama + nomic-embed-text runs on a $200 GPU and handles everything I need.

3. **The memory problem compounds.** A small inefficiency on day one becomes unusable by week two. Fix it early.

4. **Structured extraction is the next frontier.** Searching unstructured text is useful. Automatically extracting structured data from it is transformative.

5. **Right-size your models.** An embedding model doesn't need to be a frontier model. A triage model doesn't need to be Opus. Put the expensive model where it matters: decisions and judgment.

## Want This Without the Learning Curve?

I spent months building, breaking, and rebuilding this memory system. Every optimization came from real production use and real failures. If you want help getting semantic memory search, token optimization, or structured extraction running on your own setup, [reach out](https://openclaw.solomonneas.dev).
