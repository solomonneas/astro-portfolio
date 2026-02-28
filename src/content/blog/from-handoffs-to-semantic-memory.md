---
title: "I Killed Handoff Letters With a 274MB Embedding Model"
pubDate: 2026-02-09
description: "How I replaced manual AI session handoffs with local GPU-powered semantic search using Ollama and nomic-embed-text. Zero cloud calls, instant retrieval, no more copy-pasting context."
tags: ["ollama", "semantic-search", "embeddings", "local-ai", "openClaw", "developer-tools", "gpu"]
---

# I Killed Handoff Letters With a 274MB Embedding Model

Every AI assistant has the same problem: amnesia. You spend hours building context, making architecture decisions, debugging weird edge cases. Then the session ends and the AI forgets you exist.

I fixed this with a local GPU, Ollama, and a tiny embedding model. No cloud APIs. No billing surprises.

## The Handoff Letter Era

I run [OpenClaw](https://openclaw.dev), an AI assistant framework that orchestrates multiple models (Claude Opus 4.6, GPT 5.3, Gemini, local Ollama). My main agent, [redacted-host], handles everything from code reviews to portfolio management across 30+ projects. The problem: every new session starts from zero.

My workaround was handoff letters. End of session, I'd generate a structured markdown doc summarizing everything. Next session, paste it back in. The AI reads it and picks up where it left off.

It worked. Barely.

The letters got long. Important details got buried under noise. I was spending real time curating these documents instead of doing actual work. And if I forgot to generate one? Total context loss.

## Three Attempts That Didn't Work

**Attempt 1: OpenAI Embeddings.** Default config pointed at OpenAI's API. I was on the $20/mo Plus plan (OAuth only, no per-token billing). Every search attempt returned a 429 rate limit error. Dead on arrival.

**Attempt 2: QMD (Quantized Model Daemon).** OpenClaw ships with local embedding support via QMD. I got it running, downloaded the models. The problem: QMD loads a 2.2GB model into memory for every single subprocess call. Each query spawned a fresh process, loaded the model, ran one embedding, then exited. Timed out consistently.

**Attempt 3: Built-in local provider.** EmbeddingGemma, 300MB GGUF model via node-llama-cpp. This actually worked, but it was CPU-bound and noticeably slow.

None of these felt right. I needed fast, local, and persistent.

## The Fix: Ollama + nomic-embed-text

I already had Ollama installed for local chat models. The key insight: Ollama exposes an OpenAI-compatible API at `[redacted-service]/v1/`. Any tool expecting OpenAI's embedding endpoint can point at Ollama instead.

Pulled `nomic-embed-text` (274MB), updated the config:

```yaml
memory:
  backend: "builtin"

agents:
  defaults:
    memorySearch:
      provider: "openai"
      remote:
        baseUrl: "http://[redacted-service]/v1/"
      model: "nomic-embed-text"
      fallback: "none"
```

The `provider: "openai"` tells OpenClaw to use the OpenAI-compatible endpoint format. The `baseUrl` points at Ollama. The `fallback: "none"` means if Ollama is down, memory search silently skips instead of hitting a cloud provider.

Deleted the old SQLite index, restarted the gateway. It just worked.

## How It Actually Works

1. **Indexing**: OpenClaw watches my workspace files (memory logs, MEMORY.md, project notes). When files change, it chunks the text and sends each chunk to Ollama for embedding. Vectors stored in local SQLite.

2. **Retrieval**: New session starts, OpenClaw embeds the conversation context with the same model. Similarity search against stored vectors finds the most relevant chunks.

3. **Injection**: Top matches get injected into session context automatically. The AI sees relevant history without me pasting anything.

All on my local GPU (16GB VRAM). nomic-embed-text is tiny compared to chat models. It sits comfortably alongside whatever else I'm running.

## The New Workflow

No more handoff letters. Now it's just:

1. Work normally
2. Before ending, update `memory/YYYY-MM-DD.md` with what happened
3. Update `MEMORY.md` if anything is worth keeping long-term
4. Reset the session

Next session, memory search finds the relevant notes automatically based on what I'm asking about. That's it.

## Numbers

**Zero cloud API calls.** Every embedding runs on local hardware. No keys, no quotas, no 429 errors.

**Millisecond retrieval.** Embedding a query and searching the vector store is near-instant on GPU.

**It actually works.** I tested by asking about obscure topics from previous sessions. Searching "memory search backend provider setup" correctly surfaced my Ollama config notes from MEMORY.md. Searching a nonsense term ("iklana memory backend") correctly returned zero results. No hallucination. The system retrieves what exists and stays quiet when nothing matches.

Early tracking: 2/2 correct retrievals, 0 hallucinations. Token usage dropped 78.7% the week I set this up (though that also coincided with a model switch from Opus 4.5 to 4.6, so I'm still isolating the memory search impact).

## Why This Matters

The real win isn't technical. It's workflow. I stopped thinking about context transfer between sessions. I just write things down as I go (which I should be doing anyway) and the system handles the rest.

If you're running OpenClaw or anything that supports OpenAI-compatible embedding endpoints, point it at a local Ollama instance. Five minute setup. 274MB model. Never write a handoff letter again.
