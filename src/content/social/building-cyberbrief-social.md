# CyberBRIEF Social Media Drafts

## LinkedIn

I just finished building CyberBRIEF, a threat intelligence briefing tool that automates the most time-consuming parts of the intel workflow: research aggregation, IOC extraction, MITRE ATT&CK mapping, and report formatting.

The core problem is simple. Threat intelligence is only useful if it reaches decision-makers in a format they can act on. Most raw intel feeds produce volume, not clarity. CyberBRIEF generates reports in BLUF (Bottom Line Up Front) format, putting the conclusion and recommended action at the top, with supporting evidence, IOC tables, and ATT&CK mappings below.

The backend uses Python and FastAPI to fan out research queries across multiple sources: Brave Search, Perplexity, and Google Gemini. Aggregating across providers reduces coverage bias and surfaces consensus findings. The system extracts IOCs from prose text, maps adversary behaviors to ATT&CK techniques with full traceability, and formats citations in Chicago Notes-Bibliography style.

The frontend is React, TypeScript, Vite, and Tailwind CSS. I built five visual variants to explore different approaches to presenting intelligence data. The UI supports real-time research progress, interactive IOC tables, and one-click export to HTML or Markdown.

Building this deepened my understanding of both threat intelligence tradecraft and the engineering challenges of multi-source data aggregation. I wrote up the full technical details on my blog: https://solomonneas.dev/blog/building-cyberbrief

\#ThreatIntelligence #Cybersecurity #MITREATTACK #Python #FastAPI #React

---

## Twitter/X Thread

🧵 I built CyberBRIEF: an automated threat intelligence briefing tool. Here is why and how.

1/ The problem: threat intel reports are too long, too slow, and too scattered. Analysts spend hours gathering data from multiple sources just to produce a briefing that a SOC lead will skim in 30 seconds.

2/ CyberBRIEF generates BLUF-format reports. Bottom Line Up Front. The conclusion comes first, supporting evidence follows. It is how military and intel professionals communicate, and it is how cybersecurity briefings should work too.

3/ The backend (Python + FastAPI) researches topics across Brave Search, Perplexity, and Gemini simultaneously. Multi-source aggregation reduces blind spots and surfaces consensus findings across providers.

4/ The system automatically extracts IOCs from prose, maps behaviors to MITRE ATT&CK techniques with evidence tracing, and formats everything with Chicago NB citations. No manual copy-pasting from six browser tabs.

5/ Frontend is React + TypeScript + Tailwind with five visual variants. Interactive IOC tables, clickable ATT&CK mappings, and HTML/Markdown export for sharing.

6/ Full technical write-up on my blog: https://solomonneas.dev/blog/building-cyberbrief

---

## Mastodon

Just shipped CyberBRIEF, a threat intel briefing tool that tackles the "last mile" problem in intelligence: getting findings into a format people actually read.

The tool researches a threat topic across multiple sources (Brave, Perplexity, Gemini), aggregates and deduplicates findings, extracts IOCs with contextual classification, maps behaviors to MITRE ATT&CK techniques, and generates a BLUF-format report with Chicago NB citations.

Backend: Python + FastAPI. Frontend: React + TypeScript + Vite + Tailwind (five visual variants).

The ATT&CK mapping engine was the most interesting challenge. Semantic matching against technique descriptions with full evidence traceability, so every mapping explains why it was flagged. Mappings without justification are just noise.

Multi-source aggregation turned out to be harder than expected. Different providers return wildly different data structures for the same query, and building resilient normalization pipelines is its own discipline.

Full write-up: https://solomonneas.dev/blog/building-cyberbrief

#infosec #threatintelligence #MITREATTACK #cybersecurity #python #react

---

## Bluesky

Built a threat intel briefing tool called CyberBRIEF. It researches topics across multiple sources, extracts IOCs, maps to MITRE ATT&CK, and generates BLUF-format reports with proper citations. Python + FastAPI backend, React frontend.

Full write-up here: https://solomonneas.dev/blog/building-cyberbrief

---

## Substack Teaser

**Why your threat intelligence briefings are too long (and what I built about it)**

Most threat intel reports follow the same pattern: pages of background, scattered IOCs buried in paragraphs, no ATT&CK mapping, and the actual recommendation buried on page 8. Decision-makers skim them. Analysts spend hours producing them. Everyone loses.

I built CyberBRIEF to fix the format problem. It researches threats across multiple sources, extracts the signal, maps everything to MITRE ATT&CK, and delivers it in a BLUF report that puts the bottom line first.

The technical challenges of multi-source aggregation, automated IOC extraction, and ATT&CK mapping taught me a lot about the gap between "having information" and "having actionable intelligence."

Read the full technical breakdown on my blog: https://solomonneas.dev/blog/building-cyberbrief
