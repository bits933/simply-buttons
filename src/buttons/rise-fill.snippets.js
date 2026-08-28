const RISE_CSS = `
.btn-rise-root,
.btn-rise-btn {
  --rise-ink: #0b0b0b;
  --rise-fill: #0b0b0b;
  --rise-on-fill: #f1f1f1;
  --rise-line: rgba(11, 11, 11, 0.2);
  --rise-mark: rgba(11, 11, 11, 0.2);
  --rise-focus: #171717;
  --rise-ease: cubic-bezier(0.83, 0, 0.17, 1);
}
:root[data-theme="dark"] .btn-rise-root,
:root[data-theme="dark"] .btn-rise-btn {
  --rise-ink: #f1f1f1;
  --rise-fill: #f1f1f1;
  --rise-on-fill: #0b0b0b;
  --rise-line: rgba(241, 241, 241, 0.2);
  --rise-mark: rgba(241, 241, 241, 0.2);
  --rise-focus: #f5f5f5;
}
.btn-rise-root { display: grid; place-items: center; }
.btn-rise-btn {
  appearance: none;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  min-width: 228px;
  min-height: 36px;
  padding: 8px 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--rise-ink);
  font-family: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.06em;
  line-height: 1;
  text-transform: uppercase;
  cursor: pointer;
}
.btn-rise-btn *,
.btn-rise-btn *::before,
.btn-rise-btn *::after { box-sizing: border-box; }
.btn-rise-fill {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--rise-fill);
  transform: translateY(110%);
  transition: transform 0.6s var(--rise-ease);
  pointer-events: none;
}
.btn-rise-copy {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: 0 12px 0 10px;
  transition: color 0.6s var(--rise-ease);
}
.btn-rise-label { white-space: nowrap; }
.btn-rise-mark {
  flex: 0 0 auto;
  width: 11px;
  height: 11px;
  background: var(--rise-mark);
  transition: background 0.6s var(--rise-ease);
}
.btn-rise-line {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  height: 1px;
  background: var(--rise-line);
  pointer-events: none;
}
.btn-rise-btn:hover:not(:disabled) .btn-rise-fill,
.btn-rise-btn:focus-visible .btn-rise-fill { transform: translateY(0); }
.btn-rise-btn:hover:not(:disabled),
.btn-rise-btn:focus-visible { color: var(--rise-on-fill); }
.btn-rise-btn:hover:not(:disabled) .btn-rise-mark,
.btn-rise-btn:focus-visible .btn-rise-mark { background: var(--rise-on-fill); }
.btn-rise-btn:focus { outline: none; }
.btn-rise-btn:focus-visible { outline: 2px solid var(--rise-focus); outline-offset: 4px; }
.btn-rise-btn:active:not(:disabled) { transform: translateY(1px); }
.btn-rise-btn:disabled { cursor: not-allowed; opacity: 0.42; }
@media (prefers-reduced-motion: reduce) {
  .btn-rise-fill,
  .btn-rise-copy,
  .btn-rise-mark,
  .btn-rise-btn { transition: none; }
}
`;

const RISE_MARKUP = `
<button class="btn-rise-btn" type="button">
  <span class="btn-rise-fill" aria-hidden="true"></span>
  <span class="btn-rise-copy">
    <span class="btn-rise-label">Chapter II</span>
    <span class="btn-rise-mark" aria-hidden="true"></span>
  </span>
  <span class="btn-rise-line" aria-hidden="true"></span>
</button>
`;

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Rise fill</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body { display: grid; place-items: center; background: #121315; }
    ${RISE_CSS}
  </style>
</head>
<body>
  <div class="btn-rise-root">
    ${RISE_MARKUP}
  </div>
</body>
</html>
`;

export const RISE_FILL_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const RISE_CSS = ${JSON.stringify(RISE_CSS)};

export default function RiseFillButton({
  label = "Chapter II",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  useEffect(() => {
    if (document.getElementById("btn-rise-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-rise-styles";
    tag.textContent = RISE_CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button
      type="button"
      className={["btn-rise-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-rise-fill" aria-hidden="true" />
      <span className="btn-rise-copy">
        <span className="btn-rise-label">{label}</span>
        <span className="btn-rise-mark" aria-hidden="true" />
      </span>
      <span className="btn-rise-line" aria-hidden="true" />
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

export const RISE_FILL_META = {
  id: "rise-fill",
  name: "Rise fill",
  blurb: "Underlined label and square. Hover fills the bar from the bottom on an S-curve.",
  states: "default, hover, focus, active, disabled",
  keywords: [
    "rise fill",
    "underline fill",
    "bottom fill",
    "s curve",
    "fill bar",
    "hover rise",
    "square accent",
    "label underline",
    "rising fill",
    "ease fill",
    "fill hover",
    "underline button",
    "bar fill",
    "s-curve fill",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
