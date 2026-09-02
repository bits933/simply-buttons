# Remove gallery trays (2026-09-01)

User asked to drop these **current** tray numbers from the gallery:

145, 143, 140, 138, 136, 134, 131, 122, 121, 118, 115, 112, 107, 105, 99, 93, 90, 87, 88

## Mapping (1-based `slot.index` before this change)

| Tray | Id | Batch |
|------|----|--------|
| 87 | `x50-voltage` | twitter-50 |
| 88 | `x50-loved-cta` | twitter-50 |
| 90 | `x50-cq-shimmer` | twitter-50 |
| 93 | `x50-glitch-flip` | twitter-50 |
| 99 | `x50-explore-3d` | twitter-50 |
| 105 | `x50-layer-step` | twitter-50 |
| 107 | `x50-dir-roll` | twitter-50 |
| 112 | `x50-gravity` | twitter-50 |
| 115 | `x50-syntax-glass` | twitter-50 |
| 118 | `x50-glass-mix` | twitter-50 |
| 121 | `x50-proximity` | twitter-50 |
| 122 | `x50-metallic` | twitter-50 |
| 131 | `x50-button-sets` | twitter-50 |
| 134 | `x50-hover-active` | twitter-50 |
| 136 | `x50-micro-scale` | twitter-50 |
| 138 | `aw-loco-shuffle` | awwwards |
| 140 | `aw-k95-chars` | awwwards |
| 143 | `aw-lusion-arrow` | awwwards |
| 145 | `aw-basement-segment` | awwwards |

## Approach

- Unregister the 19 objects from `src/slots.js` so they no longer render.
- Compact remaining trays (indices reassigned sequentially). Trays 1–86 stay the same (`dust-premium` is still 86).
- Keep source modules, catalogs, and snippets on disk so the specimens can be re-added later.
- Drop unused awwwards imports from `slots.js` so those four do not ship in the gallery bundle.

## After

- Live gallery: **127** trays (86 prior + 35 remaining x50 + 6 remaining awwwards).
- Remaining awwwards order: unseen-enter, exo-circle, zajno-underline, obys-underline, resn-slab, lenis-swap.
- Last remaining x50 id: `x50-fifteen`.
