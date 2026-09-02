/* Mode underline snippets — awwwards showcase harvest (trays 137-146).
   Source: obys.agency's work-mode toggles.
   Specimen assembly for the Simply Buttons gallery. */

const CSS = "/* Obys underline button — obys.agency's work-mode toggles (awwwards SOTD\n   May 2026 + Developer Award). Ultra-minimal typographic text buttons with\n   a 1.34px underline that draws scaleX(0)→1 origin-left when the mode\n   activates and collapses origin-right on deactivation, 0.8s\n   cubic-bezier(0.16, 1, 0.3, 1); inactive labels drop to 40% ink.\n   Ink follows the gallery theme: black on light, white on dark.\n   Specimen for the Simply Buttons gallery. */\n\n.obys-stage {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 1rem;\n  padding: 10px;\n}\n\n.obys-underline-root {\n  --aw-mode-ink: 1;\n  --obys-ink: #0e0e0e;\n  display: inline-flex;\n  align-items: baseline;\n  gap: 1.4em;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n:root[data-theme=\"dark\"] .obys-underline-root,\n[data-theme=\"dark\"] .obys-underline-root {\n  --obys-ink: #ffffff;\n}\n\n.btn-obys-underline {\n  position: relative;\n  padding: 0.3em 0 0.45em;\n  border: 0;\n  background: none;\n  color: color-mix(in srgb, var(--obys-ink, #0e0e0e) 40%, transparent);\n  font-family: \"Neue Montreal\", \"Helvetica Neue\", Arial, sans-serif;\n  font-size: 1.05rem;\n  font-weight: 400;\n  line-height: 1;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n  transition: color 400ms cubic-bezier(0.16, 1, 0.3, 1);\n}\n\n.btn-obys-underline::after {\n  content: \"\";\n  position: absolute;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  height: 1.34px;\n  background: var(--obys-ink, #0e0e0e);\n  transform: scaleX(0);\n  transform-origin: right;\n  transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1);\n  will-change: transform;\n}\n\n.btn-obys-underline.is-on {\n  color: var(--obys-ink, #0e0e0e);\n}\n\n.btn-obys-underline.is-on::after {\n  transform: scaleX(1);\n  transform-origin: left;\n}\n\n.btn-obys-underline:hover {\n  color: color-mix(in srgb, var(--obys-ink, #0e0e0e) 75%, transparent);\n}\n\n.btn-obys-underline.is-on:hover {\n  color: var(--obys-ink, #0e0e0e);\n}\n\n.btn-obys-underline:focus-visible {\n  outline: 2px dashed var(--obys-ink, #0e0e0e);\n  outline-offset: 5px;\n}\n\n/* Small cycle control so the preview demonstrates both directions of the\n   draw without a keyboard. */\n.obys-cycle {\n  margin-left: 0.4em;\n  border: 0;\n  background: none;\n  color: color-mix(in srgb, var(--obys-ink, #0e0e0e) 50%, transparent);\n  font-size: 1rem;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.obys-cycle:hover {\n  color: var(--obys-ink, #0e0e0e);\n}\n\n.obys-cycle:focus-visible {\n  outline: 2px dashed var(--obys-ink, #0e0e0e);\n  outline-offset: 4px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .btn-obys-underline::after {\n    transition: none;\n  }\n  .btn-obys-underline {\n    transition: none;\n  }\n}\n";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mode underline button</title>
  <style>
${CSS}  </style>
</head>
<body>
<div class="obys-stage">
  <div class="obys-underline-root" data-obys-underline="">
    <button type="button" class="btn-obys-underline is-on" data-mode="vertical" aria-pressed="true">Vertical</button>
    <button type="button" class="btn-obys-underline" data-mode="horizontal" aria-pressed="false">Horizontal</button>
    <button type="button" class="btn-obys-underline" data-mode="grid" aria-pressed="false">Grid</button>
    <button type="button" class="obys-cycle" data-obys-cycle="" aria-label="Cycle modes"><span class="obys-cycle-mark" aria-hidden="true">&#8635;</span></button>
  </div>
</div>
<script>
(function () {
  document.querySelectorAll("[data-obys-underline]").forEach(function (group) {
    var modes = Array.prototype.slice.call(group.querySelectorAll(".btn-obys-underline"));
    function activate(i) {
      modes.forEach(function (btn, k) {
        var on = k === i;
        btn.classList.toggle("is-on", on);
        btn.setAttribute("aria-pressed", String(on));
      });
    }
    modes.forEach(function (btn, i) {
      btn.addEventListener("click", function () { activate(i); });
    });
    var cycle = group.querySelector("[data-obys-cycle]");
    if (cycle) {
      cycle.addEventListener("click", function () {
        var current = modes.findIndex(function (btn) { return btn.classList.contains("is-on"); });
        activate((current + 1) % modes.length);
      });
    }
  });
})();
</script>

</body>
</html>`;

const REACT = "\"use client\";\n\n// Obys underline button — obys.agency's work-mode toggles rebuilt: the\n// 1.34px underline draws origin-left on activate, collapses origin-right off.\n\nimport { useEffect, useState } from \"react\";\n\nconst CSS = \"/* Obys underline button — obys.agency's work-mode toggles (awwwards SOTD\\n   May 2026 + Developer Award). Ultra-minimal typographic text buttons with\\n   a 1.34px underline that draws scaleX(0)→1 origin-left when the mode\\n   activates and collapses origin-right on deactivation, 0.8s\\n   cubic-bezier(0.16, 1, 0.3, 1); inactive labels drop to 40% ink.\\n   Ink follows the gallery theme: black on light, white on dark.\\n   Specimen for the Simply Buttons gallery. */\\n\\n.obys-stage {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  height: 100%;\\n  font-size: 1rem;\\n  padding: 10px;\\n}\\n\\n.obys-underline-root {\\n  --aw-mode-ink: 1;\\n  --obys-ink: #0e0e0e;\\n  display: inline-flex;\\n  align-items: baseline;\\n  gap: 1.4em;\\n  flex-wrap: wrap;\\n  justify-content: center;\\n}\\n\\n:root[data-theme=\\\"dark\\\"] .obys-underline-root,\\n[data-theme=\\\"dark\\\"] .obys-underline-root {\\n  --obys-ink: #ffffff;\\n}\\n\\n.btn-obys-underline {\\n  position: relative;\\n  padding: 0.3em 0 0.45em;\\n  border: 0;\\n  background: none;\\n  color: color-mix(in srgb, var(--obys-ink, #0e0e0e) 40%, transparent);\\n  font-family: \\\"Neue Montreal\\\", \\\"Helvetica Neue\\\", Arial, sans-serif;\\n  font-size: 1.05rem;\\n  font-weight: 400;\\n  line-height: 1;\\n  cursor: pointer;\\n  -webkit-tap-highlight-color: transparent;\\n  transition: color 400ms cubic-bezier(0.16, 1, 0.3, 1);\\n}\\n\\n.btn-obys-underline::after {\\n  content: \\\"\\\";\\n  position: absolute;\\n  left: 0;\\n  bottom: 0;\\n  width: 100%;\\n  height: 1.34px;\\n  background: var(--obys-ink, #0e0e0e);\\n  transform: scaleX(0);\\n  transform-origin: right;\\n  transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1);\\n  will-change: transform;\\n}\\n\\n.btn-obys-underline.is-on {\\n  color: var(--obys-ink, #0e0e0e);\\n}\\n\\n.btn-obys-underline.is-on::after {\\n  transform: scaleX(1);\\n  transform-origin: left;\\n}\\n\\n.btn-obys-underline:hover {\\n  color: color-mix(in srgb, var(--obys-ink, #0e0e0e) 75%, transparent);\\n}\\n\\n.btn-obys-underline.is-on:hover {\\n  color: var(--obys-ink, #0e0e0e);\\n}\\n\\n.btn-obys-underline:focus-visible {\\n  outline: 2px dashed var(--obys-ink, #0e0e0e);\\n  outline-offset: 5px;\\n}\\n\\n/* Small cycle control so the preview demonstrates both directions of the\\n   draw without a keyboard. */\\n.obys-cycle {\\n  margin-left: 0.4em;\\n  border: 0;\\n  background: none;\\n  color: color-mix(in srgb, var(--obys-ink, #0e0e0e) 50%, transparent);\\n  font-size: 1rem;\\n  cursor: pointer;\\n  -webkit-tap-highlight-color: transparent;\\n}\\n\\n.obys-cycle:hover {\\n  color: var(--obys-ink, #0e0e0e);\\n}\\n\\n.obys-cycle:focus-visible {\\n  outline: 2px dashed var(--obys-ink, #0e0e0e);\\n  outline-offset: 4px;\\n}\\n\\n@media (prefers-reduced-motion: reduce) {\\n  .btn-obys-underline::after {\\n    transition: none;\\n  }\\n  .btn-obys-underline {\\n    transition: none;\\n  }\\n}\\n\";\n\nconst MODES = [\"Vertical\", \"Horizontal\", \"Grid\"];\n\nexport default function ObysUnderlineButton() {\n  const [mode, setMode] = useState(0);\n\n  useEffect(() => {\n    if (document.getElementById(\"obys-underline-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"obys-underline-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n\n  return (\n    <div className=\"obys-underline-root\" role=\"group\" aria-label=\"Mode\" data-obys-underline=\"\">\n      {MODES.map((m, i) => (\n        <button\n          key={m}\n          type=\"button\"\n          className={i === mode ? \"btn-obys-underline is-on\" : \"btn-obys-underline\"}\n          aria-pressed={i === mode}\n          onClick={() => setMode(i)}\n        >\n          {m}\n        </button>\n      ))}\n      <button\n        type=\"button\"\n        className=\"obys-cycle\"\n        aria-label=\"Cycle modes\"\n        onClick={() => setMode((m) => (m + 1) % MODES.length)}\n      >\n        <span className=\"obys-cycle-mark\" aria-hidden=\"true\">{\"\\u21BB\"}</span>\n      </button>\n    </div>\n  );\n}\n";

export const OBYS_UNDERLINE_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const OBYS_UNDERLINE_META = {
  id: "aw-obys-underline",
  name: "Mode underline",
  blurb: "obys.agency's work-mode toggles rebuilt (SOTD May 2026): typographic text buttons whose 1.34px underline draws in from the left when a mode activates and collapses to the right when it leaves, 0.8s with the studio's exact easing.",
  states: "default, hover, active mode (underline draw origin-left), inactive (collapse origin-right), focus-visible, reduced motion",
  keywords: ["mode underline","obys","obys agency","underline draw","origin swap","scalex underline","text toggle","mode toggle","segmented text","typographic toggle","vertical horizontal grid","work mode","awwwards","site of the day","minimal","animated button","interactive button","css button","hover effect","toggle button"],
};
