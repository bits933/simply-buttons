# Search Slash Button (tray 128) — build + fixes

- New original tray `search-slash` (last slot, tray 128): search-icon pill expands into a live
  search bar — left becomes icon + input, right keeps a `/` keycap. Click, or the `/` key
  anywhere, opens it; Escape or blur closes it. Interruptible width/opacity transitions.
- Files: `src/buttons/search-slash-button.css/.jsx/.snippets.js/.test.js`,
  `plans/search-slash-gen.js` (snippet generator), slots.js registration + two test count
  bumps (127 -> 128 in awwwards-10 integration + twitter-50 tests).
- Lessons:
  - Snippet modules SHIP the CSS inline as a plain string; importing `node:fs` to read the
    CSS at module top-level crashes the whole gallery in the browser (vite shims node:fs to
    an empty stub) — empty #root, no overlay.
  - search.test.js parses META with a text regex expecting unquoted JS object keys, not JSON.
- User requests during QA: remove the dark stage background (done — root is transparent).
