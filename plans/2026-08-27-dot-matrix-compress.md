# Dot Matrix Context Compression Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a high-precision, interactive Context Compression Button featuring a circular ring pie chart gauge (`276K/500K` -> `10K/500K`), a column-by-column left-to-right Dot Matrix LED particle fill with subtle cyan accent (no blur/glow), text compression squish transition, outward tactile boundary pulse, and state reveal.

**Architecture:**
- `src/buttons/DotMatrixCompressButton.jsx`: React component managing state machine (`idle` -> `compressing` -> `compressed` -> `idle`), dot matrix canvas/grid engine, dynamic SVG pie/ring gauge, and text morph.
- `src/buttons/dot-matrix-compress.css`: Razor-sharp monochrome + subtle cyan styles, border pulse keyframes, monospace typography, and responsive container layout.
- `src/buttons/dot-matrix-compress.snippets.js`: Standalone HTML/CSS/JS, React ("use client"), and Node snippets with comprehensive metadata and search keywords.
- `src/buttons/dot-matrix-compress.test.js`: Unit tests verifying states, math calculations (276K/500K = 55.2%, 10K/500K = 2.0%), canvas/SVG grid rendering, CSS properties, and snippets.
- `src/slots.js`: Register in slot 43 ("Dot matrix compress").

**Tech Stack:** React 19, HTML5 Canvas / SVG, Vanilla CSS (CSS Grid, flexbox, CSS keyframes), Node test runner.

---

### Detailed Design & Specifications

#### 1. Color Palette & Aesthetics
- **Theme:** High-end minimal monochrome with subtle cyan accent (zero blur/glow for razor-sharp digital precision).
- **Background:** Dark slate/onyx `#121316` pill with `#202226` subtle border.
- **Inactive Dots / Track:** Dark neutral `#27292e`.
- **Active Cyan Accent:** Subtle cyan `#22d3ee` / `#38bdf8` (used for active dot matrix matrix columns and gauge arc).
- **Text & Foreground:** Crisp white `#f8fafc` / `#e2e8f0` in `"IBM Plex Mono"`.

#### 2. Multi-Stage State Machine
1. **Idle State (`"idle"`)**:
   - Left: SVG Ring/Pie Gauge showing 55.2% active arc (`276K / 500K`) in subtle cyan.
   - Center/Right: Text `276K/500K`.
   - Dot matrix grid in idle background state (dim inactive dots).
2. **Compressing Phase (`"compressing"`)**:
   - Initiated on user click.
   - Text shows horizontal letter squeeze micro-transition and displays `"Compressing..."` or live descending ticker.
   - Dot matrix column-by-column raster sweep runs from column 0 (left) to column N (right) over ~1000ms.
   - As each column activates, dots illuminate sharply in subtle cyan `#22d3ee`.
   - Ring gauge smoothly animates/rotates.
3. **Completion & Pulse (`"compressed"`)**:
   - When matrix reaches 100% (rightmost column):
   - Outward boundary pulse wave triggers (`box-shadow` / ring pulse `scale(1.04)` with `#22d3ee` border wave).
   - Text snaps to `"Compressed"` then reveals `10K/500K`.
   - Ring gauge contracts smoothly to 2.0% (`10K / 500K`) in subtle cyan.
   - Dot matrix gracefully transitions back to idle matrix.
4. **Replay / Reset**:
   - Clicking again toggles back to `276K/500K` so users can interactively test the animation repeatedly.

---

### Implementation Tasks

- [ ] Task 1: Write `src/buttons/dot-matrix-compress.test.js`
- [ ] Task 2: Create `src/buttons/dot-matrix-compress.css`
- [ ] Task 3: Create `src/buttons/DotMatrixCompressButton.jsx`
- [ ] Task 4: Create `src/buttons/dot-matrix-compress.snippets.js`
- [ ] Task 5: Register in `src/slots.js`
- [ ] Task 6: Run unit tests, browser QA verification, build check, and graphify update
