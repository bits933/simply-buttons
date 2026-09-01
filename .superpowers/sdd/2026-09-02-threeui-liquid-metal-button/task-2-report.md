# Task 2 report — ThreeUI Liquid Metal Pill

## Scope

- Added `ThreeUiLiquidMetalPillPreview`, which imports the exact local `LiquidMetalButton` and `threeui.css` and renders only `<LiquidMetalButton variant="pill" />`.
- Added a Node-only generator for aligned HTML, React, and Node snippets. The generated HTML is byte-for-byte the canonical local document.
- Added the `threeui-liquid-metal` gallery item as the final tray in the working tree without modifying the existing Play Circle files.
- Follow-up: removed gallery/modal padding only for the two Liquid Metal integrations and made each source viewport inverse-sized and uniformly scaled to the preview root. The source bloom therefore fits before the card boundary; the registered source files and all copyable configured usages remain unchanged.

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

Scale follow-up RED/GREEN:

```text
$ node --test src/buttons/threeui-liquid-metal-pill.test.js
AssertionError: missing pill presentation stylesheet

$ node --test src/shaders/liquid-metal-button/liquid-metal-button.source.test.js src/buttons/threeui-liquid-metal-pill.test.js
tests 3; pass 3; fail 0
```

Clipping follow-up GREEN:

```text
$ node --test src/buttons/threeui-liquid-metal-pill.test.js src/buttons/liquid-metal-button.test.js
tests 2; pass 2; fail 0
```

Final focused verification:

```text
$ node --test src/shaders/liquid-metal-button/liquid-metal-button.source.test.js src/buttons/threeui-liquid-metal-pill.test.js src/buttons/liquid-metal-button.test.js
tests 4; pass 4; fail 0

$ npm run build
built successfully; the existing font-resolution, eval, and chunk-size warnings remain
```

## Browser evidence

- Desktop local gallery: `#threeui-liquid-metal` was visible at 664.0 × 384.5px, with one iframe, a visible **Sign up** control, and its visible `canvas#fx`.
- Moving the real pointer to the pill changed the iframe body to `hot`, confirming the live hover/pointer response. A real click was sent to the same control; the source-integrity test covers the authored `pointerdown` → `addRipple` faceted-ripple path.
- Mobile viewport: the responsive tray measured 390.2 × 384.5px. Chrome timed out while scrolling the offscreen mobile tray to trigger its intersection-mounted iframe; the viewport was reset afterwards.
- Browser logs had no Liquid Metal, WebGL, shader, or asset errors. Existing unrelated app logs remain: invalid SVG React property names and a Three.js `Clock` deprecation.
- Scale recheck: the preview-modal iframe measured 949.1 × 685.6px; dividing by the selected 0.9 scale gives 1054.5 × 761.8px, confirming uniform 90% presentation scaling. The scaled **Sign up** control still entered `hot` on pointer hover and accepted a click; no Liquid Metal logs were emitted.
- Clipping recheck: in the gallery, the Play Circle iframe now measures 395.0px high against a 395.0px source stage; the 200px card clips only that correctly rendered viewport. The new pill's iframe is 210.0px after its 0.9 presentation scale and its source stage is 233.4px, so the source stage fits before the card boundary clips the 5px visual overscan. A direct **Sign up** click again set the source body to `hot`.

## Review correction and final evidence

- Addressed every required finding in `task-2-review.md`: both layers use an inverse-size plus uniform-scale fit contract, and the new pill registration is the final literal `RAW` item.
- Desktop: each 662.5px by 200.0px preview root has a transformed iframe/content box of the same 662.5px by 200.0px bounds. The internal authored stages are 233.4px (pill) and 395.0px (Play), so their complete bloom fields are first scaled to the root instead of being cropped by it.
- Mobile: each responsive 400.0px by 200.0px preview root has a matching 400.0px by 200.0px transformed iframe/content box. Both source buttons mounted and direct Play/Sign up clicks set their source body to `hot`.
- Browser console filter `liquid` returned no warning or error records. The temporary mobile viewport override was reset.
- The focused test derives stage height from the registered 900/516 bloom padding formula and asserts the configured scale resolves to the fixed 200px card. It also asserts the Liquid Metal pill is the final literal item in `RAW`.

## Review and concerns

- Reviewed the Task 2 files and confirmed the preview contains no local shader/canvas implementation, the snippets use only `node:http`, and the generated HTML equals the canonical source.
- `graphify update .` completed after each change using code-only AST extraction; semantic extraction was not needed. It warned that the installed package is newer than the skill guidance and that labels may need refresh.
- The focused scale test also hashes all three exact registered source files, preserving their existing SHA-256 contract.
- The Play Circle integration stylesheet is an existing untracked, user-owned file. Its scoped clipping fix is intentionally not included in my follow-up commit; it must travel with the parent integration change. The separately stageable pill CSS/test/preview/report are committed below.
- `src/slots.js` has a pre-existing 579-line unstaged gallery expansion. The new item is inside its already-uncommitted `awwwards` category, so staging that file would also commit unrelated user work. Its Task 2 change remains in the working tree for the parent integration commit; all separately stageable Task 2 files are committed below.

## Commits

Primary Task 2 code commit: `4176914` (`feat: add ThreeUI liquid metal gallery button`).
