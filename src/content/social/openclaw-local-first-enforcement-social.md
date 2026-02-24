# OpenClaw Local-First Enforcement & Coder Model Evolution — Social Media Drafts

## LinkedIn (Personal)

My AI agent kept ignoring local APIs and burning cloud tokens on things it could resolve for free. So I built a system prompt injection hook to enforce local-first behavior.

I run semantic code search, a prompt library, and a curated knowledge base on localhost. All free, all GPU-powered, all containing project-specific context that a foundation model doesn't have. But Claude Opus kept skipping them: running grep instead of hitting the search API, writing prompts from scratch instead of checking the library, answering from training data instead of checking curated intel.

The fix: an OpenClaw lifecycle hook that injects enforcement rules into every agent session at bootstrap. Five rules, four iterations to get them all working. The interesting finding: concrete rules ("check this API before doing X") worked on the first try. Judgment calls ("delegate file operations to a cheaper model") needed keyword blocklists, pre-empted excuses, and personal cost framing before the model actually complied.

Then came the coder sub-agent problem. I went through three models:

1. Qwen 14B (local, free): couldn't interpret grep exit code 1 as "no matches." Reported errors that weren't errors.
2. Haiku 4.5 (Anthropic, cheap): competent, but shared the same OAuth token as Opus. Concurrent API calls caused 500 errors that OpenClaw's retry logic couldn't catch.
3. GPT 5.3 Codex (OpenAI): different provider, no token conflicts, no concurrent request issues. Problem solved.

The lesson that keeps repeating: "free" and "cheap" aren't free when the model produces bad output. The cost of confusion and wasted orchestrator turns exceeds any API savings.

Full writeup: https://solomonneas.dev/blog/openclaw-local-first-enforcement

#AIEngineering #OpenClaw #CostOptimization #MultiModel #DevTools

---

## LinkedIn (Business)

Your AI agent is probably ignoring your local infrastructure. Here's how to fix that.

We built a system prompt injection hook for OpenClaw that enforces local-first behavior: check code search APIs, prompt libraries, and knowledge bases before making cloud API calls. Five enforcement rules, injected into every session at bootstrap via OpenClaw's lifecycle hook system.

The most useful finding from iterating on the rules: concrete instructions ("curl this endpoint before any codebase question") work on the first attempt. Delegation rules ("use the cheaper model for file operations") require keyword blocklists, pre-empted rationalizations, and cost framing tied to the user before the model complies.

We also documented the full coder sub-agent model selection process. Key takeaway: never share an API provider between your orchestrator and sub-agent. Concurrent requests on the same OAuth token cause 500 errors that retry logic may not catch. Use a different provider for each agent tier.

Details: https://solomonneas.dev/blog/openclaw-local-first-enforcement

#AIEngineering #DevTools #CostOptimization #AgentArchitecture

---

## X/Twitter

Built an OpenClaw hook that forces my AI agent to check local APIs before burning cloud tokens.

5 enforcement rules, injected at session bootstrap. Concrete rules worked immediately. Judgment calls needed keyword blocklists + pre-empted excuses.

Also: never share an OAuth token between orchestrator and sub-agent. Concurrent requests = 500 errors.

solomonneas.dev/blog/openclaw-local-first-enforcement

---

## Bluesky

My AI agent kept ignoring local APIs (code search, prompt library, knowledge base) and going straight to cloud calls.

Built an OpenClaw hook that injects enforcement rules into every session. Iterated through 3 coder models: Qwen 14B (broken exit codes), Haiku 4.5 (shared token 500s), Codex 5.3 (works).

Lesson: "free" isn't free when the model can't follow instructions.

solomonneas.dev/blog/openclaw-local-first-enforcement

---

## Mastodon

Built a local-first enforcement hook for my personal AI agent (OpenClaw). Forces the agent to check localhost APIs (code search, prompt library, intel) before making cloud API calls.

Five rules, four iterations. Concrete rules land on first try. Delegation rules need keyword blocklists and pre-empted excuses.

Coder sub-agent went through three models: Qwen 14B (couldn't parse grep exit codes), Haiku 4.5 (shared OAuth token caused concurrent 500 errors), GPT 5.3 Codex (different provider, no conflicts).

Never share an API provider between orchestrator and sub-agent.

solomonneas.dev/blog/openclaw-local-first-enforcement

#AIEngineering #OpenClaw #LocalFirst #CostOptimization #DevTools #FOSS
