# Implementation Plan: Claude Code Button WebGL Pixel Simulation & Icon Update

## Overview
Transform the loader on the 85th button (**Claude Code**) into a high-performance WebGL pixel shader simulation, replace the icon with the user-provided vectorized SVG (`image 374 [Vectorized].svg`), and remove the intermediate completed state so clicking smoothly runs the simulation and resets directly to idle.

## Key Technical Specifications

### 1. Vectorized SVG Left Icon
- Exact paths from `C:\Users\User\Downloads\image 374 [Vectorized].svg`:
  - Body path: `d="M303.969 378.747L975.937 378.742L975.962 600.73L1088.04 600.707L1088.06 716.464L976.049 716.427L976.056 829.477L920.531 829.458L920.524 938.745L864.031 938.752C863.243 903.364 863.987 865.102 863.987 829.477L808.524 829.464L808.512 879.845L808.506 938.745L751.993 938.752C751.549 902.652 751.974 865.645 751.974 829.47L528.057 829.464L528.051 938.752H471.557L471.617 829.483L416.057 829.464L416.041 938.745L359.479 938.758L359.496 829.477L304.019 829.464C303.296 792.645 303.982 753.47 303.979 716.452L191.981 716.427L191.953 600.706L304.011 600.714L303.969 378.747Z"` with `fill="currentColor"`.
  - Eyes paths: `d="M808.324 494.462..."` and `d="M416.072 494.43..."` with animated glance keyframes.
- In idle: body fills with `--claude-code-accent` (`#D87757` / `#cd694a`).
- On hover and loading: smoothly transitions to pure crisp white (`#ffffff`).

### 2. WebGL Pixel Matrix Simulation (`claude-code-webgl.js`)
- Full-resolution `<canvas>` backing buffer scaled by `devicePixelRatio`.
- Custom GLSL Fragment Shader:
  - **Grid & Discrete Cells**: Renders sharp `3.5px` square pixel cells with discrete subpixel grid lines.
  - **Dynamic Wavefront**: Computes progress distance from the animated leading edge.
  - **Quantum Sparkle & Leading Edge Disintegration**: Ahead of the advancing wavefront, random pseudo-random pixel sparks light up and ignite dynamically.
  - **High-Intensity Glowing Wavefront**: Gaussian beam emission at the wavefront with white-hot core and luminous terracotta bloom.
  - **Alpha Blending**: WebGL canvas has premultiplied alpha enabled, seamlessly rendering on top of the button background without CSS artifacting.

### 3. Click Lifecycle (No Completed State)
- Click button:
  - Phase changes to `loading`.
  - WebGL animation runs for 2.2 seconds ($0.0 \to 1.0$).
  - Label transitions to shimmering `Thinking...`.
  - Upon reaching $1.0$, smoothly resets directly back to `idle` ready for another click.

### 4. Files to Update
- `src/buttons/claude-code-webgl.js`: [NEW] WebGL shader compilation, animation loop, and cleanup.
- `src/buttons/ClaudeCodeButton.jsx`: [MODIFY] Canvas ref, WebGL mount, click handler, and updated SVG mascot.
- `src/buttons/claude-code-button.css`: [MODIFY] Canvas styling, removed complete state styles, refined label & mascot.
- `src/buttons/claude-code-button.snippets.js`: [MODIFY] HTML, React, and Node snippets with inline WebGL runtime.
- `src/buttons/claude-code-button.test.js`: [MODIFY] Unit tests.
