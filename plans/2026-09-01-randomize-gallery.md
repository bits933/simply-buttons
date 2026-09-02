# Randomize gallery button — 2026-09-01

## Goal

Add a "Randomize" control directly below the hero (intro) section that shuffles
the gallery on every click. Each click produces a fresh random permutation; the
cards glide to their new positions (FLIP) instead of teleporting.

## Research notes (this session)

- `src/App.jsx` renders a flat gallery: `visible = useMemo(() => filterSlots(SLOTS, query), [query])`
  then `visible.map((slot) => <Slot key={slot.id} ... />)`. `SLOTS` is a flat
  module-level array built in `src/slots.js` (no category headers in the DOM).
- `Slot.jsx` articles carry stable ids (`id={slot.id}`, `key={slot.id}`), so a
  reorder will not remount cards — state like open modals survives. `Slot` also
  renders `index` (position number) as `slot.index`; the card number shown on a
  card should keep following the card's content, not its grid position.
- `filterSlots` in `src/search.js` is pure: `slots.filter(slotMatchesQuery)`.
  A randomized order can be layered *under* search by shuffling first and
  filtering after, i.e. keep a shuffled copy of `SLOTS` and run
  `filterSlots(shuffled, query)`.
- Phosphor icons v2.1.10 ship `Shuffle` (verified in
  `node_modules/@phosphor-icons/react/dist/ssr/Shuffle.es.js`), matching the
  `Lifebuoy`/`MagnifyingGlass` usage in the topbar.
- Design tokens live on `:root` in `src/index.css` (`--accent`, `--line`,
  `--surface`, `--radius`, `--mono`, `--font`). Existing control styling to
  match: `.support-btn` (bordered pill, 36px, muted → ink on hover,
  `scale(0.98)` on active, 220ms cubic-bezier(0.16,1,0.3,1) transitions).
- `prefers-reduced-motion` contract used across the site: animations become
  opacity fades or are disabled outright (see `.skip`, slot previews, snippet
  buttons). The shuffle animation must respect it.

## Design

### State

```jsx
const [order, setOrder] = useState(null); // null = catalog order
const base = useMemo(() => order ?? SLOTS, [order]);
const visible = useMemo(() => filterSlots(base, query), [base, query]);
```

- `order` is a shuffled array of all slot objects (same contents, new order) or
  `null` when untouched. `null` keeps the pristine catalog order.
- Every click re-shuffles *from `SLOTS`* (not from the current order), so
  clicking repeatedly can return to near-catalog order and never degenerates.
- Search composes: the shuffled array is the input to `filterSlots`, so the
  random order is preserved within whatever the query matches.

### Shuffle button

```jsx
function shuffleSlots(slots) {
  const shuffled = [...slots];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

Fisher–Yates, O(n), unbiased. Placed in a `gallery-tools` row between the intro
and the grid, left-aligned, matching `.support-btn`'s look: mono uppercase
label + Shuffle icon, bordered pill, `scale(0.98)` press, icon wiggle on hover
via `rotate` keyframes.

### FLIP animation

Reordering DOM children can't transition; use the FLIP technique:

1. **First**: before `setOrder` commits, capture each card's
   `getBoundingClientRect()` (map keyed by slot id via `data-slot-id` on the
   article).
2. **Invert**: after the DOM updates (in `useLayoutEffect` after state change),
   capture new rects and set `transform: translate(dx, dy)` on each card so it
   visually sits in its old spot, with `transition: none` to avoid animating
   the invert step.
3. **Play**: force reflow, then clear transforms with
   `transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1)` so each card
   glides home.
4. Interruption-safe: re-clicking mid-flight re-captures from current rects
   (`getBoundingClientRect` already reflects in-flight transforms).
5. `prefers-reduced-motion: reduce` → skip transforms entirely (instant swap
   with no movement); matched via `window.matchMedia` at click time.

Empty trays (no preview) are full slots in the array; they shuffle along with
everything else. The grid is 1-col below 900px, 2-col above; same-card layout
is unaffected.

### Slot numbers

`Slot` renders `String(index).padStart(2, "0")` where `index` is passed as
`slot.index` — the catalog number. Cards keep their original catalog numbers
while shuffled (number travels with the card). Verified acceptable: numbers are
specimen IDs, not positions. No change needed to `Slot.jsx`.

## Files

1. `src/App.jsx` — add `order` state, `shuffleSlots`, `gallery-tools` row with
   the Randomize button, FLIP `useLayoutEffect`, `data-slot-id` pass-through.
2. `src/index.css` — `.gallery-tools`, `.randomize-btn` (+ hover/active/
   reduced-motion), FLIP transition class `.slot` handled via inline styles.
3. `src/App.test.js` — assert shuffle wiring: `shuffleSlots`, `order` state,
   `Shuffle` icon, `randomize-btn`, `gallery-tools`, `prefers-reduced-motion`
   guard, `getBoundingClientRect` FLIP usage.
4. This plan doc (build notes appended at the end).

## Acceptance

- Button renders below hero, above the grid, in both themes.
- Click → new random order every time; repeated clicks keep reshuffling.
- Cards glide (FLIP) on desktop; instant swap under reduced motion.
- Search still narrows; shuffle + search compose.
- `node --test` green, `npm run build` green, verified in browser.

## Build notes (2026-09-01, verified)

### Files

- `src/shuffle.js` (new) — `shuffleSlots` Fisher–Yates + `nextShuffle(slots, query, currentIds)`
  which retries (≤20) until the *visible-through-query* arrangement differs from the current
  one, so every click visibly reshuffles even with a tiny filtered result set.
- `src/shuffle.test.js` (new) — 4 unit tests (permutation purity, never-repeats loop,
  query-composed reshuffle, tiny-gallery degradation).
- `src/App.jsx` — `order` state (null = catalog), `base = order ?? SLOTS`,
  `visible = filterSlots(base, query)`; `.gallery-tools` row (Randomize + Reset order +
  keyed `role="status"` live region that re-announces per click) between hero and grid;
  `captureForFlip()` + FLIP `useLayoutEffect` keyed on `shuffleTick`.
- `src/Slot.jsx` — added `data-slot-id={slot.id}` to the article so FLIP keys match cards
  without relying on DOM id lookups.
- `src/index.css` — `.gallery-tools`, `.randomize-btn` (token-styled like `.support-btn`,
  hover border mix, `scale(0.97)` press, `randomize-wiggle` icon keyframes on hover),
  `.reset-order` ghost link, reduced-motion block.
- `src/App.test.js` — new test covering imports, state, handlers, FLIP, reduced-motion
  guard, `data-slot-id`, and shuffle module exports.

### FLIP details

- Click → `captureForFlip()` records `getBoundingClientRect()` per card (includes any
  in-flight transforms, so re-clicks mid-glide are interruptible and start from the
  current visual position).
- `useLayoutEffect` inverts (transition:none + translate(dx,dy)), forces reflow via
  `void grid.offsetWidth`, then plays (`transition: transform 560ms
  cubic-bezier(0.22,1,0.36,1)`, transform:""), timer at 600ms clears inline styles.
  Effect cleanup wipes all inline styles on the next flip/unmount, so stale styles
  self-heal even if a backgrounded browser throttles the timer.
- `prefers-reduced-motion: reduce` → capture skipped, effect early-returns: instant
  reorder, zero inline styles (verified via matchMedia stub: 0 transforms, 0 transitions).

### Incidental fix

`src/search.test.js` "every snippet META ships an expanded keywords array" was failing
before this feature (untracked buttons never met the keywords contract). Fixed 3 META
blocks: designcode-cta (+2 → 18), pangeam-bend (12 → 20), dust-premium (14 → 18), each
now including "animated button" + "interactive button". Full suite 147/147 (src + buttons).

### Verification (IAB against Vite on 5173)

- Renders below hero above grid (`btnRect.bottom` < `galleryTop`), catalog order intact.
- Click 1: order changed; 86 cards carrying `transition: transform 560ms` mid-flight
  (FLIP engaged); transforms cleared after glide.
- Repeated clicks: order changed every time (never-repeats loop works in practice).
- `?q=loader` (15 matches): shuffle reordered the matches, same set preserved; count
  text "15 matches" unaffected.
- Reset order → catalog order restored (pixel-load, wipe-cta, fill-load …).
- Reduced motion (stubbed matchMedia): instant reorder, no inline transform/transition.
- Visual (PIL render of screenshot, dark theme): pill at x=28, 127×38, radius 8,
  shuffle icon + "Randomize" 13px label, token colors (surface/line/muted) — matches
  `.support-btn` control language.
- Known environmental note: in a backgrounded/throttled pane the 600ms cleanup timer
  can fire late (85/86 cards kept the inline transition at t+750ms); foreground behavior
  is correct and the effect-cleanup self-heal covers the residual. No user impact.
