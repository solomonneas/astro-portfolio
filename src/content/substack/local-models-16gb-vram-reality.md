---
title: "Local Models on 16GB VRAM: An Honest Scorecard After Months of Daily Use"
description: "Running local LLMs on an RTX 4060 Ti. Embeddings and triage are great. Complex reasoning and code generation? I stopped pretending."
pubDate: 2026-02-28
tags: ["local-models", "ollama", "vram", "gpu", "rtx-4060-ti", "embeddings", "honest-take"]
---

# Local Models on 16GB VRAM: An Honest Scorecard After Months of Daily Use

I wanted local models to replace cloud APIs. That was the goal when I started pulling models through Ollama onto my RTX 4060 Ti. Run everything locally, pay nothing, depend on nobody.

Three months later, I've deleted 8 models and freed about 35GB of disk space. The models that remain do specific jobs extremely well. The jobs I wanted them to do most (code generation, architecture planning, complex reasoning) they can't do at all. Not at this VRAM tier.

Here's what actually happened.

## The Models That Survived

Out of everything I tested, four models earn their place on the GPU:

**gemma2:9b** is S-tier. 33.9 tokens per second, consistent output quality, reliable instruction following for its size class. I use it for triage tasks, classification, and quick summaries where I need speed over depth. It's the model I reach for when something needs to be sorted or categorized fast.

**qwen2.5:7b** runs at 43.3 tokens per second. Fastest of the bunch. Handles similar tasks to gemma2 but edges it out on speed when quality requirements are relaxed. Good for high-volume processing where you need throughput.

**qwen2.5-coder:14b** handles code summarization for my Code Search API. During the nightly index rebuild, it reads source files across 40+ repos and generates natural language descriptions. The summaries are accurate enough to power search. It's slower (14B parameters in 4-bit quantization still takes real VRAM) but the overnight schedule means speed doesn't matter.

**nomic-embed-text** (137M params) is the most valuable model on my machine relative to its size. 768-dimensional embeddings in roughly 10ms. Powers all semantic search: memory card retrieval, code search indexing, similarity matching. It barely touches VRAM. I could run five instances and still have room.

## The Eight Models I Removed

I pulled down llama3:8b, mistral:7b, codellama:13b, phi-3:14b, deepseek-coder:6.7b, starcoder2:7b, llama3:70b-q2 (don't ask), and neural-chat:7b. Each one had a reason for being downloaded and a better reason for being deleted.

The common failure: I'd see a benchmark, get excited, pull the model, test it on real tasks, and discover that benchmark performance on curated evaluations doesn't predict real-world usefulness. codellama:13b scored well on HumanEval but produced code I'd never ship. phi-3:14b had impressive reasoning benchmarks but hallucinated steps in multi-part plans. llama3:70b in Q2 quantization technically ran but was so degraded it was worse than the 8B version.

Removing them freed about 35GB. More importantly, it freed me from the temptation to keep trying to make them work for tasks they're not built for.

## What Actually Works

### Embeddings: Perfect Use Case

This is the unambiguous win for local models. Embedding models are small, fast, and the quality gap between local and cloud options is negligible for knowledge bases under a few hundred documents.

nomic-embed-text at 137M parameters produces embeddings that reliably surface the right knowledge card from my collection of 36 cards. It powers the Code Search API across 40+ repos. It runs all day, every day, and I've never seen it fail to find what I'm looking for when the information exists.

```bash
# 10ms, zero cost, never rate-limited
curl -s http://localhost:11434/api/embeddings \
  -d '{"model": "nomic-embed-text", "prompt": "port assignment for code search"}'
```

If I were paying per-token for embeddings at the volume I use them, the monthly bill would be noticeable. Locally, it's invisible.

### Triage and Classification: Solid

"Is this email urgent?" "Is this code change a bug fix or a feature?" "Does this log entry indicate an error?"

These tasks need pattern matching, not deep reasoning. gemma2:9b handles them reliably at 33.9 t/s. The output doesn't need to be brilliant. It needs to be consistent and fast. Local models deliver both.

### Git Commit Messages: Surprisingly Good

Diffs provide all the context. The output is short and formulaic. The model just describes what changed. This is perfectly scoped for a 7B-14B model.

```bash
git diff --cached | ollama run gemma2:9b "Write a concise commit message for this diff:"
```

The results are consistently usable. Not poetry. Accurate and descriptive. Saves the mental overhead of writing commit messages for routine changes, which is most changes.

### Short Document Summarization: Decent

Give a local model a 500-line source file and ask what it does. You'll get a reasonable answer. Main function identified, data flow described, key dependencies noted. That's how my Code Search API generates file summaries during indexing.

The limit: documents over about 2,000 lines lose coherence. The model's effective attention drops off. For long documents, chunk first.

## What Doesn't Work

### Complex Reasoning: Not Close

I tested this head-to-head before setting up my model routing chain. Same prompts, same context, different models. The gap is not incremental. It's categorical.

I asked qwen2.5-coder:14b whether SQLite was appropriate for my Code Search API. It said yes (correct) but missed WAL mode for concurrent reads, didn't mention indexing lock implications, and suggested connection pooling for SQLite. Connection pooling is unnecessary and counterproductive for SQLite. Opus identified all three issues without being asked.

Local models at this parameter count produce output that sounds confident and is frequently incomplete. The failure mode is specific: they generate plausible text that misses edge cases, makes incorrect assumptions, and doesn't consider second-order effects. It reads like a junior developer's first pass. Sometimes that's fine. For decisions your codebase depends on, it's not.

### Code Generation: I Stopped Trying

Local models can generate code that runs. "Runs" and "good" are different things.

Consistent issues across every code-generating local model I tested: missing error handling, naive implementations that don't scale, ignored edge cases, subtle bugs that pass basic tests but fail under real conditions, copy-paste patterns instead of proper abstractions.

I stopped using local models for code generation entirely. Codex (GPT 5.3) on the $200/month Pro plan produces significantly better code and it's effectively unlimited. The quality gap isn't worth arguing about. It's a different league.

### Anything Long-Context: Hardware Wall

16GB VRAM is a hard ceiling. A 14B model in 4-bit quantization uses about 8GB, leaving headroom for maybe 4,000 to 8,000 tokens of context. That's tight for anything beyond short documents.

Loading a 14B model with a 32K context window either runs out of VRAM or falls back to CPU inference, which is 10 to 50x slower. Larger models (30B+) barely fit at all. Aggressive quantization to make them fit further degrades the quality that was supposed to justify their size.

This is the fundamental constraint. The models small enough to run comfortably (7B-14B) lack reasoning capacity for hard tasks. The models with that capacity (30B+) don't fit. Maybe at 48GB or 80GB the story changes. At 16GB, you accept the limitation and route around it.

## The Honest Scorecard

| Task | Local Quality | Use Locally? |
|------|-------------|-------------|
| Embeddings | Excellent | Always |
| Classification/triage | Good | Yes |
| Commit messages | Good | Yes |
| Short summarization | Good | Yes |
| Code generation | Poor to mediocre | No |
| Architecture planning | Poor | No |
| Complex reasoning | Poor | No |
| Long-context analysis | Hardware limited | No |

The pattern is clean. Local models excel at tasks that are narrow, well-defined, and don't require deep reasoning. They fail at tasks requiring creativity, judgment, or complex state tracking. The line between those categories is sharp and predictable.

## What I'd Tell Someone Starting Out

**Use local models for embeddings.** This is the highest-value use case by far. Zero cost, great quality, massive volume without API bills. Install Ollama, pull nomic-embed-text, and start embedding things. You'll find uses for it immediately.

**Use local models for triage.** Classification, sorting, categorization. The model doesn't need to be brilliant. It needs to be consistent. Local models are consistent at these tasks.

**Don't pretend local replaces cloud for reasoning.** The hype makes it sound possible. It's not at 16GB. Be honest about the gap and route tasks appropriately. Hybrid (local for volume, cloud for quality) is the answer, not either/or.

**Curate ruthlessly.** I went from 12 models to 4. Each removal made the system simpler, freed resources, and eliminated the temptation to use a model for something it couldn't actually do. If a model isn't earning its disk space, delete it.

**16GB is the minimum for useful local inference.** Below that, you're limited to tiny models that aren't worth the setup. Above that (24GB+), the viable model range expands significantly. If you're buying a GPU for local AI, 16GB is the floor, not the target.

## Key Takeaways

1. 16GB VRAM supports embeddings, triage, classification, and short summarization. Not complex reasoning or quality code generation.
2. nomic-embed-text is the highest-value local model per byte of VRAM. Embeddings in 10ms for free, powering every search operation in my stack.
3. The quality gap between local 14B models and frontier cloud models is enormous for reasoning tasks. Benchmarks don't capture this accurately. Real-world testing does.
4. Curate your model collection. Four focused models beat twelve unfocused ones. Delete what doesn't earn its keep.
5. Local models don't replace cloud. They eliminate API costs for high-volume, low-complexity operations that accumulate quietly. That's their real value.
