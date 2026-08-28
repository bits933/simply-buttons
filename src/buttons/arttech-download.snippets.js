import {
  ARTTECH_DOWNLOAD,
  ARTTECH_DOWNLOAD_ICON,
  buildArttechDownloadCss,
} from "./arttech-download.tokens.js";

const CSS = buildArttechDownloadCss();

const MARKUP = `
<button class="btn-atr-btn" type="button" aria-label="${ARTTECH_DOWNLOAD.label}">
  <span class="btn-atr-pill btn-atr-pill--download">
    <span class="btn-atr-label">${ARTTECH_DOWNLOAD.labelPrimary}</span>
    <span class="btn-atr-icon" aria-hidden="true">${ARTTECH_DOWNLOAD_ICON}</span>
  </span>
  <span class="btn-atr-pill btn-atr-pill--report">
    <span class="btn-atr-label">${ARTTECH_DOWNLOAD.labelSecondary}</span>
  </span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Download the full report</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f4f4; }
    ${CSS}
  </style>
</head>
<body>
  ${MARKUP}
</body>
</html>
`;

export const ARTTECH_DOWNLOAD_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const CSS = ${JSON.stringify(CSS)};

const ICON = ${JSON.stringify(ARTTECH_DOWNLOAD_ICON)};

export default function ArttechDownloadButton() {
  useEffect(() => {
    if (document.getElementById("btn-atr-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-atr-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button
      type="button"
      className="btn-atr-btn"
      aria-label="${ARTTECH_DOWNLOAD.label}"
    >
      <span className="btn-atr-pill btn-atr-pill--download">
        <span className="btn-atr-label">${ARTTECH_DOWNLOAD.labelPrimary}</span>
        <span
          className="btn-atr-icon"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: ICON }}
        />
      </span>
      <span className="btn-atr-pill btn-atr-pill--report">
        <span className="btn-atr-label">${ARTTECH_DOWNLOAD.labelSecondary}</span>
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

export const ARTTECH_DOWNLOAD_META = {
  id: "arttech-download",
  name: "ART+TECH download CTA",
  blurb: "Twin stubs that stretch, darken, and slide in a bold download icon on hover.",
  states: "default, hover, focus, active",
  keywords: [
    "art tech download",
    "download cta",
    "twin stubs",
    "stretch stubs",
    "download icon",
    "slide icon",
    "bold download",
    "icon reveal",
    "stub stretch",
    "darken hover",
    "file download",
    "download button",
    "icon slide in",
    "arttech cta",
    "hover download",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
