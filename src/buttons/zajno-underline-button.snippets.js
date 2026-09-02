/* Line wipe snippets — awwwards showcase harvest (trays 137-146).
   Source: zajno.com's work links.
   Specimen assembly for the Simply Buttons gallery. */

const CSS = "/* Zajno underline button — zajno.com's `.li_` work links (awwwards SOTD\n   Jul 2023). A lowercase text button whose underline is split into two\n   pseudo-element halves: on hover the resting half slides out to +102%\n   while the accent half slides in from -102% (800ms, custom easing in the\n   source), reading as one line wiping across the word; ink flips red on\n   hover. Specimen for the Simply Buttons gallery. */\n\n.zajno-underline-root {\n  --aw-line-wipe: 1;\n  --zajno-ink: #101112;\n  --zajno-accent: #ff2a85;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 8px;\n}\n\n:root[data-theme=\"dark\"] .zajno-underline-root,\n[data-theme=\"dark\"] .zajno-underline-root {\n  --zajno-ink: #ffffff;\n  --zajno-accent: #ff2a85;\n}\n\n.btn-zajno-underline {\n  position: relative;\n  display: inline-block;\n  padding: 0.25em 0;\n  border: 0;\n  background: none;\n  color: var(--zajno-ink, #101112);\n  font-family: \"DIN Next\", \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 1.3rem;\n  font-weight: 500;\n  line-height: 1.2;\n  text-transform: lowercase;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  transition: color 240ms ease;\n}\n\n.btn-zajno-underline::before,\n.btn-zajno-underline::after {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 1.5px;\n  background: currentColor;\n  will-change: transform;\n}\n\n/* Resting half: sits in view, slides out to +102% on hover. */\n.btn-zajno-underline::after {\n  transform: translate3d(0, 0, 0);\n  transition: transform 800ms cubic-bezier(0.77, 0, 0.18, 1);\n}\n\n/* Accent half: parked at -102%, slides in on hover. */\n.btn-zajno-underline::before {\n  background: var(--zajno-accent, #ff2a85);\n  transform: translate3d(-102%, 0, 0);\n  transition: transform 800ms cubic-bezier(0.77, 0, 0.18, 1);\n}\n\n.btn-zajno-underline:hover,\n.btn-zajno-underline:focus-visible {\n  color: var(--zajno-accent, #ff2a85);\n}\n\n.btn-zajno-underline:hover::after,\n.btn-zajno-underline:focus-visible::after {\n  transform: translate3d(102%, 0, 0);\n}\n\n.btn-zajno-underline:hover::before,\n.btn-zajno-underline:focus-visible::before {\n  transform: translate3d(0, 0, 0);\n}\n\n.btn-zajno-underline:active {\n  transform: translateY(1px);\n}\n\n.btn-zajno-underline:focus-visible {\n  outline: 2px dashed var(--zajno-ink, #101112);\n  outline-offset: 5px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .btn-zajno-underline::before,\n  .btn-zajno-underline::after {\n    transition: none;\n  }\n}\n";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Line wipe button</title>
  <style>
${CSS}  </style>
</head>
<body>
<div class="zajno-underline-root">
  <button type="button" class="btn-zajno-underline" data-zajno-underline="" aria-label="work">work</button>
</div>
</body>
</html>`;

const REACT = "\"use client\";\n\n// Zajno underline button — zajno.com's work links rebuilt: the underline\n// is two halves; hover slides one out and the other in, a continuous wipe.\n\nimport { useEffect } from \"react\";\n\nconst CSS = \"/* Zajno underline button — zajno.com's `.li_` work links (awwwards SOTD\\n   Jul 2023). A lowercase text button whose underline is split into two\\n   pseudo-element halves: on hover the resting half slides out to +102%\\n   while the accent half slides in from -102% (800ms, custom easing in the\\n   source), reading as one line wiping across the word; ink flips red on\\n   hover. Specimen for the Simply Buttons gallery. */\\n\\n.zajno-underline-root {\\n  --aw-line-wipe: 1;\\n  --zajno-ink: #101112;\\n  --zajno-accent: #ff2a85;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  height: 100%;\\n  font-size: 1rem;\\n  padding: 10px;\\n  border-radius: 8px;\\n}\\n\\n:root[data-theme=\\\"dark\\\"] .zajno-underline-root,\\n[data-theme=\\\"dark\\\"] .zajno-underline-root {\\n  --zajno-ink: #ffffff;\\n  --zajno-accent: #ff2a85;\\n}\\n\\n.btn-zajno-underline {\\n  position: relative;\\n  display: inline-block;\\n  padding: 0.25em 0;\\n  border: 0;\\n  background: none;\\n  color: var(--zajno-ink, #101112);\\n  font-family: \\\"DIN Next\\\", \\\"Helvetica Neue\\\", Arial, sans-serif;\\n  font-size: 1.3rem;\\n  font-weight: 500;\\n  line-height: 1.2;\\n  text-transform: lowercase;\\n  cursor: pointer;\\n  -webkit-tap-highlight-color: transparent;\\n  transition: color 240ms ease;\\n}\\n\\n.btn-zajno-underline::before,\\n.btn-zajno-underline::after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  left: 0;\\n  bottom: 0;\\n  width: 100%;\\n  height: 1.5px;\\n  background: currentColor;\\n  will-change: transform;\\n}\\n\\n/* Resting half: sits in view, slides out to +102% on hover. */\\n.btn-zajno-underline::after {\\n  transform: translate3d(0, 0, 0);\\n  transition: transform 800ms cubic-bezier(0.77, 0, 0.18, 1);\\n}\\n\\n/* Accent half: parked at -102%, slides in on hover. */\\n.btn-zajno-underline::before {\\n  background: var(--zajno-accent, #ff2a85);\\n  transform: translate3d(-102%, 0, 0);\\n  transition: transform 800ms cubic-bezier(0.77, 0, 0.18, 1);\\n}\\n\\n.btn-zajno-underline:hover,\\n.btn-zajno-underline:focus-visible {\\n  color: var(--zajno-accent, #ff2a85);\\n}\\n\\n.btn-zajno-underline:hover::after,\\n.btn-zajno-underline:focus-visible::after {\\n  transform: translate3d(102%, 0, 0);\\n}\\n\\n.btn-zajno-underline:hover::before,\\n.btn-zajno-underline:focus-visible::before {\\n  transform: translate3d(0, 0, 0);\\n}\\n\\n.btn-zajno-underline:active {\\n  transform: translateY(1px);\\n}\\n\\n.btn-zajno-underline:focus-visible {\\n  outline: 2px dashed var(--zajno-ink, #101112);\\n  outline-offset: 5px;\\n}\\n\\n@media (prefers-reduced-motion: reduce) {\\n  .btn-zajno-underline::before,\\n  .btn-zajno-underline::after {\\n    transition: none;\\n  }\\n}\\n\";\n\nexport default function ZajnoUnderlineButton() {\n  useEffect(() => {\n    if (document.getElementById(\"zajno-underline-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"zajno-underline-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n  return (\n    <button type=\"button\" data-zajno-underline=\"\" aria-label=\"work\" className=\"btn-zajno-underline\">\n      work\n    </button>\n  );\n}\n";

export const ZAJNO_UNDERLINE_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const ZAJNO_UNDERLINE_META = {
  id: "aw-zajno-underline",
  name: "Line wipe",
  blurb: "zajno.com's work links rebuilt (SOTD Jul 2023): a lowercase text button whose underline is two halves — on hover the resting half slides out while a red half slides in from the far side, one continuous line wipe across the word.",
  states: "default, hover (two-half line wipe + red ink flip), focus-visible, active press, reduced motion",
  keywords: ["line wipe","zajno","underline wipe","underline button","two halves","pseudo elements","line slide","text button","lowercase","link button","red accent","work link","awwwards","site of the day","minimal button","typographic","animated button","interactive button","css button","hover effect"],
};
