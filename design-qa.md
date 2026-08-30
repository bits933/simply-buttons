# Design QA — Superlist “Get notified” button

- source visual truth: `C:\Users\User\.codex\attachments\f435076d-8c8b-4a16-854b-abb9967057d8\image-1.png`
- implementation screenshot: `C:\Users\User\AppData\Local\Temp\superlist-notify-gallery.png`
- open-state screenshot: `C:\Users\User\AppData\Local\Temp\superlist-notify-open-settled.png`
- viewport: 1880 × 1028 CSS px, device scale factor 1
- source pixels: 206 × 80; the target control itself measures about 188 × 61
- implementation pixels: 1880 × 1028; the rendered control measures 188 × 61 CSS/pixels
- density normalization: none required; both target control and implementation were compared at their native 1× dimensions
- state: closed/rest visual comparison, plus hover, press/open, second-click close, keyboard semantics, reduced-motion path, and responsive-fit checks

## Full-view comparison evidence

The supplied crop and the browser-rendered gallery screenshot were opened together in one comparison input. The implementation matches the target’s 188 × 61 black pill, right-aligned 60 × 60 3D red control, Aeonik label treatment, round geometry, dark left-to-right surface gradient, inset highlight, and control placement. The original Superlist GLB, both matcaps, font, and click audio are used directly rather than approximated.

## Focused region comparison evidence

A separate crop was not needed: the implementation control is rendered at its native 188 × 61 size in the full screenshot, matching the target control’s native size, and its computed dimensions/styles were measured in the browser. The 3D control remained sharp at its 60 × 60 CSS slot with an 80 × 80 backing canvas at the active device density.

## Required fidelity surfaces

- Fonts and typography: original `aeonik-regular.woff2`, 15 px/400, −0.015em tracking; label is centered in the 128 px text region and remains readable.
- Spacing and layout rhythm: 188 × 61 closed pill, 61 px open pill, 60 × 60 right control, fixed right anchor, 999 px radius, no clipping at tested mobile/tablet widths.
- Colors and visual tokens: source `linear-gradient(270deg, #222322 3.48%, #131311)` and inset white highlight reproduced; source orange/red and black matcaps preserved byte-exact.
- Image quality and asset fidelity: original `button.glb`, `matcap-orange.png`, and `matcap-black.png` are used directly; no CSS/SVG substitute.
- Copy and content: visible and accessible label is exactly “Get notified”.
- States and accessibility: native button, `aria-pressed`, focus-visible treatment, disabled state, reduced-motion final-state behavior, staggered hover label, audio replay, 100 ms press, elastic rebound, one-second flip, and reversible open/close toggle verified.

## Findings

No actionable P0, P1, or P2 differences remain. No browser console errors were recorded. One upstream Three.js deprecation warning (`THREE.Clock`) is present elsewhere in the dependency runtime and does not affect this specimen.

## Comparison history

- Pass 1: closed/rest comparison showed no actionable visual mismatch.
- Interaction check: an initial fixed-delay measurement sampled the opening transition before it settled. Root-cause inspection confirmed the correct CSS rule was active; a condition-based recheck measured 61 px open and 188 px closed. No implementation fix was required.
- Pass 2: settled open-state capture confirmed the source-style circular-only state, and second click restored the full pill.

## Implementation checklist

- [x] Exact source assets and hashes
- [x] Exact camera, scene scale, named mesh materials, and transparent WebGL canvas
- [x] Press, elastic rebound, flip, sound, hover, open, and close interactions
- [x] Native semantics, focus, disabled, and reduced-motion behavior
- [x] HTML, React, and Node copyable snippets aligned to the live specimen
- [x] Desktop, tablet, and mobile fit

## Follow-up polish

No P3 polish is required for handoff.

final result: passed
