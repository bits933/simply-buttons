# Plan: Add the Go Premium dust-dissolve button

Append the attached Qwen “Go Premium — Dust Button” (WebGL particle scatter + reform) as the next filled gallery tray.

## Goal kind

code-change

## Source

`Qwen_html_20260901_5hh589y7g.html` — orange-red pill (gallery size 220×64, down from the source 380×110), click dissolves it into dust from the pointer, particles scatter (~3.2s), hold, then reform (~1.6s) and settle.

## Color exception

PROJECT.md grayscale lock: this tray only may use the source gradient `#f2464d → #f0821e` and the warm shadow `rgba(238, 92, 60, .38)`. The user attached this colored specimen and asked to add it.

## Acceptance criteria

1. Live preview: real `<button type="button">` labeled **Go Premium**. WebGL draws the pill; the HTML button stays a hit target. Click from the pointer (keyboard uses center) starts the dissolve. A second click is ignored until the sequence returns to rest. WebGL unavailable or `prefers-reduced-motion: reduce` shows the CSS pill (`data-dust-fallback`).
2. Canvas is **local to the specimen** (not `position: fixed` over the gallery). Particles may fly inside the tray / fullscreen preview and clip at those edges.
3. Appended as the next filled tray (do not reorder). Three copy-paste stacks (HTML+CSS, React, Node) reproduce the same pill, gradient, and dissolve without this repo.
4. Unique class prefix: `dust-premium`.

## Files

- Create: `src/buttons/dust-premium.gl.js` (timing, GLSL, `initDustPremium`)
- Create: `src/buttons/dust-premium-button.css`
- Create: `src/buttons/DustPremiumButton.jsx`
- Create: `src/buttons/dust-premium-button.snippets.js`
- Create: `src/buttons/dust-premium-button.test.js`
- Update: `src/slots.js` (append after `claude-code`)
- This plan

## Tests

`node --test src/buttons/dust-premium-button.test.js`

- Phase clock: 1→2, 2→3, 3→0 using shipped `stepDustClock`
- Settle ease `p*p*(3-2*p)`, wave radius, quad alpha
- Click origin adds PAD and NOISE_AMP
- Shaders include `aHome`, `scatterPos`, `front(`, `gl_PointCoord`
- META / slots registration / all three snippets contain `Go Premium`, `webgl`, `#f2464d`
