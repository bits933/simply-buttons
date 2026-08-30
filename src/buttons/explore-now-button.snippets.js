/* Explore now button snippets — single self-contained button.
   Original specimen for the Simply Buttons gallery. */

const CSS = "/* Explore now button \u2014 neo-brutalist yellow face (Unbounded 800) with a thick\n   black border and a chunky dark offset block; on click the face glides\n   down-right to align with the black area (shadow collapses), click again to\n   pop back. Border + offset block are painted as box-shadows on a single layer\n   so the yellow background can never bleed past the black frame.\n   Original specimen for the Simply Buttons gallery (not a replica). */\n@import url(\"https://fonts.googleapis.com/css2?family=Unbounded:wght@800&display=swap\");\n\n.explore-now-root {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 1.125rem;\n}\n\n.btn-explore-now {\n  position: relative;\n  border: 0;\n  background: none;\n  padding: 0;\n  font-family: \"Unbounded\", \"IBM Plex Sans\", sans-serif;\n  line-height: 1;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.btn-explore-now__face {\n  position: relative;\n  display: block;\n  border: 0;\n  background: #ffd23f;\n  background-clip: padding-box;\n  box-shadow:\n    inset 0 0 0 3px #131313,\n    8px 10px 0 #131313;\n  padding: 0.95em 1.5em;\n  font-size: 1em;\n  font-weight: 800;\n  letter-spacing: 0.01em;\n  color: #131313;\n  transition: translate 0.18s cubic-bezier(0.3, 0.7, 0.4, 1), box-shadow 0.18s cubic-bezier(0.3, 0.7, 0.4, 1);\n}\n\n.btn-explore-now:hover .btn-explore-now__face {\n  translate: 3px 4px;\n  box-shadow:\n    inset 0 0 0 3px #131313,\n    5px 6px 0 #131313;\n}\n\n.btn-explore-now:active .btn-explore-now__face {\n  transition-duration: 0.08s;\n}\n\n.btn-explore-now.is--pressed .btn-explore-now__face {\n  translate: 8px 10px;\n  box-shadow:\n    inset 0 0 0 3px #131313,\n    0 0 0 #131313;\n}\n\n.btn-explore-now:focus-visible {\n  outline: none;\n}\n\n.btn-explore-now:focus-visible .btn-explore-now__face {\n  outline: 2px dashed #ffd23f;\n  outline-offset: 5px;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .btn-explore-now__face {\n    transition: none;\n  }\n}\n";

const PAGE_JS = "(function () {\n  document.querySelectorAll(\"[data-explore-now]\").forEach(function (btn) {\n    var timer = null;\n    btn.addEventListener(\"click\", function () {\n      if (timer) clearTimeout(timer);\n      btn.classList.add(\"is--pressed\");\n      timer = setTimeout(function () { btn.classList.remove(\"is--pressed\"); }, 220);\n    });\n  });\n})();";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Explore now button</title>
  <style>
    body { margin: 0; background: #17181c; }
    ${CSS}
  </style>
</head>
<body>
  <div class="explore-now-root">
    <button type="button" data-explore-now="" class="btn-explore-now">
      <span class="btn-explore-now__face">EXPLORE NOW!</span>
    </button>
  </div>
  <script>
    ${PAGE_JS}
  </script>
</html>
`;

export const EXPLORE_NOW_SNIPPETS = {
  html: HTML_PAGE,
  react: "\"use client\";\n\n// Explore now button \u2014 yellow neo-brutalist face that slides into its black offset block.\n\nimport { useEffect, useRef, useState } from \"react\";\n\nconst CSS = \"/* Explore now button \\u2014 neo-brutalist yellow face (Unbounded 800) with a thick\\n   black border and a chunky dark offset block; on click the face glides\\n   down-right to align with the black area (shadow collapses), click again to\\n   pop back. Border + offset block are painted as box-shadows on a single layer\\n   so the yellow background can never bleed past the black frame.\\n   Original specimen for the Simply Buttons gallery (not a replica). */\\n@import url(\\\"https://fonts.googleapis.com/css2?family=Unbounded:wght@800&display=swap\\\");\\n\\n.explore-now-root {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  height: 100%;\\n  font-size: 1.125rem;\\n}\\n\\n.btn-explore-now {\\n  position: relative;\\n  border: 0;\\n  background: none;\\n  padding: 0;\\n  font-family: \\\"Unbounded\\\", \\\"IBM Plex Sans\\\", sans-serif;\\n  line-height: 1;\\n  cursor: pointer;\\n  -webkit-tap-highlight-color: transparent;\\n}\\n\\n.btn-explore-now__face {\\n  position: relative;\\n  display: block;\\n  border: 0;\\n  background: #ffd23f;\\n  background-clip: padding-box;\\n  box-shadow:\\n    inset 0 0 0 3px #131313,\\n    8px 10px 0 #131313;\\n  padding: 0.95em 1.5em;\\n  font-size: 1em;\\n  font-weight: 800;\\n  letter-spacing: 0.01em;\\n  color: #131313;\\n  transition: translate 0.18s cubic-bezier(0.3, 0.7, 0.4, 1), box-shadow 0.18s cubic-bezier(0.3, 0.7, 0.4, 1);\\n}\\n\\n.btn-explore-now:hover .btn-explore-now__face {\\n  translate: 3px 4px;\\n  box-shadow:\\n    inset 0 0 0 3px #131313,\\n    5px 6px 0 #131313;\\n}\\n\\n.btn-explore-now:active .btn-explore-now__face {\\n  transition-duration: 0.08s;\\n}\\n\\n.btn-explore-now.is--pressed .btn-explore-now__face {\\n  translate: 8px 10px;\\n  box-shadow:\\n    inset 0 0 0 3px #131313,\\n    0 0 0 #131313;\\n}\\n\\n.btn-explore-now:focus-visible {\\n  outline: none;\\n}\\n\\n.btn-explore-now:focus-visible .btn-explore-now__face {\\n  outline: 2px dashed #ffd23f;\\n  outline-offset: 5px;\\n}\\n\\n@media (prefers-reduced-motion: reduce) {\\n  .btn-explore-now__face {\\n    transition: none;\\n  }\\n}\\n\";\n\nexport default function ExploreNowButton() {\n  const [pressed, setPressed] = useState(false);\n  const timerRef = useRef(null);\n  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);\n  useEffect(() => {\n    if (document.getElementById(\"explore-now-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"explore-now-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n  return (\n    <button\n      type=\"button\"\n      data-explore-now=\"\"\n      className={[\"btn-explore-now\", pressed ? \"is--pressed\" : \"\"].filter(Boolean).join(\" \")}\n      onClick={() => {\n        if (timerRef.current) clearTimeout(timerRef.current);\n        setPressed(true);\n        timerRef.current = setTimeout(() => setPressed(false), 220);\n      }}\n    >\n      <span className=\"btn-explore-now__face\">EXPLORE NOW!</span>\n    </button>\n  );\n}\n",
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const EXPLORE_NOW_META = {
  id: "explore-now",
  name: "Explore now button",
  blurb: "A neo-brutalist yellow face with a thick black border and an offset black block; on click the yellow face slides down-right to align with the black area, then springs back to the hover position instead of staying pressed.",
  states: "default, hover, pressed, focus-visible, active, reduced motion",
  keywords: ["explore now", "neo brutalist", "brutalist button", "yellow button", "black shadow", "offset shadow", "hard shadow", "push button", "press effect", "shadow collapse", "cta button", "bold button", "black border", "slide down", "press animation", "flat design", "bold cta", "animated button", "interactive button", "hover effect", "hover animation", "css button", "button microinteraction", "ui animation", "cta"],
};
