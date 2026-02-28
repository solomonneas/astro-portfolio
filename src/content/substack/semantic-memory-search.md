---
title: "Why My AI Agent Stopped Forgetting Things: Semantic Search with Ollama"
description: "Keyword search can't find what your AI agent needs. Semantic search with Ollama's nomic-embed-text can. Here's how I built it and why it actually works."
pubDate: 2026-02-28
tags: ["semantic-search", "ollama", "nomic-embed-text", "embeddings", "ai-agent", "memory"]
---

# Why My AI Agent Stopped Forgetting Things: Semantic Search with Ollama

I searched my memory files for "cloudflare dns" and got nothing. The card existed. It was titled "DNS Management" and the content mentioned Cloudflare on the third line. But my search was just grep under the hood, and grep doesn't know that "cloudflare dns" and "DNS Management" with Cloudflare in the body are the same thing.

This happened three times in one afternoon. Different searches, same problem. I'd ask for something using natural language, and the system would fail because I didn't use the exact words I'd written down weeks earlier. Keyword search treats text like a string-matching puzzle. My brain doesn't work that way, and neither should my agent's memory.

## The Gap Between Searching and Finding

Before semantic search, memory retrieval was grep with extra steps. The agent would search for a string, find files containing that string, and load them. This works perfectly when you remember the exact phrase you used when you wrote something.

You never remember the exact phrase.

Some real failures from my logs:

- "how to start dev servers" found nothing. The card documented the `dev-server` command.
- "which model for code review" found nothing. The card described "GPT 5.3 Codex" as the review tool.
- "what port is code search on" found nothing. The card was titled "Dev Server Port Assignments" with the port listed in a table.

Every one of these is a connection a human makes instantly. The information existed. The search couldn't bridge the gap between how I asked and how I'd written it down.

## nomic-embed-text: The $0 Solution

Ollama runs embedding models locally. I use nomic-embed-text, a 137M parameter model that converts text into 768-dimensional vectors. The vectors capture meaning, not just characters. When two pieces of text mean similar things, their vectors point in similar directions regardless of whether they share any words.

"What port is code search on?" and "Code Search API: port 5204" produce vectors with high cosine similarity. The model understands the relationship without being told.

The model runs entirely on my GPU. No API calls, no tokens burned, no network latency. A single embedding takes about 10ms.

```bash
# Generate an embedding locally, ~10ms
curl -s http://localhost:11434/api/embeddings \
  -d '{"model": "nomic-embed-text", "prompt": "Where is the prompt library?"}' \
  | python3 -c "import sys,json; v=json.load(sys.stdin)['embedding']; print(f'Dimensions: {len(v)}')"

# Output: Dimensions: 768
```

137M parameters. That's tiny. It barely touches VRAM. You could run this on a laptop GPU and still have room for everything else.

## How the Pipeline Works

Three stages: index, query, retrieve.

**Indexing** happens when knowledge cards are created or updated. Each card's full content (including YAML frontmatter, which gives the embedding model strong topic signals) gets run through nomic-embed-text. The resulting vector gets stored alongside the card's file path in a local SQLite database.

```python
def index_card(card_path: str):
    content = Path(card_path).read_text()
    embedding = ollama_embed(content)
    db.execute(
        "INSERT OR REPLACE INTO cards (path, content, embedding) VALUES (?, ?, ?)",
        [card_path, content, serialize_vector(embedding)]
    )
```

**Querying** takes whatever the agent is looking for, embeds it through the same model, and compares it against every stored vector using cosine similarity. The math is straightforward: dot product of two normalized vectors. Higher score means closer meaning.

```python
def search_cards(query: str, top_k: int = 5):
    query_vec = ollama_embed(query)
    results = []
    for row in db.execute("SELECT path, content, embedding FROM cards"):
        similarity = cosine_similarity(query_vec, deserialize_vector(row['embedding']))
        results.append((row['path'], row['content'], similarity))
    results.sort(key=lambda x: x[2], reverse=True)
    return results[:top_k]
```

**Retrieval** loads the top matching cards into context. Usually 2 to 4 cards, each around 350 tokens. The agent gets exactly the memory it needs and nothing else.

## The Results

Here's what changed when I switched from keyword to semantic search:

| Query | Keyword Result | Semantic Result |
|-------|---------------|-----------------|
| "what port is code search on" | No match | Dev Server Port Assignments (0.89) |
| "how does the agent learn from mistakes" | No match | Self-Improvement Protocol (0.84) |
| "cloudflare token" | Wrong card (partial match) | Cloudflare DNS Config (0.91) |
| "which model for writing PRDs" | No match | Model Selection Rules (0.87) |

The similarity scores are cosine similarity, 0 to 1. Anything above 0.75 is a strong match. The system consistently finds the right card even when the query shares zero words with the card title.

That "cloudflare token" search is worth highlighting. Keyword search found a card that happened to contain the word "token" in a different context (API tokens for a different service). Semantic search understood I was asking about Cloudflare's DNS configuration and surfaced the correct card. Keyword search matches characters. Semantic search matches intent.

## Why Not Just Use OpenAI's Embedding API?

I could. It's high quality and easy to integrate. But every call would cost tokens and require a network round-trip. My agent does dozens of memory searches per session. At scale, that adds up in both cost and latency.

With Ollama running locally:

- **Cost: $0.** The model runs on hardware I already own.
- **Latency: ~10ms.** No DNS, no TLS handshake, no API queue. Just local inference.
- **Privacy: total.** My knowledge cards contain infrastructure details, port numbers, internal decisions. None of that leaves my machine.
- **Availability: 100%.** No outages. No rate limits. If my workstation is on, search works.

The quality tradeoff is real but irrelevant for my use case. OpenAI's `text-embedding-3-large` is better on benchmarks. For searching across 36 knowledge cards about my own projects, nomic-embed-text has never failed to surface the right card. Benchmark performance matters when you're searching millions of documents. At my scale, the local model is more than sufficient.

## The Hybrid Approach

Pure semantic search has one blind spot: exact matches. If you search "port 5204" and a card contains that exact string, semantic search might rank it slightly below a more conceptually similar card about "API endpoints" because the meaning vectors are close. Keyword search would nail it instantly.

So I use both. The Code Search API at port 5204 runs hybrid mode by default:

```bash
curl -s -X POST http://localhost:5204/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "port 5204", "mode": "hybrid", "limit": 5}'
```

Hybrid runs keyword and semantic search in parallel, then merges results. Exact matches get boosted. Semantic matches fill in what keywords miss. I haven't found a query that stumps the hybrid approach.

## Embedding Model Selection

I tested three models before settling:

- **all-minilm** (33M params): Fast but imprecise. Confused related-but-distinct topics. Searching "port assignments" sometimes returned the PM2 process management card instead.
- **nomic-embed-text** (137M params): The sweet spot. Reliable semantic connections, fast inference, fits easily alongside other models in 16GB VRAM.
- **mxbai-embed-large** (335M params): Slightly better quality on edge cases but noticeably slower. For 36 cards, the improvement didn't justify the extra VRAM and latency.

If you're indexing thousands of documents, the larger model might be worth it. For a personal knowledge base under a few hundred cards, nomic-embed-text is the right call.

## What This Actually Changed

The technical details matter less than what they enable. Semantic search over knowledge cards changed how my agent works day to day.

**Natural queries work.** I don't have to remember card titles or tags. I describe what I need in plain language and the right cards surface. This sounds small. In practice, it's the difference between an agent that finds things reliably and one that says "I'm not sure" when the answer is sitting in its own memory.

**Context stays lean.** The agent loads only relevant cards per task. A coding session gets infrastructure and project cards. A writing session gets preference and content cards. No 15,000 token tax on every session.

**New knowledge integrates automatically.** When a new card gets written, it gets indexed. The next semantically related search finds it. No manual wiring, no tag maintenance (though tags still help).

**Zero ongoing cost.** After setup, every search is free. The GPU handles it. No API bills accumulating quietly in the background.

## Key Takeaways

1. Keyword search fails when your query uses different words than your stored knowledge. This happens constantly in practice. Semantic search matches meaning instead of strings.
2. nomic-embed-text runs locally on Ollama, costs nothing, and produces embeddings in ~10ms. More than sufficient for knowledge bases under a few hundred documents.
3. Hybrid search (keyword plus semantic) beats either approach alone. Use both.
4. Local embeddings keep your knowledge on your machine. Full privacy, zero latency, no API dependency.
5. The real win is natural language retrieval. Your agent describes what it needs and finds it. That's the difference between memory that works and memory that exists but can't be accessed.
