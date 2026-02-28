---
title: "Why I Pay $200/Month for Opus 4.6 and Don't Think Twice"
description: "Opus handles orchestration, PRDs, architecture, and creative work. It's expensive. Nothing else comes close for the tasks where thinking quality determines the outcome."
pubDate: 2026-02-28
tags: ["opus", "anthropic", "max-plan", "orchestration", "prd", "creative-work", "ai-agent"]
---

# Why I Pay $200/Month for Opus 4.6 and Don't Think Twice

I asked Haiku to plan a migration from SQLite to distributed PostgreSQL. It gave me a numbered list: set up Postgres, migrate the schema, update connection strings, test, deploy. Five steps. All correct at a surface level. All missing the things that actually matter.

No phased rollout strategy. No mention of read replicas for a read-heavy workload. No rollback procedure if the cutover fails. No discussion of what to monitor during migration. No awareness that connection pooling (PgBouncer) becomes essential once you're off SQLite. Five clean steps that would fail in production.

I gave the same prompt to Opus. It came back with a four-phase plan: prepare (shadow writes, dual-path reads), cutover read traffic, cutover write traffic, cleanup. Each phase had its own rollback procedure. It identified PgBouncer as necessary, specified which metrics to watch (replication lag, connection pool saturation, query latency percentiles), and noted the CAP theorem implications of the target architecture.

That's the gap. That's why I pay $200/month.

## What Opus Actually Does in My Stack

My usage falls into three categories, and each one demonstrates why cheaper models don't cut it.

### Orchestration

Running one AI agent is straightforward. Running a system where Opus coordinates Haiku sub-agents, Codex for code generation, local Ollama models for embeddings, and three local APIs for knowledge retrieval is not. Someone has to decide what happens in what order, which model handles which part, and what to do when something fails.

That's Opus. It evaluates incoming tasks, determines which resources to use, delegates mechanical work to cheaper models, handles the creative and judgment-heavy parts directly, and adapts when things go wrong.

A content writing task, for example: Opus decides which research sources to query (Code Search, Agent Intel, web search), determines whether to delegate fact-gathering to Haiku or handle it directly, structures the content plan, then writes the actual piece. The delegation decisions alone require understanding what each model in the chain can and can't do. Cheaper models don't have that meta-awareness.

### PRD Writing

A good PRD does more than list features. It anticipates edge cases, considers failure modes, evaluates tradeoffs, and includes enough implementation detail that the coder model doesn't have to guess.

I write PRDs with Opus and hand them to Codex for implementation. The resulting code works on the first pass. Not "works but needs three fixes." Works.

Real example: I asked Opus to write a PRD for my Code Search API. The output included API endpoint specs with request/response schemas, database schema with justified indexes, embedding strategy with model selection rationale, hybrid search algorithm description, deployment notes (PM2, SQLite, Ollama dependency), error handling for when Ollama isn't running, and rate limiting considerations.

I handed that to Codex. Zero implementation changes needed.

The things Opus included unprompted are the things that matter. What happens when the embedding service is down? Which SQLite indexes does this query pattern actually need? Should hybrid search weight keyword or semantic results more heavily for this dataset? A cheaper model would give me the endpoint list and database schema. It wouldn't think through the implications.

### Creative Work

Writing content that doesn't sound AI-generated is genuinely hard. Most models have tells: overuse of certain phrases, generic structure (intro, three points, conclusion), a stiffness that reads like a textbook summary.

Opus writes content I actually publish. All my portfolio pages, blog posts, social media drafts. The quality difference shows in specific ways.

**Voice consistency.** Opus internalized my voice from SOUL.md and applies it across thousands of words and multiple sessions. My posts sound like me, not like a language model's idea of "professional but approachable."

**Structure that serves the content.** Instead of defaulting to the same template, Opus structures each piece based on what the material needs. Sometimes narrative. Sometimes a deep technical dive. Sometimes a problem-solution-result arc. The structure follows the content, not the other way around.

**Specifics over generics.** "The Code Search API at port 5204" instead of "a search service." "33.9 tokens per second on gemma2:9b" instead of "fast inference speeds." Opus pulls concrete details from context instead of reaching for vague placeholders.

The no-em-dash rule is a good litmus test. Most models overuse em dashes because they're frequent in training data. Opus follows the constraint consistently across complex sentences. Not because it's special syntax, but because it actually parses the rule and applies it. Cheaper models slip within a few paragraphs.

## What Opus Doesn't Do

Equally important: what I never ask Opus to handle.

**File scanning.** Grep, find, ls, cat. All delegated to Haiku at $1/M input versus Opus at $15/M. The output is identical. The cost difference is 15x.

**Routine code.** Once the PRD exists, Codex implements it. Codex is better at structured code generation and runs on a flat-rate plan. Opus writing boilerplate is waste.

**Embeddings.** Ollama handles these locally for free in 10ms. Not even a question.

The orchestration role is knowing these boundaries. Opus decides what needs to happen. Cheaper tools execute. The model that's best at thinking shouldn't spend its context window on mechanical work.

## The Economics

At $200/month, the Max plan only makes sense at sufficient volume. Here's my usage:

- Opus turns per day: 15 to 30
- Average tokens per turn: ~4,000 input, ~2,000 output
- Estimated daily cost at pay-per-token rates: $75 to $150
- Estimated monthly at pay-per-token: $2,250 to $4,500

The Max plan saves me over $2,000/month at my usage level. Even at half my volume, it breaks even. Below that, pay-per-token is smarter.

But the real value isn't the dollar savings. It's the mental freedom. I never hesitate to iterate because I'm watching a meter. I explore ideas freely. I ask follow-up questions without calculating cost. I use thinking mode when a problem is hard. That freedom produces better work than any amount of careful token budgeting.

## When Opus Is Overkill

Not everyone needs this. You probably don't if your AI usage is occasional rather than daily, your tasks are well-defined and don't require judgment, you're comfortable editing "good enough" output into shape, or your budget is tight and you'd rather trade time for money.

Opus is for people building complex systems, writing content at scale, or doing work where thinking quality directly affects outcomes. If you're shipping code to production, publishing under your name, or making architecture decisions that compound over months, the gap between Opus and everything else matters. If you're writing personal scripts and occasional emails, it doesn't.

## The Core Argument

Don't penny-pinch on the brain.

I optimize aggressively everywhere else. Local models for embeddings. Haiku for file scanning. SQLite instead of Postgres. PM2 instead of Kubernetes. Every part of my stack is cost-conscious.

But the model that plans the architecture, writes the specs, creates the content, and orchestrates everything else? That gets the best I can afford. Because every downstream decision, every piece of code, every published word flows from the quality of that model's thinking. Saving $100/month on a worse orchestrator costs more than $100/month in worse outcomes.

The chain is only as good as the brain at the top.

## Key Takeaways

1. Opus operates in a different category for orchestration, PRD writing, and creative work. The quality gap versus cheaper models isn't incremental. It's structural.
2. Good PRDs anticipate edge cases and include implementation detail that lets coder models produce working code on first pass. This is where Opus pays for itself most directly.
3. Orchestration requires maintaining system state, making delegation decisions, and adapting to failures. Only frontier models handle this reliably.
4. The Max plan economics work at scale. If your pay-per-token bill would exceed $200/month, the flat rate saves money and removes friction.
5. Optimize the cheap stuff aggressively. Local embeddings, cheap models for scanning, simple infrastructure. Then give the thinking model every token it needs. The brain is the wrong place to cut costs.
