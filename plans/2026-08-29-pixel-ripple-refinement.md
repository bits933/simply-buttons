# Pixel Ripple Refinement (Shadow Opacity & Dot Hover Contrast)

**Goal:** Refine gallery button 45 (Pixel Ripple) so that:
1. The top inner white shadow opacity is reduced for a subtler, sleeker edge highlight.
2. On hover, each dot's opacity increases proportionally according to its inactive base opacity (e.g. 10% base opacity increases by +20% to 30%, 20% base opacity increases by +40% to 60%) so that dots do NOT collapse into a single uniform opacity.

**Tech Stack:** React 19, TypeScript/TSX, HTML5 Canvas 2D, CSS, Node test runner, Vite.

## Proposed Changes

- **Styles**:
  - In `PixelRippleButton.tsx`, adjust top white inner shadows:
    - Base `.pixel-ripple-button`: `inset 0 1.5px 1px rgb(255 255 255 / 10%)`
    - Overlay `.pixel-ripple-button::after`: `inset 0 1.5px 1.5px rgb(255 255 255 / 12%)`
    - Hover `.pixel-ripple-button:hover`: `inset 0 1.5px 1px rgb(255 255 255 / 14%)`
- **Render Loop**:
  - Replace `hoverLift = pointerStrength * 0.65` with proportional formula:
    `const hoverLift = tile.noise * (pointerStrength * 2.0);`
  - In `render`, calculate tile opacity with proportional lift and bounded by `Math.min(1, tile.noise + hoverLift + rippleStrength * 0.75)`.
- **Tests**:
  - Update `src/buttons/pixel-ripple-refinement.test.js` to assert proportional hover formula and reduced shadow opacity.

## Verification
- Unit tests: `node --test src/buttons/pixel-ripple*.test.js`
- Visual inspection via browser subagent
- Build: `npm run build`
- Graph update: `/graphify --update`
