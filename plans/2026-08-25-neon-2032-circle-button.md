# Neon-Stroke Circle Button with Scrambled "2032" Label

> Research + recommendation for a grayscale-default, neon-on-hover circular button whose scrambled `2032` label resolves into a matching neon glow.

## 1. Research — technique comparison

Evaluated against the brief (palette-locked, palette decay, reduced-motion, copyable snippet, works on both an SVG `<circle>` stroke and rendered text).

### 1.1 Single `filter: drop-shadow()`

- Pros: one line, no SVG markup, animates like any other property, respects `transition`. Works on SVG strokes because `drop-shadow` follows the alpha of the painted shape (stroke included).
- Cons: the glow always re-uses the source's foreground color, so to get a "cyan halo" the element itself must already be cyan. A `currentColor` shadow works if and only if the element's `color` is the neon color — fine for the text, awkward for an SVG that prefers `stroke: white` at rest.
- Verdict: **good fallback**, but you cannot separate the "ring color" from the "halo color" without tricks.

### 1.2 Stacked `drop-shadow()` (2–3 layers)

- Pros: closest CSS-only approximation of a tube light — tight bright inner glow + soft wide outer glow. Animate one stack with `transition: filter` and you get a single decay curve that takes the whole halo with it.
- Cons: each layer is a single color, so the gradient look (`cyan → magenta`) needs a real gradient source, not stacked shadows.
- Verdict: **primary pick for the circle stroke.** Smallest possible markup, perfect transition behavior, looks "expensive" when tuned correctly.

### 1.3 SVG `<filter>` with `feGaussianBlur` + `feMerge`

- Pros: most authentic neon — a blurred underlay of the same path merged under a crisp top stroke, color-controllable per layer, gradient-friendly via `feFlood`/`linearGradient`. Animates via `transition: filter` if you wrap it in a CSS variable or swap the entire `filter` URL on a class.
- Cons: more markup, can't be `transition`-ed by URL (you must toggle classes) and the inner `feGaussianBlur stdDeviation` is not animatable through CSS without SMIL. Snippet weight goes up.
- Verdict: **use only if the design demands a multi-color gradient halo.** For a single saturated accent, stacked `drop-shadow` wins on simplicity.

### 1.4 `box-shadow` on a wrapper div

- Pros: nothing.
- Cons: only follows rectangular bounding boxes; does not follow an SVG stroke. **Rejected.**

### 1.5 `text-shadow`

- Pros: per-glyph, animates cleanly, no layout cost, naturally matches the text color if you use `currentColor`.
- Cons: identical to `drop-shadow` for the visual result, but limited to text. Cannot drive the circle's halo.
- Verdict: **primary pick for the `2032` label.** A stacked `text-shadow` is the most reliable, well-supported, reduced-motion-friendly way to put a glow on text. SVG `<text>` could use `filter: drop-shadow` instead, but plain DOM text + `text-shadow` is the path of least resistance inside a React button.

### 1.6 `mix-blend-mode: lighten` / `screen`

- Pros: makes the neon pop against a dark background without a real "additive" paint; essentially free.
- Cons: needs a *dark* background to be visible. The button must be palette-locked to grayscale by default and only briefly goes neon; relying on `mix-blend-mode` couples the look to the page background.
- Verdict: **optional add-on, not the carrier.** Worth a single line in the dark-theme variant; do not gate the look on it.

## 2. Recommendation

| Element         | Primary technique                                  | Why                                                                                                   |
| --------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Circle stroke   | **Stacked `filter: drop-shadow()` (3 layers)**     | Animates with one CSS transition, follows the stroke alpha, no SVG `<filter>` markup, snippet stays 3-tap. |
| Text "2032"     | **Stacked `text-shadow` (3 layers, `currentColor`)** | Per-glyph glow, identical decay curve to the ring, no SVG needed, reduced-motion trivial to disable. |
| Optional polish | `mix-blend-mode: screen` on the glowing layer      | Use only inside `[data-theme="dark"]` so light themes keep the look honest.                           |

### Color: single saturated accent, not a gradient

The brief calls for "cyan or electric blue". A single accent reads as **a designed neon**; a `cyan → magenta` gradient reads as **a VFX demo** and clashes with grayscale. Ship a single hue by default and expose one CSS custom property (`--neon`) so the consumer can swap it without touching the rule body.

```
--neon: #4cc9ff;   /* electric blue, designer-overridable */
```

Add a `prefers-color-scheme: dark` adjustment only if you also invert the ring/text to white.

### Decay strategy: pure CSS transition

- Hover-in is the forward transition; hover-out is the reverse. The same `transition: stroke 600ms, color 600ms, filter 600ms, text-shadow 600ms` rule produces both.
- The scramble → resolved transition is the same timeline because both the ring's `color`/`filter` and the text's `color`/`text-shadow` share the easing token.
- 600ms is the right number for "briefly turns neon". Use `cubic-bezier(0.22, 1, 0.36, 1)` (a standard "ease-out-quint") so the glow rises fast and fades slowly, matching the brief's "decay" feel.
- No `useState`, no `requestAnimationFrame` for the glow. (The scramble itself still needs RAF for the character swap; the glow does not.)
- Reduced motion: set the transition duration to `0ms` and rely on an instant color swap. The text is the scramble's responsibility — it already snaps to the resolved label under reduced motion.

## 3. Concrete CSS (paste straight into a `.css` file)

```css
/* ---- tokens ------------------------------------------------------------- */
.btn-neon2032 {
  /* palette-locked defaults */
  --ink: #111111;
  --paper: #ffffff;
  /* the one designer-overridable accent */
  --neon: #4cc9ff;
  /* timing */
  --neon-rise-ms: 220ms;
  --neon-decay-ms: 900ms;
  --neon-ease: cubic-bezier(0.22, 1, 0.36, 1);

  appearance: none;
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 96px;
  height: 96px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  cursor: pointer;
  font-family: "JetBrains Mono", ui-monospace, monospace;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.08em;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

[data-theme="dark"] .btn-neon2032 {
  --ink: #f5f5f5;
  --paper: #0b0b0b;
}

/* ---- the ring (SVG <circle>) ------------------------------------------- */
.btn-neon2032-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--ink);
  stroke-width: 1.5;
  transition:
    stroke var(--neon-decay-ms) var(--neon-ease),
    filter  var(--neon-decay-ms) var(--neon-ease);
  will-change: stroke, filter;
}

/* ---- the scrambled label ----------------------------------------------- */
.btn-neon2032-label {
  position: relative;
  z-index: 1;
  color: var(--ink);
  text-shadow: none;
  transition:
    color     var(--neon-decay-ms) var(--neon-ease),
    text-shadow var(--neon-decay-ms) var(--neon-ease);
  font-variant-numeric: tabular-nums;
}

/* ---- neon state (hover + keyboard focus + active scramble) ------------- */
.btn-neon2032:hover .btn-neon2032-ring,
.btn-neon2032:focus-visible .btn-neon2032-ring,
.btn-neon2032.is-scrambling .btn-neon2032-ring {
  stroke: var(--neon);
  filter:
    drop-shadow(0 0 2px  var(--neon))
    drop-shadow(0 0 6px  var(--neon))
    drop-shadow(0 0 14px color-mix(in oklab, var(--neon) 70%, transparent));
}

.btn-neon2032:hover .btn-neon2032-label,
.btn-neon2032:focus-visible .btn-neon2032-label,
.btn-neon2032.is-scrambling .btn-neon2032-label {
  color: var(--neon);
  text-shadow:
    0 0 2px  var(--neon),
    0 0 6px  var(--neon),
    0 0 14px color-mix(in oklab, var(--neon) 70%, transparent);
}

/* ---- dark-theme blend polish (optional, not load-bearing) -------------- */
[data-theme="dark"] .btn-neon2032:hover .btn-neon2032-ring,
[data-theme="dark"] .btn-neon2032:focus-visible .btn-neon2032-ring,
[data-theme="dark"] .btn-neon2032.is-scrambling .btn-neon2032-ring,
[data-theme="dark"] .btn-neon2032:hover .btn-neon2032-label,
[data-theme="dark"] .btn-neon2032:focus-visible .btn-neon2032-label,
[data-theme="dark"] .btn-neon2032.is-scrambling .btn-neon2032-label {
  mix-blend-mode: screen;
}

/* ---- focus ring (separate from neon, accessibility) -------------------- */
.btn-neon2032:focus { outline: none; }
.btn-neon2032:focus-visible::after {
  content: "";
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  outline: 2px solid var(--neon);
  outline-offset: 3px;
}

/* ---- disabled ---------------------------------------------------------- */
.btn-neon2032:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}
.btn-neon2032:disabled .btn-neon2032-ring,
.btn-neon2032:disabled .btn-neon2032-label {
  filter: none;
  text-shadow: none;
}

/* ---- reduced motion: instant swap, no pulse, no decay ------------------ */
@media (prefers-reduced-motion: reduce) {
  .btn-neon2032-ring,
  .btn-neon2032-label {
    transition: none;
  }
}
```

### Why those three shadow layers

| Layer | Blur | Color                                                 | Role                              |
| ----- | ---- | ----------------------------------------------------- | --------------------------------- |
| 1     | 2px  | full `--neon`                                         | crisp inner core, the "tube"      |
| 2     | 6px  | full `--neon`                                         | mid-glow that sells the neon      |
| 3     | 14px | `color-mix(... 70%, transparent)` — no `rgba` needed  | soft outer halo, blends with page |

`color-mix` keeps the third layer in the same hue as the first two and lets you swap `--neon` to a gradient palette in a dark theme without rewriting the stack. `drop-shadow` does not accept a gradient, so a `cyan → magenta` halo would require an SVG `<filter>` — out of scope for the 3-tap CSS-only deliverable.

## 4. React component shape (no `useState` for the glow)

The glow is pure CSS. The component only needs one piece of state for the scramble, which already exists in the `AsciiScrambleButton` pattern.

```jsx
import { useEffect, useRef, useState } from "react";
import "./btn-neon2032.css";

const SCRAMBLE_CHARS = "01#%*+<>{}[]/\\?$";
const SCRAMBLE_MS = 600;

function scrambleFrame(target, progress, tick) {
  if (progress >= 1) return target;
  return [...target]
    .map((ch, i) => {
      const local = Math.min(1, progress * (1 + i * 0.15));
      if (local >= 1) return ch;
      const idx = (tick * 3 + i * 7) % SCRAMBLE_CHARS.length;
      return SCRAMBLE_CHARS[idx];
    })
    .join("");
}

export function Neon2032Button({ label = "2032", disabled = false, onClick, className = "", ...rest }) {
  const [scrambling, setScrambling] = useState(false);
  const [displayed, setDisplayed] = useState(label);
  const activeRef = useRef(false);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const frameRef = useRef(0);
  const labelRef = useRef(label);
  labelRef.current = label;

  const start = () => {
    if (activeRef.current) return;
    activeRef.current = true;
    setScrambling(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(labelRef.current);
      activeRef.current = false;
      setScrambling(false);
      return;
    }
    const t0 = performance.now();
    let tick = 0;
    const tick_ = (now) => {
      const p = Math.min(1, (now - t0) / SCRAMBLE_MS);
      setDisplayed(scrambleFrame(labelRef.current, p, tick++));
      if (p < 1) frameRef.current = requestAnimationFrame(tick_);
      else { activeRef.current = false; setScrambling(false); }
    };
    frameRef.current = requestAnimationFrame(tick_);
  };

  const stop = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    activeRef.current = false;
    setDisplayed(labelRef.current);
    setScrambling(false);
  };

  useEffect(() => () => stop(), []);
  useEffect(() => { if (disabled) stop(); }, [disabled]);

  const cls = [
    "btn-neon2032",
    scrambling ? "is-scrambling" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      {...rest}
      type="button"
      className={cls}
      disabled={disabled}
      aria-label={label}
      onPointerEnter={(e) => { if (!disabled && e.pointerType !== "touch") { hoverRef.current = true; start(); } }}
      onPointerLeave={(e) => { if (e.pointerType !== "touch") { hoverRef.current = false; stop(); } }}
      onFocus={(e) => { if (e.currentTarget.matches(":focus-visible")) { focusRef.current = true; start(); } }}
      onBlur={() => { focusRef.current = false; stop(); }}
      onClick={onClick}
    >
      <svg className="btn-neon2032-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle cx="50" cy="50" r="48" />
      </svg>
      <span className="btn-neon2032-label" aria-hidden="true">{displayed}</span>
    </button>
  );
}
```

Notes on the React shape:
- The `is-scrambling` class is added while the scramble animation is running, so the CSS rule `.btn-neon2032.is-scrambling .btn-neon2032-ring` carries the neon glow for the full duration of the scramble, then the class drops and the CSS transition does the decay. This is exactly the "neon state decays back to grayscale over ~600–1200ms after the hover ends" behaviour from the brief, with no JS-driven timing.
- The scramble RAF and the CSS transition are decoupled. If the user mouses out mid-scramble, `stop()` snaps the label to the resolved value but the ring still gets to ease back via the CSS transition. That is the desired effect.
- No `useState` for the glow. No `filter` URL swapping. No SVG `<filter>`. Copy-pastable.

## 5. HTML + CSS standalone snippet (3-tap #1)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Neon 2032</title>
    <link rel="stylesheet" href="btn-neon2032.css" />
  </head>
  <body style="background:#fff;display:grid;place-items:center;min-height:100vh;margin:0;">
    <button class="btn-neon2032" type="button" aria-label="2032">
      <svg class="btn-neon2032-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <circle cx="50" cy="50" r="48" />
      </svg>
      <span class="btn-neon2032-label" aria-hidden="true">2032</span>
    </button>
    <script>
      // minimal scramble — replace with the full RAF loop if you want hover-driven animation
      const btn = document.querySelector(".btn-neon2032");
      const lbl = btn.querySelector(".btn-neon2032-label");
      const TARGET = "2032";
      const CHARS = "01#%*+<>{}[]/\\?$";
      const DURATION = 600;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

      btn.addEventListener("pointerenter", () => {
        if (reduce) { lbl.textContent = TARGET; btn.classList.add("is-scrambling"); return; }
        btn.classList.add("is-scrambling");
        const t0 = performance.now();
        let tick = 0;
        function frame(now) {
          const p = Math.min(1, (now - t0) / DURATION);
          lbl.textContent = [...TARGET].map((c, i) => {
            const local = Math.min(1, p * (1 + i * 0.15));
            if (local >= 1) return c;
            return CHARS[(tick * 3 + i * 7) % CHARS.length];
          }).join("");
          tick++;
          if (p < 1) requestAnimationFrame(frame);
          else btn.classList.remove("is-scrambling");
        }
        requestAnimationFrame(frame);
      });

      btn.addEventListener("pointerleave", () => {
        lbl.textContent = TARGET;
        btn.classList.remove("is-scrambling");
      });
    </script>
  </body>
</html>
```

## 6. Node snippet (built-in `node:http`, 3-tap #3)

```js
// server.js — run with `node server.js`, then open http://localhost:4173
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(join(here, "btn-neon2032.css"), "utf8");

const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Neon 2032</title>
<style>${css}</style></head>
<body style="background:#fff;display:grid;place-items:center;min-height:100vh;margin:0;">
  <button class="btn-neon2032" type="button" aria-label="2032">
    <svg class="btn-neon2032-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="48" />
    </svg>
    <span class="btn-neon2032-label" aria-hidden="true">2032</span>
  </button>
</body></html>`;

createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(page);
}).listen(4173, () => console.log("http://localhost:4173"));
```

## 7. What this deliberately does *not* do

- No SVG `<filter>`. Stacked `drop-shadow` covers the look with one CSS line per layer and animates with one transition. If a future brief needs a true gradient halo, swap the ring's `filter` for an inline `<defs><filter id="neon">…</filter></defs>` and a `feFlood`+`linearGradient` source. The text keeps `text-shadow`.
- No JS-driven timing on the glow. The decay is a CSS `transition` reverse, which is robust to focus/hover races and to mid-scramble cancellations.
- No `box-shadow` on the ring. It cannot follow the stroke and would be a visible square at the corners of a square bounding box.
- No `mix-blend-mode` on the light theme. The brief is grayscale by default; an additive blend would make the neon look like a Photoshop filter and would not survive a light-on-white hero.
