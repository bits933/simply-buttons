# Orbit Stroke Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new gallery button named “Orbit stroke” that looks like the compact Send button reference and reveals button 35’s smooth conic-gradient stroke motion on hover.

**Architecture:** Add one native React button, one scoped stylesheet, and the gallery’s standard copyable snippet/metadata module. Reuse button 35’s CSS `@property` plus conic-gradient orbit pattern, but keep this button visually simple and implement all motion in CSS.

**Tech Stack:** React 19, JSX, CSS custom properties, Node test runner, Vite.

**Spec:** User request dated 2026-08-29 and the attached compact “Send” button image in the conversation.

## Global Constraints

- Add a new gallery item after the current final item; do not alter button 35.
- The visible label is exactly `Send`.
- The button is `108px` wide, `42px` high, has an `11px` radius, and uses a persistent `2px` outline.
- Dark mode uses a near-black fill with white text and a white idle outline.
- Light mode uses a white fill with black text and a black idle outline.
- Hover and keyboard focus reveal a smooth conic-gradient stroke orbit based on button 35; the stroke remains exactly `2px` thick.
- Orbit duration is `3.2s` with S-curve timing using `cubic-bezier(.65, 0, .35, 1)` across the two half-turns.
- Pointer press scales the whole button to `.98`; the label stays fixed and unchanged.
- Reduced motion disables the orbit while retaining a visible static gradient stroke.
- Use a native `<button type="button">`; preserve `disabled`, `onClick`, and other button props through prop spreading.
- No new dependency, canvas, requestAnimationFrame loop, React state, icon, or extra interaction.
- HTML, React, and Node copy examples must render the same button, label, theme behavior, and motion values as the gallery preview.

---

### Task 1: Add and Register Orbit Stroke

**Files:**
- Create: `src/buttons/OrbitStrokeButton.jsx`
- Create: `src/buttons/orbit-stroke.css`
- Create: `src/buttons/orbit-stroke.snippets.js`
- Create: `src/buttons/orbit-stroke.test.js`
- Modify: `src/slots.js`

**Interfaces:**
- Consumes: the existing gallery slot shape `{ id, name, blurb, states, keywords, preview, snippets }` and `[data-theme="light"]` theme selector.
- Produces: named exports `OrbitStrokeButton`, `OrbitStrokePreview`, `ORBIT_STROKE_META`, and `ORBIT_STROKE_SNIPPETS`.

- [x] **Step 1: Write the failing focused test**

Create a Node test that reads the component, stylesheet, snippets, and `src/slots.js`, then asserts:

```js
assert.equal(ORBIT_STROKE_META.id, "orbit-stroke");
assert.equal(ORBIT_STROKE_META.name, "Orbit stroke");
assert.match(component, /label = "Send"/);
assert.match(component, /<button/);
assert.match(component, /type="button"/);
assert.match(component, /\.\.\.props/);
assert.doesNotMatch(component, /useState|requestAnimationFrame|<svg/);
assert.match(css, /width:\s*108px/);
assert.match(css, /height:\s*42px/);
assert.match(css, /border-radius:\s*11px/);
assert.match(css, /inset 0 0 0 2px/);
assert.match(css, /padding:\s*2px/);
assert.match(css, /@property --orbit-stroke-angle/);
assert.match(css, /animation:\s*orbit-stroke 3\.2s infinite/);
assert.match(css, /cubic-bezier\(\.65, 0, \.35, 1\)/);
assert.match(css, /\[data-theme="light"\]/);
assert.match(css, /prefers-reduced-motion:\s*reduce/);
assert.match(slots, /OrbitStrokePreview/);
assert.match(slots, /id: "orbit-stroke"/);
```

Also assert every snippet contains `Send`, `2px`, `3.2s`, the light-theme selector, and reduced-motion handling.

- [x] **Step 2: Run the focused test and capture RED**

Run: `node --test src/buttons/orbit-stroke.test.js`

Expected: FAIL because the new component, CSS, snippets, and slot registration do not exist.

- [x] **Step 3: Implement the minimal button**

Build the component with this public shape:

```jsx
export function OrbitStrokeButton({ label = "Send", className = "", ...props }) {
  return (
    <button
      type="button"
      className={["btn-orbit-stroke", className].filter(Boolean).join(" ")}
      {...props}
    >
      <span>{label}</span>
    </button>
  );
}

export function OrbitStrokePreview() {
  return <div className="btn-orbit-stroke-root"><OrbitStrokeButton /></div>;
}
```

Use a masked `::before` ring with `padding: 2px`. Define theme-specific `--orbit-stroke-stops` on the button and resolve the conic gradient on the animated pseudo-element so `--orbit-stroke-angle` repaints correctly. Reveal it with `opacity` on `:hover:not(:disabled)` and `:focus-visible`; animate `--orbit-stroke-angle` through `0deg`, `180deg`, and `360deg` over `3.2s`, assigning `cubic-bezier(.65, 0, .35, 1)` to each half. Under reduced motion, remove the animation but keep the pseudo-element visible for hover/focus.

Register the component and metadata in `src/slots.js` immediately after `pixel-ripple`.

- [x] **Step 4: Add aligned copyable examples and metadata**

Export:

```js
export const ORBIT_STROKE_META = {
  id: "orbit-stroke",
  name: "Orbit stroke",
  blurb: "A minimal Send button whose thin gradient outline orbits smoothly on hover.",
  states: "idle, hover orbit, pressed, focus, disabled, reduced motion",
  keywords: [
    "orbit stroke", "send button", "gradient border", "animated outline",
    "conic gradient", "thin border", "black button", "white button",
    "hover border", "smooth stroke", "cta", "theme button",
    "animated button", "interactive button", "button microinteraction", "ui animation",
  ],
};
```

Provide complete `html`, `react`, and `node` strings using the same `Send` copy, dimensions, 2px stroke, theme overrides, 3.2s orbit, focus behavior, disabled behavior, and reduced-motion fallback.

- [x] **Step 5: Verify, self-review, and commit**

Run:

```powershell
node --test src/buttons/orbit-stroke.test.js
npm run build
```

Expected: the focused test passes and Vite exits `0`.

Commit only the five task files with message `add orbit stroke button`. In the report, include RED/GREEN output, the production build result, and a self-review confirming no unrelated files changed.

## Completion record

- Focused RED/GREEN evidence and the final review-fix RED/GREEN evidence are recorded in the SDD task report.
- Task implementation and fix commits: `cff7448`, `f4f748c`, and `07f1f87` on the isolated feature branch.
- Final scoped re-review: approved; all four review findings addressed with no new Critical or Important regression.
- Controller verification: `node --test src/buttons/orbit-stroke.test.js src/App.test.js` passed 2/2 and `npm run build` exited `0` in the active website workspace.
- Browser QA: verified 108x42 rendering, dark/light themes, live 3.2s angle progression, keyboard focus, smooth hover exit, reduced-motion and forced-colors rules, and no feature-specific console errors.
- Published runtime-only commit: `2315a3b` on `bits933/simply-buttons` `main`; local and remote SHAs match.
