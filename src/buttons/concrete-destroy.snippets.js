const FALLBACK_CSS = `
.concrete-fallback {
  appearance: none;
  min-width: 220px;
  min-height: 76px;
  border: 1px solid #b9bab5;
  border-radius: 10px;
  background: #cecfc9;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.65), 0 8px 18px rgba(31, 31, 28, 0.18);
  color: #22221f;
  font: 700 18px/1 system-ui, sans-serif;
  letter-spacing: 0.12em;
  cursor: pointer;
}
.concrete-fallback:hover:not(:disabled) { background: #d3d3ce; }
.concrete-fallback:active:not(:disabled) { transform: translateY(1px); }
.concrete-fallback:focus-visible { outline: 2px solid #22221f; outline-offset: 3px; }
.concrete-fallback:disabled { cursor: not-allowed; opacity: 0.5; }
`.trim();

const FALLBACK_MARKUP = `<button class="concrete-fallback" type="button" aria-label="Destroy">DESTROY</button>`;

const HTML_PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Concrete destroy fallback</title>
  <style>
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #eef0ed; }
    ${FALLBACK_CSS}
  </style>
</head>
<body>
  <!-- Semantic pale-concrete fallback only; unbundled HTML does not include Three, Rapier, or Pinata physics. -->
  ${FALLBACK_MARKUP}
</body>
</html>`;

export const CONCRETE_DESTROY_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

// Install runtime dependencies:
// npm install three @react-three/fiber @react-three/drei @dgreenheck/three-pinata @dimforge/rapier3d-compat
// Engine modules used by the wrapper:
// ./concrete/ConcreteScene.jsx (lazy-loaded; uses Fiber createRoot internally)
// ./concrete/physics.js
// ./concrete/textures.js
// ./concrete/dust.js
import { ConcreteDestroyButton } from "./ConcreteDestroyButton.jsx";

export default function Example() {
  return <ConcreteDestroyButton label="DESTROY" onClick={() => console.log("fractured")} />;
}
`,
  node: `import { createServer } from "node:http";

const page = ${JSON.stringify(HTML_PAGE)};

createServer((request, response) => {
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(page);
}).listen(3000, () => console.log("http://localhost:3000"));

// This serves the semantic pale-concrete fallback only, not unbundled Three/Rapier/Pinata physics.
`,
};

export const CONCRETE_DESTROY_META = {
  id: "concrete-destroy",
  name: "Concrete Destroy",
  blurb: "Pale cast concrete fractures at the exact press point, then settles into physical rubble.",
  states: "default, hover, press, shattered, reset, disabled, reduced motion",
  keywords: [
    "concrete destroy",
    "concrete shatter",
    "fracture press",
    "press shatter",
    "physical rubble",
    "cast concrete",
    "3d shatter",
    "rapier physics",
    "crack rubble",
    "destroy button",
    "impact fracture",
    "break apart",
    "concrete crack",
    "physics shatter",
    "rubble settle",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
