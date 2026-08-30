# Orano Innovation Push CTA Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replicate the high-tech nuclear innovation CTA button from [Orano Group Innovation Experience](https://www.orano.group/experience/innovation/en) ("EXPLORE" / "ENTER EXPERIENCE") with full interactive fidelity (chromatic RGB split, animated radioactive grain noise, dynamic dual-layer slide wipe, forward label glide, and crossbar strike line).

**Architecture:**
- `src/buttons/OranoPushCtaButton.jsx`: React component implementing the layered architecture (`rgb-offset red`, `rgb-offset green`, `overflow`, `hover-inner noise`, `background`, `label-container`, `stroke`).
- `src/buttons/orano-push-cta.css`: Exact timing curves (`cubic-bezier(0.75, 0, 0.25, 1)`), RGB split offsets, noise keyframes, hover wipe mechanics, and responsive sizing.
- `src/buttons/orano-push-cta.snippets.js`: Export `ORANO_PUSH_CTA_META`, `ORANO_PUSH_CTA_SNIPPETS` with HTML, React, and Node code snippets.
- `src/buttons/orano-push-cta.test.js`: Unit tests verifying CSS transforms, keyframes, DOM structure, metadata, and snippets.
- `src/slots.js`: Register `OranoPushCtaPreview` in the gallery.

**Tech Stack:** React 19, CSS transforms & keyframes, embedded static noise texture, Vite, Node test runner.

---

### Key Requirements & Specifications

1. **Layer Hierarchy:**
   ```html
   <button class="btn-orano-push is-visible is-active" type="button" aria-label="EXPLORE">
     <span class="btn-orano-rgb red" aria-hidden="true"></span>
     <span class="btn-orano-rgb green" aria-hidden="true"></span>
     <span class="btn-orano-overflow">
       <span class="btn-orano-hover" aria-hidden="true">
         <span class="btn-orano-hover-inner">
           <span class="btn-orano-noise"></span>
         </span>
       </span>
       <span class="btn-orano-bg" aria-hidden="true"></span>
       <span class="btn-orano-label-container">
         <span class="btn-orano-label">EXPLORE</span>
       </span>
       <span class="btn-orano-stroke" aria-hidden="true"></span>
     </span>
   </button>
   ```

2. **State & Motion Choreography:**
   - **Rest / Idle:**
     - White background (`.btn-orano-bg`) at `translateX(0)`.
     - Label centered with left padding `38px`.
     - Stroke collapsed at `scaleX(0.001)`.
     - RGB offsets and noise at `opacity: 0`.
   - **Hover / Active:**
     - White background sweeps right to `translateX(100% + 10px)` (duration 0.5s).
     - Yellow layer (`.btn-orano-hover` `#ffe600`) sweeps in from left.
     - Noise layer active with `@keyframes btn-orano-noise` jitter.
     - Chromatic RGB split (Red: `+2px, -2px`, Green: `-2px, +2px`).
     - Label glides forward by `translateX(50px)`.
     - Crossbar stroke expands to `scaleX(1)`.
   - **Active Press:**
     - `transform: scale(0.98)` tactile press feedback.

3. **Typography:**
   - Monospace / industrial uppercase: `font-family: "IBM Plex Mono", monospace; font-size: 14px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #161611;`

---

### Implementation Tasks

- [ ] Task 1: Write `src/buttons/orano-push-cta.test.js`
- [ ] Task 2: Create `src/buttons/orano-push-cta.css`
- [ ] Task 3: Create `src/buttons/OranoPushCtaButton.jsx`
- [ ] Task 4: Create `src/buttons/orano-push-cta.snippets.js`
- [ ] Task 5: Register in `src/slots.js`
- [ ] Task 6: Run unit tests, browser QA verification, build check, and graphify update
