import { KOULEN_WIPE, buildKoulenWipeCss } from "./koulen-wipe.tokens.js";

const KOULEN_CSS = buildKoulenWipeCss({ previewStage: false });
const KOULEN_FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Koulen&display=swap";

const KOULEN_MARKUP = `
<button class="btn-koulen-btn" type="button">
  <span class="btn-koulen-fill" aria-hidden="true"></span>
  <span class="btn-koulen-ink btn-koulen-ink--rest">${KOULEN_WIPE.label}</span>
  <span class="btn-koulen-hot" aria-hidden="true">
    <span class="btn-koulen-ink btn-koulen-ink--hot">${KOULEN_WIPE.label}</span>
  </span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Koulen wipe</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${KOULEN_FONT_HREF}" rel="stylesheet">
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #141414; }
    ${KOULEN_CSS}
  </style>
</head>
<body>
  ${KOULEN_MARKUP}
</body>
</html>
`;

export const KOULEN_WIPE_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const KOULEN_CSS = ${JSON.stringify(KOULEN_CSS)};
const KOULEN_FONT_HREF = ${JSON.stringify(KOULEN_FONT_HREF)};

export default function KoulenWipeButton({
  label = ${JSON.stringify(KOULEN_WIPE.label)},
  disabled = false,
}) {
  useEffect(() => {
    if (!document.getElementById("btn-koulen-font")) {
      const link = document.createElement("link");
      link.id = "btn-koulen-font";
      link.rel = "stylesheet";
      link.href = KOULEN_FONT_HREF;
      document.head.appendChild(link);
    }
    if (document.getElementById("btn-koulen-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-koulen-styles";
    tag.textContent = KOULEN_CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button
      type="button"
      className="btn-koulen-btn"
      disabled={disabled}
    >
      <span className="btn-koulen-fill" aria-hidden="true" />
      <span className="btn-koulen-ink btn-koulen-ink--rest">{label}</span>
      <span className="btn-koulen-hot" aria-hidden="true">
        <span className="btn-koulen-ink btn-koulen-ink--hot">{label}</span>
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

export const KOULEN_WIPE_META = {
  id: "koulen-wipe",
  name: "Koulen wipe",
  blurb:
    "Koulen BUTTON. Yellow fill wipes in from the left; type stays put and flips to black.",
  states: "default, hover, focus, disabled",
  keywords: [
    "koulen wipe",
    "koulen button",
    "yellow wipe",
    "fill wipe",
    "left wipe",
    "color invert",
    "text flip",
    "wipe hover",
    "display font",
    "bold type",
    "yellow fill",
    "type contrast",
    "wipe cta",
    "koulen",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
