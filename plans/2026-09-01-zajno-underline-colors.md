# Implementation Plan - 124th Button (Zajno Underline) Color Theme Updates

Update the 124th button (`aw-zajno-underline` / `ZajnoUnderlineButton`) to:
1. Remove the static `#f4f4f5` background.
2. Provide light mode theme: black text/resting underline (`#101112`) with vibrant pink hover accent (`#ff2a85`).
3. Provide dark mode theme: white text/resting underline (`#ffffff`) with vibrant pink hover accent (`#ff2a85`).
4. Maintain all other kinetics, transitions, and contract snippets untouched.

## Proposed Changes

### [CSS & Components]
- **`src/buttons/zajno-underline-button.css`**:
  - Remove background from `.zajno-underline-root`.
  - Introduce `--zajno-ink: #101112` and `--zajno-accent: #ff2a85` for light mode.
  - Add `:root[data-theme="dark"] .zajno-underline-root, [data-theme="dark"] .zajno-underline-root` with `--zajno-ink: #ffffff` and `--zajno-accent: #ff2a85`.
  - Update `.btn-zajno-underline` to use `var(--zajno-ink, #101112)`.
  - Update pseudo-element `::before` accent and hover colors to `var(--zajno-accent, #ff2a85)`.
- **`src/buttons/zajno-underline-button.snippets.js`**:
  - Sync CSS string in snippet templates (`HTML`, `React`, `Node`).
- **`src/buttons/zajno-underline-button.test.js`**:
  - Update test assertion for the pink accent color.

## Verification Plan
- Run `node --test src/buttons/zajno-underline-button.test.js`
- Run `node --test src/buttons/awwwards-10-buttons.integration.test.js`
- Run full test suite across all 62 test files
- Run `npm run build`
- Run `/graphify --update`
