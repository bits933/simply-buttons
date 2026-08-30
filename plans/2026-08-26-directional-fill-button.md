# Directional Fill Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new icon-free gallery button based on Rise fill whose hover fill enters from below and leaves through the top.

**Architecture:** A focused React component owns a three-state fill direction (`idle`, `active`, `exiting`), so CSS can animate entry and exit in different directions. Its CSS owns the visual treatment; the snippet module provides matching HTML, React, and Node examples, and `slots.js` registers it in the gallery beside Rise fill.

**Tech Stack:** React 19, CSS transitions, Vite, Node’s built-in test runner.

**Spec:** User-approved bounded design in chat on 2026-08-26; no standalone design document.

## Global Constraints

- Create a distinct new gallery item; do not alter the existing Rise fill button.
- Use Rise fill (the 25th gallery button) only as the visual/layout reference.
- Do not render an icon, mark, SVG, or decorative glyph inside the new button.
- Use the sans-serif stack `"IBM Plex Sans", "Segoe UI", system-ui, sans-serif`.
- On hover or keyboard focus, the fill enters from below; on pointer leave or blur, it exits through the top.
- Use the existing S-curve `cubic-bezier(.65, 0, .35, 1)` and honor `prefers-reduced-motion`.
- Add accessible focus styling, `type="button"`, and disabled behavior.
- Keep the component, styles, copyable snippets, gallery registration, and focused Node test aligned.
- Add no dependency.

---

### Task 1: Build and register the Directional Fill button

**Files:**
- Create: `src/buttons/DirectionalFillButton.jsx`
- Create: `src/buttons/directional-fill.css`
- Create: `src/buttons/directional-fill.snippets.js`
- Create: `src/buttons/directional-fill.test.js`
- Modify: `src/slots.js`

**Interfaces:**
- Consumes: React state hooks; the gallery’s `{ id, name, blurb, states, preview, snippets }` slot contract.
- Produces: `DirectionalFillButton`, `DirectionalFillPreview`, `DIRECTIONAL_FILL_META`, and `DIRECTIONAL_FILL_SNIPPETS`.

- [x] **Step 1: Write the failing test**

```js
test("directional fill enters below and exits above without an icon", async () => {
  const { DIRECTIONAL_FILL_META, DIRECTIONAL_FILL_SNIPPETS } = await import("./directional-fill.snippets.js");
  const css = await readFile(new URL("./directional-fill.css", import.meta.url), "utf8");
  const component = await readFile(new URL("./DirectionalFillButton.jsx", import.meta.url), "utf8");
  const slots = await readFile(new URL("../slots.js", import.meta.url), "utf8");

  assert.equal(DIRECTIONAL_FILL_META.id, "directional-fill");
  assert.match(css, /font-family:\s*"IBM Plex Sans", "Segoe UI", system-ui, sans-serif/);
  assert.match(css, /transform:\s*translateY\(102%\)/);
  assert.match(css, /transform:\s*translateY\(-102%\)/);
  assert.match(css, /cubic-bezier\(\.65, 0, \.35, 1\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(component, /onPointerEnter/);
  assert.match(component, /onPointerLeave/);
  assert.match(component, /onTransitionEnd/);
  assert.doesNotMatch(component, /svg|mark|icon/i);
  assert.match(slots, /DirectionalFillPreview/);
  for (const snippet of Object.values(DIRECTIONAL_FILL_SNIPPETS)) {
    assert.match(snippet, /translateY\(102%\)/);
    assert.match(snippet, /translateY\(-102%\)/);
    assert.doesNotMatch(snippet, /btn-rise-mark/);
  }
});
```

- [x] **Step 2: Run test to verify it fails**

Run: `node --test src/buttons/directional-fill.test.js`

Expected: FAIL because the module and styles do not exist yet.

- [x] **Step 3: Write the minimal implementation**

```jsx
const [motion, setMotion] = useState("idle");

<button
  data-motion={motion}
  onPointerEnter={() => setMotion("active")}
  onPointerLeave={() => setMotion("exiting")}
  onFocus={() => setMotion("active")}
  onBlur={() => setMotion("exiting")}
>
  <span
    className="btn-directional-fill"
    aria-hidden="true"
    onTransitionEnd={(event) => {
      if (event.propertyName === "transform" && motion === "exiting") setMotion("idle");
    }}
  />
  <span className="btn-directional-label">{label}</span>
</button>
```

Use the same state contract in the React copyable snippet. CSS must define the `idle`, `active`, and `exiting` transforms so the exit transition ends above the clipped button before the next idle reset places it below. Focus must activate the fill and blur must use the same upward exit. Register `DirectionalFillPreview` immediately after `RiseFillPreview` in the Loaders section.

- [x] **Step 4: Run test to verify it passes**

Run: `node --test src/buttons/directional-fill.test.js`

Expected: PASS with one test and zero failures.

- [x] **Step 5: Verify the production build and commit**

Run: `npx.cmd vite build --outDir "$env:TEMP\\codex-directional-fill" --emptyOutDir`

Expected: build exits 0.

```powershell
git add -- src/buttons/DirectionalFillButton.jsx src/buttons/directional-fill.css src/buttons/directional-fill.snippets.js src/buttons/directional-fill.test.js src/slots.js
git commit -m "feat: add directional fill button"
```
