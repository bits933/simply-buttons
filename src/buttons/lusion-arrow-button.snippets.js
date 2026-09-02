/* Dots to arrow snippets — awwwards showcase harvest (trays 137-146).
   Source: lusion.co's “let's talk” pill.
   Specimen assembly for the Simply Buttons gallery. */

const CSS = "/* Lusion arrow button — lusion.co's \"Let's talk\" header CTA (awwwards SOTD\n   May 2019 + Developer Award). Fully-rounded pill (radius 6.25em) whose\n   label slides +1.5em on hover while a three-dot cluster scales to 0 and\n   an arrow flies in from -2.5em, 0.3s cubic-bezier(0.4, 0, 0.1, 1) —\n   exact transform math from the site's stylesheet. Specimen for the\n   Simply Buttons gallery. */\n\n.lusion-arrow-root {\n  --aw-glide-arrow: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 1rem;\n  padding: 10px;\n  background: #16181d;\n  border-radius: 8px;\n}\n\n.btn-lusion-arrow {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  gap: 0;\n  box-sizing: border-box;\n  padding: 0.85em 1.5em;\n  border: 0;\n  border-radius: 6.25em;\n  background: #5e6b78;\n  color: #ffffff;\n  font-family: \"Neue Montreal\", \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 0.85rem;\n  font-weight: 500;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n  line-height: 1;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.btn-lusion-arrow,\n.btn-lusion-arrow * {\n  box-sizing: border-box;\n}\n\n.la-window {\n  position: relative;\n  display: inline-block;\n  width: 0;\n  height: 1em;\n}\n\n/* Arrow parks at -2.5em; on hover it flies to sit next to the label. */\n.la-arrow {\n  position: absolute;\n  left: -1.5em;\n  top: 50%;\n  width: 1em;\n  height: 1em;\n  margin-top: -0.5em;\n  color: #ffffff;\n  transform: translate3d(-2.5em, 0, 0);\n  transition: transform 300ms cubic-bezier(0.4, 0, 0.1, 1);\n  will-change: transform;\n}\n\n.la-arrow svg {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n/* Dot cluster scales to 0 on hover, making room for the arrow. */\n.la-dots {\n  position: absolute;\n  left: -1.5em;\n  top: 50%;\n  width: 1em;\n  height: 1em;\n  margin-top: -0.5em;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.18em;\n  transition: transform 300ms cubic-bezier(0.4, 0, 0.1, 1), opacity 200ms ease;\n  will-change: transform, opacity;\n}\n\n.la-dots span {\n  width: 3px;\n  height: 3px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.85);\n}\n\n/* Label slides +1.5em to make room for the arriving arrow. */\n.la-label {\n  display: inline-block;\n  transform: translate3d(0, 0, 0);\n  transition: transform 300ms cubic-bezier(0.4, 0, 0.1, 1);\n  will-change: transform;\n}\n\n.btn-lusion-arrow:hover .la-arrow,\n.btn-lusion-arrow:focus-visible .la-arrow {\n  transform: translate3d(0, 0, 0);\n}\n\n.btn-lusion-arrow:hover .la-dots,\n.btn-lusion-arrow:focus-visible .la-dots {\n  transform: scale(0);\n  opacity: 0;\n}\n\n.btn-lusion-arrow:hover .la-label,\n.btn-lusion-arrow:focus-visible .la-label {\n  transform: translate3d(1.5em, 0, 0);\n}\n\n.btn-lusion-arrow:active {\n  transform: scale(0.96);\n}\n\n.btn-lusion-arrow:focus-visible {\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .la-arrow,\n  .la-dots,\n  .la-label {\n    transition: none;\n  }\n  .btn-lusion-arrow:active {\n    transform: none;\n  }\n}\n";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dots to arrow button</title>
  <style>
${CSS}  </style>
</head>
<body>
<div class="lusion-arrow-root">
  <button type="button" class="btn-lusion-arrow" data-lusion-arrow="" aria-label="LET'S TALK">
    <span class="la-window">
      <span class="la-arrow" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 12h15M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
      </span>
      <span class="la-dots" aria-hidden="true"><span></span><span></span><span></span></span>
    </span>
    <span class="la-label">LET'S TALK</span>
  </button>
</div>
</body>
</html>`;

const REACT = "\"use client\";\n\n// Lusion arrow button — lusion.co's \"Let's talk\" pill rebuilt: label slides\n// +1.5em while dots collapse and an arrow flies in from -2.5em.\n\nimport { useEffect } from \"react\";\n\nconst CSS = \"/* Lusion arrow button — lusion.co's \\\"Let's talk\\\" header CTA (awwwards SOTD\\n   May 2019 + Developer Award). Fully-rounded pill (radius 6.25em) whose\\n   label slides +1.5em on hover while a three-dot cluster scales to 0 and\\n   an arrow flies in from -2.5em, 0.3s cubic-bezier(0.4, 0, 0.1, 1) —\\n   exact transform math from the site's stylesheet. Specimen for the\\n   Simply Buttons gallery. */\\n\\n.lusion-arrow-root {\\n  --aw-glide-arrow: 1;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  height: 100%;\\n  font-size: 1rem;\\n  padding: 10px;\\n  background: #16181d;\\n  border-radius: 8px;\\n}\\n\\n.btn-lusion-arrow {\\n  position: relative;\\n  display: inline-flex;\\n  align-items: center;\\n  gap: 0;\\n  box-sizing: border-box;\\n  padding: 0.85em 1.5em;\\n  border: 0;\\n  border-radius: 6.25em;\\n  background: #5e6b78;\\n  color: #ffffff;\\n  font-family: \\\"Neue Montreal\\\", \\\"Helvetica Neue\\\", Arial, sans-serif;\\n  font-size: 0.85rem;\\n  font-weight: 500;\\n  letter-spacing: 0.04em;\\n  text-transform: uppercase;\\n  line-height: 1;\\n  cursor: pointer;\\n  -webkit-tap-highlight-color: transparent;\\n}\\n\\n.btn-lusion-arrow,\\n.btn-lusion-arrow * {\\n  box-sizing: border-box;\\n}\\n\\n.la-window {\\n  position: relative;\\n  display: inline-block;\\n  width: 0;\\n  height: 1em;\\n}\\n\\n/* Arrow parks at -2.5em; on hover it flies to sit next to the label. */\\n.la-arrow {\\n  position: absolute;\\n  left: -1.5em;\\n  top: 50%;\\n  width: 1em;\\n  height: 1em;\\n  margin-top: -0.5em;\\n  color: #ffffff;\\n  transform: translate3d(-2.5em, 0, 0);\\n  transition: transform 300ms cubic-bezier(0.4, 0, 0.1, 1);\\n  will-change: transform;\\n}\\n\\n.la-arrow svg {\\n  display: block;\\n  width: 100%;\\n  height: 100%;\\n}\\n\\n/* Dot cluster scales to 0 on hover, making room for the arrow. */\\n.la-dots {\\n  position: absolute;\\n  left: -1.5em;\\n  top: 50%;\\n  width: 1em;\\n  height: 1em;\\n  margin-top: -0.5em;\\n  display: inline-flex;\\n  align-items: center;\\n  justify-content: center;\\n  gap: 0.18em;\\n  transition: transform 300ms cubic-bezier(0.4, 0, 0.1, 1), opacity 200ms ease;\\n  will-change: transform, opacity;\\n}\\n\\n.la-dots span {\\n  width: 3px;\\n  height: 3px;\\n  border-radius: 50%;\\n  background: rgba(255, 255, 255, 0.85);\\n}\\n\\n/* Label slides +1.5em to make room for the arriving arrow. */\\n.la-label {\\n  display: inline-block;\\n  transform: translate3d(0, 0, 0);\\n  transition: transform 300ms cubic-bezier(0.4, 0, 0.1, 1);\\n  will-change: transform;\\n}\\n\\n.btn-lusion-arrow:hover .la-arrow,\\n.btn-lusion-arrow:focus-visible .la-arrow {\\n  transform: translate3d(0, 0, 0);\\n}\\n\\n.btn-lusion-arrow:hover .la-dots,\\n.btn-lusion-arrow:focus-visible .la-dots {\\n  transform: scale(0);\\n  opacity: 0;\\n}\\n\\n.btn-lusion-arrow:hover .la-label,\\n.btn-lusion-arrow:focus-visible .la-label {\\n  transform: translate3d(1.5em, 0, 0);\\n}\\n\\n.btn-lusion-arrow:active {\\n  transform: scale(0.96);\\n}\\n\\n.btn-lusion-arrow:focus-visible {\\n  outline: none;\\n  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.4);\\n}\\n\\n@media (prefers-reduced-motion: reduce) {\\n  .la-arrow,\\n  .la-dots,\\n  .la-label {\\n    transition: none;\\n  }\\n  .btn-lusion-arrow:active {\\n    transform: none;\\n  }\\n}\\n\";\n\nexport default function LusionArrowButton() {\n  useEffect(() => {\n    if (document.getElementById(\"lusion-arrow-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"lusion-arrow-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n  return (\n    <button type=\"button\" data-lusion-arrow=\"\" aria-label=\"LET'S TALK\" className=\"btn-lusion-arrow\">\n      <span className=\"la-window\">\n        <span className=\"la-arrow\" aria-hidden=\"true\">\n          <svg viewBox=\"0 0 24 24\" fill=\"none\">\n            <path d=\"M4 12h15M13 6l6 6-6 6\" stroke=\"currentColor\" strokeWidth=\"2\" strokeLinecap=\"round\" strokeLinejoin=\"round\" />\n          </svg>\n        </span>\n        <span className=\"la-dots\" aria-hidden=\"true\">\n          <span /><span /><span />\n        </span>\n      </span>\n      <span className=\"la-label\">LET'S TALK</span>\n    </button>\n  );\n}\n";

export const LUSION_ARROW_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const LUSION_ARROW_META = {
  id: "aw-lusion-arrow",
  name: "Dots to arrow",
  blurb: "lusion.co's “let's talk” pill rebuilt (SOTD May 2019): on hover the label slides +1.5em, a three-dot cluster collapses to zero, and an arrow flies in from −2.5em — exact transform math from the site's stylesheet.",
  states: "default, hover (label slide + dots collapse + arrow fly-in), focus-visible, active press, reduced motion",
  keywords: ["dots to arrow","lusion","arrow swap","glide arrow","pill button","rounded pill","dot cluster","three dots","arrow fly in","label slide","translate pill","lets talk","let's talk","awwwards","site of the day","developer award","animated button","interactive button","css button","hover effect"],
};
