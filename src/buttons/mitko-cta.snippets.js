import { MITKO_CTA, buildMitkoCtaCss } from "./mitko-cta.tokens.js";

const MITKO_CTA_CSS = buildMitkoCtaCss();

const MITKO_CTA_MARKUP = `
<button type="button" class="btn-mitko-btn">
  ${MITKO_CTA.title}
  <div class="btn-mitko-bar" aria-hidden="true"></div>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>This is a button</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f4f4; }
    ${MITKO_CTA_CSS}
  </style>
</head>
<body>
  ${MITKO_CTA_MARKUP}
</body>
</html>
`;

export const MITKO_CTA_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect } from "react";

const MITKO_CTA_CSS = ${JSON.stringify(MITKO_CTA_CSS)};

export default function MitkoCtaButton() {
  useEffect(() => {
    if (document.getElementById("btn-mitko-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-mitko-styles";
    tag.textContent = MITKO_CTA_CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button
      type="button"
      className="btn-mitko-btn"
    >
      ${MITKO_CTA.title}
      <div className="btn-mitko-bar" aria-hidden="true" />
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

export const MITKO_CTA_META = {
  id: "mitko-cta",
  name: "This is a button",
  blurb: "A plain button with a 2px underline that wipes from gray to ink.",
  states: "default, hover, focus",
  keywords: [
    "mitko cta",
    "this is a button",
    "underline wipe",
    "ink underline",
    "gray to ink",
    "plain button",
    "text underline",
    "wipe hover",
    "2px underline",
    "minimal cta",
    "underline reveal",
    "simple link button",
    "stroke wipe",
    "ink stroke",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
