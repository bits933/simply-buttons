# Donut Studio CTA Button — Plan + Build Notes

**Slot:** 81 · **ID:** `donut-cta` · **Status:** built 2026-08-31
**Request:** "https://www.donut-studio.com/ make the CTA from this website and
make the fill of the button pink"

## 1. Research (live site, not guesswork)

Inspected donut-studio.com (a Framer site) in the browser — computed styles,
markup, and live hover sampling of the primary CTA (`data-framer-name="Primary"`,
the "Contact" pill; "SEE WORKS" is the same component):

- **Pill**: height 48px, `border-radius: 259px` (fully rounded), `border:
  2px solid #FFF70D` (electric yellow, measured `rgb(255,247,13)` /
  screenshot `#faff18`), **transparent interior** (the section shows through),
  `overflow: hidden`, padding 12px 18px.
- **Letters**: per-letter spans (the site's `rolling-text` component),
  "Helvetica Neue Bold" 700, 23px, uppercase, letter-spacing -0.3px,
  line-height 24px, color electric yellow.
- **Section behind the Contact CTA**: hot pink `rgb(255,75,167)` ≈ `#FC4BA7`.
- **"Filler" hover layer**: an absolutely positioned band (border-radius 30px,
  black `rgb(0,0,0)` via the site's token) that rests as a 6px sliver *below*
  the pill (clipped) and on hover is re-laid-out to a tall band (186px) and
  animated via `transform: scaleY(≈0.03 → 1)` around a low center — i.e. the
  fill **rises and floods the pill**. (The live animation froze at its start on
  the throttled pane — a known computed-style lie — but the start pose, layout
  height change, and band geometry were captured.)
- Nav + CTA letters use the site's rolling-text pattern → letters roll on
  hover (same mechanic as this repo's SuperlistNotifyButton).

## 2. Design decisions

- Faithful rebuild of the pill: 2px electric-yellow border, fully-rounded,
  transparent rest state, yellow bold uppercase letters, Helvetica Neue stack.
- **Pink fill (user request)**: the hover flood fill is the site's own hot pink
  `#FC4BA7` (instead of the original black Filler). The fill rises bottom-up
  (`scaleY` 0→1, bottom origin, gentle overshoot).
- **Letter roll for contrast**: as the pink flood passes, each letter rolls up
  (staggered `calc(var(--i) * 24ms)`) revealing a near-black duplicate copy —
  readable on pink, and faithful to the site's own rolling-text component.
- Pure CSS interaction (hover + focus-visible); no JS state, no timers — the
  snippets' vanilla page needs no script at all.
- Press: instant `scale(0.97)`; focus-visible: dotted yellow outline, and the
  fill + roll also play on keyboard focus. Reduced motion: fill becomes an
  opacity fade, letters swap without motion.
- Theme note: rest state is exact-replica in dark theme (yellow on dark); on the
  light well the yellow is softer (per the gallery lede, theme experimentation
  is expected). Hover state reads identically in both themes.

## 3. Files

`src/buttons/DonutCtaButton.jsx`, `donut-cta-button.css`,
`donut-cta-button.snippets.js`, `donut-cta-button.test.js`, slots entry after
`mac-folder`; generator `%TEMP%/batch/gen_dc.py`.

## 4. Verification

- Suite + build green; browser verify rest / hover / press / focus in the
  gallery (screenshots + color histogram: rest = transparent pill + yellow
  letters; hover = pink `#fc4ba7` flood + dark letters).

## 5. Build notes (2026-08-31 — implemented, slot 81)

Built via `%TEMP%/batch/gen_dc.py` (reads css+jsx; idempotent slots patch
after `mac-folder`). Files: `DonutCtaButton.jsx`, `donut-cta-button.css`,
`donut-cta-button.snippets.js`, `donut-cta-button.test.js`.

- Pill rest: transparent, 2px `#faff18` border, `999px` radius, Helvetica Neue
  700 uppercase, per-letter spans each holding a two-copy stack (yellow copy +
  near-black `#131313` alt).
- Hover/focus-visible: `.dc-fill` pink `#fc4ba7` rises `scaleY(0→1)` bottom
  origin (420ms `cubic-bezier(0.3,1.1,0.5,1)` on enter, 320ms retreat);
  letter stacks roll `translateY(-50%)` with `delay calc(var(--i)*24ms)`.
  Press: `scale(0.97)` 100ms. Reduced motion: fill as opacity fade.
- Standalone HTML snippet needs **no JS** (pure CSS).

**Verified:** gallery rest (color histogram: yellow letters `#dde524` on
transparent pill over dark card) and real-pointer hover (flood `#f94ba7` +
near-black letters, `:hover` true) via document-relative clip screenshots;
standalone page structure probe (border/radius/fill/letters/alt copies all
correct). Suite 124/124 (one intermediate 5-fail run was the known Windows
parallel flakiness; two clean re-runs), build green.
