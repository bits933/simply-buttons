# ThreeUI Liquid Metal Sign Up Pill

Integrate the exact registered ThreeUI `LiquidMetalButton` pill as the next Simply Buttons gallery tray without changing the existing Liquid Metal Play card.

## Source contract

- Fetch only `https://threeui.com/source-code/liquid-metal-button.json`.
- Preserve these registered files byte-for-byte:
  - `src/shaders/liquid-metal-button/LiquidMetalButton.tsx` — `89b940bab445f17fafb444a7833b3c785d24c86a28156d8ad231e18de9503e11`
  - `src/shaders/liquid-metal-button/liquid-metal-button.html` — `76624e881a3aecbd79b473d9c51f53c7157d47052abd0f9dc28fefd223b0a819`
  - `src/shaders/threeui.css` — `efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf`
- Render the configured usage exactly: `<LiquidMetalButton variant="pill" />`.

## Task 1 — exact registered source

Add a built-in Node materializer and focused integrity test. Verify all paths and hashes before writing, preserve LF bytes, run the test and production build, and commit only source-task files.

## Task 2 — gallery integration

- Add `src/buttons/ThreeUiLiquidMetalPillPreview.jsx` importing the exact component and `threeui.css` and rendering only the configured pill usage.
- Add `src/buttons/threeui-liquid-metal-pill.snippets.js`, `src/buttons/threeui-liquid-metal-pill.test.js`, and `plans/threeui-liquid-metal-pill-snippets-gen.mjs`.
- Generate copyable HTML from the canonical HTML, React from exact-source imports plus the pill Scene, and Node with built-in `node:http` serving the canonical HTML.
- Export ID `threeui-liquid-metal`, name `Liquid metal`, and states for default, hover, focus-visible, active, and ripple.
- Append one final gallery tray; do not reorder or alter earlier trays, especially existing `liquid-metal-play`.
- Run focused source/integration tests and the production build.
- Browser-verify the visible Sign up pill, hover spectral/pointer response, press ripple, responsive tray sizing, and absence of WebGL/shader/console errors.

## Completion

Run independent per-task reviews and a final full-range review, refresh Graphify, and report only after checks pass.
