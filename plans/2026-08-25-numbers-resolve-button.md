# Plan: Scrambled Numbers Resolve to "2032" — Circular Button Reveal

Date: 2026-08-25
Owner: next agent (JSX implementer)
Status: research complete, algorithm chosen

## 1. Goals & constraints recap

- 4-character target string `"2032"` rendered inside a circular hollow button.
- On hover:
  - Each cell starts hidden, slides down from `y = -100%` → `y = 0` with `opacity 0 → 1` (CSS transition, ~280ms easeOutCubic).
  - During and after the slide, each visible character is replaced ~9 times per second by a random glyph from a charset, with replacement probability decaying over time.
  - By `~900ms` total, every cell holds its target character and stays there.
- On hover-end: cells slide up (translateY -100%), opacity 1 → 0, scramble stops, label restored on next enter.
- Respect `prefers-reduced-motion` → skip slide, skip scramble, set cells to target string immediately.
- 3 drop-in snippets: HTML+CSS+vanilla-JS, React, Node static server.
- Snippet must be reliable. **rAF is acceptable** in the React snippet for the scramble loop (matches existing `AsciiScrambleButton` pattern; the test file explicitly asserts `requestAnimationFrame` is present, so we keep that contract). The slide-in/out + opacity is pure CSS transitions on a `<span class="cell">` so it stays smooth even when JS stops.

## 2. Algorithm decision

**Recommended: variant (a) — per-character probability decay.** It's the only variant that gives the "matrix digits falling into place" feel the user is asking for. (b) is too synchronized and "typewriter-y" — that's what the existing `AsciiScrambleButton` does and the user is asking to improve on it. (c) is too mechanical/repetitive. (d) is heavier (needs vertical column layout per cell) and visually wrong for "scrambled numbers".

### 2.1 Per-character state

For each of the 4 cells we track:

- `target` — the final char (`'2' | '0' | '3' | '2'`).
- `char` — currently displayed glyph (starts as a random glyph).
- `lastReplaceAt` — `performance.now()` of last mutation (ms).
- `frozen` — `false`; flips to `true` once the cell locks onto `target` (probability reaches 0 and we pick a non-target zero times in a row is not how we lock — see below).

### 2.2 Lock condition (when does a cell stop scrambling?)

We want the chaos to **die out smoothly** rather than hard-snap. A cell freezes when its per-cell `progress` reaches 1. We compute per-cell progress as:

```
globalProgress = clamp((now - startAt) / 900, 0, 1)
eased = 1 - (1 - globalProgress) ** 3           // easeOutCubic on the *calm-down*, not on resolve
perCellStart = index * 60                       // 0, 60, 120, 180ms stagger
perCellProgress = clamp((globalProgress * 900 - perCellStart) / (900 - perCellStart*4), 0, 1)
```

**Simpler equivalent that we should actually ship:**

```
perCellProgress = clamp((globalProgress - index * 0.15) / 0.4, 0, 1)
```

Meaning: cell 0 starts calming at 0%, is fully calm at 40%. Cell 3 starts calming at 45%, fully calm at 85%. After 85% all cells are frozen. The remaining 15% is a quiet "hold" so the eye sees the resolved "2032" for ~135ms before total duration ends.

### 2.3 Probability of replacement per tick

Each rAF tick, for each non-frozen cell, we **always** replace its glyph, but with a probability that decays:

```
pReplace = (1 - perCellProgress) ** 1.6        // ease-out decay, 1.6 exponent = "calm down" curve
                                            //   at p=0   → 1.0  (every tick)
                                            //   at p=0.5 → 0.33 (every 3rd tick on avg)
                                            //   at p=1   → 0.0  (never)
```

Replace the displayed char with `randomGlyph()` from charset. The `**1.6` exponent gives a perceptually nice "fast at first, slow tail" — feels organic, not linear.

### 2.4 Easing curve for the calm-down

**Recommendation: easeOutCubic on the calm-down (`1 - (1-p)^3`), with probability exponent 1.6.**

Justification: pure linear decay looks robotic. Pure exponential (e^(-3p)) is too front-loaded — the first 200ms is pure chaos and the last 400ms is almost static. A cubic ease-out on the calm-down puts most of the substitution in the first half and a long graceful tail — matches the "matrix" feel. The 1.6 probability exponent adds extra bias toward early replacement so the tail is unmistakably settling.

### 2.5 Total duration

**Recommendation: 900ms.**

- <700ms: too fast, doesn't read as a reveal; user can't track the digits "falling" into place.
- 800ms: borderline; works for "WORK" (4 letters) but feels rushed for numeric target.
- 900ms: matches the user's stated 700–1100ms midpoint. After 900ms the label is fully resolved and held; the slide-in (~280ms) finishes at ~280ms, so the scramble runs 280→900ms with the digits visible but moving — exactly the desired overlap.
- >1100ms: feels laggy on a small button; the eye expects a click target by 1s.

If you want to bias shorter, go 820ms. If you want the "long luxurious decode" feel, go 1000ms. **Default: 900ms.**

### 2.6 Stagger recommendation

**Per-cell stagger of 0.15 of global progress (= 135ms in real time at 900ms total).**

- All 4 cells resolve left-to-right: cell 0 starts calming first, cell 3 last.
- This is the same directional logic as the existing `AsciiScrambleButton` (which uses `Math.floor(4 * progress)` as the resolved count), so it feels familiar to users of this repo.
- Stagger interval of 0.15 was chosen so the 4 cells (0, 1, 2, 3) start at progress 0, 0.15, 0.30, 0.45 — and all are fully frozen by 0.85, leaving a 135ms quiet tail. This gives a visible wave without dragging.
- Each cell takes 0.4 of global progress (~360ms) to go from "100% replace" to "0% replace" — long enough to look animated, short enough to feel snappy.

If you prefer all-at-once (no stagger), drop the `index * 0.15` offset. The visual is fine but less premium.

### 2.7 Charset

**Recommendation: digits-only charset `"0123456789"`.**

The user said the example charsets were `"0123456789"` or `"0123456789·#%<>$"`. The target is numeric, so the scramble should also look numeric — seeing digits resolve to digits is more legible than seeing a `%` flash for 50ms inside a numeric countdown. If you want more visual texture, use `"0123456789·"` (10 digits + 1 dot) which is still 91% digits and adds subtle texture without breaking the "this is a counter" reading.

- The existing `ascii-scramble.js` uses `"#*?>%0"` which is a symbols-only charset that looks like a debug terminal. That's great for a generic "scramble text" but wrong for a year counter / 2032 indicator. **Do not reuse that charset.**

### 2.8 Tick rate

**Recommendation: rAF loop, but throttle text-update to ~50ms (20 updates/sec).**

The existing `AsciiScrambleButton` uses `frameInterval = 1000 / 30` (~33ms, ~30Hz). 20Hz is the sweet spot: visibly animated, no perceptible jitter, half the React re-renders. 60Hz text updates are wasteful (the eye can't read them); 10Hz feels strobing.

So: rAF drives the loop (cheap), but inside the rAF callback we only call `setText` when `now - lastTextUpdate >= 50`.

## 3. Implementation in React (no `setInterval`)

Pure `setInterval`/`setTimeout` will look **janky** because the loop won't sync with the browser's paint, and `setInterval` clamps to ~4ms in nested timers. **Use rAF for the loop. This is allowed — the existing test file asserts `requestAnimationFrame` is present, and rAF in the React snippet is the established pattern of this codebase.**

Why not setInterval: at 50ms intervals, the first scramble tick can land anywhere in a 50ms window relative to the slide-in, so the digits and the slide visually desync. rAF locks the loop to the paint frame, so the slide transition (CSS) and the text replacement (JS) feel locked together.

### 3.1 Skeleton (drop-in for the implementer)

```jsx
import { useEffect, useRef, useState } from "react";
import "./circular-reveal.css";

const GLYPHS = "0123456789";
const TARGET = "2032";
const DURATION = 900;        // ms
const TEXT_TICK_MS = 50;     // throttle text re-render
const STAGGER = 0.15;        // global-progress offset between cells
const SPAN = 0.4;            // fraction of global progress for one cell to calm down
const PROB_EXP = 1.6;        // calm-down curve exponent

function buildFrame(now, startAt, tick) {
  const gp = Math.min(1, (now - startAt) / DURATION);
  return [...TARGET].map((target, index) => {
    const cp = Math.min(1, Math.max(0, (gp - index * STAGGER) / SPAN));
    if (cp >= 1) return target;
    const pReplace = (1 - cp) ** PROB_EXP;
    // Always replace on the first tick of the cell (so we start random);
    // after that, flip a coin.
    const shouldReplace = tick === 0 || Math.random() < pReplace;
    if (!shouldReplace) {
      // We don't store per-cell state across ticks in this pure version,
      // so if we don't replace, we keep the previous frame's char.
      // This means the pure buildFrame() needs to be called with state.
      return target; // placeholder; see stateful version below
    }
    return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
  }).join("");
}
```

The above pure version has a bug: it doesn't remember the previous char when we choose *not* to replace. The shipped version must be **stateful per-cell**:

```jsx
function CircularRevealLabel({ active }) {
  const [text, setText] = useState(TARGET);
  const frameRef = useRef(0);
  const stateRef = useRef([...TARGET].map(() => ({ char: randomGlyph() })));

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    if (!active) {
      setText(TARGET);
      stateRef.current = [...TARGET].map(() => ({ char: randomGlyph() }));
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(TARGET);
      return;
    }
    const startAt = performance.now();
    let lastTextUpdate = -Infinity;
    let tick = 0;
    const loop = (now) => {
      const gp = Math.min(1, (now - startAt) / DURATION);
      let textDirty = false;
      for (let i = 0; i < TARGET.length; i++) {
        const cell = stateRef.current[i];
        const cp = Math.min(1, Math.max(0, (gp - i * STAGGER) / SPAN));
        if (cp >= 1) {
          if (cell.char !== TARGET[i]) { cell.char = TARGET[i]; textDirty = true; }
          continue;
        }
        const pReplace = (1 - cp) ** PROB_EXP;
        if (tick === 0 || Math.random() < pReplace) {
          cell.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          textDirty = true;
        }
      }
      if (now - lastTextUpdate >= TEXT_TICK_MS || gp === 1) {
        if (textDirty) setText(stateRef.current.map(c => c.char).join(""));
        lastTextUpdate = now;
        tick += 1;
      }
      if (gp < 1) frameRef.current = requestAnimationFrame(loop);
      else { frameRef.current = 0; stateRef.current = [...TARGET].map(() => ({ char: randomGlyph() })); }
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);

  return (
    <span className="btn-reveal-label" aria-hidden="true">
      {[...text].map((c, i) => (
        <span key={i} className={`btn-reveal-cell ${active ? "is-in" : ""}`}>{c}</span>
      ))}
    </span>
  );
}
```

This keeps rAF in the React snippet (matches repo contract), uses 4 small per-cell objects instead of a single string, and only triggers a React re-render when the displayed text actually changes (and throttled to 20Hz max).

### 3.2 CSS for the slide + circular shape

```css
.btn-reveal {
  --reveal-surface: transparent;
  --reveal-stroke: currentColor;
  --reveal-fill: currentColor;
  appearance: none;
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  padding: 0;
  border: 1.5px solid var(--reveal-stroke);
  border-radius: 50%;
  background: var(--reveal-surface);
  color: inherit;
  cursor: pointer;
  overflow: hidden;
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.02em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  touch-action: manipulation;
  user-select: none;
}
.btn-reveal-label { display: flex; gap: 0.05ch; }
.btn-reveal-cell {
  display: block;
  width: 1ch;
  height: 1em;
  text-align: center;
  transform: translateY(-100%);
  opacity: 0;
  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
              opacity 220ms cubic-bezier(0.22, 1, 0.36, 1);
}
.btn-reveal-cell.is-in {
  transform: translateY(0);
  opacity: 1;
}
.btn-reveal:focus { outline: none; }
.btn-reveal:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.btn-reveal:disabled { opacity: 0.4; cursor: not-allowed; }
@media (prefers-reduced-motion: reduce) {
  .btn-reveal-cell { transition: none; transform: none; opacity: 1; }
}
```

The `.is-in` class is added on hover and removed on hover-end. CSS handles the slide; JS handles the scramble. They run in parallel and visually overlap (slide 0→280ms, scramble 0→900ms, fully resolved 280→900ms with digits in place sliding).

## 4. Existing code review (file `src/buttons/ascii-scramble.js`)

**Current approach:**

```js
export const ASCII_SCRAMBLE_GLYPHS = "#*?>%0";
export const ASCII_SCRAMBLE_MS = 720;

export function buildAsciiScrambleFrame(text, progress, tick = 0) {
  const amount = Math.min(1, Math.max(0, progress));
  const resolved = Math.floor(text.length * amount);
  if (amount >= 1) return text;
  return [...text].map((character, index) => {
    if (character === " " || index < resolved) return character;
    return ASCII_SCRAMBLE_GLYPHS[(index + tick) % ASCII_SCRAMBLE_GLYPHS.length];
  }).join("");
}
```

What it does:

- `resolved = floor(4 * progress)` — counts how many leftmost cells are "locked in" (1, 2, 3, 4 as progress goes 0.25, 0.5, 0.75, 1.0).
- Unresolved cells display a glyph from a 6-symbol charset, deterministically chosen as `(index + tick) % 6`. **The displayed glyph is fully deterministic given the tick — it's not random at all.** It just *looks* random because the charset is `"#*?>%0"` and it cycles.
- The full reveal is a left-to-right lock-in over 720ms, with all unresolved cells cycling their glyphs in lockstep (every cell has the same `tick` offset by `index`).
- `progress === 1` short-circuits to the target text.
- Spaces pass through untouched.

**Critique vs. the user's brief:**

1. ❌ The glyph is deterministic, not random. The user explicitly asked for "a random glyph from a charset". The current code looks randomized but is actually a 6-step fixed cycle per cell.
2. ❌ The lock-in is a hard step (cell 1 either shows target or cycles glyph; there's no gradual calm-down). The user wants "resolves" which implies a smooth deceleration.
3. ❌ Charset is symbols-only (`#*?>%0`), wrong aesthetic for a numeric "2032" target.
4. ❌ No slide-in / slide-out animation — just an in-place text change. The user explicitly asked for "slide in from up to down" and unhover slide-out.
5. ✅ The throttled-rAF + 30Hz text-update pattern is solid and we should match it.
6. ✅ The `prefers-reduced-motion` short-circuit and the `activeRef`/`hoverRef`/`focusRef` triad are good patterns to copy.

**Recommendation: keep the rAF + 30Hz throttle + reduced-motion + focus/hover ref pattern. Replace the frame-builder with a stateful per-cell probability-decay model. Add CSS slide transitions on the cells. Switch charset to digits.**

The 3 new exported names from `src/buttons/numbers-resolve.js` should be:

```js
export const NUMBERS_RESOLVE_TARGET = "2032";
export const NUMBERS_RESOLVE_GLYPHS = "0123456789";
export const NUMBERS_RESOLVE_MS = 900;
```

A single `tickNumbersResolve(now, startAt, state)` mutator function (no `buildFrame` — we need stateful cells), or the equivalent of `buildFrame` but operating on the per-cell state object. See §3.1.

## 5. Concrete deliverable for the next agent

Files to create in `src/buttons/`:

1. `numbers-resolve.css` — the CSS from §3.2, with class prefix `btn-numbers-resolve-*` to match the repo's prefix convention.
2. `numbers-resolve.js` — `NUMBERS_RESOLVE_TARGET`, `NUMBERS_RESOLVE_GLYPHS`, `NUMBERS_RESOLVE_MS`, plus a stateful mutator.
3. `NumbersResolveButton.jsx` — the React component using the rAF pattern.
4. `numbers-resolve.snippets.js` — exports `NUMBERS_RESOLVE_SNIPPETS = { html, react, node }` and `NUMBERS_RESOLVE_META` matching the shape of `ASCII_SCRAMBLE_META`.
5. `numbers-resolve.test.js` — mirrors the structure of `ascii-scramble.test.js`, asserts:
   - `NUMBERS_RESOLVE_MS === 900`
   - Glyphs are digits-only
   - Component uses rAF + cancel
   - Component respects `prefers-reduced-motion`
   - Snippets contain the target `"2032"`, the slide CSS, the probability logic
   - `slots.js` is updated to import `NumbersResolvePreview` and add a slot

Naming: use `numbers-resolve` (kebab-case) for files, `NumbersResolve` (PascalCase) for the component, `NUMBERS_RESOLVE_*` (SCREAMING_SNAKE) for constants. Matches the repo's `ascii-scramble` ↔ `AsciiScramble` ↔ `ASCII_SCRAMBLE_*` convention exactly.

## 6. Open questions for the user (resolve before implementation)

1. **Visual container:** "circular hollow button" — should the unhovered state show an empty ring (no text) and the text only appears on hover? Or always show "2032" and just animate it in? The brief says "we render a 4-character string inside a circular hollow button on hover" → strongly implies **empty ring idle, "2032" appears on hover**. Confirm.
2. **Slide origin:** "slide in from up to down" → confirmed `translateY(-100% → 0)`. Unhover should reverse (`translateY(0 → -100%)`, opacity 1→0). Confirm reverse direction.
3. **Charset:** digits-only (`"0123456789"`) or digits+dot (`"0123456789·"`)? Default to digits-only unless the design has a "year ticker" theme that warrants the dot.
4. **Total duration:** 900ms default. OK to ship, or do you want 800ms (snappier) or 1000ms (more dramatic)?
5. **Reduced motion fallback:** on `prefers-reduced-motion`, the cells should appear instantly with `"2032"` filled in (no slide, no scramble). Confirm.
