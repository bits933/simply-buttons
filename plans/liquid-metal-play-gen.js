/* Writes src/buttons/liquid-metal-button.snippets.js.

   HTML / Node stacks ship the Play Circle document produced by the exact
   ThreeUI LiquidMetalButton.tsx transforms. The React stack wraps that
   document in an iframe (same host + srcDoc path the registered component
   uses) plus the configured Scene usage.

   Run: node plans/liquid-metal-play-gen.js */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "src", "buttons");
const SHADERS = join(ROOT, "src", "shaders", "liquid-metal-button");

const liquidMetalButtonSource = readFileSync(
  join(SHADERS, "liquid-metal-button.html"),
  "utf8",
);
const galleryCss = readFileSync(join(DIR, "liquid-metal-button.css"), "utf8");

const LIQUID_METAL_BUTTON_BRIDGE = `
<script id="liquid-metal-button-bridge">
  window.addEventListener('message', event => {
    if(event.source !== parent) return;
    const config = event.data && event.data.liquidMetalButton;
    if(!config) return;
    const text = typeof config.text === 'string' ? config.text.slice(0, 24) : '';
    const label = btn.querySelector('.lbl');
    if(label) label.textContent = text;
    btn.setAttribute('aria-label', text || 'Button');
    if(Number.isFinite(config.pillWidthUnits)) {
      stage.style.setProperty('--bw', 'calc(' + config.pillWidthUnits + ' * var(--u))');
    }
    document.body.style.background = config.embedded ? '#0e0f12' : '';
    stage.style.position = config.embedded ? 'absolute' : '';
    stage.style.top = config.embedded ? '50%' : '';
    stage.style.left = config.embedded ? '50%' : '';
    stage.style.transform = config.embedded ? 'translate(-50%, -50%)' : '';
  });

  btn.addEventListener('click', () => {
    parent.postMessage({ liquidMetalButton: { type: 'activate' } }, '*');
  });
</script>`;

const playHtml = liquidMetalButtonSource
  .replace(
    "--bw: calc(1407 * var(--u));",
    "--bw: var(--h);",
  )
  .replace(
    "</style>",
    `
  /* Circular play-button adapter. The renderer and interaction graph stay
     source-exact; only geometry, finish, outline, and accessible naming vary. */
  body{position:relative}
  .stage{
    --h:88px;
    position:absolute;top:50%;left:50%;
    transform:translate(-50%,-50%);
  }
  #fx{filter:none}
  .btn{flex-direction:column;gap:0}
  .btn:focus-visible{outline:2px solid rgba(255,255,255,.68);outline-offset:4px}
  .btn .ico{
    width:calc(var(--h) * .25);height:calc(var(--h) * .25);
    transform:translateX(calc(var(--h) * .018));
  }
</style>`,
  )
  .replace(
    `<button class="btn" id="btn" type="button">
    <svg class="ico" viewBox="0 0 115 115" aria-hidden="true">
      <g stroke="currentColor" stroke-width="17" stroke-linecap="round">
        <path d="M57.5 8.5 V106.5"/>
        <path d="M8.5 57.5 H106.5"/>
      </g>
    </svg>
    <span class="lbl">Sign up</span>
  </button>`,
    `<button class="btn" id="btn" type="button" aria-label="Play">
    <svg class="ico" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="currentColor" d="M15.5 10.75a2.2 2.2 0 0 1 3.32-1.9l18.04 13.25a2.35 2.35 0 0 1 0 3.8L18.82 39.15a2.2 2.2 0 0 1-3.32-1.9v-26.5Z"/>
    </svg>
  </button>`,
  )
  .replace(
    "let needResize = true;",
    "let needResize = true;\nlet playStrokeWidth = 3;",
  )
  .replace(
    "const bw = Math.max(1.5, 3.2 * (BH/516));      // stroke half-width, device px",
    "const bw = Math.max(0.5 * DPR, playStrokeWidth * DPR * 0.5); // configurable stroke half-width, device px",
  )
  .replace(
    "window.__seek   = v => { clock = v; drawn = null; };",
    `window.__seek   = v => { clock = v; drawn = null; };

window.addEventListener('message', event => {
  if(event.source !== parent) return;
  const config = event.data && event.data.liquidMetalPlayButton;
  if(!config) return;
  const diameter = Math.min(160, Math.max(72, Number(config.diameter) || 88));
  const strokeWidth = Math.min(8, Math.max(1, Number(config.strokeWidth) || 3));
  const text = typeof config.text === 'string' ? config.text.slice(0, 24) : 'Play';
  stage.style.setProperty('--h', diameter + 'px');
  playStrokeWidth = strokeWidth;
  btn.setAttribute('aria-label', text.trim() || 'Play');
  cv.style.filter = config.rendering === 'monotone' ? 'grayscale(1) contrast(1.04)' : 'none';
  needResize = true;
  drawn = null;
});`,
  )
  .replace("</body>", `${LIQUID_METAL_BUTTON_BRIDGE}\n</body>`);

const hostCss = `${galleryCss}

.liquid-metal-button {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  isolation: isolate;
  background: #070708;
}

.liquid-metal-button__frame {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: #070708;
  opacity: 0;
  transition: opacity 180ms ease-out;
}

.liquid-metal-button__frame.is-ready {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .liquid-metal-button__frame {
    transition: none;
  }
}

.liquid-metal-play-root {
  width: min(100vw, 640px);
  height: min(42vw, 220px);
}
`;

const react = `import { useEffect, useRef, useState } from "react";

const CSS = ${JSON.stringify(hostCss)};

const PLAY_HTML = ${JSON.stringify(playHtml)};

export function LiquidMetalPlayButton({
  variant = "play",
  rendering = "colored",
  diameter = 88,
  strokeWidth = 3.0,
  text = "Play",
} = {}) {
  const frameRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;
    frameRef.current?.contentWindow?.postMessage({
      liquidMetalPlayButton: { diameter, strokeWidth, rendering, text },
    }, "*");
  }, [ready, diameter, rendering, strokeWidth, text]);

  return (
    <div className="liquid-metal-play-root" data-lmp-play>
      <style>{CSS}</style>
      <div className="shader-frame">
        <div
          className="liquid-metal-button"
          data-variant={variant}
          data-state={ready ? "ready" : "loading"}
        >
          <iframe
            ref={frameRef}
            className={"liquid-metal-button__frame" + (ready ? " is-ready" : "")}
            title="Interactive liquid metal play button"
            srcDoc={PLAY_HTML}
            sandbox="allow-scripts"
            onLoad={() => {
              setReady(true);
              frameRef.current?.contentWindow?.postMessage({
                liquidMetalPlayButton: { diameter, strokeWidth, rendering, text },
              }, "*");
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function Scene() {
  return (
    <div className="shader-frame">
      <LiquidMetalPlayButton
        variant="play"
        rendering="colored"
        diameter={88}
        strokeWidth={3.0}
        text="Play"
      />
    </div>
  );
}

export default LiquidMetalPlayButton;
`;

const node = `const express = require("express");

const HTML = ${JSON.stringify(playHtml)};

const app = express();
app.get("/", (req, res) => res.type("html").send(HTML));

app.listen(3000, () => console.log("liquid-metal-play button on http://localhost:3000"));
`;

const META_LITERAL = `{
  id: "liquid-metal-play",
  name: "Liquid metal play",
  blurb: "A compact icon-only play control from ThreeUI: WebGL 2 liquid-metal finish, 88px circle, configurable outline, and an accessible Play label.",
  states: ["idle", "hover", "focus-visible", "active", "ripple"],
  keywords: [
    "animated button",
    "interactive button",
    "liquid metal",
    "play button",
    "play circle",
    "webgl2 button",
    "threeui",
    "spectral metal",
    "icon button",
    "circle button",
    "ripple button",
    "hover glow",
    "press ripple",
    "shader button",
    "canvas button",
    "media play",
    "iridescent button",
  ],
}`;

const out = [
  "/* Liquid metal play snippets. HTML is the Play Circle document produced",
  "   by the exact ThreeUI LiquidMetalButton.tsx transforms. React wraps that",
  "   document in an iframe srcDoc; Express serves the same HTML.",
  "   Generated by plans/liquid-metal-play-gen.js. */",
  "",
  "export const LIQUID_METAL_BUTTON_SNIPPETS = {",
  "  html: " + JSON.stringify(playHtml) + ",",
  "  react: " + JSON.stringify(react) + ",",
  "  node: " + JSON.stringify(node) + ",",
  "};",
  "",
  "export const LIQUID_METAL_BUTTON_META = " + META_LITERAL + ";",
  "",
].join("\n");

writeFileSync(join(DIR, "liquid-metal-button.snippets.js"), out);
console.log("wrote liquid-metal-button.snippets.js", {
  html: playHtml.length,
  react: react.length,
  node: node.length,
});
