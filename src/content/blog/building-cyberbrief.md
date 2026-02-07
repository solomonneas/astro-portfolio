---
title: "Building CyberBRIEF: An Automated Threat Intelligence Briefing Tool"
pubDate: 2025-02-07
tags: ["cybersecurity", "threat-intelligence", "python", "fastapi", "react", "mitre-attack"]
---

Threat intelligence is only useful if it reaches the right people in the right format at the right time. That sounds obvious, but most intel workflows break down at the "right format" part. Analysts drown in raw feeds, managers get 40-page PDFs they never read, and decision-makers end up relying on gut feeling because nobody distilled the signal from the noise. I built CyberBRIEF to fix that: an automated tool that researches a threat topic across multiple sources, extracts indicators of compromise, maps findings to the MITRE ATT&CK framework, and delivers everything in a clean BLUF briefing with proper citations.

## Why BLUF?

BLUF stands for Bottom Line Up Front. It is a communication format with deep roots in military and intelligence writing. The core idea is simple: put the conclusion first, then support it with evidence. In a traditional report, you build toward a recommendation. In a BLUF report, you lead with it. The reader knows within the first paragraph whether they need to act, and the rest of the document tells them why.

This matters enormously in cybersecurity. When a new vulnerability drops or a threat actor campaign surfaces, the SOC lead does not have 20 minutes to read background context before finding out whether their organization is at risk. They need the answer immediately, with supporting details available if they want to dig deeper. CyberBRIEF generates reports in exactly this structure: a concise BLUF paragraph at the top, followed by categorized findings, IOC tables, ATT&CK technique mappings, and sourced citations.

## The Multi-Source Research Approach

One of the biggest limitations of any single threat intelligence source is coverage bias. A vendor's blog will emphasize threats relevant to their product. A government advisory will focus on critical infrastructure. An independent researcher's write-up might go deep on technical details but miss the broader campaign context. CyberBRIEF addresses this by aggregating research across multiple sources.

The backend is built with Python and FastAPI. When a user submits a research topic, the system fans out queries to multiple providers: Brave Search for broad web coverage, Perplexity for synthesized research summaries, and Google Gemini for analytical processing. Each source returns different perspectives on the same threat, and the system merges these into a unified research corpus before generating the briefing.

This is not just concatenation. The aggregation pipeline deduplicates overlapping findings, identifies consensus across sources (if three independent sources flag the same IOC, that carries more weight), and flags contradictions for analyst review. The goal is to give the reader a comprehensive picture without making them visit six different websites and mentally merge the information themselves.

## IOC Extraction and ATT&CK Mapping

Raw intelligence is full of indicators of compromise scattered through prose paragraphs. IP addresses, domain names, file hashes, CVE identifiers. Manually extracting these from a multi-page report is tedious and error-prone. CyberBRIEF automates this with regex-based extraction patterns combined with contextual validation. An IPv4 address in a "Contact Us" footer is not the same as one identified as a C2 server. The extractor uses surrounding context to classify and tag each IOC appropriately.

The MITRE ATT&CK mapping was one of the more challenging features to implement well. ATT&CK is the industry standard framework for categorizing adversary tactics and techniques, and mapping threat intelligence to it makes findings immediately actionable for defensive teams. If a briefing identifies that a threat actor uses spearphishing attachments (T1566.001) for initial access and then deploys a scheduled task (T1053.005) for persistence, a defender can immediately check whether their detection rules cover those specific techniques.

CyberBRIEF maps findings to ATT&CK techniques by analyzing the behavioral descriptions in the aggregated research. The system maintains a local reference of technique descriptions and uses semantic matching to identify which techniques are relevant. Each mapping includes the technique ID, name, tactic category, and the specific evidence from the research that triggered the mapping. This traceability is critical. A mapping without justification is just a guess.

## Citation Formatting

This might seem like a minor detail, but it matters more than people think. CyberBRIEF generates citations in Chicago Notes-Bibliography format. Every claim in the briefing traces back to a specific source with a properly formatted citation. In an academic or professional intelligence context, unsourced assertions are worthless. If a briefing claims that APT29 shifted to a new infrastructure pattern, the reader needs to know whether that claim comes from a Mandiant report, a CISA advisory, or a random blog post. The source changes how much weight you give the finding.

Chicago NB was chosen deliberately over APA or MLA because it is the standard in intelligence and policy writing. The footnote-style citations keep the body text readable while providing full attribution in the notes section. CyberBRIEF generates these automatically, so the analyst never has to manually format a bibliography.

## The Frontend

The frontend is built with React, TypeScript, Vite, and Tailwind CSS. I built five visual variants to explore different approaches to presenting intelligence data. The interface handles topic submission, displays real-time research progress, and renders the final briefing with interactive elements. IOC tables are sortable and filterable. ATT&CK mappings link to the official MITRE pages. The HTML export produces a self-contained file that can be emailed or archived, and the Markdown export integrates with documentation systems and wikis.

Designing the UI for an intelligence product taught me a lot about information hierarchy. The most important information needs to be visually dominant. Supporting details should be accessible but not competing for attention. Color and spacing do heavy lifting when the reader is scanning under time pressure.

## What I Learned

Building CyberBRIEF reinforced something I keep coming back to in cybersecurity: the gap between having information and having actionable intelligence is enormous, and most of the work is in the translation layer. The technical challenges of API integration, text extraction, and framework mapping were real, but the harder problem was always "how do I present this so a busy human can make a decision in 30 seconds?"

I also gained a much deeper understanding of the MITRE ATT&CK framework by building the mapping engine. Reading about ATT&CK is one thing. Building a system that has to correctly classify adversary behaviors into the right techniques forces you to understand the boundaries between similar techniques and the nuances of sub-techniques.

The multi-source architecture taught me practical lessons about API rate limiting, response normalization, and the reality that different providers return wildly different data structures for the same conceptual query. Building resilient aggregation pipelines is its own discipline.

CyberBRIEF is the kind of tool I wish existed when I started studying threat intelligence. Not because the information is unavailable, but because the time cost of gathering, organizing, and formatting it properly is a barrier that keeps a lot of useful analysis from ever reaching the people who need it.
