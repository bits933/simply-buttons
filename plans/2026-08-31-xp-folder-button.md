# Windows XP Folder Button — Detailed Plan

**Slot:** 80 · **ID:** `xp-folder` · **Status:** PLAN — awaiting user go-ahead
**Created:** 2026-08-31 · **Sources:** 2 research subagents (authentic icon extraction + animation technique study)

---

## 1. Objective (verbatim user request)

> "make a button in shape of a windows XP folder icon and when clicked the folder
> should have an open icon and files coming out, i need you to do this exactly how
> i asked assign subagents to do the research and other agents to find exact
> components and then create a detailed plan file and let me know"

Deliverables implied: (a) button whose face IS the XP folder icon, (b) click →
folder becomes the open-folder icon, (c) file documents come out of it,
(d) research done by subagents, (e) exact components located, (f) this plan file,
(g) user informed before build.

---

## 2. Research results (subagent evidence)

### 2.1 Authentic icon extraction (research agent #1)

The agent downloaded the **Windows XP SP3 installer from archive.org**, carved the
embedded CAB, expanded `i386/shell32.dl_` → `shell32.dll` (v5.1.2600.5512),
parsed the PE resource tree, and **pixel-sampled the actual 32bpp frames**. Every
color below is measured, not estimated.

- Closed folder = shell32 icon **group 4**; open folder = **group 5**.
- Extracted working assets saved at `C:\Users\User\AppData\Local\Temp\xpicons\`
  (key files: `g4_48_32.png`, `g5_48_32.png`, `g4_48_big.png`, `g5_48_big.png`,
  `g5_papers.png`, `grp004.ico`, `grp005.ico`, plus a `contact_small.png` sheet).
- ASCII-rendered confirmation of both silhouettes was done in-session; geometry
  below matches the renders.

**Why this matters:** the "exact components" requirement is satisfied by the
authentic DLL assets themselves (measured geometry + palette), which supersede
any third-party SVG recreation. A third assets-search agent was queued but
cancelled twice by the platform's model-concurrency limit; it is redundant now.

### 2.2 Animation technique (research agent #2)

Studied Tutorialzine's Mac-folder flap, CodePens by chonz0 / Velous / gansoft,
WAAPI motion-path docs, CSS-Tricks/easings.net constants. Verdict:

- **Flap = the yellow front face as its own HTML `<span>` layer**, hinged at the
  bottom, opening with `rotateX` under `perspective`. NEVER put 3D transforms on
  SVG `<g>` children (iOS Safari ignores/bugs them); each layer is an HTML span
  containing a small inline SVG, and the 3D transform goes on the span.
- **Papers = one HTML span per sheet**, keyframed `translate/rotate/scale` with
  per-sheet CSS custom properties (`--dx`, `--dy`, `--rot`), stagger via
  `animation-delay`. They rest in a loose fan above the folder mouth (matching
  the authentic open icon, which shows white sheets standing along the mouth).
- **State machine in JS only** (two setTimeouts, StrictMode-cleaned): 
  `closed → opening (860ms) → open → closing (~520ms) → closed`, click toggles,
  clicks ignored mid-transition.

---

## 3. Measured XP folder palette (exact hex, from 32bpp frames)

Shared outline/crease family (dark goldenrod): `#CC9900` `#C29200` `#BE8F00`
`#B88A00` `#CF9E08` `#A47B00`; silhouette outline (bottom/right) near-black
`#000000`–`#030303`; core yellow `#FFFF99`.

### Closed folder
| Element | Gradient stops (top→bottom) |
|---|---|
| Back slab + tab | `#FFFEE2` → `#FFFCEF` → `#FFFF99` → `#FFF892` → `#FFF38D` → `#F2DD6B` |
| Front face | `#FFF9EC` → `#FFFFC7` → `#FFFFB5` → `#FFFF99` → `#FFF28C` → `#FFE680` → `#FFDA74` → `#FFD46E` → `#EFC04A` (bottom edge) |
| Right side face | `#FFFFFC` → `#F2E6AE` → `#E6CC6F` → `#D9B335` → `#CC9900` → `#A57C00` → `#7A5C01` → `#000000` |

### Open folder
| Element | Gradient stops (top→bottom) |
|---|---|
| Back wall | `#FFFEE2` → `#FFFF99` → `#FFF892` → `#FFED87` → `#FFE27C` → `#FFDC76` |
| Mouth crease line | `#D2A00E` / `#D6A818` (1–2px) |
| Papers | `#FFFFFF` fill, `#FFFAD4`/`#FFF4AE` seams, `#ECD99F`/`#DCB950` cream edges |
| Front flap | `#FFFFFF` → `#FFFFEE` → `#FFFFD6` → `#FFFFB8` → `#FFFF99` → `#FFED87` → `#FFDC76` → `#FFD56F`, bottom `#EFC14B` → black |

### Stroke/shadow spec (MSDN "Creating Windows XP Icons")
- 1px outline at native size (≈2 units on 100-grid); black on bottom/right,
  goldenrod on top/left; corners soft/rounded ~2–3px.
- Soft drop shadow: black, 75% opacity, 135°, offset 2, blur 2; keep 2–3px free
  margin at bottom/right of the art.
- Light from upper-left; thin 1–3px near-white gloss band under each face's top
  edge; gradients on every face (flat fills read wrong).

## 4. Geometry (100×100 viewBox, ±2–3 units, hand-fit from measured pixel extents)

### Closed folder
- **Back slab (whole silhouette incl. tab):** 
  `(15,17)→(27,12)→(37,12)→(44,17)→(77,17)→(88,23)→(83,77)→(10,92)→(8,23)`
  — tab is the bump at far-left top (top at y≈12); top edge nearly flat then
  dips ~6 to the top-right corner; bottom edge slopes down-left ~11°.
- **Front face (big cream panel):** `(10,46)→(81,25)→(83,77)→(12,88)` — its top
  edge (the "crease") rises to the right at ≈16°.
- **Right side face:** `(81,25)→(88,23)→(83,77)→(79,75)` — narrow shadow quad.
- **Crease line:** dark goldenrod, (10,46)→(81,25).

### Open folder
- **Back wall (upright, with tab):** 
  `(10,15)→(77,15)→(77,29)→(17,46)→(6,50)→(4,25)→(8,17)`; tab bump 
  `(23,10)→(38,10)→(44,15)`. Interior = this white→gold back wall (not a dark
  cavity).
- **Mouth line:** (17,46)→(77,29), goldenrod `#D2A00E`.
- **Papers band:** white sheets along the mouth, ≈(19,50)→(92,31), 2 sheets
  readable at the left, merging rightward.
- **Front flap (lying band):** `(12,58)→(92,29)→(96,50 fades)→(83,60)→(8,88)`;
  far-right tip fades with soft alpha (signature XP detail); thin `#CC9900`
  fold line crosses at x≈73.

---

## 5. Button design

**Composition:** a `role=button` element sized ~`7.5em × 5em` containing a
64px-tall icon stage plus a small Tahoma caption — the classic XP "desktop icon"
read (icon + label). Caption text: **"My Documents"** (Tahoma 11px, XP's UI font;
falls back to system-ui). The button face itself is transparent; the icon IS the
button visual.

**Layer stack (z bottom→top), all HTML spans inside one perspective stage:**
1. `.xf-back` — back panel SVG. Contains BOTH: closed-state back-slab band and
   open-state back wall; the two paths crossfade (opacity) in sync with the flap
   swing. Tab lives here (never moves — correct for both authentic states).
2. `.xf-paper` ×4 — one span per sheet, each a small inline SVG (white sheet,
   2–3 gray text lines `#c3c9d4`, folded top-right corner `#eceff4`, hairline
   stroke `#d7dce3`, `drop-shadow(0 1px 1px rgba(15,23,42,.25))`, ±5% scale
   variation). Hidden behind the flap when closed.
3. `.xf-flap` — the front face span (yellow parallelogram SVG with gradient +
   crease + gloss band), hinged `transform-origin: 50% 92%`.

**Stage:** `perspective: 480px`; `overflow: visible` (papers fly above/left);
icon drawn ~10% small to leave shadow margin, per MSDN.

**States & choreography (exact constants from research):**

| Piece | Duration | Delay/stagger | Easing |
|---|---|---|---|
| Flap open (`rotateX(0)→rotateX(-62deg)`) | 340ms | 0 | `cubic-bezier(0.34, 1.4, 0.64, 1)` back-out |
| Paper out (per sheet) | 540ms | `110ms + i·70ms` | launch `cubic-bezier(0.22,1,0.36,1)`; settle `cubic-bezier(0.34,1.56,0.64,1)` |
| Paper in | 260ms | `(3−i)·45ms` | `cubic-bezier(0.55,.055,.675,.19)` easeInCubic |
| Flap close | 300ms | 180ms | `cubic-bezier(0.45,0,0.55,1)` |

- Paper destinations (fan above mouth, right-biased): 
  p0 `--dx:-18px --dy:-30px --rot:-16deg` · p1 `-6/-36/-6` · p2 `6/-36/5` · 
  p3 `17/-29/15`.
- Launch/overshoot keyframe shape: 0% `translate(0,12px) scale(.72) opacity 0` →
  35% `opacity 1` → 60% `translate(.78·dx, dy−14px) rotate(.55·rot)` → 100%
  settled pose.
- Total open choreography ends at 860ms → phase flips to `open` with static pose
  (no dependence on `animation-fill`).
- Click behavior: **toggle** (open ↔ close), ignore clicks while
  `opening`/`closing`. `aria-expanded` reflects open.

**Interaction chrome (Luna-flavored):**
- Hover: caption gains the XP-selected-blue tint (`#316ac5` text color at ~
  selected-icon strength) + icon lifts 1px.
- Focus-visible: 1px dotted `#316ac5` outline (XP focus idiom).
- Press: stage `scale(0.98)` for 120ms.
- Cursor pointer; `prefers-reduced-motion`: jump-cut poses, no transforms
  (pure-CSS fallback).

**Theme note:** the icon is self-contained (yellow/white/gold/black) and reads
on both light and dark wells; caption colors switch with theme tokens. Verified
against the gallery's `data-theme="dark"` mechanism.

---

## 6. Files & pipeline

| File | Purpose |
|---|---|
| `src/buttons/XpFolderButton.jsx` | state machine + layer spans + inline SVGs |
| `src/buttons/xp-folder-button.css` | stage, layers, gradients, keyframes, reduced-motion |
| `src/buttons/xp-folder.snippets.js` | 3 self-contained snippet tabs (HTML+CSS page / React / Node express) |
| `src/buttons/xp-folder.test.js` | assertions (see §7) |
| `src/slots.js` | new entry appended at tail (after `explore-now`), slot 80 |
| `%TEMP%/batch/gen_xf.py` | generator: writes the 4 button files + idempotent slots patch |

**Slots entry fields:** id `xp-folder`, name **"XP folder"**, blurb "A Windows XP
folder swings open and fans its paper files out", states
"Closed folder → click → swings open, files fan out → click → snaps shut",
keywords ≥17 incl. required `animated button` + `interactive button`
(draft: windows, xp, folder, luna, file, files, document, paper, open, retro,
nostalgia, 2001, manila, tab, icon, flap, swing, fan, toggle, 3d, animated
button, interactive button).

Category: same expressive family as `run-compiler` / `explore-now` (verify exact
category id in `src/slots.js` when appending).

## 7. Tests (contract)

- Snippets contain all three tabs; META single-line double-quoted fields.
- ≥17 keywords, includes exactly `animated button` and `interactive button`
  (existing `search.test.js` contract).
- CSS asserts: `rotateX(-62deg)` open pose, `perspective: 480px`,
  `transform-origin: 50% 92%`, paper keyframes with `--dx/--dy/--rot`, stagger
  `calc(110ms + var(--i) * 70ms)`, reduced-motion override block.
- JSX asserts: 4 paper spans, `data-phase` driven classes/toggle, timers cleaned
  up in effect cleanup (StrictMode), `aria-expanded`.
- Vanilla snippet asserts: `data-phase` toggling with the same 860/520ms
  constants, click guard during transitions.
- Run: `node --test` on the new file (+ quoted repo glob), `npm run build`.
  Known unrelated: 6 pre-existing failures in arttech, ascii-scramble,
  kriss-cta, star.

## 8. Verification plan

1. `node --test` new test file → green; full suite → only the 6 known failures.
2. `npm run build` → green.
3. IAB on dev server (HMR, port 5173): screenshot closed state, click → mid-open
   (~300ms in), fully open with papers fanned, click again → closed. Screenshots
   are ground truth (computed-style probes can freeze on throttled panes).
4. Both themes (`data-theme` toggle): check caption tint + outline legibility.
5. Reduced motion emulation: jump-cut still communicates open/closed.
6. Fidelity check against `contact_small.png` reference (closed + open) side by
   side.

## 9. Risks & mitigations

| Risk | Mitigation |
|---|---|
| 3D transforms on SVG children buggy (iOS Safari) | all 3D on HTML spans only |
| Papers clipped by card overflow | stage `overflow: visible`; verify inside card bounds; keep fan within 1em margins |
| Flap/seam gap when foreshortened | hinge at 92% height (2% overlap) hides the seam |
| Two-state back panel crossfade looks mushy | crossfade duration = flap swing (340ms), opacity only (no scale) |
| HMR remount swallows first click after regen | settle 1s before browser verification clicks |
| Papers look cloned | per-sheet ±5% scale + distinct `--rot` + 2 text-line variants |

## 10. Out of scope (explicitly)

No XP window chrome, taskbar, wallpaper, or dialog styling — icon button only
(lesson from run-compiler: user rejected over-applied chrome). No GSAP — CSS +
two timers only. Single card, no variants.

---

**Next step:** on user go-ahead, run `gen_xf.py` pipeline → tests → build →
browser verification → plan doc update → `graphify update .`

---

## 11. Build notes (2026-08-31 — implemented, slot 80)

User approved ("implement plan") and asked to run it a bit faster. Implemented
via `%TEMP%/batch/gen_xf.py` (regenerates snippets + test; idempotent slots.js
patch). Files: `src/buttons/XpFolderButton.jsx`, `xp-folder-button.css`,
`xp-folder-button.snippets.js`, `xp-folder-button.test.js`, slots entry
`xp-folder` (slot 80, States category, after `explore-now`).

**Deviations from §5 (all visual-verified):**
- **Faster choreography** (user request): open total 860→**600ms**
  (flap 260ms; papers 380ms, delay `60ms + i·50ms`), close 520→**360ms**
  (papers in 200ms reverse-staggered, flap 240ms after 130ms delay).
- **Flap open pose**: `translateY(-2px) rotateX(-46deg)` (not -62°) — the nudge
  keeps the compressed flap inside the silhouette (no poke-out past the
  bottom-right edge under perspective).
- **Back panel**: the open-folder wall crossfades *in* over the always-present
  closed slab (not slab↔wall swap) — prevents a see-through gap between the
  wall's mouth line and the foreshortened flap; the slab's yellow band below
  the mouth reads as the folder's front rim, matching the authentic open icon.
- Papers rest hugging the mouth (dy -17..-23px) rather than flying high — the
  authentic open icon keeps its paper band inside/along the mouth.

**Geometry**: measured 100-grid paths ×0.8 into a 78×80 viewBox (closed slab
incl. tab, open wall + tab subpath, front face, right side face, mouth line,
gloss lines). Stage 80×100px, folder box 80×78 bottom-anchored, paper base at
(34px, 44px), `perspective: 480px`, hinge `transform-origin: 50% 92%`.

**Verification (screenshots + pixel sampling, both themes):**
- Gallery (React): closed ASCII/pixel check = measured colors (`#fbff98` face
  core, pale slab, gold outlines); open = 4 white papers fanned (`#f9fafb`),
  no silhouette holes; re-closed identical to closed; caption inherits theme
  text (dark `#1b253e` / light `#abb6d0`).
- Standalone HTML+CSS+JS snippet (served via the temp icon server): toggle
  works (closed → open → closed), `aria-expanded` correct.
- `node --test` full buttons suite: **101/101 pass** (the previously-known 6
  failures no longer reproduce). `npm run build`: green.

---

## 12. Redesign (2026-08-31, later same day) — XP skin rejected, rebuilt Apple-style

User: "this is shit, can you make it a modern folder use apple style
[$apple-design]". The XP build (all four files) was **deleted** and slot 80 was
rebuilt as **`mac-folder`** ("Mac folder button") per the apple-design skill:

- **Visual**: modern Apple folder — soft blue gradient lid `#6ec6ff→#3ea0ff`,
  face `#54b8ff→#2890f0`, deep-blue interior `#0c3f8e→#0a67d6`, continuous
  rounded corners (no outline strokes), soft ambient drop shadow, sheen line
  under the face top, system-font caption ("Documents"), Apple-blue
  `#0a84ff` hover caption + soft focus glow ring.
- **Motion (per skill)**: *interruptibility over everything* — the 4-phase
  state machine with click-guard timers was **removed**; now a 2-state
  `closed↔open` toggle where all motion is CSS **transitions** (not keyframes),
  so a click mid-flight retargets from the current on-screen value. Spring-like
  curves: face `420ms cubic-bezier(0.4,0,0.2,1)` (critically damped), papers
  `cubic-bezier(0.34,1.3,0.64,1)` with per-paper durations as the stagger.
  Press feedback on `:active` (scale 0.96, 100ms). Reduced motion = opacity
  cross-fades only.
- **Layer stack**: `.mf-back` (lid w/ tab) → `.mf-interior` (fades in) →
  3 `.mf-paper` cards → `.mf-front` (tips `translateY(3px) rotateX(-10deg)`,
  bottom hinge, `perspective: 600px`). 3D stays on HTML spans only.
- **User refinement 1**: "files should peek out, not totally appear" — cards
  rest tucked behind the face (`top:36px` + `translate(0,14px)`) and rise only
  `dy +6..8px` on open, so only the top half clears the mouth (~48px). NOTE:
  after resizing the base box, `dy` must be recomputed against the REST pose —
  negative dy values left the whole card floating above the folder (caught by
  ASCII render, fixed by pixel probe: card top 41.3, mouth ~51.7 open).
- **User refinement 2**: "make the files bigger" → "wider, same height" —
  cards are 28×18px (viewBox 14×9, matching aspect so corners stay round).

Files: `src/buttons/MacFolderButton.jsx`, `mac-folder-button.css`,
`mac-folder-button.snippets.js`, `mac-folder-button.test.js`; slots entry
swapped `xp-folder → mac-folder`; generator `%TEMP%/batch/gen_mf.py` (also
deletes XP remnants; META blurb must be a single JS string literal — a
multi-line adjacent-literal blurb broke rollup).
Verified: closed/open/interrupt (mid-flight reversal flips phase instantly and
settles closed) via ASCII pixel render; probe: card top 41.3 vs mouth 51.7
(≈half the card peeks). Suite 115/115, build green.


