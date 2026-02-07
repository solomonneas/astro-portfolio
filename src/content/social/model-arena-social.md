# Model Arena - Social Media Drafts

## LinkedIn

Picking the right large language model for a project should be a data-driven decision. In practice, most people choose based on leaderboard rankings, social media hype, or whichever model is newest. That is not analysis. That is vibes.

I built Model Arena to make LLM comparison more systematic. It is an interactive dashboard that visualizes model performance across multiple dimensions: benchmark scores, cost per token, latency, context window size, and more. Instead of a single leaderboard ranking, you get bar charts, radar charts, scatter plots, and timeline charts that reveal tradeoffs and patterns a flat ranking would hide.

The most interesting technical decision was building all four chart types from scratch using raw SVG in React, without D3 or any charting library. Bar charts, radar charts (with the trigonometry to position radial axes and compute polygon vertices), scatter plots with optional trend lines, and timeline charts. The total code for all chart components is under 1,500 lines of TypeScript with zero external dependencies beyond React.

Model Arena has five visual variants with a per-variant page override system. Each variant does not just restyle the same layout. Variants can customize which charts appear, the section order, and which datasets are featured. One variant might lead with a radar comparison of top models while another leads with a cost-vs-performance scatter plot.

I was deliberate about presenting benchmarks honestly. No single score tells the full story. The radar chart is particularly useful here because it plots multiple benchmarks simultaneously. If a model scores exceptionally on one benchmark but average on others, the irregular polygon shape makes that visible immediately.

Check it out on my GitHub. Link in comments.

## Twitter/X

🧵 Built Model Arena: an interactive dashboard for comparing LLM performance across multiple dimensions. Custom SVG charts, no charting libraries. Here is the build thread: (1/7)

The problem: LLM leaderboards flatten everything into a single ranking. But model selection is multi-variable. Capability vs. cost. Speed vs. quality. General vs. domain-specific performance. You need visualizations that show the tradeoffs. (2/7)

Built four chart types from scratch using raw SVG in React. Bar charts (grouped + stacked), radar charts, scatter plots with trend lines, and timeline charts. Under 1,500 lines of TypeScript total. Zero charting library dependencies. (3/7)

The radar chart is the star. It plots multiple benchmarks on radial axes, creating a polygon for each model. Balanced models make regular shapes. Uneven performers make spiky shapes. Overlaying two models shows exactly where each has an edge. (4/7)

Scatter plots reveal what leaderboards hide. Plot cost vs. capability and you immediately see the efficiency frontier. Which models give you the most performance per dollar? The dots tell the story. (5/7)

Five visual variants with per-variant page overrides. Variants do not just restyle the layout. They customize which charts appear, section order, and featured datasets. Same components, different analytical stories. (6/7)

Stop picking LLMs based on vibes. Model Arena makes model selection data-driven. Open source, frontend-only, deployable anywhere. Link in bio. (7/7)

## Mastodon

Shipped Model Arena: an LLM comparison dashboard with custom SVG chart components built from scratch in React + TypeScript.

Four chart types, no D3 or charting libraries:
- Bar (grouped, stacked, horizontal)
- Radar (radial axes, polygon overlays per model)
- Scatter (with linear regression trend lines)
- Timeline (chronological performance tracking)

The radar chart required the most geometry. Each axis at equal angular intervals, data values mapped to radial distances, polygon vertices computed with sine/cosine, concentric grid rings for scale. All rendered as SVG `path` and `circle` elements with React state managing hover/selection.

Per-variant page overrides let each of the five variants customize which charts appear and in what order, not just styling. Configuration objects drive page composition.

Benchmarks are presented with context: multiple metrics simultaneously on radar charts to prevent single-score distortion, cost/latency data alongside capability scores. The goal is honest comparison, not rankings.

Frontend-only, static benchmark data, zero backend. Source on GitHub.

#llm #datavisualization #react #typescript #svg #benchmarks #opensource

## Bluesky

Stop picking LLMs based on vibes. I built Model Arena: an interactive dashboard for comparing model performance with custom SVG charts.

Bar, radar, scatter, and timeline charts. All built from scratch in React, no D3 needed. Five visual variants with per-variant page overrides.

Frontend-only and open source. Check it out on solomonneas.dev.

## Substack Teaser

**You are probably picking your LLM wrong.**

Not because you chose a bad model. Because you chose based on a leaderboard ranking, a tweet, or whichever release is newest. That is vibes-based engineering.

Model Arena is my answer: an interactive dashboard with custom SVG charts that visualize LLM performance across multiple dimensions simultaneously. Radar charts that reveal uneven capabilities. Scatter plots that expose cost-vs-quality tradeoffs. Timeline charts that show whether improvements are real or plateauing.

I built all four chart types from scratch without D3. Read the full breakdown, including the trigonometry behind radar chart rendering, on solomonneas.dev.
