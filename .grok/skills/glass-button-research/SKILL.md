---
name: glass-button-research
description: >
  Research-first protocol for premium glass / liquid-glass buttons. Use when
  researching or building frosted glass, liquid glass, Apple glass, glassmorphism
  buttons, cursor-follow specular highlights, cursor-cast light shadows, or
  press-state light reflection. Slash command: /glass-button-research.
---

# Glass button research

You are a senior interaction designer researching a **single glass button**, not a landing page.

Do not invent techniques from memory. Open real pages, read the CSS/JS, and quote what you saw.

## Brief (this project)

Gallery at `C:\Users\User\Desktop\vibe coding\buttons`.

- Fill first empty tray: Loaders `skeleton` in `src/slots.js`.
- Grayscale only (black / white / gray). No hue.
- Live preview + 3 complete snippets (HTML+CSS, React, Node). Unique prefix.
- Real `<button>`, visible focus, pasteable, no extra deps.
- User asked for: **cursor-cast light on hover** and **proper light reflection on press**.

## What "good glass" is

Not `backdrop-filter: blur(12px)` plus a white border. That is generic glassmorphism.

Apple Liquid Glass (WWDC25 / iOS 26) is the north star. Official docs describe **three layers**:

1. **Highlight** — specular light that moves with pointer / device motion
2. **Shadow** — contact + cast shadow that light bleeds into
3. **Illumination** — inner glow that starts under the fingertip on press and spreads

Glassmorphism = frosted plate. Liquid glass = refraction + reflection + interaction.

## Research sequence (do not skip)

1. Search 3+ angles (production products, component libraries, CSS/JS recipes).
2. Open the actual page or repo. Do not stop at a title.
3. Extract measurements: radius, blur, saturate, border, shadow stack, pointer math, press timing.
4. Record hover light and press reflection separately.
5. Reject anything that fails the fail list below.
6. Return the output schema. No essays.

## Must open

Production / official:

- https://developer.apple.com/videos/play/wwdc2025/219/
- https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views
- https://css-tricks.com/getting-clarity-on-apples-liquid-glass/
- https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/
- https://atlaspuplabs.com/blog/liquid-glass-but-in-css

Libraries / specimens (open live demos, steal measurements, do not copy color):

- https://21st.dev (liquid-glass / glass button)
- https://github.com/rdev/liquid-glass-react
- https://github.com/naughtyduk/liquidGL
- https://uiverse.io (glass buttons, sort by likes)
- https://buttons.ibelick.com
- https://ui.ibelick.com
- Stripe / Linear / Raycast / paper.design nav or CTA if glass is present

Cursor light (the hover the user asked for):

- Pointer as a **point light**, not a generic card glow
- Specular: `radial-gradient` at `--mx --my`
- Cast shadow: offset opposite the light (`--lx/--ly` from center)
- Rim highlight rotates with light direction
- Write CSS vars from pointer; do not `setState` every move

Press reflection (the press the user asked for):

- Apple: glow starts **under the fingertip** and spreads through the glass
- Surface sinks (`translateY(1px)` + `scale(0.98)`)
- Top rim highlight **inverts** (pressed glass catches light from below)
- Inner shadow deepens; outer shadow tightens
- Specular shrinks and brightens (caustic), then restores on release
- Feedback under 100ms

## Fail list (do not recommend)

- Whole-button hue glow, neon, RGB split, purple AI glass
- Only `backdrop-filter` with no highlight / shadow / illumination layers
- `feDisplacementMap` as the main trick (too close to a glitch, snippets get heavy)
- WebGL / Three / extra npm for a gallery paste snippet
- `useState` for mouse x/y
- Flat `:active { opacity: 0.8 }` or only `scale(0.98)` with no light change
- Colored glass, iridescence, rainbow foil
- Glass over a flat same-color well (blur is invisible). The specimen well must have a grayscale field to refract.

## Output schema (return exactly this)

```text
PRIMARY
- name + url
- why it wins for this brief
- hover light (how, px, vars)
- press reflection (how, timing)
- measurements (radius, blur, saturate, border, shadow)

BORROW
- 2 details max, each with source url and the exact trait

REJECT
- 3 named anti-patterns with why

RECIPE (vanilla, grayscale)
- layers (well, plate, rim, specular, fingertip, shadow)
- pointer math
- press math
- a11y (focus, reduced-motion, reduced-transparency, contrast)
- what NOT to ship
```

## Implementation constraints to respect

- Prefix `btn-glass-`.
- CSS + a few lines of pointer JS. No Motion/GSAP/WebGL unless the brief changes.
- Light and dark wells both need a visible grayscale field (soft grid or bands) so blur reads.
- Contrast: label must pass WCAG AA on the frosted plate in both themes.
- `prefers-reduced-motion`: snap light to center, skip press spring.
- `prefers-reduced-transparency`: solid gray plate, keep rim + cursor light.
