# Orbit Stroke Send Button (Button 46) Implementation Plan

**Goal:** Transform gallery button 46 (Orbit Stroke) into an interactive Send state machine:
1. **Idle State**: Displays "Send" with an inactive state; on hover the conic stroke gradient rotates smoothly around the border.
2. **Sending State (Triggered on Click)**: The conic stroke rotation starts and stays active, and the text morphs to "Sending" using `TextShimmerWave` (from `motion/react`) for ~2 seconds.
3. **Sent State**: Morphs to "Sent" with an animated SVG tick checkmark on the left.
4. **Auto-Reset**: After holding for ~1.8 seconds, automatically resets back to the initial "Send" state.

**Tech Stack**: React 19, Motion (`motion/react`), CSS, Node test runner, Vite.

## Proposed Changes
- `src/lib/utils.ts`: helper `cn` function.
- `src/components/TextShimmerWave.tsx`: Motion-powered wave shimmer component.
- `src/buttons/OrbitStrokeButton.jsx`: State machine ("idle" -> "sending" -> "sent" -> "idle") with timer management and animated tick checkmark.
- `src/buttons/orbit-stroke.css`: Active conic animation, smooth width transition, and SVG tick stroke animation.
- `src/buttons/orbit-stroke.snippets.js`: Snippets with React, HTML, Node code.
- `src/buttons/orbit-stroke.test.js`: Comprehensive unit tests verifying states, timing, accessibility, and TextShimmerWave integration.

## Verification Plan
- Unit tests: `node --test src/buttons/orbit-stroke*.test.js`
- Browser test: visually verify idle -> hover -> click -> Sending wave -> Sent tick -> Reset loop
- Build: `npm run build`
- Graph update: `/graphify --update`
