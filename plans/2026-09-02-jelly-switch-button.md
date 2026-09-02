# Jelly Switch Button (tray 130)

Port of Software Mansion’s TypeGPU [Jelly Switch](https://docs.swmansion.com/TypeGPU/examples/#example=rendering--jelly-switch)
as a **click button**, not a slider.

## Behavior

- The gel blob stays centered (no `SWITCH_RAIL_LENGTH` travel).
- Pointer down: TypeGPU press squash (`squashX.vel = -2`, `squashZ.vel = 1`, wiggle kick).
- Pointer up: toggle inactive → active (or back). Progress accelerates at `SWITCH_ACCELERATION = 100`.
- Hitting 0 or 1 converts leftover velocity into the same impact squash / wiggle as the source.
- `progress` drives the beer-lambert absorption + scatter (clear glass off, amber gel on).

## Files

- `src/buttons/jelly-switch-webgl.js` — springs + WebGL1 SDF raymarch
- `src/buttons/jelly-switch-button.css`
- `src/buttons/JellySwitchButton.jsx`
- `src/buttons/jelly-switch-button.snippets.js` (from `plans/jelly-switch-gen.js`)
- `src/buttons/jelly-switch-button.test.js`

Appended after `water-ripple` (tray 129). Color exception: TypeGPU demo jelly
`vec3(0.08, 0.5, 1.0)` (the published example / thumbnail, not the unused orange uniform).

## Orientation

TypeGPU's `fullScreenTriangle` UV is top-left, so their ray uses
`ndc.y = -(uv.y * 2 - 1)`. Our WebGL triangle has `v_uv.y = 0` at the
bottom (clip Y up). The first port copied their negation and rendered
the gel upside down. Fragment NDC Y is now `v_uv.y * 2.0 - 1.0`.

## Well + index

The TypeGPU studio plane is restored (gel sits on an infinite floor with
contact shadow + bounce). The plane albedo is `#121315` so the tray fills
with that grey — no circular well/socket (that read as a disc) and no
transparent misses. `.slot-index` / `.slot-expand` stay `z-index: 6` so
“130” sits above the opaque canvas.
