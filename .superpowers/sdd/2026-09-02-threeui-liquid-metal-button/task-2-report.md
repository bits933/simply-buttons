# Task 2 report — ThreeUI Liquid Metal Pill

## Scope

- Added `ThreeUiLiquidMetalPillPreview`, which imports the exact local `LiquidMetalButton` and `threeui.css` and renders only `<LiquidMetalButton variant="pill" />`.
- Added a Node-only generator for aligned HTML, React, and Node snippets. The generated HTML is byte-for-byte the canonical local document.
- Added the `threeui-liquid-metal` gallery item after `liquid-metal-play` in the working tree without modifying the existing Play Circle files.

## TDD evidence

RED:

```text
$ node --test src/buttons/threeui-liquid-metal-pill.test.js
✖ ThreeUI liquid metal pill registers the canonical Sign up button
AssertionError: missing pill preview
tests 1; pass 0; fail 1
```

GREEN:

```text
$ node --test src/shaders/liquid-metal-button/liquid-metal-button.source.test.js src/buttons/threeui-liquid-metal-pill.test.js
tests 3; pass 3; fail 0

$ npm run build
✓ built in 12.31s
```

## Browser evidence

- Desktop local gallery: `#threeui-liquid-metal` was visible at 664.0 × 384.5px, with one iframe, a visible **Sign up** control, and its visible `canvas#fx`.
- Moving the real pointer to the pill changed the iframe body to `hot`, confirming the live hover/pointer response. A real click was sent to the same control; the source-integrity test covers the authored `pointerdown` → `addRipple` faceted-ripple path.
- Mobile viewport: the responsive tray measured 390.2 × 384.5px. Chrome timed out while scrolling the offscreen mobile tray to trigger its intersection-mounted iframe; the viewport was reset afterwards.
- Browser logs had no Liquid Metal, WebGL, shader, or asset errors. Existing unrelated app logs remain: invalid SVG React property names and a Three.js `Clock` deprecation.

## Review and concerns

- Reviewed the Task 2 files and confirmed the preview contains no local shader/canvas implementation, the snippets use only `node:http`, and the generated HTML equals the canonical source.
- `graphify update .` completed after each change using code-only AST extraction; semantic extraction was not needed. It warned that the installed package is newer than the skill guidance and that labels may need refresh.
- `src/slots.js` has a pre-existing 579-line unstaged gallery expansion. The new item is inside its already-uncommitted `awwwards` category, so staging that file would also commit unrelated user work. Its Task 2 change remains in the working tree for the parent integration commit; all separately stageable Task 2 files are committed below.

## Commits

Primary Task 2 code commit: `4176914` (`feat: add ThreeUI liquid metal gallery button`).
