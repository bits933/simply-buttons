# Implementation Plan - 122nd Button (Unseen Enter) Right Edge Whitespace Fix

## Problem
In button 122 (`aw-unseen-enter`), when the button is in hover/active state with the dark sweep fill (`.ue-fill`), a subpixel white gap/sliver appears on the right curved boundary of the pill because `.ue-fill` is constrained horizontally to `inset: -2px 0` (0px horizontal overflow).

## Proposed Changes
1. **`src/buttons/unseen-enter-button.css`**:
   - Update `.ue-fill` `inset: -4px -8px;` and `border-radius: 999px;` so the dark fill overdraws past the left and right rounded caps without exposing the underlying white background.
   - Add `isolation: isolate;` and `-webkit-mask-image: -webkit-radial-gradient(white, black);` if needed on `.btn-unseen-enter` for clean antialiasing.
2. **`src/buttons/unseen-enter-button.snippets.js`**:
   - Sync CSS across `HTML`, `React`, and `Node` code exports.
3. **Verification**:
   - Run unit and integration tests.
   - Verify dev server in browser.
   - Run `/graphify --update`.
