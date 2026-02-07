# Intel Workbench Social Media Drafts

## LinkedIn

I built Intel Workbench, an interactive Analysis of Competing Hypotheses (ACH) tool for cybersecurity analysts and students. ACH is a structured analytic technique developed by Richards Heuer at the CIA, designed to counteract the cognitive biases that derail intelligence analysis.

The core insight of ACH is counterintuitive: instead of collecting evidence that supports your preferred hypothesis, you systematically evaluate which hypotheses are most inconsistent with the evidence. The surviving hypothesis is not the one you proved right. It is the one you could not prove wrong. This inversion is powerful because it directly combats confirmation bias, the single most common analytical failure mode.

Intel Workbench implements ACH as a fully interactive browser-based tool. The matrix interface lets you rate evidence consistency against multiple hypotheses, apply confidence weights, and run sensitivity analysis to determine which evidence is load-bearing for your conclusions. Five visual variants explore different approaches to presenting the same analytical data.

The technical stack is React, TypeScript, Zustand for state management, and Tailwind CSS. Everything runs client-side with no backend, so sensitive analysis never leaves the browser. Analysis sessions export as JSON for persistence and sharing.

Building this tool made me significantly more aware of my own cognitive biases in everyday analysis. The methodology is valuable, but the mindset shift that came from implementing it might be even more so.

Full write-up: https://solomonneas.dev/blog/building-intel-workbench

\#IntelligenceAnalysis #Cybersecurity #CognitiveBias #StructuredAnalysis #React #TypeScript

---

## Twitter/X Thread

🧵 I built Intel Workbench, an Analysis of Competing Hypotheses tool for cybersecurity analysts. Here is why structured analysis beats gut feeling.

1/ The human brain is wired with cognitive biases that systematically distort how we evaluate evidence. Anchoring, confirmation bias, availability heuristic. These are not flaws. They are features. And they are devastating in intelligence analysis.

2/ ACH was developed by Richards Heuer at the CIA to counteract these biases. The method: list all hypotheses, list all evidence, then build a matrix rating each evidence item against each hypothesis.

3/ The key insight: do NOT pick the hypothesis with the most supporting evidence. Eliminate the hypothesis with the most INCONSISTENT evidence. This inversion directly fights confirmation bias.

4/ Intel Workbench makes ACH interactive and practical. Color-coded matrix, weighted evidence scoring, and sensitivity analysis that shows which pieces of evidence are load-bearing for your conclusion.

5/ Built with React + TypeScript + Zustand + Tailwind. Fully client-side, no backend. Sensitive analysis stays in your browser. Five visual variants for different workflows.

6/ The sensitivity analysis feature is the one I am most proud of. Toggle evidence items and watch scores shift in real time. If one piece of evidence flips your ranking, your conclusion is fragile.

7/ Full technical write-up: https://solomonneas.dev/blog/building-intel-workbench

---

## Mastodon

Shipped Intel Workbench, an Analysis of Competing Hypotheses (ACH) tool built for cybersecurity analysis.

ACH is a structured analytic technique from Richards Heuer at the CIA. The core mechanism is a matrix where you rate evidence consistency against competing hypotheses, then eliminate hypotheses with the most inconsistent evidence rather than selecting the one with the most confirming evidence. It is designed to directly counteract confirmation bias.

Intel Workbench adds weighted scoring, sensitivity analysis, and five different visual variants for different analytical workflows. Sensitivity analysis is the standout feature: toggle evidence items and watch hypothesis rankings shift in real time. If removing one piece of evidence flips your conclusion, you know exactly how fragile that conclusion is.

Stack: React + TypeScript + Zustand + Tailwind. Client-side only, no backend. Analysis exports to JSON. Sensitive hypotheses never leave the browser.

Building the tool forced me to engage with ACH at a much deeper level than reading about it ever did. Decisions about neutral evidence handling, weight separation (reliability vs. significance), and uncertainty visualization all required understanding the analytical principles, not just the mechanics.

Write-up: https://solomonneas.dev/blog/building-intel-workbench

#infosec #intelligenceanalysis #ACH #cybersecurity #structuredanalysis

---

## Bluesky

Built an interactive Analysis of Competing Hypotheses tool for cybersecurity analysts. It is a structured technique from the CIA that fights confirmation bias by focusing on disproving hypotheses rather than confirming them. Weighted scoring, sensitivity analysis, five UI variants. All client-side.

Blog post: https://solomonneas.dev/blog/building-intel-workbench

---

## Substack Teaser

**Your gut feeling is lying to you (here is the CIA's fix)**

Intelligence analysts do not get to trust their instincts. The stakes are too high and human cognition is too biased. Richards Heuer spent decades at the CIA developing structured techniques to counteract the biases that derail analysis, and the Analysis of Competing Hypotheses is his most influential contribution.

I built Intel Workbench to make ACH interactive, weighted, and practical for cybersecurity work. The sensitivity analysis feature alone changed how I think about evidence: if your entire conclusion depends on a single data point, you need to know that before you brief anyone.

Read the full build story: https://solomonneas.dev/blog/building-intel-workbench
