---
title: "Building Model Arena: A Data-Driven LLM Comparison Dashboard"
pubDate: 2025-02-05
tags: ["llm", "react", "data-visualization", "typescript", "svg", "benchmarks"]
---

The large language model landscape changes fast. New models drop every few weeks, each claiming to outperform the last on various benchmarks. If you are trying to pick the right model for a specific use case, the amount of data you need to compare is overwhelming. Leaderboards help, but they flatten everything into a single ranking that hides important nuances. Model Arena is my answer to that problem: an interactive dashboard that lets you compare LLM performance across multiple dimensions using custom-built visualizations.

## Why Model Comparison Matters

Choosing an LLM is not as simple as picking whichever model tops the leaderboard. Different models excel at different tasks. A model that dominates coding benchmarks might underperform on reasoning tasks. A model with excellent raw capability might have latency characteristics that make it impractical for real-time applications. Cost per token varies dramatically. Context window sizes differ. Output quality on domain-specific tasks does not always correlate with general benchmark scores.

For anyone deploying LLMs in production, model selection is a multi-variable optimization problem. You need to weigh capability against cost, speed against quality, and general performance against domain-specific needs. A single leaderboard score cannot capture all of that. You need visualizations that let you see the tradeoffs.

Model Arena presents benchmark data across multiple chart types, each designed to reveal different aspects of model performance. The goal is not to tell you which model is best. The goal is to give you the data to figure out which model is best for your specific situation.

## The Tech Stack

Model Arena is a frontend-only application built with React, TypeScript, Vite, and Tailwind CSS. There is no backend. Benchmark data is embedded in the application as static datasets. This keeps things simple and deployable anywhere: no API keys, no database, no server costs.

The most interesting technical decision was building all the chart components from scratch using SVG instead of pulling in a charting library like D3, Chart.js, or Recharts. That decision deserves its own section.

## Building Custom SVG Charts Without D3

D3.js is the standard for data visualization on the web, and for good reason. It is incredibly powerful and flexible. But it is also a large dependency with a steep learning curve, and for the specific chart types I needed, it would have been overkill.

I needed four chart types: bar charts, radar charts, scatter plots, and timeline charts. Each had specific requirements tied to LLM comparison that off-the-shelf chart components would not handle well without significant customization. So I built them from scratch using raw SVG elements in React components.

**Bar charts** compare models across a single metric. Tokens per second, benchmark scores, cost per million tokens. The bar chart component handles grouped bars (multiple models side by side), stacked bars (breaking a score into sub-components), and horizontal orientation for metrics where model names need more space. Each bar is an SVG `rect` element with calculated positions, dimensions, and colors. Hover interactions show exact values in a tooltip rendered as an SVG `foreignObject`.

**Radar charts** are where Model Arena really differentiates itself. A radar chart plots multiple metrics on radial axes, creating a polygon shape for each model. This is the best way to see a model's overall profile at a glance. A model that excels at everything produces a large, regular polygon. A model with uneven capabilities produces a spiky, irregular shape. Overlaying two or three models on the same radar chart immediately shows where each one has advantages.

Building a radar chart from scratch requires some trigonometry. Each axis is positioned at equal angular intervals around a center point. Data values are mapped to distances from the center. The polygon for each model is constructed by calculating the x,y coordinates for each metric value and connecting them with SVG `path` elements. I added concentric grid rings for scale reference and axis labels positioned around the perimeter.

**Scatter plots** show the relationship between two metrics. Cost versus capability. Speed versus quality. Scatter plots reveal clusters and outliers that other chart types miss. If all the high-capability models are also the most expensive, the scatter plot shows that immediately as a diagonal trend. If one model breaks the trend by offering high capability at lower cost, it stands out as a point below the trend line.

The scatter plot component handles axis scaling, grid lines, point rendering with model-specific colors, and hover labels. I added optional trend line rendering using a simple linear regression calculation to make correlations explicit.

**Timeline charts** show how model performance has changed over time. As new versions and models release, their benchmark scores can be plotted chronologically. This reveals the pace of improvement and whether newer models are consistently better or whether performance has plateaued in certain areas. The timeline component renders time on the x-axis with model releases as data points connected by lines.

## No D3: Was It Worth It?

Building four chart types from scratch took more time than importing a library. But the result is tighter, faster, and more maintainable for this specific use case. The total code for all four chart components is under 1,500 lines of TypeScript. There are no external dependencies beyond React itself. The charts render exactly the way I want them to, with no fighting against library opinions about margins, legends, or interaction patterns.

For a general-purpose data visualization tool, I would use D3. For a focused dashboard with known chart types and specific interaction requirements, custom SVG was the right call. The components are fully typed with TypeScript, accept data through clean prop interfaces, and are easy to extend if I need new chart features later.

## Five Variants with Per-Variant Page Overrides

Like my other projects, Model Arena has five visual variants. But this project takes the variant system further with per-variant page overrides. Each variant does not just restyle the same layout. Variants can customize which charts appear on each page, the order of sections, and which benchmark datasets are featured.

This means one variant might lead with a radar chart comparison of the top five models, while another variant leads with a scatter plot of cost versus performance. The underlying data and chart components are shared, but the page composition varies. This was an experiment in how much you can differentiate an application's user experience through layout and content curation alone, without changing the core functionality.

The override system works through a configuration object for each variant that specifies page sections, chart types, featured datasets, and styling tokens. The main page component reads this configuration and renders accordingly. Adding a new variant means adding a new configuration object, not duplicating page components.

## Benchmark Data Interpretation

One thing I was careful about in Model Arena is how benchmark data gets presented. Benchmarks are not neutral. The choice of benchmark suite, the evaluation methodology, and the scoring criteria all influence which models look good. A model trained on data similar to a benchmark's test set will score higher on that benchmark, regardless of its real-world capability.

Model Arena addresses this by showing multiple benchmarks simultaneously rather than relying on a single score. The radar chart is particularly useful here because it plots several benchmarks on the same visualization. If a model scores exceptionally high on one benchmark but average on others, the radar chart makes that imbalance visible in a way that a leaderboard ranking would hide.

I also included cost and latency data alongside capability benchmarks. Performance without context is meaningless. A model that scores 95 on a reasoning benchmark but costs ten times more than a model scoring 90 is not necessarily the better choice. Model Arena puts those tradeoffs on screen together.

## Making AI Model Selection Data-Driven

The broader goal of Model Arena is to push back against vibes-based model selection. It is easy to pick a model because it is the newest release, because a popular developer recommended it, or because it tops a single leaderboard. Those are all weak signals.

Strong model selection looks at multiple performance dimensions, considers the specific use case, accounts for cost and latency constraints, and compares alternatives systematically. Model Arena provides the visualization layer for that kind of analysis. It does not make the decision for you, but it makes sure you are looking at the right data when you make it.

## What I Learned

Building custom SVG charts deepened my understanding of how data visualization actually works at the rendering level. When you use a charting library, you think in terms of "add a bar chart." When you build from scratch, you think in terms of coordinate systems, scale functions, and geometric primitives. That lower-level understanding makes you better at using libraries too, because you understand what they are doing under the hood.

The per-variant page override system taught me about the tension between flexibility and complexity. Making everything configurable sounds good in theory, but every configuration option is a maintenance burden. I found a sweet spot where variants can customize page structure without touching component internals.

Model Arena is on my GitHub. If you are evaluating LLMs for a project and want a better way to compare them than scrolling through leaderboards, take a look.
