---
title: "From Handoff Letters to Semantic Memory Search"
pubDate: 2026-02-09
description: "How I replaced manual AI session handoffs with local GPU-powered semantic search using Ollama and nomic-embed-text. Zero cloud calls, instant retrieval, no more copy-pasting context."
tags: ["ollama", "semantic-search", "embeddings", "local-ai", "openClaw", "developer-tools", "gpu"]
---

# From Handoff Letters to Semantic Memory Search

Every AI assistant has the same problem: amnesia. You build up hours of context, decisions, architecture choices, debugging breakthroughs. Then the session ends. Next time you start a conversation, the AI has no idea who you are or what you were working on.

I solved this. Not with cloud APIs, not with expensive embedding services. With a local GPU, Ollama, and a 274MB embedding model.

## The Problem: Session Amnesia

I run [OpenClaw](https://openclaw.dev), an AI assistant framework that orchestrates multiple models. My main agent (Claude Opus 4.6) handles everything from code reviews to portfolio management across 30+ projects. The problem is that every new session starts from zero.

My workaround was **handoff letters**. At the end of each session, I would generate a structured markdown document summarizing everything: what we worked on, what decisions were made, what was left unfinished. Next session, I would paste it back in. The AI would read it and pick up where we left off.

It worked. Barely. The letters got long. Important details got buried. I was spending real time writing and curating these documents instead of doing actual work. And if I forgot to generate one? Total context loss.

## The Failed Attempts

OpenClaw has a built-in memory search feature. It indexes your workspace files and retrieves relevant context when starting new sessions. The catch is that it needs an embedding provider to convert text into vectors for semantic similarity matching.

**Attempt 1: OpenAI Embeddings.** The default configuration points at OpenAI's embedding API. I didn't have an OpenAI API key with embedding quota. I was on the $20/mo Plus plan (OAuth only, no per-token billing). Every search attempt returned a 429 rate limit error. Dead on arrival.

**Attempt 2: QMD (Quantized Model Daemon).** OpenClaw ships with QMD support for local embeddings. I installed it, got Bun running, downloaded the models. The problem: QMD loads a 2.2GB model into memory for every single subprocess call. Each query spawned a fresh process, loaded the model, ran one embedding, then exited. It timed out consistently. Even when it worked, it was painfully slow.

**Attempt 3: Built-in local embeddings.** OpenClaw also supports a built-in local provider using EmbeddingGemma (300MB GGUF model via node-llama-cpp). This actually worked, but it was noticeably slower than I wanted and CPU-bound.

None of these felt right. I needed something fast, local, and persistent.

## The Solution: Ollama + nomic-embed-text

I already had Ollama installed for local chat models (qwen2.5, llama3.1, etc.), though I had mostly stopped using them once I got Opus 4.6 access. The key insight: Ollama exposes an **OpenAI-compatible API** at `localhost:11434/v1/`. That means any tool expecting an OpenAI embeddings endpoint can point at Ollama instead.

I pulled the `nomic-embed-text` model (274MB) and configured OpenClaw to use it:

```yaml
# OpenClaw gateway config (relevant sections)
memory:
  backend: "builtin"

agents:
  defaults:
    memorySearch:
      provider: "openai"
      remote:
        baseUrl: "http://localhost:11434/v1/"
      model: "nomic-embed-text"
      fallback: "none"
```

That's it. The `provider: "openai"` setting tells OpenClaw to use the OpenAI-compatible endpoint format. The `baseUrl` points at Ollama instead of OpenAI's servers. The `fallback: "none"` means if Ollama is down, memory search just silently skips rather than falling back to a cloud provider.

I deleted the old SQLite index to force a fresh reindex with the new nomic-embed-text vectors, restarted the gateway, and it just worked.

## How It Works

The flow is simple:

1. **Indexing**: OpenClaw watches my workspace files (memory logs, MEMORY.md, project notes). When files change, it chunks the text and sends each chunk to Ollama for embedding. The vectors get stored in a local SQLite database.

2. **Retrieval**: When a new session starts, OpenClaw takes the conversation context and embeds it using the same model. It then does a similarity search against the stored vectors to find the most relevant chunks.

3. **Injection**: The top matching chunks get injected into the session context automatically. The AI sees relevant history without me pasting anything.

All of this happens on my local GPU (16GB VRAM). The nomic-embed-text model is tiny compared to chat models. It sits comfortably alongside whatever else I'm running.

## The Checkpoint Workflow

The new workflow replaced handoff letters entirely:

1. Work normally throughout the session
2. Before ending, update `memory/YYYY-MM-DD.md` with what happened
3. Update `MEMORY.md` if anything is worth keeping long-term
4. Reset the session

That's the whole process. No handoff letter generation. No copy-pasting context back in. Next session, memory search finds the relevant notes automatically based on what I'm asking about.

## Results

After switching to Ollama-powered memory search:

**Zero cloud API calls.** Every embedding runs on local hardware. No API keys, no quota limits, no 429 errors, no billing surprises.

**Instant retrieval.** Embedding a query and searching the vector store takes milliseconds on GPU. The bottleneck is now network latency to the AI provider, not the memory system.

**No handoff friction.** I tested this by asking about obscure topics from previous sessions. Searching for "memory search backend provider setup" correctly surfaced my Ollama configuration notes from MEMORY.md. Searching for a nonsense term ("iklana memory backend") correctly returned zero results with no hallucination. The system retrieves what exists and stays quiet when nothing matches.

**Validation numbers.** Early tracking shows 2/2 correct retrievals, 0 hallucinations. The week I set this up, overall token usage dropped 78.7% (though that also coincided with a model switch from Opus 4.5 to 4.6, so I'm still isolating the memory search impact specifically).

## The Bigger Picture

The real win isn't technical. It's workflow. I no longer think about context transfer between sessions. I just write things down as I go (which I should be doing anyway), and the system handles the rest.

If you're running OpenClaw or any system that supports OpenAI-compatible embedding endpoints, try pointing it at a local Ollama instance. The setup takes five minutes. The nomic-embed-text model is 274MB. And you never have to write a handoff letter again.
