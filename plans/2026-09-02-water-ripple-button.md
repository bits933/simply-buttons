# Implementation Plan - Water Ripple Button (Qwen HTML)

Replace gallery slot **129** (`water-ripple`) with the specimen in
`C:\Users\User\Downloads\Qwen_html_20260902_buz9mzywq.html`.

That file is a 220×65 teal water pill using **jquery.ripples 0.6.3**:
generated PNG water texture, resolution 256, dropRadius 25, perturbance 0.05,
interactive pointer ripples, plus an extra click drop `(30, 0.08)`.

The gallery does **not** load jQuery. `water-ripple-webgl.js` is a vanilla
port of the same shaders and pointer strengths so the live preview matches
the HTML without a CDN.

## Files

- `src/buttons/water-ripple-webgl.js` — `makeWaterTexture()` + `initWaterRipple(button)`
- `src/buttons/water-ripple-button.css` — Qwen pill styling, `--wr-splash` marker
- `src/buttons/WaterRippleButton.jsx` — live preview
- `plans/water-ripple-gen.js` — embeds CSS + WebGL into the three snippets
- `src/buttons/water-ripple-button.snippets.js` — HTML / React / Express
- `src/buttons/water-ripple-button.test.js`
- `src/slots.js` — already registered as slot 129; not reordered

## Verification

- `node --test src/buttons/water-ripple-button.test.js src/search.test.js`
- Browser: `/?q=ripple` — 220×65 pill, wave texture, pointer ripples, click splash
- `graphify update .`
