# Implementation Plan - Randomize Button Lottie Dice Icon

Replace the static Phosphor `<Shuffle />` icon in the `.randomize-btn` header control with the user-provided Lottie dice cube animation (`wired-outline-1471-dice-cube.json`). The animation remains static at frame 0 and only animates/rolls when the button is clicked.

## Proposed Changes

### Assets & Config

#### [NEW] [wired-outline-1471-dice-cube.json](file:///c:/Users/User/Desktop/vibe%20coding/buttons/src/assets/wired-outline-1471-dice-cube.json)
- Store the 430x430 60fps outline dice cube Lottie animation JSON data in `src/assets/wired-outline-1471-dice-cube.json`.

---

### App Component

#### [MODIFY] [App.jsx](file:///c:/Users/User/Desktop/vibe%20coding/buttons/src/App.jsx)
- Import `Lottie` from `lottie-react` and `diceCubeJson` from `./assets/wired-outline-1471-dice-cube.json`.
- Add a ref `randomizeLottieRef = useRef(null)`.
- In `randomize()`:
  - Call `randomizeLottieRef.current?.goToAndPlay(0, true)`.
- In `.randomize-btn`:
  - Replace `<Shuffle ... />` with `<Lottie lottieRef={randomizeLottieRef} animationData={diceCubeJson} autoplay={false} loop={false} className="randomize-lottie-icon" aria-hidden="true" />`.

---

### Styles

#### [MODIFY] [index.css](file:///c:/Users/User/Desktop/vibe%20coding/buttons/src/index.css)
- Style `.randomize-lottie-icon` (18x18px size, `display: inline-flex`, `stroke: currentColor`).
- Remove hover CSS wiggle animation so the icon only animates when clicked.

---

### Tests

#### [MODIFY] [App.test.js](file:///c:/Users/User/Desktop/vibe%20coding/buttons/src/App.test.js)
- Update assertions to verify `Lottie`, `wired-outline-1471-dice-cube.json`, and `.randomize-lottie-icon`.

---

## Verification Plan

### Automated Tests
1. `npm test` -> verify all test suites pass.
2. `npm run build` -> verify clean Vite production bundle.
3. `/graphify --update` -> maintain graph index integrity.

### Manual Verification
- Test in browser: clicking "Randomize" rolls the dice animation, idle/hover does not loop or animate.
