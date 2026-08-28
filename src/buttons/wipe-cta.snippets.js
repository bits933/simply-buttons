const WIPE_CTA_CSS = `
.btn-wipe-btn {
  --wipe-fill: #080b08;
  --wipe-ink: #ecebe5;
  --wipe-hover-fill: #ecebe5;
  --wipe-hover-ink: #080b08;
  --wipe-focus: #171717;
  --wipe-clip-ease: cubic-bezier(0.25, 0, 0, 1);
  --wipe-press-ease: cubic-bezier(0.16, 1, 0.3, 1);
  appearance: none;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 48px;
  padding: 12px 18px;
  border: 1px solid var(--wipe-fill);
  border-radius: 0;
  background: var(--wipe-fill);
  background-clip: padding-box;
  color: var(--wipe-ink);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 11px;
  font-weight: 600;
  font-variation-settings: "wght" 620;
  letter-spacing: 0.12em;
  line-height: 1.25;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.14s var(--wipe-press-ease);
}
.btn-wipe-btn *,
.btn-wipe-btn *::before,
.btn-wipe-btn *::after { box-sizing: border-box; }
.btn-wipe-copy {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: inherit;
  width: 100%;
  white-space: nowrap;
}
.btn-wipe-copy--hover {
  position: absolute;
  z-index: 2;
  inset: 0;
  padding: inherit;
  background: var(--wipe-hover-fill);
  color: var(--wipe-hover-ink);
  clip-path: polygon(0% 0%, 0% 0%, -100% 100%, 0% 100%);
  pointer-events: none;
  transition: clip-path 0.4s var(--wipe-clip-ease);
}
@media (hover: hover) {
  .btn-wipe-btn:hover:not(:disabled) .btn-wipe-copy--hover {
    clip-path: polygon(0% 0%, 200% 0%, 100% 100%, 0% 100%);
  }
}
.btn-wipe-btn:focus-visible .btn-wipe-copy--hover {
  clip-path: polygon(0% 0%, 200% 0%, 100% 100%, 0% 100%);
}
.btn-wipe-btn:focus-visible {
  outline: 2px solid var(--wipe-focus);
  outline-offset: 3px;
}
.btn-wipe-btn:active:not(:disabled) {
  transform: translateY(1px);
}
.btn-wipe-btn:disabled { cursor: not-allowed; opacity: 0.42; }
@media (prefers-reduced-motion: reduce) {
  .btn-wipe-btn, .btn-wipe-copy--hover { transition: none; }
  .btn-wipe-btn:active:not(:disabled) { transform: none; }
}
`.trim();

const WIPE_CTA_MARKUP = `
<button class="btn-wipe-btn" type="button" aria-label="Motion+">
  <span class="btn-wipe-copy">Motion+</span>
  <span class="btn-wipe-copy btn-wipe-copy--hover" aria-hidden="true">Motion+</span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Wipe CTA</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #fbd509; }
    ${WIPE_CTA_CSS}
  </style>
</head>
<body>
  ${WIPE_CTA_MARKUP}
</body>
</html>
`;

export const WIPE_CTA_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const WIPE_CTA_CSS = ${JSON.stringify(WIPE_CTA_CSS)};

export default function WipeCtaButton({
  label = "Motion+",
  disabled = false,
}) {
  useEffect(() => {
    if (document.getElementById("btn-wipe-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-wipe-styles";
    tag.textContent = WIPE_CTA_CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button
      type="button"
      className="btn-wipe-btn"
      disabled={disabled}
      aria-label={label}
    >
      <span className="btn-wipe-copy">{label}</span>
      <span className="btn-wipe-copy btn-wipe-copy--hover" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
`,
  node: `const express = require("express");

const app = express();

const PAGE = ${JSON.stringify(HTML_PAGE)};

app.get("/", function (req, res) {
  res.type("html").send(PAGE);
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
`,
};

export const WIPE_CTA_META = {
  id: "wipe-cta",
  name: "Wipe invert",
  blurb: "Header CTA that reveals its invert on a hard diagonal.",
  states: "default, hover, focus, active, disabled",
  keywords: [
    "wipe invert",
    "cta",
    "wipe",
    "invert",
    "diagonal wipe",
    "hover",
    "reveal",
    "header cta",
    "hard diagonal",
    "swipe",
    "call to action",
    "primary",
    "hero",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
