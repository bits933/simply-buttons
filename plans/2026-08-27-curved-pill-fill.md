# Curved Pill Fill Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new rounded pill button with long condensed typography, continuous upward curved fill transition (entering from bottom with an arch curve and exiting through the top), dynamic text color inversion (black on hover in dark mode, white on hover in light mode), and register it as the last button in the gallery.

**Architecture:**
- `src/buttons/CurvedPillFillButton.jsx`: React component managing three motion states (`idle`, `active`, `exiting`) with `requestAnimationFrame` safety and `onTransitionEnd` reset.
- `src/buttons/curved-pill-fill.css`: High-performance CSS transitions using curved border-radius dome geometry, theme token support (light/dark), and hardware-accelerated transforms.
- `src/buttons/curved-pill-fill.snippets.js`: Standalone HTML/CSS, React, and Node snippets + metadata for the CodeModal.
- `src/buttons/curved-pill-fill.test.js`: Unit tests verifying curved transforms, color inversions, motion states, accessibility, and slots registration.
- `src/slots.js`: Register `CurvedPillFillPreview` as the final slot in the `states` category.

**Tech Stack:** React 19, CSS transforms & transitions, Vite, Node test runner.

---

### Key Requirements & Specifications

1. **Shape & Layout:**
   - Rounded pill: `border-radius: 9999px; overflow: hidden; isolation: isolate; position: relative;`
   - Padding: `padding: 12px 36px; min-height: 46px; min-width: 320px;`
   - Border: `1px solid color-mix(in srgb, var(--ink) 25%, transparent)` in light mode, `1px solid rgba(255, 255, 255, 0.2)` in dark mode.

2. **Condensed Typography:**
   - Long condensed text label: `"SYNCHRONIZE PROTOCOL // ARCHIVE QUANTUM CORE"`
   - Font styling: `font-family: "Koulen", "IBM Plex Sans", system-ui, sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; white-space: nowrap;`

3. **Curved Dome Transition Mechanics:**
   - Fill container: `height: 180%; border-radius: 50% 50% 0 0 / 36px 36px 0 0; position: absolute; inset: -40% 0 0 0;`
   - `idle`: `transform: translateY(115%); transition: none;`
   - `active` (on hover / focus): `transform: translateY(0%); transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);`
   - `exiting` (on leave / blur): `transform: translateY(-115%); transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);`
   - Reset: On `transitionend` of transform while in `exiting`, reset motion state to `idle`.

4. **Dynamic Color Inversion:**
   - **Dark Mode**:
     - Rest: text is `#ffffff`, pill border is subtle white.
     - Hover: fill is `#ffffff`, text transitions to `#0a0a0a` (black).
   - **Light Mode**:
     - Rest: text is `#0a0a0a`, pill border is subtle black.
     - Hover: fill is `#0a0a0a`, text transitions to `#ffffff` (white).

5. **Accessibility & Reduced Motion:**
   - `type="button"`, focus-visible rings with `outline-offset: 4px`.
   - Full `prefers-reduced-motion: reduce` fallback.

---

### Implementation Tasks

- [ ] Task 1: Write `src/buttons/curved-pill-fill.test.js`
- [ ] Task 2: Create `src/buttons/curved-pill-fill.css`
- [ ] Task 3: Create `src/buttons/CurvedPillFillButton.jsx`
- [ ] Task 4: Create `src/buttons/curved-pill-fill.snippets.js`
- [ ] Task 5: Register in `src/slots.js` as the last slot (Slot 41)
- [ ] Task 6: Run unit tests, verify in browser, build check, and update graphify
