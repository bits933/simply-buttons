# Osmo Button Pack batch — xlsx rows 40–50 + 56 (osmo buttons 066–085)

Date: 2026-08-29
Branch: codex/mechanical-keyboard-button

## Request

"now make button 40 to 50 and 56" — build gallery cards for rows #40–#50 and #56 of
`x-button-posts.xlsx`, following the same conventions as the previous Osmo batches:
replicate only the default variant, no variant toolbar, exact original colors, appended
at the end of the slots registry.

## Mapping (xlsx row → post → osmo demo)

| Row | Tweet | Osmo | Card |
| --- | ----- | ---- | ---- |
| 40 | 2075879690254868896 | 066 | direction-stagger (Direction stagger button) |
| 41 | 2076233941644714437 | 067 | chromatic-rise (Chromatic rise button) |
| 42 | 2076609720001941607 | 068 | item-box (Item box button) |
| 43 | 2076952869643727250 | 069 | letter-rotate (Letter rotate button) |
| 44 | 2077316428093337696 | 070 | corner-frame (Corner frame button) |
| 45 | 2077678856975045107 | 071 | char-roll (Char roll button) |
| 46 | 2078042170192244991 | 072 | random-rise (Random rise button) |
| 47 | 2079478198736204003 | 076 | dual-block-fill (Dual block fill button) |
| 48 | 2079863933708493255 | 077 | draw-arrow (Draw arrow button) |
| 49 | 2080221712822497430 | 078 | jump-burst (Jump burst button) |
| 50 | 2080578984132125010 | 079 | shine-scale (Shine scale button) |
| 56 | 2082754146868895911 | 085 | stripe-scroll (Stripe scroll button) |

## Implementation

- Generator: `%TEMP%/batch/gen2.py` reuses the batch-1 pipeline (scope inline + shared
  base CSS under `.obNNN-root`, keyframe stashing, variant/nth-child stripping, border
  normalizer) plus per-button JS ports. Extraction via `extract2.py` from
  `osmo-button-NNN.webflow.io` demo pages (inline style, shared CSS button rules,
  first-panel markup, inline `initButtonNNN` script).
- GSAP → vanilla ports:
  - 066 SplitText(propIndex) → manual split, 1-based `--char`, alternating
    `--button-066-char-direction` (verified against SplitText.min.js source).
  - 067 timeline → two-phase char opacity/color stagger (0.1s/0.15s spread, phase 2 at
    250ms) + bg-hover rise (translateY 101%→0, power2 out/in), gated by hover media.
  - 071 SplitText + stagger timers → identical timer port (center-out stagger, one-shot,
    no reverse), CSS keyframes unchanged.
  - 072 CustomEase `button-072-ease` (101-point SVG path) → sampled to a CSS `linear()`
    string; random-order stagger (each 17ms) via WAAPI, text-shadow ghost via CSS.
  - 077 DrawSVGPlugin → stroke-dasharray/dashoffset windows animated with WAAPI
    (circ.out / circ.inOut approximations, timeline offsets 0/125/375/525ms).
  - 078 SplitText + keyframes spark burst → WAAPI jump (`cubic-bezier(0.2,0.5,0.5,1)`,
    34ms stagger) + verbatim dynamic-@keyframes spark port (6 sparks, ±3em drift).
  - 079/085 ScrollTrigger inview → IntersectionObserver toggling `is--inview`.
  - 079 scale vars computed from `data-button-079-width-increase="16"` /
    `height-increase="8"` on init + resize.
- All React effects are StrictMode-safe (listeners removed, animations cancelled, split
  text restored on cleanup).
- Files per button: `<slug>-button.css`, `<Component>.jsx` (+`Preview`),
  `<slug>-button.snippets.js` (HTML+CSS page / React self-contained / Node express),
  `<slug>-button.test.js` with a source marker assertion.

## Verification

- 12/12 new tests pass; search/registry suites pass (8/8, 2/2); `npm run build` green.
- The 6 failing tests in the suite (arttech, ascii-scramble, kriss-cta, star-button) fail
  identically with HEAD `slots.js` — pre-existing from earlier uncommitted work, not this
  batch.
- Browser (IAB): all 12 previews render with exact original colors (computed-style
  probes); screenshots taken of every card; real-hover verified for 068
  (`rotateX(180deg)`) and 079 (`scale 1.19048 1.2`); JS ports verified mid-flight:
  069 scramble ("ttonBu"→"Button"), 071 one-shot roll (12→0 animating), 072 rise
  (translateY 20.9px), 077 dash-window redraw, 078 jump (-4px) + 6 sparks, 085 stripes
  running when in view; hover CSS rules confirmed present for 066/076/085.
- Graphify rebuilt (1378 nodes / 1903 edges).

## Follow-ups (same day)

- Slot 74 (shine-scale, #079): white shine sweep angle changed from -14deg to 60deg
  (`rotate` in the `button-079-shine` keyframes), also in the snippet CSS copies.
  Follow-up fix: at 60deg the original steep top-to-bottom translate path kept the
  streak outside the clip, so the travel became horizontal left-to-right
  (`translate: -135% -15%` -> `135% 15%`); verified sampling translate -132% -> +125%.
- xlsx row 28 → post 2071521190477250933 → Osmo #054 → new card "Line bloom button"
  (slot 76, `line-bloom` / `LineBloomButton`), pure CSS, original colors (pink
  #F67DEF on white). Generator: `%TEMP%/batch/gen3.py`. Verified: tests pass, build
  green, real-hover bloom caught mid-expansion (`inset(calc(38.9% - 0.78px) 0%)`),
  label wipe at `inset(0%)`.

## Online status button (slot 77, 2026-08-30)

Original specimen (not a replica) built from a user reference image: a white status
chip with a pulsing green dot reading "Online"; on click it shifts to a red accent
(soft red tint, red border/text), the dot bursts into a ring while an X draws itself
via `pathLength="100"` dash-offset strokes, the label rolls to "Offline", and a WAAPI
ripple fires. Toggles both ways; `role="switch"` + `aria-checked`; reduced-motion
gating. Techniques per two research subagents (icon-morph patterns; repo conventions).
Files: online-status-button.css, OnlineStatusButton.jsx (+Preview),
online-status-button.snippets.js (3 tabs), online-status-button.test.js. Width
transition uses cached button chrome + in-flow active label (fixed a flex-squeeze bug
where the labels wrapper collapsed to zero width). Verified: tests pass, build green,
live toggle both directions (dashoffset mid-draw sampled).

## Drag drop upload button (slot 78, 2026-08-30)

Original specimen from a user-supplied LottieFiles JSON ("multimedia 8", white
variant): two white-stroked photo cards tumbling around a plus, recreated in pure CSS
(two counter-tumbling dashed-border cards, 2.4s loop, plus pop mid-cycle) so the
snippets stay dependency-free (no lottie-web). iOS dark-mode styling per the
apple-design skill: system font stack, dashed border rgba(235,235,245,0.28), secondary
label text, huge padding (2.75em/3.5em), instant :active press, iOS blue #0a84ff
drag-over telegraph (border + tint + 2x tumble speed), drop = land bounce + blue WAAPI
ripple, focus ring, reduced-motion static cards. Files: drag-drop-upload-button.css,
DragDropUploadButton.jsx (+Preview), drag-drop-upload-button.snippets.js (3 tabs),
drag-drop-upload-button.test.js. Verified: tests pass, build green, synthetic
dragover/drop events drive all states.

### Drag drop upload v2 rebuild (2026-08-30, after "this is very bad")

Rebuilt from two subagent plans (motion-analysis agent hit infra limits; the design
spec agent delivered the full v2 spec and its motion system supersedes a literal
lottie port). Key changes per the spec audit of v1:
- Cards: outline-only boxes -> solid white 56x42 photo prints with duotone landscape
  (::before radial sun + horizon gradient), stacked shadows; translucent 44x33 back
  card; z-order back < plus < front for occlusion depth.
- Motion: mirrored 2.4s ping-pong -> shared elliptical orbit (front rx34/ry13, back
  rx26/ry10 phase +180, 8 linear keyframe stops), tumble leading travel, 6.4s
  phase-locked; plus breathes 3.2s, never blinks. Dragover no longer changes
  animation-duration (phase-jump bug); it lifts art, rotates plus 90deg, tints blue.
- Frame: default `dashed` -> inline SVG rect with pathLength=100, 50 round-capped
  dashes, 1.5px, 0.25 alpha; marching ants (dashoffset -2/1.1s) only during dragover.
- Composition: fixed 340x224 container, art 128x96 (~43% height), 28px gap, 15px/590
  label + 13px/0.45 "or click to browse" hint.
- States: monochrome rest (blue only on interaction), 80ms dragover-in / 160ms out,
  drop = pop + expanding ring box-shadow (ripple blob removed), dragenter/leave
  counter + dataTransfer Files gate + dropEffect copy.
- JS/React snippets regenerated; test updated to v2 markers.
Verified: build green, tests pass, dragover captured on screen (blue marching frame,
tint, lift). Note: IAB computed-style probes freeze under the throttled pane; use
screenshots as ground truth there.

### Layout revision (2026-08-30, user request)

Container switched to horizontal composition: art (128x96 orbit) left, label + hint
cluster right, gap 30px, container resized 380x190. SVG dash frame made
stretch-aware (viewBox + preserveAspectRatio none + vector-effect
non-scaling-stroke). Snippets regenerated; tests + build green.

## Run compiler button (slot 78, 2026-08-30)

Original specimen from a 3-state reference image: white 2px terminal frame, monospace
(IBM Plex Mono) uppercase label. State 1 types RUN_COMPILER with a blinking block
caret (55ms/char, steps blink at 1.06s); click generates 6 gray blocks that fill the
frame left-to-right (scaleX 0->1, transform-origin left, 110ms stagger, 260ms each);
then COMPILED types out with the same caret effect; clicking again resets. Fixed
frame size (14.5em x 4.5em) across states. Fixed two bugs during verification: the
caret child was being wiped by textContent assignment (typed label now lives in its
own sub-span) and a var shadowing crash (str.slice is not a function) where the DOM
label element shadowed the label string in both the React effect and the vanilla
page JS. React snippet uses literal strings; site component uses label/done props.
Files: run-compiler-button.css, RunCompilerButton.jsx (+Preview),
run-compiler-button.snippets.js (3 tabs), run-compiler-button.test.js. Verified:
tests pass, build green, all states exercised live (typing, mid/final fill, COMPILED,
reset with blinking caret).

### Loader stagger fix (2026-08-30, "boxes still not loading one by one")

Root cause: the loader wrapper used display:none -> flex, so the boxes rendered
directly in their final scaleX(1) state and no transition ever ran (classic
display:none transition trap; the stagger delays were unreachable). Fix: loader is
always rendered and toggled with visibility:hidden -> visible, letting the per-box
scaleX transition (origin left, 110ms stagger) actually animate. Verified with
sampled transforms mid-fill: [1, 0.99, 0.89, 0, 0, 0] at ~300ms -> [1, 1, 1, 1,
0.99, 0.83] at ~600ms. Snippets regenerated.

### Windows XP "Copying..." restyle (2026-08-30, slot 78)

Run compiler button rebuilt as a Luna-theme XP dialog per two style agents
(XP.css-traced token sheet + high-end-visual-design implementation spec, incl. a
10-point "fake XP" pitfall audit). Chrome: 252px dialog, royal-blue caption gradient
(px stops, #0997ff top lip), 1px #0831d9 frame + 3px gradient side/bottom frame,
8/8/3/3 radii, Trebuchet MS Bold "Copying..." with 1px #0f1089 shadow, red gloss X
(18x18, white ring, CSS bars), #ece9d8 body. Progress: always-rendered sunken white
track (asymmetric #8f8f88/#dcd9cc border) with six #28a828-family 7-stop green
chunks, scaleX L-to-R 110ms stagger (machine untouched); "From "Gallery Stage" to
"G:\" dim line + "Copying files..." status. Typed mono label stays IBM Plex Mono
dark-on-beige. Hover = Luna blue halo; focus = 1px dotted #2b2a24 inner rect;
reduced-motion kept. Verified live: chrome, mid-fill green blocks, COMPILED, reset.

### XP loader tweaks (2026-08-30, user feedback)

- XP chrome reverted per user ("copy only the loader animation, not the entire
  block"): terminal frame restored (white 2px border, mono text, blinking caret);
  loader kept as XP progress bar (sunken track + green 7-stop chunks, scaleX
  L-to-R stagger).
- White track background removed (transparent over the stage).
- Loader track stroke removed (chunks fill borderless inside the frame).
- Button size reduced to 13em x 4em (234x72px). Snippets regenerated each time.

## Explore now button (slot 79, 2026-08-30)

Original neo-brutalist specimen from a user reference image: #ffd23f yellow face,
2px #131313 border, 800-weight IBM Plex Sans uppercase label, and a solid #131313
offset block (translate 7px 7px) behind it. On click the face slides down-right to
translate 7px 7px, fully covering the black block (shadow collapse); hover previews
a 3px nudge; click again pops back. aria-pressed toggle; dashed yellow focus ring;
reduced-motion kills the transitions. Files: explore-now-button.css,
ExploreNowButton.jsx (+Preview), explore-now-button.snippets.js (3 tabs),
explore-now-button.test.js. Verified: tests pass, build green, pressed alignment
confirmed live (translate 7px 7px, shadow hidden).

### Explore now refinements (2026-08-30, user feedback)

- Font switched to Unbounded 800 (@fontsource/unbounded in the gallery; Google
  Fonts @import in the snippet CSS).
- Shadow made chunkier per reference: 3px face border, offset block now
  translate(8px, 10px).
- Smooth 180ms cubic-bezier(0.3, 0.7, 0.4, 1) glide between rest (shadow visible)
  and pressed (face flush over shadow, matching the two reference states); hover
  previews a 3/4px nudge. Test marker updated to translate: 8px 10px. Verified:
  Unbounded renders, pressed alignment exact.

### Explore now bleed fix (2026-08-30)

Yellow bled 1px past the black frame: the face (own composited layer after
translate) and the ::after black block were separate painted layers and the
face's background smeared past its border. Fix: removed the ::after and the CSS
border entirely - the frame is now `box-shadow: inset 0 0 0 3px #131313` plus the
offset block as a second shadow on the same single layer, with
background-clip: padding-box. Nothing can seam or bleed. Verified zoomed at rest
and pressed.

### Run compiler light mode (2026-08-30, user request)

Gallery light mode: button frame, label, caret, and focus ring go black
(html:not([data-theme="dark"]) overrides in a gallery-only
run-compiler-light.css, imported by the JSX so the dark-styled snippet CSS is
unaffected). Dark mode keeps white. Green XP chunks unchanged in both.

### Caret blink fix (2026-08-30, user feedback)

The block caret never blinked: JS adds is--blinking to the caret element itself
but the CSS selector expected the class on the button. Selector corrected to
.btn-run-compiler__caret.is--blinking. An interim frame-blink experiment was
removed (user clarified: the rectangle AFTER the text blinks, not the container
frame).

### Explore now dark state contrast & hover border fix (slot 79, 2026-08-31)

- In dark mode / dark state, the `#131313` offset shadow block and border blended into
  the dark background of the tray/stage. Added `--explore-now-face` and `--explore-now-dark`
  CSS variables so that in dark mode (`:root[data-theme="dark"]`, `[data-theme="dark"]`,
  and `@media (prefers-color-scheme: dark)`), `--explore-now-dark` changes from `#131313` to
  `#2d2f36` (a visible charcoal dark grey).
- On hover, subpixel antialiasing previously exposed a thin yellow fringe when using inset
  box-shadow because border was 0. Switched `.btn-explore-now__face` to a real
  `border: 3px solid var(--explore-now-dark)` with `background-clip: padding-box`, completely
  encapsulating the yellow face inside the 3px solid border and eliminating any outer yellow fringe.
- Updated `explore-now-button.css`, `explore-now-button.snippets.js`, and `explore-now-button.test.js`.
  Tests pass, production build clean.


