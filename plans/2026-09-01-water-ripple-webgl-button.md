# Water Ripple WebGL Button (tray 129) — build notes

- Tray 129 `water-ripple` ("Dive in"): a pill of living water. Clicking drops a
  gaussian "drop" into a GPU heightfield (the Hugo Elias / sirxemic-ripples
  wave-equation algorithm) so ripples propagate, damp, and reflect; the pointer
  trails faint droplets; idle drops keep the pond alive.
- Files: `src/buttons/water-ripple-webgl.js` (sim module, initWaterRipple(canvas)),
  `water-ripple-button.css`, `WaterRippleButton.jsx`, `water-ripple-button.snippets.js`,
  `water-ripple-button.test.js`; `plans/water-ripple-gen.js` (snippet generator).
- Registered as tray 129 in slots.js; bumped the pinned tray counts 128→129 in
  awwwards-10-buttons.integration.test.js and twitter-50/twitter-50.test.js.

## Research basis (agents were blocked by the model concurrency cap → ran inline)
- Algorithm: Hugo Elias 2D heightfield (new = 2*avg(4 neighbors) - previous, damped)
  over two ping-ponged RGBA8 textures (R = current, G = previous, centered at 0.5) —
  the exact sirxemic/jquery.ripples pattern, chosen over a single-pass analytic
  ring-sum because real superposition + edge reflection reads as actual water.
- Display pass: normals from the height gradient refract a procedural deep-water
  background; chromatic dispersion (per-channel refraction offsets), crest
  brightening, specular glint.
- Portability: everything runs on UNSIGNED_BYTE textures (0.5-encoded heights),
  so no float-texture extension needed on WebGL1. preserveDrawingBuffer=true so
  toDataURL/screenshot probes work on the specimen.

## Verification
- Sim readback: calm pixel-sum 172 → click 392 (+220) → settled 172 exactly.
- Screenshot: wavefront arcs through the pill with refracted light.
- Full suite: 168/168.
