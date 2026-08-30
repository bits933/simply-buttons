# Context Window Status Refinement

## Goal

Refine gallery button 44 so its idle gauge and readout show used context exactly, its longer compression phase uses a quiet full-pill white/purple dot-matrix rain behind shimmering text, and completion pulses before returning to an exact `10K / 1M` used state.

## Global Constraints

- Keep the existing `ContextWindowStatusButton` API and gallery registration.
- Default idle state is `200K / 1M`; the SVG arc plots `usedTokens / maxTokens` (20%).
- On click, ignore additional activation until the complete loop finishes.
- Exit idle content, then show lowercase `compressing` with a native-CSS text shimmer.
- The compression background covers the whole pill with small, widely spaced white/purple dots. A dense leading edge travels left-to-right while the quieter field behind it progressively fills the pill.
- Show lowercase `compressed` with a brief blink-and-scale confirmation, then return to idle at exactly `10K / 1M`; the SVG arc plots 1%.
- Keep fixed width, native-button keyboard behavior, meaningful `aria-label`/`aria-busy`, reduced-motion behavior, and `onCompress()` at the end.
- Use native React/CSS only; do not add Tailwind, Motion, `cn`, or another dependency.
- Keep standalone HTML, React, and Node copyable snippets behaviorally aligned.
- Preserve card height and all unrelated dirty worktree changes.

## Task 1: Correct button 44 and every copyable variant

- Update `src/buttons/context-window-status.test.js` first and demonstrate the new assertions fail.
- Refine `src/buttons/ContextWindowStatusButton.tsx` while keeping its existing props and gallery registration.
- Default idle state: display `200K / 1M`; calculate the SVG arc from `currentUsed / safeMax`, so it plots exactly 20% rather than remaining context.
- Click sequence: ignore more clicks while busy; exit idle for 220ms; show lowercase `compressing` over the full-pill matrix for 3 seconds; show lowercase `compressed` with a blink/scale-up and hold it for about 0.9 seconds; begin the updated `10K / 1M` return after the confirmation and keep the button busy until its 520ms arc/220ms content transitions finish (about 4.7 seconds total), then invoke `onCompress()` once.
- Build the matrix with native CSS: roughly 1.3–1.4px dots on a 6px grid, with a tighter 3px grid at the dense leading band. Fade both dot layers progressively from left to right so the moving fill reads as a soft wave. Keep the subdued track and white/light-purple/purple filled field. Sweep the band left-to-right over the same 3 seconds while revealing the filled field behind it; use an S-curve, not a linear wipe.
- Adapt the supplied shimmer without dependencies: use a native-CSS gradient animation on the visible `compressing` text.
- UX concept: **Quiet Compression Scan**. Keep the matrix subordinate to the status copy: track opacity about 0.12–0.16, filled field about 0.24–0.28, and dense leading edge no higher than about 0.34.
- Make the phase handoffs seamless: ease the matrix and labels in/out, keep `compressing` continuously legible for 3 seconds, hold the `compressed` blink/scale confirmation for about 0.9 seconds, then ease the updated idle state back in. Avoid abrupt visibility cuts.
- Keep the 38px fixed-width pill, 17px SVG gauge, 8px icon/readout gap, native button keyboard behavior, tabular readout, `aria-label`, `aria-busy`, and focus styling.
- Under reduced motion, omit the loader and slides; give `compression` and `compressed` readable crossfade holds, return to exactly `10K / 1M`, and invoke `onCompress()` once only after the return crossfade finishes.
- Mirror all behavior and exact values in the standalone HTML, React, and Node exports in `src/buttons/context-window-status.snippets.js` without Tailwind, Motion, `cn`, or any new dependency.
- Keep `src/slots.js` unchanged unless registration parity requires a correction.
- Run focused tests, snippet parse/compile checks, and the production build.
- Run `graphify update .` after each code or documentation change.
