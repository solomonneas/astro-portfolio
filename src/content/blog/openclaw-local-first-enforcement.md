---
title: "Building a Local-First Enforcement Hook for OpenClaw (And the Coder Model That Kept Breaking)"
description: "How I built a system prompt injection hook that forces my AI agent to check local APIs before burning cloud tokens, then iterated through three coder models to find one that actually works."
pubDate: 2026-02-22
tags: ["openclaw", "hooks", "cost-optimization", "agent-routing", "multi-model"]
---

# Building a Local-First Enforcement Hook for OpenClaw

I have local APIs for code search, prompt templates, and agent intel. I also have an AI agent that keeps ignoring them and going straight to cloud APIs. So I built an OpenClaw hook that injects enforcement rules into every session, then spent an afternoon iterating through three coder sub-agent models to find one that actually follows instructions.

Here's what worked, what didn't, and what I learned about enforcing model behavior through system prompts.

## The Problem

I run several local APIs on my workstation:

- **Code Search** ([redacted-service]): Semantic search across 40+ repos using nomic-embed-text embeddings. Zero cloud costs.
- **Prompt Library** ([redacted-service]): Reusable prompt templates so I don't rewrite the same instructions every session.
- **Agent Intel** ([redacted-service]): A knowledge base my agent should check before answering questions from scratch.

The agent (Claude Opus 4.6) kept skipping all of them. It would run `grep` across codebases instead of hitting the code search API. It would write prompts from scratch instead of checking the library. It would answer knowledge questions from its training data instead of checking what I'd already curated in Agent Intel.

Every skipped local API call is wasted cloud tokens and worse output. The local APIs have project-specific context that a foundation model doesn't have.

## The Hook Architecture

OpenClaw supports lifecycle hooks that fire on events like `agent:bootstrap` (when a session starts). I built a hook that intercepts every bootstrap event and injects a rules file into the agent's system prompt.

The key insight: OpenClaw's `WorkspaceBootstrapFile` type expects `{name, path, content, missing}`. My first version used wrong property names and crashed the entire gateway:

```typescript
// BROKEN: wrong properties crashed with "Cannot read properties of undefined"
event.context.bootstrapFiles.push({
  basename: "LOCAL_FIRST_RULES.md",    // wrong key
  content: RULES_CONTENT,
  source: "hook:local-first-enforcement", // not part of type
});

// FIXED: matching the actual type definition
event.context.bootstrapFiles.push({
  name: "LOCAL_FIRST_RULES.md",
  path: `${event.context.workspaceDir}/LOCAL_FIRST_RULES.md`,
  content: RULES_CONTENT,
  missing: false,
});
```

The crash happened because OpenClaw internally calls `file.path.replace(/\\/g, "/")` during bootstrap file processing. When `path` is undefined, you get a TypeError that kills the gateway on every incoming message.

I found this by tracing through the bundled source at `/usr/lib/node_modules/openclaw/dist/pi-embedded-CAmQsy9D.js:21286`. Not the most fun debugging session.

## The Rules (4 Iterations to Get Right)

The injected `LOCAL_FIRST_RULES.md` enforces five behaviors. Getting all five to actually work took four iterations of the rules document.

### What Worked Immediately (v1)

Concrete, unambiguous instructions landed on the first try:

1. **Code Search first**: "Before ANY codebase question, `curl [redacted-service]`." Passed immediately.
2. **Prompt Library first**: "Before writing ANY prompt, check `[redacted-service]`." Passed immediately.
3. **No web search for indexed code**: "NEVER use Brave for questions about code in indexed projects." Passed immediately.

These rules succeeded because they're binary. There's no judgment call. The model sees "before X, do Y" and does Y.

### What Failed (v1-v2)

Rules that required the model to override its own instincts failed:

4. **Agent Intel check**: The model skipped [redacted-service] for "general knowledge" questions like caching best practices, reasoning that it already knew the answer. It had to be told explicitly: *"This includes questions you think you 'already know.' You MUST check first. No exceptions. Even for 'general knowledge' topics."* That fixed it in v2.

5. **Coder delegation**: The model was supposed to delegate file operations (grep, find, cat) to a cheaper sub-agent. Instead, it ran them directly as Opus. Took until v3 to fix.

### The Delegation Problem (v3)

Getting the model to stop running shell commands itself was the hardest rule. Telling it "delegate to the coder agent" wasn't enough. The model kept rationalizing exceptions: "it's just a quick grep," "I already know the file path," "it would be faster to just run it."

What finally worked was a combination of three techniques:

**Keyword blocklist**: If your `exec` command contains `grep`, `find`, `cat`, `head`, `tail`, `wc`, `ls`, `awk`, or `sed`, you're violating the rule. No ambiguity.

**Pre-empted excuses**: I literally listed every rationalization the model had used in previous attempts and said "NO" to each one:

> - "It's just a quick grep" : NO. Delegate it.
> - "It's only one file" : NO. Delegate it.
> - "I already know where the file is" : NO. Delegate it.

**Personal cost framing**: "Solomon is paying real money every time you run grep yourself." This was more effective than technical arguments about token costs.

The model's thinking trace in v3 showed it working: *"The LOCAL_FIRST_RULES say I must check Agent Intel... I need to delegate this grep to the coder agent..."* The rules were actually influencing its chain of thought.

## The Coder Model Problem

With delegation working, the next challenge was finding a coder model that could actually do the job. The coder's responses auto-announce directly to Telegram. Opus never sees or interprets them. That means the coder model must produce user-facing quality output on its own.

### Phase 1: Local Qwen 14B (Free, Broken)

The appeal was obvious: free, runs on local GPU, no API costs for routine file operations.

The reality: Qwen couldn't interpret Unix exit codes. When `grep -rn "TODO"` returned exit code 1 (zero matches, which is normal), Qwen reported: *"It seems like the last command I tried to run returned an error. Could you provide more details?"*

Exit code 1 from grep means no matches. Not an error. Qwen didn't know this.

Additional problems: inconsistent output formatting, couldn't follow multi-step tasks, and kept passing `elevated: true` in exec arguments (which OpenClaw's permission system rejected).

**Lesson**: Local GPU saves $0 in practice when the model can't follow basic instructions. The cost of bad output (user confusion, wasted Opus turns re-explaining) exceeds the API savings.

### Phase 2: Haiku 4.5 (Cheap, Concurrent Conflicts)

Haiku at $1/$5M tokens understood exit codes, produced clean reports, and followed instructions reliably. All five enforcement rules passed immediately after the switch.

Then the 500 errors started.

Both Opus and Haiku hit Anthropic through the same API credential. When Opus spawns a Haiku coder, both agents make simultaneous API calls on the same provider. Four internal server errors in a single session, all correlating with concurrent Opus + Haiku requests.

Worse, OpenClaw's retry logic didn't catch them. The retry handler (`isTransientHttpError`) checks for HTTP status code prefixes like "500 Internal Server Error." But Anthropic returns JSON error payloads: `{"type":"error","error":{"type":"api_error","message":"Internal server error"}}`. The JSON format doesn't match the prefix pattern, so retry never fires.

The cascade was ugly: Opus lost track of coder results, re-spawned the same task three times, drafted content but never wrote files, and eventually stalled completely. The session grew from 24k to 35k tokens with error entries polluting the context.

### Phase 3: GPT 5.3 Codex (Different Provider, No Conflicts)

The fix was simple: use a coder model from a different API provider. Codex runs through OpenAI, completely independent from Anthropic. Opus and Codex can make concurrent API calls without interfering.

```json
{
  "id": "coder",
  "name": "Code Worker",
  "model": "openai-codex/gpt-5.3-codex",
  "tools": {
    "elevated": { "enabled": true }
  }
}
```

No more shared rate limits. No more 500 errors from concurrent requests. Codex handles file operations, exit codes, and formatted reporting without issues.

## Decision Matrix

| Factor | Qwen 14B (Local) | Haiku 4.5 | Codex 5.3 |
|---|---|---|---|
| Cost | Free | ~$0.001/task | $200/mo sub |
| Exit code handling | Broken | Correct | Correct |
| Output quality | Poor | Good | Good |
| Concurrent w/ Opus | No conflict | Conflicts (shared token) | No conflict |
| Retry on error | N/A | Not retried (bug) | Independent |

## Key Takeaways

**For system prompt enforcement:**
- Concrete actions ("check this API first") work on the first try
- Judgment calls ("decide whether to delegate") need keyword blocklists and pre-empted excuses
- Cost framing tied to the user personally is more effective than technical arguments
- System prompt rules still aren't guaranteed. A true infrastructure-level routing hook would be stronger.

**For sub-agent model selection:**
- Never share an API provider between orchestrator and sub-agent. Concurrent requests on a shared API credential cause 500 errors.
- Local models save $0 if they can't follow instructions. Bad output costs more in wasted orchestrator turns than API fees.
- Auto-announce bypasses the orchestrator. Sub-agent models must produce user-facing quality output independently.
- Test exit code handling explicitly. `grep` returning 1 (no matches) is the litmus test for whether a model understands Unix conventions.

**Open issues:**
- OpenClaw's `isTransientHttpError` doesn't detect Anthropic JSON error payloads (should be filed as an issue)
- Auto-announce gap: coder completion doesn't trigger an Opus inference turn. Only new user messages wake Opus up. Structural limitation.

## The Setup

If you want to replicate this, you need:

1. An OpenClaw hook at `~/.openclaw/workspace/hooks/local-first-enforcement/` with a handler that injects rules on `agent:bootstrap`
2. Local APIs worth enforcing (code search, prompt library, whatever you've built)
3. A coder sub-agent on a **different API provider** from your main model
4. Rules that are specific, pre-empt rationalizations, and tie costs to the user

The rules document itself is the most interesting artifact. It's essentially a system prompt engineering exercise: how do you get a frontier model to follow operational constraints it would otherwise optimize away? The answer is: be extremely specific, block every escape hatch, and make it personal.
