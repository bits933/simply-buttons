# ThreeUI Generate / Spinning Border / Plasma Drive buttons (trays 132–134)

Integrate the three requested ThreeUI components from their exact registered
source bundles — not from the docs previews.

| Button | Component · Variant | Bundle | Canonical HTML SHA-256 |
| --- | --- | --- | --- |
| Generate Button (tray 132) | `RectangleButtons` · `generate-button` | <https://threeui.com/source-code/generate-button.json> | `e99ab802a1e1f1a7b1444727e26197c43f8cfe328ca6e2cd45b6fbb3bce694c6` |
| Spinning Border (tray 133) | `RectangleButtons` · `spinning-border-button` | <https://threeui.com/source-code/spinning-border-button.json> | `d7150ca6ca4ad7975ba183c368b25a5de266e6a018c801b89720b8e8e3fab8a7` |
| Plasma Drive (tray 134) | `ShaderButtons` · `plasma-button` (canonical `aetheris-labs.html`) | <https://threeui.com/source-code/plasma-button.json> | `eea617fe0e37a79be7aee44f00a53ec3ae41e006e771a8aad53acce3648147e0` |

Configured usage for all three: `mode="dark"` `hue={0}` `saturation={1.00}`
`brightness={1.00}` → identity, no filter applied.

## What was built (per button, house dot-border/liquid-metal pattern)

### Generate — `id: "generate-button"`, files
- `src/buttons/generate-button.source.html` — registered canonical HTML, byte-for-byte (SHA-pinned in test)
- `src/buttons/GenerateButton.jsx` — `RectangleButtons` port: `clamp()` hue/sat/brightness guard, `data-generate` + `data-mode` root; letters rendered via spans (Chromium clamps the authored `word-spacing: -1em` to zero, so adjacent spans are the faithful rendering)
- `src/buttons/generate-button.css` — authored rules scoped under `[data-generate]`; Tailwind `px-3 py-2 md:px-4 md:py-2 focus:outline-none` translated; keyframes prefixed `generate-*` to avoid collisions; house dark ground `#111318` / light `#f4f7fb` + `--generate-cta: 1` marker
- Snippets/test: `generate-button.snippets.js` + `generate-button.test.js` (via `plans/threeui-buttons-gen.js`)

### Spinning Border — `id: "spinning-border-button"`, files
- `src/buttons/spinning-border-button.source.html` — canonical (SHA-pinned)
- `src/buttons/SpinningBorderButton.jsx` — `RectangleButtons` port: beam span (conic-gradient `spin 3s`), static zinc ring, gradient surface + label + arrow
- `src/buttons/spinning-border-button.css` — Tailwind utilities translated 1:1 (zinc-800 `#27272a`, zinc-950 `#09090b`, zinc-400 `#a1a1aa`; `pt-2.5 pr-6` → `padding: 0.625rem 1.5rem`); `--spinning-border-cta: 1` marker
- Snippets/test same pattern

### Plasma Drive — `id: "plasma-button"`, files
- `src/buttons/aetheris-labs.source.html` — canonical (SHA-pinned)
- `src/buttons/PlasmaButton.jsx` — `ShaderButtons` port; `useEffect` mounts `initAetherisDrive(btn, {reduced})`, StrictMode-safe destroy
- `src/buttons/aetheris-webgl.js` — vanilla port of BOTH canonical engines: ambient fbm cosmic-void field on `.aetheris-bg` (fades to authored 0.45) + drive shader (`u_heat`/`u_flash`/churn time; heat lerps `dt*6`, erupt decays `exp(-3.2*dt)`, churn `0.35 + heat*1.1 + erupt*2.2`; hover/focus shadow swap; reduced-motion pins time at 6.0); no-WebGL → `.nogl` gradient face
- `src/buttons/plasma-button.css` — Tailwind translation (250×70, rounded-2xl = 16px, `cubic-bezier(0.34,1.4,0.5,1)` 220ms, `#00d2ff` focus ring); ground `#020614` (canonical theme); light mode inverts the bg field per ThreeUI isolation transform
- Snippets/test same pattern; react/html/node embed the full engine

## Slot registration & counts

- `slots.js`: three entries appended after `liquid-metal-play`. NOTE: a concurrent
  session later moved `threeui-liquid-metal` (pill) to the tail — live order is
  … 131 liquid-metal-play, 132 generate-button, 133 spinning-border-button,
  134 plasma-button, 135 threeui-liquid-metal (135 trays total).
- Count pins bumped: `awwwards-10-buttons.integration.test.js` order.length
  131→135 (+ tail ids), `twitter-50.test.js` filled 131→135.
- Fixed en route: `threeui-liquid-metal-pill.snippets.js` META shipped only 6
  keywords, failing the repo-wide search contract test → topped up to 18 in
  `plans/threeui-liquid-metal-pill-snippets-gen.mjs` (its generator) and regenerated.

## Verification

- `node --test "src/buttons/*.test.js" "src/buttons/twitter-50/*.test.js" "src/*.test.js" "src/shaders/liquid-metal-button/*.test.js"` → **182/182 pass**.
- Canonical ground truth measured live: generate letters render adjacent
  (G right=616 = e left — negative word-space clamps to 0); prismatic hue
  resolves (`hsl(210deg, 100%, 70%)` → `rgb(102,179,255)`); spinning button
  renders 175×38, padding 10px 24px, 12px/500 label, 8px gap, 1.2px tracking.
- Gallery (post-reload; HMR remount leaves stale WebGL state — always reload):
  trays 132/133/134 present; generate plate `rgb(16,16,16)` on `#111318` with
  783 bright shimmering-letter pixels; spinning idle beam 0 / ring 1; plasma
  drive 250×70 program-bound + ambient canvas at opacity 0.45, cosmic blue
  field confirmed by pixel analysis (43,865 blue-dominant px).
- Interactions: spinning hover → beam `opacity 1` + `spinning-border-spin`
  running, ring → 0, label → `rgb(255,255,255)`, arrow `translateX(2px)`;
  plasma hover → shadow swaps to `rgba(0,150,220,0.35)…` (press flash fires
  through the same listener chain).

## Pitfalls recorded

- IAB throttled-pane rollback: injected styles/classes can silently revert
  between evaluate calls — probe within one evaluate window.
- Clip-parameter screenshots of the IAB pane lag the committed scroll; full
  viewport screenshot + DOM-reported rect is the reliable pairing.
- WebGL readback without `preserveDrawingBuffer` returns zeros — judge
  painting by screenshot pixels, not readPixels.
- HMR remount of a WebGL button leaves dead canvases (no program bound) until
  a real reload.
- Node-snippet content checks must account for JSON escaping (`aria-label`
  becomes `aria-label=\"…\"` in the embedded string).
