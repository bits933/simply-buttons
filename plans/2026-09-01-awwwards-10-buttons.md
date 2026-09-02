# Awwwards 10-button harvest (trays 137–146)

Screened awwwards.com for websites people have showcased with distinctive buttons, collected
the 10 best specimens, and rebuild each as a gallery tray. Skill: `.agents/skills/awwwards-button-to-gallery/SKILL.md`
(created via skill-creator this session). Catalog: `plans/awwwards-10-catalog.json`.

## Numbering contract

- Gallery is at 86 filled trays (tail: `dust-premium`).
- **Trays 87–136 are reserved** (user instruction) for the planned `twitter-50` batch
  (`plans/2026-09-01-twitter-50-buttons.md`, catalog `plans/twitter-50-catalog.json`).
  This batch registers those 50 trays as **empty reserved trays** (no preview, no snippets —
  the gallery renders "Empty tray / Reserved — code on fill"), so the future batch can fill
  them in place without renumbering.
- The 10 new awwwards buttons therefore land at **trays 137–146** (user: "from 137 to 147",
  10 buttons starting at 137 — 137+10−1 = 146).
- Append-only: no existing tray is renumbered or reordered.

## The 10 sources (all awwwards-recognized, all verified from real CSS)

| # | id | Source | Recognition | Button style extracted |
|---|----|--------|-------------|--------------------------|
| 137 | `aw-unseen-enter` | Unseen Studio (unseen.co) | SOTD Feb 2023 + Dev Award | White pill, fill rises from below, label rolls out/in, arrow slides |
| 138 | `aw-loco-shuffle` | Locomotive (locomotive.ca) | SOTD + SOTM Mar 2023 | Fisher–Yates letter shuffle on hover, restore on leave |
| 139 | `aw-exo-circle` | Exo Ape (exoape.com) | SOTD May 2022 + Dev Award | Circle fill scales up + arrow fades in + underline draw |
| 140 | `aw-k95-chars` | Studio K95 (k95.it) | SOTD Aug 2026 | Frosted pill, per-char masked roll MENU ↔ ×CLOSE |
| 141 | `aw-zajno-underline` | Zajno (zajno.com) | SOTD Jul 2023 | Two-half underline wipe (in/out pseudo-halves) |
| 142 | `aw-obys-toggle` | Obys (obys.agency) | SOTD May 2026 + Dev Award | Underline draws origin-left on activate, collapses origin-right |
| 143 | `aw-lusion-arrow` | Lusion (lusion.co) | SOTD May 2019 + Dev Award | Text slides, dot cluster shrinks, arrow glides in |
| 144 | `aw-resn-slab` | Breakthrough Energy by Resn | SOTD Jan 2026 + Dev Award | Lime slab, stacked labels auto-cycle rolling upward |
| 145 | `aw-basement-segment` | basement.studio | SOTD Apr 2025 + Dev Award | HUMAN/MACHINE segmented pill, orange flip + sliding indicator |
| 146 | `aw-lenis-swap` | Studio Freight / Lenis | SOTD Feb 2023 + Dev Award | scaleY label-swap pair + fill wash + icon square (archived CSS) |

Screened but rejected: igloo.inc + Active Theory + Aristide Benoist (WebGL/canvas — no DOM
buttons), Studio Freight current site (generic text links — replaced by the archived SOTD-era
Lenis button), Kiss My Button (button-library demo, not a signature CTA), Wall of Art
(insufficient detail), Dala + Niccolò Miranda (text-only extraction, no verifiable CSS).

## Implementation

- Skill used: `.agents/skills/awwwards-button-to-gallery/SKILL.md`; graphify queried for the
  registry shape before building (`graphify explain "src/slots.js"`).
- Each tray ships the 4-file pattern: `<Name>Button.jsx` + `<id>-button.css` +
  `<id>-button.snippets.js` (META ≥17 keywords incl. "animated button"/"interactive button";
  SNIPPETS {html, react, node} complete, marker in all three; Node tab = Express server) +
  `<id>-button.test.js`.
- `slots.js`: new `reserved` category (50 empty x50 trays from the twitter-50 catalog) and new
  `awwwards` category (10 filled trays) appended after `states`.
- Colors: source-faithful (per the x50/awwwards skill convention — the post's colors are in
  scope; no invented hues).
- Tests: per-button tests + `awwwards-10-buttons.integration.test.js` driving the catalog
  (unique ids/markers, batch order, filled count 86→96, first id at index 137).

## Build notes (verified 2026-09-01)

- **Reserved-space reconciliation:** during this session the `twitter-50` batch
  (`src/buttons/twitter-50/`, 4/4 tests) landed and filled trays 87–136 with the real
  x50 buttons — exactly what that range was reserved for. The awwwards batch therefore
  appends after `x50-micro-scale` inside a new `awwwards` category, landing on 137–146
  with zero renumbering of earlier trays. The interim `twitter-50-reserved.js`
  placeholder module was removed.
- **Numbering verified in-browser:** all 10 trays render with `slot-index` 137–146,
  total 146 slots, all filled; trays 87–136 hold x50 ids in order (integration test
  + DOM audit).
- **Files:** 10 × (`<Name>Button.jsx`, `<id>-button.css`, `<id>-button.snippets.js`,
  `<id>-button.test.js`) + `awwwards-10-buttons.integration.test.js`
  (3 tests) + catalog + this plan. Snippets generated via `plans/awwwards-10-gen.js`
  (CSS is single-sourced from each button's css file into html/react/node tabs).
- **Keyword contract:** every META ships 20–21 keywords incl. "animated button" +
  "interactive button" (enforced by search.test.js + the integration test).
- **Slots imports use the generated export names** (e.g. `UNSEEN_ENTER_META`, no
  `AW_` prefix — the generator keeps the older naming convention).
- **Tests:** `node --test "src/*.test.js" "src/buttons/*.test.js"
  "src/buttons/twitter-50/twitter-50.test.js"` → **165/165 pass** (was 148; +13 awwwards
  tests, +4 twitter-50). The twitter-50 count assertion (`filled === 136`) was relaxed to
  `>= 136` + a contiguity guard since later batches now append after it.
- **Build:** `npm run build` green (13.5s).
- **Browser verification (IAB on 5173):**
  - All 10 trays present, filled, numbered 137–146; 146 total trays.
  - K95 char roll: click toggles `data-phase` closed→open, stack measured translateY
    ≈ −13px (≈1em), aria-expanded flips; second click closes.
  - Basement segment: MACHINE click flips `data-active` 0→1 and back; indicator pill +
    orange flip asserted structurally (computed styles freeze on the throttled
    background pane — known issue; state attributes are the reliable signal).
  - Resn slab: `aw-slab-cycle` animation present, 6400ms, playState running.
  - Loco shuffle: Fisher–Yates racing logic exercised live in a fresh (unthrottled)
    tab — 8 scrambled frames, then restore; the gallery pane's timers freeze when
    backgrounded (environmental, not a code bug).
  - Button audit: white 999px pill (Unseen), glass rgba(21,25,30,.55) 100px pill (K95),
    #5e6b78 6.25em pill (Lusion), #dfff5c 6px slab (Resn), #ff98a2 Lenis ink —
    all source palettes correct.
  - Code modal: tray 137's React tab opens "Unseen enter — React" with 4580 chars,
    marker `--aw-enter-sweep` present, copy control available.
  - Screenshot ground truth (PIL, PNG-read broken this session): tray 137 renders the
    #edc1cb Unseen stage with the white bordered pill centered.
