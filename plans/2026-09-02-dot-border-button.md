# Dot Border Button (tray 131)

Integrate ThreeUI `RectangleButtons` variant **dot-border-button** from the
registered source bundle, not from the docs preview.

- Source: https://threeui.com/source-code/dot-border-button.json
- Revision: SHA-256 `ff30e28c2781`
- Canonical HTML SHA-256 `eb3ef1de8c8af80bf3f532630c60ed4ee90f10cd645d136f284417e75bda6584`
- Configured usage: `variant="dot-border-button"` `mode="dark"` `hue={0}` `saturation={1}` `brightness={1}`

## Behavior

Exact authored CSS: four corner dots fly to the corners, then dashed border
segments draw in sequence, hatch fades in, the plate scales and fills `#25358b`.
ThreeUI isolation uses dark ground `#111318` (not the HTML file’s `#000` body).
`a[href="#"]` is preventDefault’d. Hue/sat/brightness at identity → no filter.

## Files

- `src/buttons/dot-border-button.source.html` — registered canonical HTML, byte-for-byte
- `src/buttons/dot-border-button.css`
- `src/buttons/DotBorderButton.jsx` — `RectangleButtons` + preview
- `src/buttons/dot-border-button.snippets.js` (from `plans/dot-border-gen.js`)
- `src/buttons/dot-border-button.test.js`

Appended after `jelly-switch` (tray 130). Color exception: source hover fill
`#25358b` and white/alpha ink on `#111318`.
