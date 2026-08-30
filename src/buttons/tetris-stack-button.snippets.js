/* Tetris stack button snippets — single self-contained button.
   Source: Osmo Button Pack #036 by Eduard Bodak
   (https://x.com/eduardbodak/status/2064631381213225327), recolored violet/amber. */

const CSS = `
@font-face {
  font-family: "Haffer";
  src: url("https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b17558b_HafferRegular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Haffer";
  src: url("https://cdn.prod.website-files.com/69dcc68547ac15ea8b175579/69dcc68547ac15ea8b175594_HafferSemiBold.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
.tetris-stack-root {
  --size-unit: 16;
  --size-container-ideal: 1440;
  --size-container-min: 992px;
  --size-container-max: 1680px;
  --size-container: clamp(var(--size-container-min), 100vw, var(--size-container-max));
  --size-font: calc(var(--size-container) / (var(--size-container-ideal) / var(--size-unit)));
  --button-036-color: #fff;
  --button-036-color-background: #5a45e0;
  --button-036-hover-color: #131313;
  --button-036-hover-color-background: #ffd23f;
  --button-036-hover-bg-origin-y: bottom;
  --button-036-hover-text-move-y: 1;
  --button-036-text-origin-y: top;
  --button-036-hover-text-origin-y: bottom;
  --button-036-color-focus: #131313;
  --button-036-padding: 0.75em 1em;
  --button-036-border-radius: 2.5em;
  --button-036-focus-inset: -0.125em;
  --button-036-hover-scale: 1.065 1.095;
  --button-036-click-scale: 0.955 0.925;
  --button-036-ease-click: cubic-bezier(0.4, 0, 0.2, 1);
  --button-036-ease-hover: cubic-bezier(0.625, 0.05, 0, 1);
  --button-036-ease-focus: cubic-bezier(0.32, 0.72, 0, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  font-family: "Haffer", Arial, sans-serif;
  font-weight: 600;
  line-height: 1;
  font-size: calc(var(--size-font) * 1.5);
}
.tetris-stack-root *, .tetris-stack-root *::after, .tetris-stack-root *::before { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
.tetris-stack-root .button-036 { -webkit-tap-highlight-color: transparent; transition: scale 0.15s var(--button-036-ease-click); }
@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .tetris-stack-root .button-036:is(:hover, :focus-visible) .button-036__bg,
  .tetris-stack-root [data-hover]:is(:hover, :focus-visible) .button-036 .button-036__bg {
    scale: var(--button-036-hover-scale);
    transition-delay: 0.05s;
  }
  .tetris-stack-root .button-036:is(:hover, :focus-visible) .button-036__bg-span,
  .tetris-stack-root [data-hover]:is(:hover, :focus-visible) .button-036 .button-036__bg-span {
    scale: 1 1;
    transition: scale 0.525s calc(var(--index) * 0.049s + 0.05s) var(--button-036-ease-hover);
  }
  .tetris-stack-root .button-036:is(:hover, :focus-visible) .button-036__text.is--default,
  .tetris-stack-root [data-hover]:is(:hover, :focus-visible) .button-036 .button-036__text.is--default {
    transform: perspective(10em) scale(0.75) rotateX(calc(var(--button-036-hover-text-move-y) * 90deg)) translate3d(0, calc(var(--button-036-hover-text-move-y) * -50%), 0);
    opacity: 0;
    transition: transform 0.475s 0.1s var(--button-036-ease-hover), opacity 0.1s 0.2s ease-out;
  }
  .tetris-stack-root .button-036:is(:hover, :focus-visible) .button-036__text.is--hover,
  .tetris-stack-root [data-hover]:is(:hover, :focus-visible) .button-036 .button-036__text.is--hover {
    transform: perspective(10em) scale(1) rotateX(0deg) translate3d(0, 0, 0);
    opacity: 1;
    transition: transform 0.475s 0.15s var(--button-036-ease-hover), opacity 0.1s 0.175s ease-out;
  }
}
.tetris-stack-root .button-036:is(:focus-visible)::after {
  box-shadow: 0 0 0 0.125em var(--button-036-color-focus);
  scale: var(--button-036-hover-scale);
}
.tetris-stack-root .button-036:active { scale: var(--button-036-click-scale); }
.tetris-stack-root .button-036::after {
  content: '';
  display: block;
  position: absolute;
  inset: var(--button-036-focus-inset);
  border-radius: var(--button-036-border-radius);
  transition: box-shadow 0.3s var(--button-036-ease-focus), scale 0.45s var(--button-036-ease-hover);
  pointer-events: none;
  z-index: 1;
}
.tetris-stack-root .button-036__bg { transition: scale 0.45s var(--button-036-ease-hover); }
.tetris-stack-root .button-036__bg-span {
  will-change: transform;
  transform-origin: center var(--button-036-hover-bg-origin-y);
  transition: scale 0.4s calc(var(--index) * 0.036s) var(--button-036-ease-hover);
  scale: 1 0;
}
.tetris-stack-root .button-036__bg-span::after {
  content: '';
  display: block;
  position: absolute;
  inset: -1px;
  background-color: var(--button-036-hover-color-background);
}
.tetris-stack-root .button-036__text { will-change: transform; }
.tetris-stack-root .button-036__text.is--default {
  transform-origin: var(--button-036-text-origin-y) center;
  transition: transform 0.45s 0.1s var(--button-036-ease-hover), opacity 0.1s 0.125s ease-out;
}
.tetris-stack-root .button-036__text.is--hover {
  transform-origin: var(--button-036-hover-text-origin-y) center;
  transform: perspective(10em) scale(0.75) rotateX(calc(var(--button-036-hover-text-move-y) * -90deg)) translate3d(0, calc(var(--button-036-hover-text-move-y) * 50%), 0);
  transition: transform 0.45s 0.05s var(--button-036-ease-hover), opacity 0.1s 0.15s ease-out;
  opacity: 0;
}
.tetris-stack-root .button-036 {
  -webkit-user-select: none;
  user-select: none;
  color: var(--button-036-color);
  background-color: #0000;
  outline-style: none;
  padding: 0;
  line-height: 1;
  text-decoration: none;
  display: inline-grid;
  position: relative;
  font-family: inherit;
  font-size: inherit;
  border: 0;
  cursor: pointer;
}
.tetris-stack-root .button-036__bg {
  border-radius: var(--button-036-border-radius);
  background-color: var(--button-036-color-background);
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: clip;
}
.tetris-stack-root .button-036__bg-span { width: 100%; height: 100%; padding: 0; position: relative; }
.tetris-stack-root .button-036__inner {
  z-index: 1;
  border-radius: var(--button-036-border-radius);
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  display: grid;
  overflow: clip;
}
.tetris-stack-root .button-036__text {
  width: 100%;
  height: 100%;
  padding: var(--button-036-padding);
  grid-area: 1 / 1;
}
.tetris-stack-root .button-036__text.is--hover { color: var(--button-036-hover-color); }
`.trim();

function bgSpans() {
  return `
        <span style="--index: 0" class="button-036__bg-span"></span>
        <span style="--index: 1" class="button-036__bg-span"></span>
        <span style="--index: 2" class="button-036__bg-span"></span>
        <span style="--index: 3" class="button-036__bg-span"></span>
        <span style="--index: 4" class="button-036__bg-span"></span>`;
}

const MARKUP = `
  <div class="tetris-stack-root">
    <button type="button" data-button-036="" class="button-036">
      <span class="button-036__bg">${bgSpans()}
      </span>
      <span class="button-036__inner">
        <span class="button-036__text is--default">Button</span>
        <span aria-hidden="true" class="button-036__text is--hover">Button</span>
      </span>
    </button>
  </div>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tetris stack button</title>
  <style>
    body { margin: 0; }
    ${CSS}
  </style>
</head>
<body>
${MARKUP}
</body>
</html>
`;

export const TETRIS_STACK_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

// Tetris stack button — Osmo Button Pack #036 by Eduard Bodak, recolored
// https://x.com/eduardbodak/status/2064631381213225327

import { useEffect } from "react";

const CSS = ${JSON.stringify(CSS)};

const SPAN_INDEXES = [0, 1, 2, 3, 4];

export default function TetrisStackButton({ label = "Button" }) {
  useEffect(() => {
    if (document.getElementById("tetris-stack-styles")) return;
    const tag = document.createElement("style");
    tag.id = "tetris-stack-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <div className="tetris-stack-root">
      <button type="button" data-button-036="" className="button-036">
        <span className="button-036__bg">
          {SPAN_INDEXES.map((index) => (
            <span key={index} style={{ "--index": index }} className="button-036__bg-span" />
          ))}
        </span>
        <span className="button-036__inner">
          <span className="button-036__text is--default">{label}</span>
          <span aria-hidden="true" className="button-036__text is--hover">{label}</span>
        </span>
      </button>
    </div>
  );
}
`,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const TETRIS_STACK_META = {
  id: "tetris-stack",
  name: "Tetris stack button",
  blurb:
    "Variant of Eduard Bodak's 100 Buttons #036 — five Tetris-style blocks stack up behind the label with a staggered rise while the text flips through 3D. Recolored from the original white/black to violet and amber.",
  states: "default, hover, focus-visible, active, reduced motion",
  keywords: [
    "tetris stack button",
    "tetris button",
    "tetromino",
    "block fill",
    "stack fill",
    "staggered blocks",
    "stagger hover",
    "game button",
    "arcade button",
    "pixel blocks",
    "eduard bodak",
    "100 buttons",
    "036/100",
    "osmo button pack",
    "violet button",
    "purple button",
    "amber fill",
    "yellow fill",
    "color invert",
    "text flip",
    "3d text",
    "rotateX",
    "perspective text",
    "animated button",
    "interactive button",
    "cta",
  ],
};
