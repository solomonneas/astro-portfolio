---
title: "I Automated My Entire Social Media Pipeline (And It Cost $0/Month)"
subtitle: "How a self-hosted stack of open-source tools turned me from 'I should post about this' to actually posting consistently."
tags: ["automation", "developer-tools", "self-hosted", "social-media"]
---

I'm an introvert who builds things. Talking about those things publicly is the hard part.

For months, my workflow looked like this: finish a project, think "I should share this," open LinkedIn, stare at the blank post box, close the tab, go build something else. I had 30+ open-source projects and maybe 5 posts about any of them.

The problem wasn't a lack of content. It was friction. Every platform has different character limits, different norms, different expectations. A LinkedIn post doesn't work on X. An X post looks lazy on LinkedIn. And the mental context switch from "builder" to "content creator" is harder than any API integration I've ever written.

So I built a pipeline to eliminate that friction entirely.

## The Setup

Four tools, all self-hosted, all free:

**1. Markdown files** organized by platform and topic. Each post lives in its own file, already written for that platform's specific constraints. I write once per platform, not once and hope it translates.

**2. Ops Deck**, a custom React/TypeScript dashboard I built to manage my entire development workflow. The social content page reads those markdown files, displays them in a calendar view, enforces character limits per platform (280 for X, 300 for Bluesky, 500 for Mastodon, 3000 for LinkedIn), and lets me approve or schedule from one screen.

**3. n8n**, a self-hosted workflow automation tool. It polls my dashboard API every 30 minutes for approved posts, validates them one more time, and routes them to the publishing layer.

**4. Postiz**, a self-hosted social media scheduler. It handles OAuth tokens, rate limits, and the actual API calls to LinkedIn, X, Bluesky, and Mastodon.

The flow: write markdown, review in dashboard, approve, and walk away. n8n picks it up, validates it, pushes to Postiz, and Postiz publishes to all four platforms.

Total monthly cost: $0. Everything runs on a Proxmox server I already had.

## Why Self-Hosted?

I tried Buffer. I tried Hootsuite. They work fine if all you need is a scheduling calendar for tweets. But I didn't want a standalone scheduling tool. I wanted publishing integrated into the same dashboard where I track my projects, manage my cron jobs, and monitor my services.

SaaS tools also mean your content pipeline depends on someone else's pricing changes, feature removals, and API deprecations. I've been burned by that enough times to prefer owning the stack.

And honestly? The engineering was fun. Wiring n8n webhooks to a React dashboard to a self-hosted publisher is exactly the kind of integration work I enjoy.

## What Actually Changed

Before the pipeline: sporadic posting. One burst of activity, then three weeks of silence. Algorithms hate that pattern.

After: I write posts in batches (usually when I finish a project or a major feature). They sit in the queue. The pipeline publishes them on a schedule I set. Consistency without willpower.

The other unexpected benefit: writing for X's 280-character limit first makes every other version better. When you're forced to distill a project into two sentences, you figure out what actually matters. Then expanding that to LinkedIn's 3000 characters is easy. The constraint improves the writing.

## The Real Lesson

Automation doesn't replace the creative work. I still write every post myself. What it replaces is the administrative overhead: the tab switching, the copy-pasting, the "did I format the hashtags right for this platform," the "I'll post it later" that turns into never.

If you're a developer who keeps meaning to share your work and keeps not doing it, the problem probably isn't motivation. It's friction. Reduce the friction, and the work gets done.

For me, that meant building a pipeline. For you, it might be as simple as writing posts in a text file and scheduling time to publish them manually. The tool doesn't matter. The friction reduction does.

---

*I write about building tools that solve real problems, usually my own. If that sounds interesting, subscribe and I'll keep showing up in your inbox.*

*Portfolio and full project breakdowns: [solomonneas.dev](https://solomonneas.dev)*
