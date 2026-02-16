---
title: "Model Arena: I Built Custom SVG Charts Because D3 Felt Like Overkill"
pubDate: 2025-02-05
updatedDate: 2026-02-16
tags: ["llm", "react", "data-visualization", "typescript", "svg", "benchmarks"]
---



Every week there's a new LLM claiming to be the best at everything. Leaderboards rank them into a single number that hides all the interesting tradeoffs. I wanted something better, so I built Model Arena: an interactive dashboard that lets you actually compare models across multiple dimensions.

## The Problem With Leaderboards

A model that crushes coding benchmarks might be mediocre at reasoning. A model scoring 95 on some eval might cost 10x more than one scoring 90. Context windows differ. Latency varies wildly. Speed matters for real-time apps.

One number can't capture any of that. You need visualizations that show the tradeoffs side by side.

## Stack: React, TypeScript, Zero Backend

Model Arena is frontend-only. React, TypeScript, Vite, Tailwind. Benchmark data is embedded as static datasets. No API keys, no database, no server costs. Deploy it anywhere.

The interesting decision: I built all four chart types from scratch using raw SVG instead of pulling in D3 or Recharts.

## Why I Skipped D3

D3 is incredible. It's also a massive dependency with a steep learning curve, and I needed exactly four chart types with specific LLM comparison requirements. Off-the-shelf components would've needed so much customization that I'd be fighting the library more than using it.

So I went raw SVG in React components. Here's what I built:

**Bar charts** for single-metric comparisons. Tokens per second, benchmark scores, cost per million tokens. Grouped bars, stacked bars, horizontal orientation. Each bar is an SVG `rect` with calculated positions. Tooltips via `foreignObject`.

**Radar charts** are where this thing really shines. Plot multiple metrics on radial axes, get a polygon shape for each model. Big regular polygon = good at everything. Spiky polygon = uneven capabilities. Overlay two models and the differences jump out immediately.

Building radar charts means doing actual trigonometry. Equal angular intervals, data values mapped to distances from center, coordinates connected with SVG `path` elements. I added concentric grid rings for scale and axis labels around the perimeter.

**Scatter plots** for two-variable relationships. Cost vs. capability. Speed vs. quality. These reveal clusters and outliers that other charts miss. I added optional trend lines using linear regression to make correlations explicit.

**Timeline charts** for tracking how model performance changes over time. Are newer models actually better, or has performance plateaued in certain areas?

## Was Custom SVG Worth It?

Total code for all four chart types: under 1,500 lines of TypeScript. Zero external dependencies beyond React. The charts render exactly how I want them to, with no fighting against library opinions about margins or legends.

For a general-purpose viz tool, I'd use D3. For a focused dashboard with known chart types, custom SVG was the right call.

## Five Variants, Different Compositions

Like my other projects, Model Arena has five visual variants. But here, variants don't just restyle the layout. They customize which charts appear, the section order, and which datasets are featured.

One variant leads with radar charts of the top five models. Another leads with a cost vs. performance scatter plot. Same data and components underneath, different page composition through a configuration object per variant.

## Honest Takes on Benchmark Data

Benchmarks aren't neutral. A model trained on data similar to a benchmark's test set will score higher regardless of real-world capability. Model Arena addresses this by showing multiple benchmarks simultaneously. The radar chart is great for this: if a model scores sky-high on one benchmark but average on everything else, that imbalance is immediately visible.

I also put cost and latency data right next to capability scores. Performance without context is meaningless.

## Current Status

Model Arena is shelved for now. I've got higher-priority projects pulling my attention. But the code is on GitHub and the custom SVG chart work taught me more about data visualization than any library tutorial ever could.

When you build charts from scratch, you stop thinking "add a bar chart" and start thinking in coordinate systems, scale functions, and geometric primitives. That understanding carries over to everything else.
