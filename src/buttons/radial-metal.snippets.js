const METAL_CSS = `
.btn-metal-mount {
  --metal-mount: #30343a;
  --metal-mount-dark: #14171a;
  --metal-focus: #1f6feb;
  position: relative;
  display: grid;
  place-items: center;
  width: 82px;
  height: 82px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgb(255 255 255 / 28%), transparent 27%, rgb(0 0 0 / 42%) 74%), var(--metal-mount);
  box-shadow: inset 0 1.5px 2px rgb(255 255 255 / 18%), inset 0 -3.5px 6px rgb(0 0 0 / 68%), 0 8px 12px rgb(0 0 0 / 25%);
}
:root[data-theme="dark"] .btn-metal-mount {
  --metal-mount: #24282e;
  --metal-mount-dark: #090b0d;
  --metal-focus: #9ecbff;
}
.btn-metal-mount::before {
  position: absolute;
  inset: 6px;
  border-radius: inherit;
  background: radial-gradient(circle at 35% 28%, rgb(0 0 0 / 8%), rgb(0 0 0 / 48%) 72%);
  box-shadow: inset 0 1.5px 3px rgb(0 0 0 / 72%), 0 1px 1px rgb(255 255 255 / 18%);
  content: "";
  pointer-events: none;
}
.btn-metal {
  appearance: none;
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 70px;
  height: 70px;
  margin: 0;
  padding: 0;
  border: 1px solid rgb(255 255 255 / 72%);
  border-radius: 50%;
  background-color: #a4a9aa;
  background-image: linear-gradient(140deg, rgb(255 255 255 / 34%), transparent 31%, rgb(0 0 0 / 19%) 76%), url("/textures/radial-brushed-aluminum.webp");
  background-position: center;
  background-size: cover;
  background-blend-mode: screen, normal;
  box-shadow: 0 5px 0 var(--metal-mount-dark), 0 9px 10px rgb(0 0 0 / 32%), inset 1.5px 1.5px 1.5px rgb(255 255 255 / 92%), inset -3px -3.5px 5px rgb(55 59 60 / 42%);
  color: #626768;
  cursor: pointer;
  transition: transform 180ms cubic-bezier(.2, 1.45, .45, 1), box-shadow 180ms ease, filter 180ms ease;
  -webkit-tap-highlight-color: transparent;
}
.btn-metal::before {
  position: absolute;
  inset: 3.5px;
  border: 1px solid rgb(255 255 255 / 37%);
  border-radius: inherit;
  box-shadow: inset 0 0 6px rgb(0 0 0 / 16%);
  content: "";
  pointer-events: none;
}
.btn-metal:hover:not(:disabled) { filter: brightness(1.045); }
.btn-metal.is-on { border-color: rgb(192 255 208 / 86%); box-shadow: 0 5px 0 var(--metal-mount-dark), 0 9px 10px rgb(0 0 0 / 32%), 0 0 2px rgb(57 255 106 / 72%), 0 0 8px rgb(57 255 106 / 24%), inset 1.5px 1.5px 1.5px rgb(255 255 255 / 92%), inset -3px -3.5px 5px rgb(55 59 60 / 42%); color: #39ff6a; }
.btn-metal:active:not(:disabled) { filter: brightness(.94); transform: scale(.94); box-shadow: 0 2px 3px rgb(0 0 0 / 35%), inset 3px 4px 6px rgb(23 27 28 / 56%), inset -1.5px -1.5px 2px rgb(255 255 255 / 54%); transition-duration: 70ms; }
.btn-metal.is-on:active:not(:disabled) { box-shadow: 0 2px 3px rgb(0 0 0 / 35%), 0 0 2px rgb(57 255 106 / 58%), 0 0 6px rgb(57 255 106 / 18%), inset 3px 4px 6px rgb(23 27 28 / 56%), inset -1.5px -1.5px 2px rgb(255 255 255 / 54%); }
.btn-metal:focus-visible { outline: 2.5px solid var(--metal-focus); outline-offset: 4px; }
.btn-metal:disabled { cursor: not-allowed; filter: grayscale(.55) brightness(.76); }
.btn-metal-icon { position: relative; z-index: 1; width: 24px; height: 24px; font-size: 24px; line-height: 1; filter: drop-shadow(1px 1px 0 rgb(255 255 255 / 72%)) drop-shadow(-1px -1px 0 rgb(44 48 49 / 44%)); opacity: .84; }
.btn-metal.is-on .btn-metal-icon { filter: drop-shadow(1px 1px 0 rgb(232 255 238 / 76%)) drop-shadow(-1px -1px 0 rgb(15 92 34 / 54%)) drop-shadow(0 0 3px rgb(57 255 106 / 76%)); }
@media (prefers-reduced-motion: reduce) { .btn-metal { transition: none; } }
`.trim();

const MARKUP = `<div class="btn-metal-mount">
  <button class="btn-metal" type="button" aria-label="Power" aria-pressed="false">
    <i class="ph-bold ph-power btn-metal-icon" aria-hidden="true"></i>
  </button>
</div>`;

const HTML_PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Radial metal button</title>
    <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.2/src/bold/style.css">
    <style>
      body { min-height: 100vh; display: grid; place-items: center; margin: 0; background: #e8eaee; }
      ${METAL_CSS}
    </style>
  </head>
  <body>
    <!-- Required asset: serve radial-brushed-aluminum.webp at /textures/radial-brushed-aluminum.webp. -->
    ${MARKUP}
    <script>
      const button = document.querySelector(".btn-metal");
      button.addEventListener("click", () => {
        const isOn = button.classList.toggle("is-on");
        button.setAttribute("aria-pressed", String(isOn));
      });
    </script>
  </body>
</html>`;

export const RADIAL_METAL_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useState } from "react";
import { Power } from "@phosphor-icons/react";

// Required asset: serve public/textures/radial-brushed-aluminum.webp at /textures/radial-brushed-aluminum.webp.

const METAL_CSS = ${JSON.stringify(METAL_CSS)};

export default function RadialMetalButton({ disabled = false, onClick }) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    if (document.getElementById("btn-metal-styles")) return;
    const style = document.createElement("style");
    style.id = "btn-metal-styles";
    style.textContent = METAL_CSS;
    document.head.appendChild(style);
  }, []);

  return <div className="btn-metal-mount"><button className={["btn-metal", isOn && "is-on"].filter(Boolean).join(" ")} type="button" aria-label="Power" aria-pressed={isOn} disabled={disabled} onClick={(event) => { setIsOn((value) => !value); onClick?.(event); }}><Power className="btn-metal-icon" weight="bold" aria-hidden="true" /></button></div>;
}
`,
  node: `import { createServer } from "node:http";
import { readFile } from "node:fs";

const page = ${JSON.stringify(HTML_PAGE)};
// Keep radial-brushed-aluminum.webp beside this server file.
const texture = new URL("./radial-brushed-aluminum.webp", import.meta.url);

createServer((request, response) => {
  if (request.url === "/textures/radial-brushed-aluminum.webp") {
    readFile(texture, (error, file) => {
      if (error) response.writeHead(404).end();
      else response.writeHead(200, { "content-type": "image/webp" }).end(file);
    });
    return;
  }
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  response.end(page);
}).listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const RADIAL_METAL_META = {
  id: "radial-metal",
  name: "Radial metal",
  blurb: "Machined metal face with tactile physical travel.",
  states: "default, hover, press, focus, disabled, reduced motion",
  keywords: [
    "radial metal",
    "machined metal",
    "brushed metal",
    "metal face",
    "physical travel",
    "tactile press",
    "aluminum button",
    "radial brush",
    "metal cta",
    "machined face",
    "hardware press",
    "metallic button",
    "depth travel",
    "industrial metal",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
