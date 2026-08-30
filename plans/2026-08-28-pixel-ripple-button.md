# Pixel Ripple Button

## Goal

Add a self-contained React + TypeScript canvas button that recreates the supplied blue pixel-pill reference: a stationary rounded-square grid, cursor-lit tile trail, click-origin radial brightness ripples, and a permanently crisp label.

## Implementation

- Add `PixelRippleButton.tsx` with a native button, a high-DPI canvas capped at device-pixel-ratio 2, and embedded CSS for the button and optional gallery preview frame.
- Render a 42 by 13 clipped grid with deterministic luminance variation. Track pointer samples and ripple origins in refs; use `requestAnimationFrame` only while a pointer trail or ripple is alive.
- Trigger a center ripple with Enter/Space. Reduced motion uses a 120ms full-fill flash while preserving the native click callback.
- Add gallery metadata and the React usage snippet, register the preview in `src/slots.js`, and cover component and registration requirements with a focused Node test.

## Verification

- Run the focused test red before production code, then green after implementation.
- Run the gallery test and production build; visually inspect hover, left/right/center ripples, overlap, and the reduced-motion fallback.

## Result

- Registered as gallery item 45.
- Focused gallery/component tests pass (4/4), the production build completes, and live canvas QA confirms the tile field, hover trail, overlapping point-origin ripples, stable 240×64 size, and locked label.
