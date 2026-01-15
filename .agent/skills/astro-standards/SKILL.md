---
name: astro-project-standards
description: Project architecture, design, and development standards for the Astro Portfolio website.
---

# Astro Project Standards

This skill contains the core directives for developing the Astro Portfolio project, ensuring consistency with the project's "Islands Architecture" and minimalist design philosophy.

## 1. Architecture & Core Tech
- **Framework:** Astro.js (Static-first, Islands Architecture).
- **Runtime:** Node.js 20.
- **Environment:** Vercel.
- **Routing:** File-based routing in `src/pages/`.
- **Interactivity:** Use `client:` directives only when necessary for UI components (React/Vue/etc.).

## 2. Design System
- **Font:** IBM Plex Mono (for a terminal/minimalist feel).
- **Palette:** Vibrant hues, high contrast, sleek dark mode.
- **Visuals:** 
    - Subtle noise texture on the main background.
    - Multi-layered drop shadows for depth.
    - "Glow" effects on interactive elements.
    - Monochrome SVG Icons.
- **Responsiveness:** Mobile-first, adaptive layouts.

## 3. Workflow & Documentation
- **Blueprint:** Always update `blueprint.md` with current task status and project history.
- **Errors:** Monitor diagnostics and browser console. Auto-correct syntax and path errors when possible.
- **Data Fetching:** Fetch data in `.astro` frontmatter using top-level `await`.

## 4. Components
- **.astro Components:** Use for static content (layouts, headers, footers).
- **UI Islands:** Use for stateful/interactive elements. Hydrate only as needed.
