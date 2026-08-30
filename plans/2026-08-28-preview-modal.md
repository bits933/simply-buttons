# Specimen preview modal

**Goal:** Always-visible fullscreen control on filled cards opens a large modal of just the specimen.

**Approach:** Slot flag + `PreviewModal`. Second mount of `<slot.preview />`. No CSS scale. No `CodeModal` refactor.

## UI

- Filled cards only. `CornersOut` at top-right of `.slot-preview` (`16px` / `16px`), always visible.
- Modal: reuse `.code-modal-scrim`. Bar is close (`X` + `Esc`) left, existing `CopyButton` right. Stage is a large well, specimen native size.
- Close via `X`, `Escape`, or scrim click. Focus trap + body scroll lock.

## Rules

- One modal at a time: opening preview closes the code modal, and the reverse.
- Reuse `copyComponent` + `copied`.
- Card instance stays mounted. Empty trays unchanged.

## Files

- Create: `src/PreviewModal.jsx`
- Modify: `src/Slot.jsx`, `src/index.css`
- Test: `src/Slot.test.js` (source-scan, same style as `App.test.js`)
