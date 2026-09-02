# Simply Buttons

Simply Buttons is a growing gallery of polished, interactive button patterns. It is designed as a practical reference: preview an interaction, inspect its states, then copy the implementation that fits your stack.

<img width="1658" height="900" alt="image" src="https://github.com/user-attachments/assets/35ce1ee8-bbb8-4334-b11f-b481eb9325c7" />


## What’s inside

- Live button previews for hover, press, loading, success, toggle, and motion states.
- Copyable HTML + CSS, React, and Node variants where applicable.
- Search to find buttons by name, interaction, or use case.
- Light and dark theme support throughout the gallery.
- A mix of native CSS interactions and richer experiences using SVG, canvas, Three.js, Rive, and Lottie where the effect benefits from them.
- Accessible interaction foundations, including native buttons, keyboard activation, focus-visible states, and reduced-motion fallbacks where relevant.

## Using the gallery

1. Browse the cards or use the search icon in the top bar.
2. Interact with a preview to see its intended behavior.
3. Open the code option you need: **HTML + CSS**, **React**, or **Node**.
4. Copy the code and adapt the colours, text, and callback behavior to your product.

Each card is intentionally self-contained so you can lift a pattern without adopting a separate component library.

## Run locally

Simply Buttons requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Vite prints a local URL when the development server is ready. Open it in your browser to explore the gallery.

## Available scripts

```bash
# Start the local development server
npm run dev

# Create an optimized production build
npm run build

# Preview the production build locally
npm run preview
```

## Project structure

```text
src/
  buttons/       Individual button components, styles, assets, and copyable snippets
  components/    Shared presentation components
  App.jsx        Gallery layout and interaction wiring
  slots.js       Button registration and card metadata
public/          Runtime assets such as sounds, Rive files, Lottie files, and textures
```

## Request a button

Have a reference, interaction, or product moment you would like turned into a button? Email [bitanpaul933@gmail.com](mailto:bitanpaul933@gmail.com) with:

- A screenshot, video, or link to the reference.
- The desired states and interaction details.
- Your preferred output: HTML + CSS, React, Node, or all three.
- Any accessibility, performance, or theme requirements.

The clearer the interaction brief, the more faithfully it can be recreated.
