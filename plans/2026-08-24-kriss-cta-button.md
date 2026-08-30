# Kriss CTA Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Kriss.ai `Learn More` CTA to the button gallery with the source button's exact glass fill transition and four-segment rounded-border hover choreography.

**Architecture:** Keep the source geometry and motion in a small pure token/math module. A native React button owns four SVG rounded rectangles and one 70fps `requestAnimationFrame` loop that eases their dash offsets toward idle or hover targets. A shared CSS builder and shared snippet strings keep the live gallery specimen and HTML/React/Node copies aligned without adding a dependency.

**Tech Stack:** React, CSS, SVG, `requestAnimationFrame`, native `node:test`, existing Vite gallery.

**Spec:** Source evidence captured on 2026-08-24 from `https://kriss.ai/`, `Button.DcB3XnAV.js`, `Border.BCyUfeNM.js`, `Button.C1Z-X1yJ.css`, `2.fJmAGZe1.css`, and `C:\Users\User\.codex\attachments\6b544688-4f72-4d6b-a7f8-2387bb40587c\image-1.png`.

## Global Constraints

- Add one new Styles specimen after `floema-cta`; do not reorder existing specimens or change shared card dimensions.
- The button label is `Learn More`. Use a semantic `<button type="button">`; decorative border SVG content is `aria-hidden="true"` and `focusable="false"`.
- Intrinsic fill box is `120px × 38px`: content width `90px`, `padding: 10px 15px`, `border-radius: 3px`, and no conventional border.
- Border wrapper is exactly `inset: -11px`; its SVG is `142px × 60px`. Each of four rects uses `x="1.5"`, `y="1.5"`, `width="139"`, `height="57"`, `rx="8"`, and `stroke-linecap="round"`.
- Thick rects use white, `stroke-width="3"`; faint rects use `rgba(255,255,255,.3)`, `stroke-width="1"`.
- Use the source Krissai 400 webfont copied locally from `https://kriss.ai/assets/fonts/krissai-normal.woff2`; never hotlink it. Label typography is `400 12px/18px Krissai` with zero letter spacing and `rgb(15,15,15)` ink.
- Fill is `rgba(255,255,255,.2)` at rest and `rgba(255,255,255,.6)` on hover/focus-visible, with `background-color 300ms ease` and no layout shift.
- Border constants are `radius=8`, `tail=10`, `gap=10`, `fps=70`, and `ease=0.1`. Hover location is the fixed horizontal midpoint `0.5`; it does not track pointer position and it does not loop.
- At `142×60`, initial thick dash length is `32.5664` and source idle offsets are approximately `22.5664` and `-166.404`; hover moves the two thick segments toward the top and bottom centers using the exact source formulas below. Mouse leave reverses through the same exponential easing.
- Keyboard focus mirrors hover; disabled blocks hover/focus motion. Reduced motion snaps to the correct endpoint and removes the fill transition.
- Click only invokes the consumer's `onClick`; do not invent navigation, loading, press, or page-exit animation.
- HTML, React, and Node snippets must include identical local-safe CSS, SVG geometry, 70fps motion math, focus, disabled, cleanup, and reduced-motion behavior. Add no package.
- Preserve unrelated dirty worktree changes. Stage and commit only task-owned paths.
- After every code or documentation edit, run `graphify . --update --code-only`.

---

### Task 1: Source-faithful border motion model

**Files:**
- Create: `src/buttons/kriss-cta.tokens.js`
- Create: `src/buttons/kriss-cta.tokens.test.js`

**Interfaces:**
- Produces `KRISS_CTA`, `getKrissBorderGeometry()`, `getKrissBorderTargets(perimeter, isHover)`, and `stepKrissBorderFrame(previous, targets)`.
- `KRISS_CTA` contains the exact label, geometry, paint, typography, motion rate, and easing values from Global Constraints.
- `getKrissBorderGeometry()` returns the observed browser perimeter `377.9414`, the source rounded-rect dash length, and all four base dash definitions. The live component may replace the constant with the mounted rect's `getTotalLength()` result before its first frame, matching the source implementation.
- `getKrissBorderTargets(perimeter, false)` returns the source idle thick offsets; `true` returns the fixed midpoint hover offsets.
- `stepKrissBorderFrame` performs `current += (target - current) * 0.1`, then derives both faint dash arrays/offsets from the eased thick offsets.

- [ ] **Step 1: Write the failing pure-logic tests**

```js
assert.equal(KRISS_CTA.label, "Learn More");
assert.deepEqual(KRISS_CTA.svg, { width: 142, height: 60, inset: 11 });
assert.equal(KRISS_CTA.fps, 70);
assert.equal(KRISS_CTA.ease, 0.1);

const perimeter = getKrissBorderGeometry().perimeter;
const idle = getKrissBorderTargets(perimeter, false);
const hover = getKrissBorderTargets(perimeter, true);
assert.ok(Math.abs(idle.first - 22.5664) < 0.01);
assert.ok(Math.abs(idle.second + 166.404) < 0.05);
assert.ok(hover.first < idle.first);
assert.ok(hover.second < idle.second);

const frame = stepKrissBorderFrame(idle, hover);
assert.ok(frame.first < idle.first && frame.first > hover.first);
assert.ok(frame.second < idle.second && frame.second > hover.second);
assert.equal(frame.thickDash, `${getKrissBorderGeometry().dashLength}, ${perimeter - getKrissBorderGeometry().dashLength}`);
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test src/buttons/kriss-cta.tokens.test.js`

Expected: FAIL because `kriss-cta.tokens.js` is missing.

- [ ] **Step 3: Implement the minimum source formulas**

```js
const quarterArc = (radius) => 2 * Math.PI * radius * 0.25;

export function getKrissBorderTargets(perimeter, isHover) {
  const { width, radius, tail } = KRISS_CTA;
  const arc = quarterArc(radius);
  const base = arc + tail;
  if (!isHover) return { first: base, second: base - perimeter * 0.5 };
  const far = -(width - 3 - radius * 2) - arc + base;
  const opposite = -perimeter * 0.5 - (width - 3 - radius * 2) - arc + base;
  return {
    first: (base + far) * 0.5,
    second: (opposite + (base - perimeter * 0.5)) * 0.5,
  };
}
```

Use the exact source equations for the faint rects:

```js
const faintOneLength = -second + first - gap * 2 - dashLength;
const faintOneOffset = first - dashLength - gap;
const faintTwoLength = perimeter + second - first - gap * 2 - dashLength;
const faintTwoOffset = second - dashLength - gap + perimeter * 2;
```

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run: `node --test src/buttons/kriss-cta.tokens.test.js`

Expected: all Task 1 assertions pass.

- [ ] **Step 5: Update Graphify and commit**

Run: `graphify . --update --code-only`

Commit: `feat(kriss-cta): add border motion model`

---

### Task 2: Live native button and exact local font

**Files:**
- Create: `src/buttons/KrissCtaButton.jsx`
- Create: `src/buttons/kriss-cta.css`
- Create: `src/buttons/fonts/krissai-normal.woff2`
- Modify: `src/buttons/kriss-cta.tokens.test.js`

**Interfaces:**
- Consumes Task 1 tokens and math helpers.
- Produces `KrissCtaButton({ label = "Learn More", disabled = false, className = "", onClick, ...rest })` and `KrissCtaPreview`.

- [ ] **Step 1: Extend the tests before production code**

Assert that the component contains one native button, four SVG rects, stable accessible text, `aria-hidden`, `focusable="false"`, 70fps throttling, request/cancel cleanup, hover/focus/disabled/reduced-motion paths, and no pointer-coordinate tracking. Assert CSS contains the exact local `@font-face`, geometry, fills, transition, focus-visible, disabled, and reduced-motion rules.

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test src/buttons/kriss-cta.tokens.test.js`

Expected: FAIL because the component, CSS, and local font are missing.

- [ ] **Step 3: Copy the source font locally**

Download `https://kriss.ai/assets/fonts/krissai-normal.woff2` to `src/buttons/fonts/krissai-normal.woff2`. Verify the response is `font/woff2` and the resulting file is non-empty. Do not download any unrelated Kriss asset.

- [ ] **Step 4: Implement the live component**

Render one button and this decorative SVG structure:

```jsx
<span className="btn-kriss-border" aria-hidden="true">
  <svg width="142" height="60" viewBox="0 0 142 60" focusable="false">
    <rect ref={firstRef} className="btn-kriss-segment btn-kriss-segment--thick" x="1.5" y="1.5" width="139" height="57" rx="8" />
    <rect ref={secondRef} className="btn-kriss-segment btn-kriss-segment--thick" x="1.5" y="1.5" width="139" height="57" rx="8" />
    <rect ref={faintOneRef} className="btn-kriss-segment btn-kriss-segment--faint" x="1.5" y="1.5" width="139" height="57" rx="8" />
    <rect ref={faintTwoRef} className="btn-kriss-segment btn-kriss-segment--faint" x="1.5" y="1.5" width="139" height="57" rx="8" />
  </svg>
</span>
```

Use one animation loop while the component is mounted. Throttle writes to `1000 / 70`, ease toward the current hover/focus target, and update only SVG dash styles. Stop scheduling on unmount. For reduced motion, render the endpoint synchronously without interpolation.

- [ ] **Step 5: Implement scoped CSS**

Use `.btn-kriss-*` selectors only. Keep the intrinsic button `120×38`; load `Krissai` from `./fonts/krissai-normal.woff2`; place the `142×60` SVG at `inset:-11px`; set `pointer-events:none`; transition only background color. Do not add gradients, shadows, blur, scaling, or press motion.

- [ ] **Step 6: Run focused tests and build**

Run:

```powershell
node --test src/buttons/kriss-cta.tokens.test.js
npx vite build --outDir "$env:TEMP\codex-kriss-cta-task2" --emptyOutDir
```

Expected: focused tests and build exit 0.

- [ ] **Step 7: Update Graphify and commit**

Run: `graphify . --update --code-only`

Commit: `feat(kriss-cta): add live reference button`

---

### Task 3: Copyable code and gallery registration

**Files:**
- Create: `src/buttons/kriss-cta.snippets.js`
- Modify: `src/buttons/kriss-cta.tokens.test.js`
- Modify: `src/slots.js`

**Interfaces:**
- Produces `KRISS_CTA_SNIPPETS` with `html`, `react`, and `node`, plus `KRISS_CTA_META`.
- Metadata is `{ id: "kriss-cta", name: "Kriss CTA", blurb: "Glass CTA with source-faithful segmented border choreography.", states: "idle, hover, focus, disabled, reduced motion" }`.

- [ ] **Step 1: Extend the snippet/slot test and confirm RED**

For every snippet assert: `Learn More`, one native button, four rects, exact `142×60`/`139×57` geometry, thick/faint paint, `.2→.6` background transition, `70` fps, `0.1` easing, focus-visible, disabled, cleanup, reduced motion, and no hotlinked asset. Assert `src/slots.js` imports the new preview/meta/snippets and places `kriss-cta` immediately after `floema-cta`.

Run: `node --test src/buttons/kriss-cta.tokens.test.js`

Expected: FAIL because snippets and registration are missing.

- [ ] **Step 2: Implement the three snippets and metadata**

Build HTML and Node from one shared page string. The Node version uses built-in `node:http`; do not add Express. The standalone examples may use `font-family: Krissai, Arial, sans-serif` but must not hotlink the proprietary font; include a comment telling users where to place their licensed local `krissai-normal.woff2` file. React mirrors the live requestAnimationFrame cleanup and state behavior.

- [ ] **Step 3: Register the next Styles specimen**

Append this object after the existing `floema-cta` object without touching any other order:

```js
{
  id: "kriss-cta",
  name: KRISS_CTA_META.name,
  blurb: KRISS_CTA_META.blurb,
  states: KRISS_CTA_META.states,
  preview: KrissCtaPreview,
  snippets: KRISS_CTA_SNIPPETS,
}
```

- [ ] **Step 4: Run focused/full checks**

Run:

```powershell
node --test src/buttons/kriss-cta.tokens.test.js
node --test src/buttons/*.test.js
npx vite build --outDir "$env:TEMP\codex-kriss-cta-task3" --emptyOutDir
```

Expected: focused tests and build exit 0. Record unrelated pre-existing full-suite failures without editing them.

- [ ] **Step 5: Update Graphify and commit**

Run: `graphify . --update --code-only`

Commit: `feat(kriss-cta): add snippets and gallery slot`

---

### Task 4: Browser fidelity QA and final review

**Files:**
- Create: `design-qa.md`
- Modify only if reviewed fixes are required.

- [ ] **Step 1: Capture local idle, early-hover, settled-hover, early-exit, settled-exit, focus, disabled, and reduced-motion states**

Use the same crop and viewport for source and local captures. Inspect button and SVG bounds, computed fill, text font/metrics, every dash array/offset, and console errors.

- [ ] **Step 2: Compare source and local evidence**

Blocking checks:

- Fill box remains `120×38`; SVG remains `142×60`; no state moves either box.
- Fill reaches `.2` idle and `.6` hover through a 300ms ease.
- Idle segments sit at diagonally opposed corners; hover segments chase the top/bottom midpoint without looping; exit retraces the same easing.
- Text remains `Learn More`, centered, and unchanged through hover.
- The accessible button remains keyboard operable; reduced motion snaps instead of animating.

Save the report with source truth, implementation screenshot paths, viewport/density, full/focused comparisons, console check, findings/history, and `final result: passed` only when no P0/P1/P2 mismatch remains.

- [ ] **Step 3: Run independent final review**

Review the entire feature range against this plan. Treat wrong border math, static or looping borders, pointer tracking, hotlinked font, layout shift, missing cleanup, stale snippets, wrong slot order, or a non-passing QA report as blocking.

- [ ] **Step 4: Apply one fix wave if required, re-review, update Graphify, and commit**

Use the responsible implementer for fixes, rerun the covering tests/build/captures, and dispatch one scoped re-review. Commit only reviewed feature paths.

---

## Completion

- [x] Source motion model, native button, local font, snippets, and gallery registration completed.
- [x] Browser fidelity QA completed; follow-up fixes verified continuous exit and reduced-motion endpoints.
- [x] Latest user overrides completed: visible name `Stoke Move`, opaque-white hover/focus fill, and symmetric `background-color 300ms ease` entry/exit.
- [x] Final independent whole-feature review approved with no Critical, Important, or Minor findings.
- [x] Focused tests pass 3/3 and the production Vite build passes. The four broader-suite failures remain documented pre-existing Arttech/Star assertions outside this feature.
