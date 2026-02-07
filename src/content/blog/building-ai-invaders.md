---
title: "Building AI Invaders: A Space Invaders Clone with AI-Themed Enemies"
pubDate: 2025-02-07
tags: ["gamedev", "javascript", "canvas", "portfolio"]
---

Why does a cybersecurity portfolio have a Space Invaders clone in it? That is probably the first question anyone asks when they see it. The short answer: because building a game from scratch in vanilla JavaScript, with zero dependencies, is one of the best ways to demonstrate fundamentals. The long answer is this entire blog post.

## The Premise

I wanted to build something fun that would stand out among the typical dashboard-and-CRUD portfolio projects. A classic Space Invaders game felt right, but with a twist: the enemies are logos from various AI companies. Claude, GPT, Gemini, DeepSeek, Kimi, Cursor. They descend in formation, you shoot them down. Simple concept, surprisingly deep implementation.

The whole thing is a single HTML file. No React, no build tools, no npm install. Just open the file in a browser and play. That constraint forced me to think carefully about architecture, because you cannot hide behind a framework when everything lives in one document.

## The Game Loop

Every real-time game needs a loop, and the Canvas API paired with `requestAnimationFrame` is the standard approach in the browser. The core pattern looks like this:

```javascript
let lastTime = 0;

function gameLoop(timestamp) {
  const deltaTime = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  update(deltaTime);
  render();
  requestAnimationFrame(gameLoop);
}
```

The critical piece here is `deltaTime`. Without it, your game runs at different speeds on different monitors. A player with a 144Hz display would see everything move more than twice as fast as someone on a 60Hz screen. By multiplying all movement values by `deltaTime` (the time elapsed since the last frame), physics stay consistent regardless of refresh rate. Bullets travel the same distance per second whether the loop fires 60 times or 240 times.

This is a fundamental pattern in game development, but it is also relevant to any real-time application: monitoring dashboards, animation systems, anything that needs frame-independent updates.

## Enemy Formation and Movement

The enemy grid follows the classic Space Invaders pattern: rows of enemies that shift horizontally and drop down when they hit a screen edge. Each row features a different logo rendered onto the canvas.

I used a simple array-based grid system. Each enemy object tracks its position, type, health, and alive status. The formation moves as a unit, checking boundary collisions and reversing direction when any enemy in the row reaches the edge. When an enemy is destroyed, it plays a brief explosion animation before being removed from the active array.

The tricky part was rendering the logos. Rather than loading image files (which would break the single-file constraint), I drew simplified versions of each logo using canvas paths and shapes. It is not pixel-perfect, but it is recognizable and keeps everything self-contained.

## The Grok Boss Fight

The highlight of the game is the boss encounter with Grok, which appears after you clear all the regular waves. The boss fight has three distinct phases, each introducing new attack patterns:

**Phase 1** starts with simple sweeping laser beams that move in predictable arcs. The player can dodge these with basic lateral movement. It is the warmup.

**Phase 2** adds scatter shot patterns. The boss fires clusters of projectiles that spread outward in a fan shape. Timing and positioning become critical because the gaps between projectiles shrink as the phase progresses.

**Phase 3** combines both attack types and adds a charging dash attack where the boss moves rapidly across the screen. The player needs to track multiple threat types simultaneously. It is intentionally overwhelming, and that is the fun of it.

Each phase has its own health pool, so the boss visually degrades as you wear it down. The transition between phases includes a brief invulnerability window with a screen flash effect, giving the player a moment to breathe and reposition.

## Sound Without Files

One of the more interesting challenges was audio. Loading sound files would break the single-file approach, so I used the Web Audio API's `AudioContext` to generate sound effects programmatically.

Laser shots use a quick frequency sweep from high to low. Explosions combine noise with a low-frequency thump that decays rapidly. The boss phase transitions get a dramatic chord. All of these are synthesized in real time using oscillators, gain nodes, and careful envelope shaping.

The result is not going to win any audio design awards, but it gives the game satisfying feedback without a single external asset.

## Touch Controls for Mobile

Making the game work on mobile required touch event handling for movement and firing. I implemented a virtual joystick area on the left side of the screen for movement and a fire button on the right. The touch controls use `touchstart`, `touchmove`, and `touchend` events with `preventDefault()` to stop the browser from scrolling or zooming during gameplay.

The canvas itself scales responsively based on viewport size, so the game fills the screen on both phones and desktops. I used a fixed internal resolution (800x600) with CSS scaling to maintain the aspect ratio while keeping the coordinate math simple.

## Why This Belongs in a Security Portfolio

Here is the thing. Security work is not just writing detection rules and analyzing logs. It requires strong programming fundamentals, creative problem-solving, and the ability to understand complex systems. Building a game from scratch demonstrates all three.

The game loop pattern maps directly to event-driven architectures used in SIEM systems and real-time monitoring. Delta-time calculations show an understanding of timing-sensitive operations, which matters when you are correlating events across distributed systems. The single-file constraint mirrors the reality of working in locked-down environments where you cannot always install dependencies.

And honestly, it shows personality. Security is a field where you spend a lot of time communicating with stakeholders, writing reports, and explaining technical concepts to non-technical audiences. Having a project that makes people smile and say "that is cool" is valuable in its own right.

## Technical Takeaways

Building this project reinforced several patterns I use across all my work:

**State management without frameworks.** The game tracks player state, enemy arrays, projectile lists, boss phases, score, and lives using plain objects and arrays. No Redux, no Zustand, just clean data structures and update functions.

**Render/update separation.** Keeping game logic separate from drawing logic makes both easier to reason about and debug. This same principle applies to any application with a UI layer.

**Progressive complexity.** The three-phase boss fight taught me a lot about designing escalating difficulty curves, which is surprisingly applicable to building onboarding flows and tiered access systems.

The full source is available in my portfolio. Open it, play a round, and feel free to dig through the code. It is all right there in one file, with comments explaining the interesting bits.
