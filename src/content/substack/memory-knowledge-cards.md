---
title: "Killing the Monolith: How I Replaced a 62KB Memory File with Atomic Knowledge Cards"
description: "My AI agent's memory was a 62KB wall of text. I broke it into 36 atomic knowledge cards at ~350 tokens each. Here's why it changed everything."
pubDate: 2026-02-28
tags: ["openclaw", "memory", "knowledge-cards", "ai-agent", "optimization"]
---

# Killing the Monolith: How I Replaced a 62KB Memory File with Atomic Knowledge Cards

I asked Roci what port a local API runs on. The answer is in MEMORY.md. Line 847. Roci loaded the file, processed all 62KB of it, and told me it wasn't sure. The information was right there, buried between a paragraph about DNS records and some notes from a Tuesday standup.

That's the moment I realized my agent's memory system was broken. Not because it forgot things, but because it remembered everything at once and couldn't find any of it.

## The Lost-in-the-Middle Problem

MEMORY.md started clean. Project notes, infrastructure details, a few preferences. Then weeks of daily use happened. Every decision, every port number, every lesson learned got appended to the same file. 62KB. Roughly 15,000 tokens loaded into context every single session.

Here's what nobody warns you about large context windows: models don't read them evenly. There's a well-documented phenomenon called "lost in the middle" where models pay strong attention to the beginning and end of their context but get fuzzy on everything between. When your memory file is 15,000 tokens, most of it sits in that fuzzy zone.

I tried organizing it. Headers, sections, categories. It helped a little. But the fundamental problem was structural. You can't make a model reliably attend to 15,000 tokens of dense, varied information no matter how well you format it.

The cost was also getting stupid. Every session started with a 15,000 token tax just to load memory. A simple weather check carried the full weight of my infrastructure documentation, project history, and personal preferences. That's like packing your entire closet for a trip to the grocery store.

## Ripping It Apart

The fix was obvious in hindsight. Stop treating memory as one document. Treat it as a collection of small, searchable units.

I broke MEMORY.md into 36 knowledge cards. Each card covers exactly one topic, runs about 350 tokens, and lives as its own markdown file with YAML frontmatter. Here's a real one:

```markdown
---
topic: Dev Server Port Assignments
category: infrastructure
tags: [ports, dev-servers, wsl, networking]
updated: 2026-02-20
---

# Dev Server Port Assignments

Dedicated port range for dev services. All served from WSL sandbox.

| Port | Service |
|------|---------|
| xxxx | Main/Template preview |
| xxxx | Model Arena |
| xxxx | Prompt Library API |
| xxxx | Code Search API |
| xxxx | Dev Tools API |

Start with: dev-server <project> [port]
Access from network: http://<host-ip>:<port>
```

One card. One topic. Everything about port assignments and nothing about Cloudflare, Tuesday's decisions, or what model to use for code review.

## The Slim Index

MEMORY.md still exists, but it's 2KB now. It's a routing document that tells the agent how memory works:

```markdown
- Master index: MEMORY.md (~2KB) - loaded every session
- Knowledge cards: memory/cards/*.md (~36 cards, ~350 tokens each)
- Daily notes: memory/YYYY-MM-DD.md - raw daily logs

Search first, load second.
```

That last line is the whole strategy. The agent doesn't load all 36 cards on startup. It loads the 2KB index, understands the system, and searches for relevant cards only when it needs them. A session about blog posts loads writing preference cards. A session about infrastructure loads port and server cards. Nothing else.

## Why 350 Tokens

I tested different card sizes before landing here.

Too small (under 200 tokens) and you split related information across multiple cards. The port assignments table above only makes sense as one unit. Splitting it into "ports 5173-5177" and "ports 5199-5204" creates two cards that both need to be loaded together anyway, defeating the purpose.

Too large (over 500 tokens) and you start recreating the original problem. A 600-token card about "infrastructure" that covers ports, DNS, SSH, and PM2 means loading PM2 details when you only asked about DNS.

350 tokens is the sweet spot where each card is self-contained, focused on one topic, and small enough that the model actually reads it properly when it enters context. Every card I've written fits naturally at this size without forcing or padding.

## The YAML Frontmatter

Each card's frontmatter isn't decoration. It serves the search pipeline directly.

```yaml
---
topic: Human-readable title
category: infrastructure | project | preference | tool | lesson
tags: [searchable, terms, for, retrieval]
updated: 2026-02-20
---
```

The tags feed into semantic search. When the embedding model (nomic-embed-text, running locally on GPU) processes a card, the frontmatter gives it strong signals about content. Searching "which port is the prompt library on" hits tags like `ports` and `dev-servers` and surfaces the right card immediately. No digging through thousands of lines.

The `updated` field handles staleness. If a card hasn't been touched in weeks and the domain has changed, the agent treats it with appropriate skepticism. Information has a shelf life. The frontmatter makes that visible.

## The Workflow Now

The day-to-day is simple:

1. Agent wakes up, loads MEMORY.md (2KB). Knows how to find things.
2. Task starts. Agent runs semantic search against the card collection.
3. Two to four relevant cards load into context. Usually 700 to 1,400 tokens total.
4. Agent works with focused, relevant memory.

Creating new cards is just writing a new file. When the agent learns something worth keeping (a new infrastructure detail, a lesson from a failed build, a user preference), it writes a card instead of appending to a monolith. When something changes (new port, updated project status), it updates the specific card.

No card has ever needed to reference another card. That was a design goal. If a card can't stand alone, it's either too narrow (merge it) or trying to cover too much (split it).

## The Numbers

Before:
- Startup memory load: ~15,000 tokens
- Relevant information in that load: maybe 500 to 1,000 tokens
- Signal-to-noise: roughly 5% useful content per session

After:
- Startup memory load: ~500 tokens (the 2KB index)
- Per-query card loads: ~700 to 1,400 tokens (2-4 relevant cards)
- Signal-to-noise: almost everything loaded is relevant

That's a 10x reduction in memory tokens with better recall. The agent finds the right port on the first try now. Not because the information changed, but because it's no longer buried on line 847 of a 62KB file.

## What I'd Do Differently

I waited too long. MEMORY.md grew for weeks before I dealt with it. The migration took an afternoon of reading the old file, identifying natural topic boundaries, and writing cards. If I'd started with cards from day one, there would have been no migration at all.

The category system could be more granular. "Infrastructure" covers ports, DNS, SSH, and GPU setup. They're separate cards, but the category doesn't distinguish them. Tags compensate, but a subcategory field might be worth adding eventually.

The backup of the original 62KB MEMORY.md still exists at `memory/MEMORY-backup-2026-02-20.md`. I haven't opened it once since the migration. That tells you everything about whether the cards captured what mattered.

## Key Takeaways

1. Monolithic memory files degrade model performance through the lost-in-the-middle problem. Break them into atomic units.
2. 350 tokens per card is the sweet spot: self-contained, focused, and small enough for reliable model attention.
3. YAML frontmatter with topic, category, and tags makes semantic search dramatically more effective. It's nearly free in token cost.
4. Search first, load second. Only pull cards relevant to the current task. The 2KB index plus targeted loading beats a 62KB dump every time.
5. Start with cards from day one. Migrating later works, but you'll wish you hadn't waited.
