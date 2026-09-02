/* Rolling slab snippets — awwwards showcase harvest (trays 137-146).
   Source: breakthroughenergy.org's KeyAreas CTA.
   Specimen assembly for the Simply Buttons gallery. */

const CSS = "/* Resn roll slab — breakthroughenergy.org's KeyAreas CTA (awwwards SOTD +\n   Developer Award Jan 2026, built by Resn). A giant 6px-radius lime slab\n   whose label lines are stacked, clipped to 1.2em, and roll\n   upward on an auto-cycle; the site drives the roll with GSAP, this rebuild\n   expresses it as a CSS keyframe column with a dwell on each line. Hover\n   pauses. Specimen for the Simply Buttons gallery. */\n\n.resn-roll-slab-root {\n  --aw-slab-roll: 1;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 1rem;\n  padding: 10px;\n  border-radius: 8px;\n}\n\n.btn-resn-roll-slab {\n  position: relative;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1em;\n  box-sizing: border-box;\n  min-width: 270px;\n  padding: 0.7em 1.2em;\n  border: 0;\n  border-radius: 6px;\n  background: #dfff5c;\n  color: #12130f;\n  font-family: \"Saans\", \"Inter\", \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 0.85rem;\n  font-weight: 500;\n  line-height: 1.2;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.btn-resn-roll-slab,\n.btn-resn-roll-slab * {\n  box-sizing: border-box;\n}\n\n.rs-window {\n  display: block;\n  overflow: hidden;\n  height: 1.2em;\n}\n\n.rs-column {\n  display: block;\n  animation: aw-slab-cycle 6400ms cubic-bezier(0.65, 0, 0.35, 1) infinite;\n  will-change: transform;\n}\n\n.rs-line {\n  display: block;\n  height: 1.2em;\n  white-space: nowrap;\n}\n\n/* Three campaign lines + a first-line duplicate, so the column rolls\n   upward one line per dwell and wraps without a jump. */\n@keyframes aw-slab-cycle {\n  0%, 26% { transform: translateY(0); }\n  33%, 59% { transform: translateY(-1.2em); }\n  66%, 92% { transform: translateY(-2.4em); }\n  100% { transform: translateY(-3.6em); }\n}\n\n.btn-resn-roll-slab:hover .rs-column,\n.btn-resn-roll-slab:focus-visible .rs-column {\n  animation-play-state: paused;\n}\n\n.rs-cta {\n  flex: none;\n  font-weight: 700;\n  font-size: 0.75em;\n  letter-spacing: 0.14em;\n  text-transform: uppercase;\n  opacity: 0.55;\n  transition: opacity 200ms ease;\n}\n\n.btn-resn-roll-slab:hover .rs-cta,\n.btn-resn-roll-slab:focus-visible .rs-cta {\n  opacity: 1;\n}\n\n.btn-resn-roll-slab:active {\n  transform: scale(0.985);\n}\n\n.btn-resn-roll-slab:focus-visible {\n  outline: none;\n  box-shadow: 0 0 0 3px rgba(18, 19, 15, 0.35);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .rs-column {\n    animation: none;\n  }\n  .btn-resn-roll-slab:active {\n    transform: none;\n  }\n}\n";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Rolling slab button</title>
  <style>
${CSS}  </style>
</head>
<body>
<div class="resn-roll-slab-root">
  <button type="button" class="btn-resn-roll-slab" data-resn-roll-slab="">
    <span class="rs-window">
      <span class="rs-column">
        <span class="rs-line">29 manufacturing companies</span>
        <span class="rs-line">26 electricity companies</span>
        <span class="rs-line">24 transportation companies</span>
        <span class="rs-line" aria-hidden="true">29 manufacturing companies</span>
      </span>
    </span>
    <span class="rs-cta" aria-hidden="true">View</span>
  </button>
</div>
</body>
</html>`;

const REACT = "\"use client\";\n\n// Resn roll slab — breakthroughenergy.org's KeyAreas CTA rebuilt: stacked\n// clipped label lines roll upward on an auto-cycle; hover pauses.\n\nimport { useEffect } from \"react\";\n\nconst CSS = \"/* Resn roll slab — breakthroughenergy.org's KeyAreas CTA (awwwards SOTD +\\n   Developer Award Jan 2026, built by Resn). A giant 6px-radius lime slab\\n   whose label lines are stacked, clipped to 1.2em, and roll\\n   upward on an auto-cycle; the site drives the roll with GSAP, this rebuild\\n   expresses it as a CSS keyframe column with a dwell on each line. Hover\\n   pauses. Specimen for the Simply Buttons gallery. */\\n\\n.resn-roll-slab-root {\\n  --aw-slab-roll: 1;\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  height: 100%;\\n  font-size: 1rem;\\n  padding: 10px;\\n  border-radius: 8px;\\n}\\n\\n.btn-resn-roll-slab {\\n  position: relative;\\n  display: inline-flex;\\n  align-items: center;\\n  justify-content: center;\\n  gap: 1em;\\n  box-sizing: border-box;\\n  min-width: 270px;\\n  padding: 0.7em 1.2em;\\n  border: 0;\\n  border-radius: 6px;\\n  background: #dfff5c;\\n  color: #12130f;\\n  font-family: \\\"Saans\\\", \\\"Inter\\\", \\\"Helvetica Neue\\\", Arial, sans-serif;\\n  font-size: 0.85rem;\\n  font-weight: 500;\\n  line-height: 1.2;\\n  cursor: pointer;\\n  -webkit-tap-highlight-color: transparent;\\n}\\n\\n.btn-resn-roll-slab,\\n.btn-resn-roll-slab * {\\n  box-sizing: border-box;\\n}\\n\\n.rs-window {\\n  display: block;\\n  overflow: hidden;\\n  height: 1.2em;\\n}\\n\\n.rs-column {\\n  display: block;\\n  animation: aw-slab-cycle 6400ms cubic-bezier(0.65, 0, 0.35, 1) infinite;\\n  will-change: transform;\\n}\\n\\n.rs-line {\\n  display: block;\\n  height: 1.2em;\\n  white-space: nowrap;\\n}\\n\\n/* Three campaign lines + a first-line duplicate, so the column rolls\\n   upward one line per dwell and wraps without a jump. */\\n@keyframes aw-slab-cycle {\\n  0%, 26% { transform: translateY(0); }\\n  33%, 59% { transform: translateY(-1.2em); }\\n  66%, 92% { transform: translateY(-2.4em); }\\n  100% { transform: translateY(-3.6em); }\\n}\\n\\n.btn-resn-roll-slab:hover .rs-column,\\n.btn-resn-roll-slab:focus-visible .rs-column {\\n  animation-play-state: paused;\\n}\\n\\n.rs-cta {\\n  flex: none;\\n  font-weight: 700;\\n  font-size: 0.75em;\\n  letter-spacing: 0.14em;\\n  text-transform: uppercase;\\n  opacity: 0.55;\\n  transition: opacity 200ms ease;\\n}\\n\\n.btn-resn-roll-slab:hover .rs-cta,\\n.btn-resn-roll-slab:focus-visible .rs-cta {\\n  opacity: 1;\\n}\\n\\n.btn-resn-roll-slab:active {\\n  transform: scale(0.985);\\n}\\n\\n.btn-resn-roll-slab:focus-visible {\\n  outline: none;\\n  box-shadow: 0 0 0 3px rgba(18, 19, 15, 0.35);\\n}\\n\\n@media (prefers-reduced-motion: reduce) {\\n  .rs-column {\\n    animation: none;\\n  }\\n  .btn-resn-roll-slab:active {\\n    transform: none;\\n  }\\n}\\n\";\n\nconst LINES = [\n  \"29 manufacturing companies\",\n  \"26 electricity companies\",\n  \"24 transportation companies\",\n];\n\nexport default function ResnRollSlabButton() {\n  useEffect(() => {\n    if (document.getElementById(\"resn-roll-slab-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"resn-roll-slab-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n  return (\n    <button type=\"button\" data-resn-roll-slab=\"\" className=\"btn-resn-roll-slab\">\n      <span className=\"rs-window\">\n        <span className=\"rs-column\">\n          {LINES.map((line) => (\n            <span className=\"rs-line\" key={line}>{line}</span>\n          ))}\n          <span className=\"rs-line\" aria-hidden=\"true\">{LINES[0]}</span>\n        </span>\n      </span>\n      <span className=\"rs-cta\" aria-hidden=\"true\">View</span>\n    </button>\n  );\n}\n";

export const RESN_ROLL_SLAB_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const RESN_ROLL_SLAB_META = {
  id: "aw-resn-slab",
  name: "Rolling slab",
  blurb: "breakthroughenergy.org's KeyAreas CTA rebuilt (SOTD Jan 2026, by Resn): a lime slab whose label lines are stacked and clipped to 1.2em, rolling upward through the site's campaign lines on an auto-cycle; hover pauses the roll.",
  states: "default, auto-cycle (label column roll), hover pause, focus-visible, active press, reduced motion (static first line)",
  keywords: ["rolling slab","resn","breakthrough energy","roll slab","label roll","auto cycle","stacked labels","clipped lines","slab button","lime button","campaign cta","keyareas","giant button","big cta","awwwards","site of the day","animated button","interactive button","css button","hover effect"],
};
