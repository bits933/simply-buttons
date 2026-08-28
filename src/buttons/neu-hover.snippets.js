const NEU_CSS = `
.btn-neu-hover {
  --neu-surface: #e0e5ec;
  --neu-ink: #6c7686;
  --neu-shadow-dark: rgb(163 177 198 / 65%);
  --neu-shadow-light: #fff;
  appearance: none;
  padding: 14px 30px;
  border: none;
  border-radius: 12px;
  background: var(--neu-surface);
  color: var(--neu-ink);
  box-shadow: 7px 7px 16px var(--neu-shadow-dark), -7px -7px 16px var(--neu-shadow-light);
  font: 500 14px/1.2 system-ui, sans-serif;
  cursor: pointer;
  transition: box-shadow 200ms ease;
}
.btn-neu-hover:hover:not(:disabled) {
  box-shadow: inset 5px 5px 10px var(--neu-shadow-dark), inset -5px -5px 10px var(--neu-shadow-light);
}
.btn-neu-hover:focus-visible { outline: 2px solid #4b5563; outline-offset: 4px; }
.btn-neu-hover:disabled { cursor: not-allowed; opacity: 0.48; }
@media (prefers-reduced-motion: reduce) { .btn-neu-hover { transition: none; } }
`.trim();

const MARKUP = `<button class="btn-neu-hover" type="button">Soft</button>`;

const HTML_PAGE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Neumorphic hover button</title>
    <style>
      body { min-height: 100vh; display: grid; place-items: center; margin: 0; background: #e0e5ec; }
      ${NEU_CSS}
    </style>
  </head>
  <body>${MARKUP}</body>
</html>`;

export const NEU_HOVER_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const NEU_CSS = ${JSON.stringify(NEU_CSS)};

export default function NeuHoverButton({ label = "Soft", disabled = false, onClick }) {
  useEffect(() => {
    if (document.getElementById("btn-neu-hover-styles")) return;
    const style = document.createElement("style");
    style.id = "btn-neu-hover-styles";
    style.textContent = NEU_CSS;
    document.head.appendChild(style);
  }, []);

  return <button type="button" className="btn-neu-hover" disabled={disabled} onClick={onClick}>{label}</button>;
}
`,
  node: `const express = require("express");

const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};

app.get("/", (req, res) => res.type("html").send(PAGE));
app.listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const NEU_HOVER_META = {
  id: "neu-hover",
  name: "Neumorphic hover",
  blurb: "Soft raised surface presses inward on hover.",
  states: "default, hover, focus, disabled",
  keywords: [
    "neu hover",
    "neumorphic",
    "neumorphism",
    "soft ui",
    "raised surface",
    "press inward",
    "hover press",
    "soft emboss",
    "inset hover",
    "tactile soft",
    "clay soft",
    "neu button",
    "pressed face",
    "soft raise",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
