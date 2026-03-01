# Coder Agent Model Evolution — Social Drafts

## LinkedIn (Personal)

I just finished a 3-phase migration of my OpenClaw coder subagent: Qwen 14B → Haiku 4.5 → GPT 5.3 Codex.

The surprising part: each model solved one problem and exposed the next.

- Qwen (local, free): weak shell semantics. Treated grep exit code 1 (no matches) like a hard error.
- Haiku (cheap, strong): excellent output, but shared-provider concurrency with Opus caused recurring Anthropic 500s.
- Codex (different provider): no token contention, stable concurrency, clean user-facing reports.

Core lesson: model selection for subagents is architecture, not just cost. If orchestrator and subagent share a provider token under load, reliability can collapse before price matters.

Full post: /blog/coder-agent-model-evolution

#OpenClaw #AIAgents #CostOptimization #AgentArchitecture #DevTools

---

## LinkedIn (Business)

If your orchestrator and subagent share one provider credential, concurrent load can become your hidden failure mode.

We documented a production-style model evolution path for OpenClaw coder routing:

1) Local Qwen 14B: low cost, low reliability for shell-edge behavior
2) Haiku 4.5: high quality, but shared-provider contention caused repeated 500s
3) GPT 5.3 Codex: provider separation restored concurrency stability

This is less about vendor preference and more about architecture boundaries.

Read: /blog/coder-agent-model-evolution

#AgentRouting #ReliabilityEngineering #OpenClaw #MLOps

---

## X / Twitter

Coder subagent model evolution in OpenClaw:
Qwen → Haiku → Codex.

Qwen failed grep semantics.
Haiku worked but collided with Opus on a shared Anthropic API credential under concurrency (500s).
Codex fixed it by provider separation.

Subagent model choice is an architecture decision, not just a pricing one.

/blog/coder-agent-model-evolution

---

## Bluesky

Three coder models later, the real fix was architecture:

- Local Qwen: cheap, weak shell reliability
- Haiku: good output, shared-provider concurrency failures
- Codex: separate provider path, stable concurrent execution

If orchestrator + coder run in parallel, provider isolation matters.

/blog/coder-agent-model-evolution

---

## Mastodon

OpenClaw coder model migration notes:
Qwen 14B → Haiku 4.5 → GPT 5.3 Codex.

The key reliability breakpoint was shared-provider concurrency. When orchestrator and coder both hit Anthropic on the same API credential, we saw repeated 500s and failed continuation flows.

Moving coder to Codex separated provider traffic and stabilized the system.

Thread + writeup: /blog/coder-agent-model-evolution

#OpenClaw #AIAgents #Reliability #CostOptimization
