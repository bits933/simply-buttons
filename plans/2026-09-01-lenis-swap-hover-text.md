# Implementation Plan - 127th Button (Lenis Swap) Hover Text Color Update

## Problem
In button 127 (`aw-lenis-swap` / `LenisSwapButton`), the hovered swapped label (`.ls-hidden`) inherited the default button color (`--lenis-pink: #ff98a2`), rendering pink text on top of the pink wash background (`.ls-wash`).

## Proposed Changes
1. **`src/buttons/lenis-swap-button.css`**:
   - Set `.ls-hidden` and `.btn-lenis-swap:hover .ls-hidden, .btn-lenis-swap:focus-visible .ls-hidden` color to `#ffffff`.
2. **`src/buttons/lenis-swap-button.snippets.js`**:
   - Sync CSS in `HTML`, `React`, and `Node` code exports.
3. **Verification**:
   - Run unit and integration tests (`node --test src/buttons/lenis-swap-button.test.js`).
   - Run full test suite (`run_all_tests.py`).
   - Run `/graphify --update`.
