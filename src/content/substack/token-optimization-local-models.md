---
title: "The Model Chain: How I Route AI Tasks by Complexity Instead of Burning Money"
description: "Ollama (free) → Haiku ($1/M) → GPT 5.3 Codex → Opus 4.6. Every task gets the cheapest model that can handle it well. Here's the system."
pubDate: 2026-02-28
tags: ["token-optimization", "model-routing", "ollama", "haiku", "opus", "codex", "ai-agent"]
---

# The Model Chain: How I Route AI Tasks by Complexity Instead of Burning Money

I caught Opus running `grep -rn "TODO" --include="*.py"` across my codebase last month. Opus. The model I pay $200/month for specifically because it's the best at reasoning, planning, and creative work. Doing a grep.

That's like hiring a surgeon to take your temperature. The output was correct. The cost was absurd. Every token Opus spent reading file paths and matching strings was a token it could have spent on architecture planning or content creation. The things it's actually good at.

That grep was the last straw. I built a routing system where every task gets assigned to the cheapest model that handles it well. Not the cheapest model, period. The cheapest model that produces quality output for that specific type of work.

## The Four Tiers

### Tier 1: Ollama on Local GPU (Free)

Two models running on my RTX 4060 Ti, 16GB VRAM. Zero cost per query, no matter how many times they run.

**nomic-embed-text** (137M params) handles all embedding operations. Memory search across 36 knowledge cards. Code indexing across 40+ repos. Semantic similarity for the Code Search API. About 10ms per embedding. It runs thousands of times per day.

**qwen2.5:14b** handles code summarization during indexing. It reads source files and generates natural language descriptions that make the Code Search API's summary mode work. Two to three seconds per summary, runs during the nightly 4am index rebuild.

```bash
# Embedding: free, ~10ms
curl -s http://localhost:11434/api/embeddings \
  -d '{"model": "nomic-embed-text", "prompt": "authentication middleware"}'

# Summarization: free, ~2-3 seconds
curl -s http://localhost:11434/api/generate \
  -d '{"model": "qwen2.5:14b", "prompt": "Summarize this function: ..."}'
```

If I paid for these operations through an API, the embedding volume alone would cost real money over a month. Locally, it's just GPU time I already own.

### Tier 2: Haiku 4.5 ($1/M input, $5/M output)

The workhorse for mechanical tasks. Haiku is smart enough to follow instructions reliably, fast enough to not block workflows, and cheap enough that I don't think about token counts.

What Haiku does: scanning directories, reporting file structures, running grep operations, find-and-replace across many files, boilerplate generation from clear templates, simple data extraction.

My agent is explicitly forbidden from running these operations directly. The rule is enforced, not suggested:

```markdown
If your exec command contains ANY of these words,
YOU ARE VIOLATING THIS RULE:
grep, find, cat, head, tail, wc, ls, awk, sed, rg, fd, tree

Delegate to the coder agent (Haiku 4.5).
```

Opus costs $15/M input, $75/M output. Haiku costs $1/$5. For a grep that produces identical results from either model, the cost difference is 15x on input and 15x on output. There is no argument for running mechanical operations through a frontier model.

### Tier 3: GPT 5.3 Codex ($200/mo flat)

Codex handles structured code generation on OpenAI's Pro plan. Effectively unlimited usage through the Codex CLI.

What Codex does: code generation from specs, code reviews, test generation, documentation, bulk refactors with clear patterns.

```bash
# Code review
codex exec review -c 'model="gpt-5.3-codex"'

# Implementation from spec
codex exec --full-auto "implement auth middleware per docs/auth-spec.md"
```

Codex is particularly good when you hand it a well-written spec. Give it a PRD with endpoint schemas, error handling requirements, and database structure, and it produces working code. Not "working but needs three fixes" code. Working code.

### Tier 4: Opus 4.6 ($200/mo flat via Max plan)

The brain. Opus handles everything that requires actual reasoning.

Architecture planning. PRD writing. Research and analysis. Content creation. Complex decision-making. Orchestrating the other models. Anything where the quality of thinking directly impacts the outcome.

Opus doesn't scan files. It doesn't write boilerplate. It doesn't generate embeddings. It thinks, plans, decides, and creates. Everything mechanical gets pushed down the chain.

## The Routing Question

When a task arrives, I ask one thing: does this require thinking or scanning?

**Scanning** is mechanical. Reading files, searching text, counting things, matching patterns. Any model produces the same result. Use the cheapest one.

**Thinking** is creative. Making judgments, planning architecture, writing content that sounds human, deciding between approaches when both have tradeoffs. This needs the best model available.

The gray area is code generation. Simple boilerplate goes to Haiku. Structured implementation from a clear spec goes to Codex. Novel problem-solving where the approach isn't obvious goes to Opus for planning, then Codex for implementation.

The spec handoff is the key pattern. Opus writes a detailed PRD (it's very good at anticipating edge cases and failure modes). Codex implements it. The PRD costs maybe 2,000 tokens of Opus output. The implementation runs through Codex on a flat rate. The resulting code is better than what either model would produce alone because the planning and execution are each handled by the model best suited for them.

## A Typical Day

| Model | Operations | Cost |
|-------|-----------|------|
| Ollama (nomic-embed) | ~200 embeddings | $0 |
| Ollama (qwen2.5) | ~15 summaries | $0 |
| Haiku 4.5 | ~30 file scans and searches | ~$0.50 |
| GPT 5.3 Codex | ~5 code gen/review tasks | $0 (flat rate) |
| Opus 4.6 | ~20 planning/content/orchestration | $0 (flat rate) |

Daily variable cost: about fifty cents in Haiku tokens.

Before this system, everything ran through Opus. The same day's work on pay-per-token Opus pricing would cost $10 to $20. The flat-rate plans for Opus and Codex change the math significantly. I'm not conserving tokens on those two since I've already paid for unlimited usage. The optimization is about keeping mechanical work on cheap models and not accidentally sending complex tasks to models that'll botch them.

## The Anti-Pattern I Keep Seeing

People try to run everything through the cheapest model. "Why pay for Opus when Haiku is 15x cheaper?" Because the output is 15x worse for anything requiring judgment.

Haiku writing a PRD produces generic, surface-level output that misses edge cases. Haiku planning architecture overlooks failure modes. Haiku writing blog posts sounds like a textbook summary. The savings aren't real if you spend an hour fixing the output or just redo the work with Opus anyway.

The model chain works because each tier genuinely excels at its job. nomic-embed-text is perfect for embeddings. Haiku is perfect for scanning. Codex is perfect for structured code. Opus is perfect for reasoning. Force any of them into the wrong tier and you waste either money (expensive model on cheap work) or quality (cheap model on hard work).

## How to Set This Up

1. **Install Ollama** and pull nomic-embed-text for embeddings. This handles your highest-volume operations for free.
2. **Pick a cheap model** for mechanical tasks. Haiku, GPT-4o-mini, whatever. Route all file operations here.
3. **Use a code model** for implementation. Codex, Claude with focused prompts, whichever you have access to.
4. **Reserve your frontier model** for planning and creative work. Never let it do grunt work.
5. **Write enforcement rules** that can't be rationalized away. The agent will find excuses to skip the chain if you let it. Block every excuse explicitly.

## Key Takeaways

1. Route by cognitive demand. Scanning is cheap, thinking is expensive. Price the model to match the task.
2. Local models handle embeddings and summarization at zero marginal cost. Run them for every high-volume, low-complexity operation.
3. Flat-rate plans change the game. Once you're on Max or Pro, use those models fully. Optimize the variable costs (Haiku) and let the fixed costs do their job.
4. Enforcement rules beat suggestions. If the agent can run grep through Opus, it will. Make the routing mandatory.
5. The spec-to-implementation handoff is the highest-leverage pattern. Opus writes the plan, Codex builds it. Better output from both, cheaper overall.
