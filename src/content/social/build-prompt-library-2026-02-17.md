---
title: "Your Prompts Deserve Version Control"
published: false
---

# Your Prompts Deserve Version Control

Every team working with AI has the same problem: prompts scattered across docs, Slack threads, and text files with no versioning and no way to serve them programmatically.

So I built Prompt Library: a self-hosted prompt management system with expandable browsable cards, full version history on every edit, variable substitution with live preview, and a REST API so your agent pipelines can pull prompts dynamically.

Write a prompt once. Template it with `{{variables}}`. Access it from the browser or from code. Change it in the UI and every system using it picks up the new version automatically.

React + TypeScript frontend. FastAPI + SQLite backend. No Docker, no cloud dependency. Clone, install, run.

Full build log: [link to blog post]

If you are building agent pipelines or managing prompts across a team, I am curious what your current workflow looks like.
