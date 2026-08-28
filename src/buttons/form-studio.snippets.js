const FORM_STUDIO_CSS = `
@property --form-mask {
  syntax: "<length-percentage>";
  inherits: true;
  initial-value: 8px;
}
.btn-form-btn {
  --form-ink: #111111;
  --form-focus: #171717;
  --form-mask: 8px;
  --form-ease: cubic-bezier(0.44, 0, 0.56, 1);
  appearance: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  min-height: 41px;
  padding: 4px 12px;
  border: none;
  border-radius: 40px;
  background: transparent;
  color: var(--form-ink);
  font-family: system-ui, sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
}
.btn-form-btn *,
.btn-form-btn *::before,
.btn-form-btn *::after { box-sizing: border-box; }
.btn-form-border {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  pointer-events: none;
  overflow: hidden;
  -webkit-mask:
    linear-gradient(to right, #000 var(--form-mask), transparent var(--form-mask)) left center / 51% 100% no-repeat,
    linear-gradient(to left, #000 var(--form-mask), transparent var(--form-mask)) right center / 51% 100% no-repeat;
  mask:
    linear-gradient(to right, #000 var(--form-mask), transparent var(--form-mask)) left center / 51% 100% no-repeat,
    linear-gradient(to left, #000 var(--form-mask), transparent var(--form-mask)) right center / 51% 100% no-repeat;
  transition: --form-mask 0.5s var(--form-ease);
}
.btn-form-border::after {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid currentColor;
  border-radius: inherit;
}
.btn-form-label {
  position: relative;
  z-index: 1;
  white-space: nowrap;
  user-select: none;
}
.btn-form-btn:hover:not(:disabled) .btn-form-border,
.btn-form-btn:focus-visible .btn-form-border { --form-mask: 100%; }
.btn-form-btn:focus-visible {
  outline: 2px solid var(--form-focus);
  outline-offset: 3px;
}
.btn-form-btn:disabled { cursor: not-allowed; opacity: 0.42; }
@media (prefers-reduced-motion: reduce) {
  .btn-form-border { transition: none; }
}
`.trim();

const FORM_STUDIO_MARKUP = `
<button class="btn-form-btn" type="button" aria-label="Studio">
  <span class="btn-form-border" aria-hidden="true"></span>
  <span class="btn-form-label">Studio</span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Form Studio CTA</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f4f4; }
    ${FORM_STUDIO_CSS}
  </style>
</head>
<body>
  ${FORM_STUDIO_MARKUP}
</body>
</html>
`;

export const FORM_STUDIO_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const FORM_STUDIO_CSS = ${JSON.stringify(FORM_STUDIO_CSS)};

export default function FormStudioButton({
  label = "Studio",
  disabled = false,
}) {
  useEffect(() => {
    if (document.getElementById("btn-form-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-form-styles";
    tag.textContent = FORM_STUDIO_CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button
      type="button"
      className="btn-form-btn"
      disabled={disabled}
      aria-label={label}
    >
      <span className="btn-form-border" aria-hidden="true" />
      <span className="btn-form-label">{label}</span>
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

export const FORM_STUDIO_META = {
  id: "form-studio",
  name: "Form studio pill",
  blurb: "Split end-caps at rest; the oval draws closed on hover.",
  states: "default, hover, focus, disabled",
  keywords: [
    "form studio",
    "form studio pill",
    "split end caps",
    "oval close",
    "draw closed",
    "pill morph",
    "end cap join",
    "hover seal",
    "split pill",
    "capsule draw",
    "geometry close",
    "outline morph",
    "studio pill",
    "closing oval",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
