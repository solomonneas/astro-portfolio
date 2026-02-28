---
title: "Coder Agent Model Evolution: Qwen → Haiku → Codex"
description: "Three iterations of the OpenClaw coder subagent model, each solving one problem and revealing the next: local model quality issues, shared-provider concurrency failures, and final stability with provider separation."
pubDate: 2026-02-22
tags: ["openclaw", "anthropic", "api-errors", "agent-routing", "cost-optimization"]
---

# Coder Agent Model Evolution: Qwen → Haiku → Codex

Three iterations of the OpenClaw coder subagent model, each solving one problem and revealing the next.

---

## Architecture Context

OpenClaw uses a multi-agent setup where Opus 4.6 (main) orchestrates and delegates file operations to a cheaper `coder` subagent via `sessions_spawn`. The coder's responses auto-announce directly to Telegram, and Opus never sees or interprets them.

That means the coder model must produce user-facing quality output on its own.

Config location:

`~/.openclaw/openclaw.json` → `agents.list[id="coder"]`

---

## Phase 1: Local Qwen 14B (`ollama/qwen2.5:14b`)

### Why We Tried It

Free. Runs on local GPU. No API costs for routine grep/find/read tasks.

### What Went Wrong

`grep -rn "TODO" ~/repos/watchtower --include='*.py'` returned exit code `1` (no matches, no output).

Qwen responded as if this was a hard failure:

> "It seems like the last command I tried to run returned an error. Could you provide more details?"

Exit code `1` from grep means zero matches, not an execution error.

Additional issues:

- Qwen passed `elevated: true` in exec arguments and was rejected by OpenClaw's permission system
- Required enabling `tools.elevated.enabled: true` as a workaround
- Output formatting was inconsistent and not reliably user-facing
- Multi-step instructions were inconsistent

### Lesson

Local GPU only saves money if the model can execute reliably. Bad output increases confusion and burns more orchestrator turns.

---

## Phase 2: Haiku 4.5 (`anthropic/claude-haiku-4-5`)

### Why We Switched

Haiku is inexpensive and materially better at shell semantics and structured reporting. It understood grep behavior and immediately passed all enforcement checks.

### What Went Wrong

Both Opus and Haiku were hitting Anthropic via the same `anthropic:claude-cli` OAuth credential.

Concurrent Opus + coder traffic correlated with repeated Anthropic 500 errors in-session.

### Compounding Problem: Retry Logic Miss

OpenClaw includes transient HTTP retry logic (`runAgentTurnWithFallback`), but it only triggers when `isTransientHttpError()` matches expected status-prefix formats such as:

- `500 Internal Server Error`

Anthropic often returned JSON payloads like:

```json
{"type":"error","error":{"type":"api_error","message":"Internal server error"}}
```

That format did not match the prefix-check path, so retries did not fire.

### Cascade Effect

The unretried errors caused the orchestrator to:

1. Lose track of coder results already delivered
2. Re-spawn duplicate coder tasks
3. Draft content without writing target files
4. Eventually stall after repeated failures

### Structural Gap

Separately, coder auto-announce delivery does not itself trigger a fresh orchestrator inference turn. In practice, a new user message is required to continue execution.

---

## Phase 3: GPT 5.3 Codex (`openai-codex/gpt-5.3-codex`)

### Why This Works

Different provider, different OAuth path.

Codex uses OpenAI credentials, so concurrent Opus (Anthropic) + coder (OpenAI) traffic does not contend on the same provider token.

- No shared Anthropic concurrency bottleneck
- Strong shell-task competence
- Stable user-facing reports

### Config Change

```json
{
  "id": "coder",
  "name": "Code Worker",
  "model": "openai-codex/gpt-5.3-codex",
  "tools": {
    "elevated": {
      "enabled": true
    }
  }
}
```

Previously:

- `anthropic/claude-haiku-4-5`
- before that: `ollama/qwen2.5:14b`

Applied with gateway restart.

---

## Decision Matrix

| Factor | Qwen 14B (Local) | Haiku 4.5 | Codex 5.3 |
|---|---|---|---|
| Cost | Free | ~0.001 USD/task | Covered by monthly sub |
| Exit code handling | Broken | Correct | Correct |
| Output quality | Poor | Good | Good |
| Concurrent with Opus | No conflict | Conflicts on shared token | No conflict |
| Retry resilience | N/A | Missed by parser pattern | Independent provider path |
| Elevated tools behavior | Problematic | Works | Works |

---

## Key Takeaways

1. Do not share one API provider between orchestrator and subagent in concurrent workflows.
2. Local models are only cost wins if they are reliable for the exact operational task class.
3. Auto-announce means coder output must be user-grade without orchestration cleanup.
4. Explicitly test shell semantics (especially grep exit code behavior) before adopting a coder model.

---

## Open Items

- File an OpenClaw issue for transient error detection not matching Anthropic JSON-style 500 payloads
- Continue Codex-coder monitoring to validate stability over several days
- Auto-announce wake-up gap remains a structural limitation
