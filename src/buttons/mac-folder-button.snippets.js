/* Mac folder button snippets — an Apple-style folder that opens with
   spring-restrained motion and floats its file cards out.
   Specimen assembly for the Simply Buttons gallery. */

const CSS = "/* Mac folder button \u2014 a modern Apple-style folder (soft blue gradients, rounded\n   corners, no outlines) that opens with spring-like restraint: the front tips\n   forward, a deep-blue interior appears, and three rounded file cards float out\n   in a gentle fan. Transitions \u2014 not keyframes \u2014 drive the motion, so a click\n   mid-flight retargets everything from wherever it currently is: the animation\n   is interruptible and reversible at any instant, and input is never locked.\n   Specimen assembly for the Simply Buttons gallery. */\n\n.mac-folder-root {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 1rem;\n}\n\n.btn-mac-folder {\n  position: relative;\n  border: 0;\n  background: none;\n  padding: 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5em;\n  font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"Segoe UI\", system-ui, sans-serif;\n  line-height: 1;\n  color: inherit;\n  cursor: pointer;\n  -webkit-tap-highlight-color: transparent;\n}\n\n.mf-stage {\n  position: relative;\n  width: 80px;\n  height: 104px;\n  perspective: 600px;\n  transition: translate 300ms cubic-bezier(0.4, 0, 0.2, 1), scale 100ms ease-out;\n}\n\n.btn-mac-folder:hover .mf-stage {\n  translate: 0 -2px;\n}\n\n.btn-mac-folder:active .mf-stage {\n  scale: 0.96;\n  transition: scale 100ms ease-out;\n}\n\n.mf-back,\n.mf-interior,\n.mf-front {\n  position: absolute;\n  left: 0;\n  bottom: 10px;\n  width: 80px;\n  height: 56px;\n}\n\n.mf-back {\n  z-index: 1;\n  filter: drop-shadow(0 6px 10px rgba(10, 63, 214, 0.28));\n  transition: filter 300ms ease;\n}\n\n.btn-mac-folder:hover .mf-back {\n  filter: drop-shadow(0 10px 16px rgba(10, 63, 214, 0.34));\n}\n\n.mf-back svg,\n.mf-interior svg,\n.mf-paper svg,\n.mf-front svg {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n\n.mf-interior {\n  z-index: 2;\n  opacity: 0;\n  transition: opacity 280ms ease;\n}\n\n[data-phase=\"open\"] .mf-interior {\n  opacity: 1;\n}\n\n.mf-paper {\n  position: absolute;\n  left: 26px;\n  top: 36px;\n  width: 28px;\n  height: 18px;\n  z-index: 3;\n  transform: translate(0, 14px) rotate(0deg) scale(0.92);\n  opacity: 0;\n  transition: transform var(--d, 560ms) cubic-bezier(0.34, 1.3, 0.64, 1), opacity 240ms ease;\n  filter: drop-shadow(0 1px 2px rgba(15, 23, 42, 0.18));\n}\n\n[data-phase=\"open\"] .mf-paper {\n  transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(var(--s, 1));\n  opacity: 1;\n}\n\n.mf-front {\n  z-index: 4;\n  transform-origin: 50% 100%;\n  transform: rotateX(0deg);\n  transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);\n}\n\n[data-phase=\"open\"] .mf-front {\n  transform: translateY(3px) rotateX(-10deg);\n}\n\n.mf-caption {\n  font-size: 12px;\n  font-weight: 500;\n  letter-spacing: 0.01em;\n  color: currentColor;\n  opacity: 0.75;\n  transition: color 150ms ease, opacity 150ms ease;\n}\n\n.btn-mac-folder:hover .mf-caption {\n  color: #0a84ff;\n  opacity: 1;\n}\n\n.btn-mac-folder:focus-visible {\n  outline: none;\n  border-radius: 14px;\n  box-shadow: 0 0 0 4px rgba(10, 132, 255, 0.35);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .mf-stage,\n  .mf-back,\n  .mf-front,\n  .mf-caption {\n    transition: none;\n  }\n  .mf-interior,\n  .mf-paper {\n    transition: opacity 200ms ease;\n  }\n}\n";

const PAGE_JS = "(function () {\n  document.querySelectorAll(\"[data-mac-folder]\").forEach(function (btn) {\n    btn.addEventListener(\"click\", function () {\n      var open = btn.getAttribute(\"data-phase\") === \"open\";\n      btn.setAttribute(\"data-phase\", open ? \"closed\" : \"open\");\n      btn.setAttribute(\"aria-expanded\", String(!open));\n    });\n  });\n})();";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Mac folder button</title>
  <style>
    body { margin: 0; background: #f5f5f7; min-height: 100vh; display: grid; place-items: center; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif; }
    /* Mac folder button — a modern Apple-style folder (soft blue gradients, rounded
   corners, no outlines) that opens with spring-like restraint: the front tips
   forward, a deep-blue interior appears, and three rounded file cards float out
   in a gentle fan. Transitions — not keyframes — drive the motion, so a click
   mid-flight retargets everything from wherever it currently is: the animation
   is interruptible and reversible at any instant, and input is never locked.
   Specimen assembly for the Simply Buttons gallery. */

.mac-folder-root {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 1rem;
}

.btn-mac-folder {
  position: relative;
  border: 0;
  background: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", system-ui, sans-serif;
  line-height: 1;
  color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mf-stage {
  position: relative;
  width: 80px;
  height: 104px;
  perspective: 600px;
  transition: translate 300ms cubic-bezier(0.4, 0, 0.2, 1), scale 100ms ease-out;
}

.btn-mac-folder:hover .mf-stage {
  translate: 0 -2px;
}

.btn-mac-folder:active .mf-stage {
  scale: 0.96;
  transition: scale 100ms ease-out;
}

.mf-back,
.mf-interior,
.mf-front {
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 80px;
  height: 56px;
}

.mf-back {
  z-index: 1;
  filter: drop-shadow(0 6px 10px rgba(10, 63, 214, 0.28));
  transition: filter 300ms ease;
}

.btn-mac-folder:hover .mf-back {
  filter: drop-shadow(0 10px 16px rgba(10, 63, 214, 0.34));
}

.mf-back svg,
.mf-interior svg,
.mf-paper svg,
.mf-front svg {
  display: block;
  width: 100%;
  height: 100%;
}

.mf-interior {
  z-index: 2;
  opacity: 0;
  transition: opacity 280ms ease;
}

[data-phase="open"] .mf-interior {
  opacity: 1;
}

.mf-paper {
  position: absolute;
  left: 26px;
  top: 36px;
  width: 28px;
  height: 18px;
  z-index: 3;
  transform: translate(0, 14px) rotate(0deg) scale(0.92);
  opacity: 0;
  transition: transform var(--d, 560ms) cubic-bezier(0.34, 1.3, 0.64, 1), opacity 240ms ease;
  filter: drop-shadow(0 1px 2px rgba(15, 23, 42, 0.18));
}

[data-phase="open"] .mf-paper {
  transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(var(--s, 1));
  opacity: 1;
}

.mf-front {
  z-index: 4;
  transform-origin: 50% 100%;
  transform: rotateX(0deg);
  transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-phase="open"] .mf-front {
  transform: translateY(3px) rotateX(-10deg);
}

.mf-caption {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: currentColor;
  opacity: 0.75;
  transition: color 150ms ease, opacity 150ms ease;
}

.btn-mac-folder:hover .mf-caption {
  color: #0a84ff;
  opacity: 1;
}

.btn-mac-folder:focus-visible {
  outline: none;
  border-radius: 14px;
  box-shadow: 0 0 0 4px rgba(10, 132, 255, 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .mf-stage,
  .mf-back,
  .mf-front,
  .mf-caption {
    transition: none;
  }
  .mf-interior,
  .mf-paper {
    transition: opacity 200ms ease;
  }
}

  </style>
</head>
<body>
  <div class="mac-folder-root">
    <button type="button" data-mac-folder="" data-phase="closed" aria-expanded="false" class="btn-mac-folder">
      <span class="mf-stage" aria-hidden="true">
        <span class="mf-back"><svg viewBox="0 0 80 56" fill="none"><defs><linearGradient id="mf-lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6ec6ff"/><stop offset="1" stop-color="#3ea0ff"/></linearGradient></defs><path d="M4 14 C4 9 7 6 12 6 L28 6 C30 6 32 7 33 9 L36 13 L68 13 C73 13 76 16 76 21 L76 46 C76 51 73 54 68 54 L12 54 C7 54 4 51 4 46 Z" fill="url(#mf-lid)"/></svg></span>
        <span class="mf-interior"><svg viewBox="0 0 80 56" fill="none"><defs><linearGradient id="mf-inner" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c3f8e"/><stop offset="1" stop-color="#0a67d6"/></linearGradient></defs><path d="M8 12 L72 12 L72 46 C72 51 69 54 64 54 L16 54 C11 54 8 51 8 46 Z" fill="url(#mf-inner)"/></svg></span>
        <span class="mf-paper" style="--i:0;--dx:-6px;--dy:6px;--rot:-5deg;--s:0.95;--d:460ms"><svg viewBox="0 0 14 9" fill="none"><rect x="1" y="1" width="12" height="7" rx="2.5" fill="#ffffff"/><path d="M4 3.5 H10 M4 5.5 H8" stroke="#c7cdd8" stroke-width="1.2" stroke-linecap="round"/></svg></span>
        <span class="mf-paper" style="--i:1;--dx:0px;--dy:8px;--rot:0deg;--s:1;--d:560ms"><svg viewBox="0 0 14 9" fill="none"><rect x="1" y="1" width="12" height="7" rx="2.5" fill="#ffffff"/><path d="M4 3.5 H10 M4 5.5 H8" stroke="#c7cdd8" stroke-width="1.2" stroke-linecap="round"/></svg></span>
        <span class="mf-paper" style="--i:2;--dx:6px;--dy:7px;--rot:4deg;--s:0.97;--d:480ms"><svg viewBox="0 0 14 9" fill="none"><rect x="1" y="1" width="12" height="7" rx="2.5" fill="#ffffff"/><path d="M4 3.5 H10 M4 5.5 H8" stroke="#c7cdd8" stroke-width="1.2" stroke-linecap="round"/></svg></span>
        <span class="mf-front"><svg viewBox="0 0 80 56" fill="none"><defs><linearGradient id="mf-face" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#54b8ff"/><stop offset="1" stop-color="#2890f0"/></linearGradient></defs><path d="M6 18 C6 13 9 10 14 10 L66 10 C71 10 74 13 74 18 L74 46 C74 51 71 54 66 54 L14 54 C9 54 6 51 6 46 Z" fill="url(#mf-face)"/><path d="M10 16 L70 16" stroke="#ffffff" stroke-opacity="0.45" stroke-width="2" stroke-linecap="round"/></svg></span>
      </span>
      <span class="mf-caption">Documents</span>
    </button>
  </div>
  <script>
    (function () {
  document.querySelectorAll("[data-mac-folder]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("data-phase") === "open";
      btn.setAttribute("data-phase", open ? "closed" : "open");
      btn.setAttribute("aria-expanded", String(!open));
    });
  });
})();
  </script>
</body>
</html>
`;

export const MAC_FOLDER_SNIPPETS = {
  html: HTML_PAGE,
  react: "\"use client\";\n\n// Mac folder button \u2014 an Apple-style folder that opens with spring-restrained\n// motion and floats its file cards out in a gentle fan. Fully interruptible.\n\nimport { useEffect, useState } from \"react\";\n\nconst CSS = \"/* Mac folder button \\u2014 a modern Apple-style folder (soft blue gradients, rounded\\n   corners, no outlines) that opens with spring-like restraint: the front tips\\n   forward, a deep-blue interior appears, and three rounded file cards float out\\n   in a gentle fan. Transitions \\u2014 not keyframes \\u2014 drive the motion, so a click\\n   mid-flight retargets everything from wherever it currently is: the animation\\n   is interruptible and reversible at any instant, and input is never locked.\\n   Specimen assembly for the Simply Buttons gallery. */\\n\\n.mac-folder-root {\\n  display: flex;\\n  justify-content: center;\\n  align-items: center;\\n  width: 100%;\\n  height: 100%;\\n  font-size: 1rem;\\n}\\n\\n.btn-mac-folder {\\n  position: relative;\\n  border: 0;\\n  background: none;\\n  padding: 0;\\n  display: flex;\\n  flex-direction: column;\\n  align-items: center;\\n  gap: 0.5em;\\n  font-family: -apple-system, BlinkMacSystemFont, \\\"SF Pro Text\\\", \\\"Segoe UI\\\", system-ui, sans-serif;\\n  line-height: 1;\\n  color: inherit;\\n  cursor: pointer;\\n  -webkit-tap-highlight-color: transparent;\\n}\\n\\n.mf-stage {\\n  position: relative;\\n  width: 80px;\\n  height: 104px;\\n  perspective: 600px;\\n  transition: translate 300ms cubic-bezier(0.4, 0, 0.2, 1), scale 100ms ease-out;\\n}\\n\\n.btn-mac-folder:hover .mf-stage {\\n  translate: 0 -2px;\\n}\\n\\n.btn-mac-folder:active .mf-stage {\\n  scale: 0.96;\\n  transition: scale 100ms ease-out;\\n}\\n\\n.mf-back,\\n.mf-interior,\\n.mf-front {\\n  position: absolute;\\n  left: 0;\\n  bottom: 10px;\\n  width: 80px;\\n  height: 56px;\\n}\\n\\n.mf-back {\\n  z-index: 1;\\n  filter: drop-shadow(0 6px 10px rgba(10, 63, 214, 0.28));\\n  transition: filter 300ms ease;\\n}\\n\\n.btn-mac-folder:hover .mf-back {\\n  filter: drop-shadow(0 10px 16px rgba(10, 63, 214, 0.34));\\n}\\n\\n.mf-back svg,\\n.mf-interior svg,\\n.mf-paper svg,\\n.mf-front svg {\\n  display: block;\\n  width: 100%;\\n  height: 100%;\\n}\\n\\n.mf-interior {\\n  z-index: 2;\\n  opacity: 0;\\n  transition: opacity 280ms ease;\\n}\\n\\n[data-phase=\\\"open\\\"] .mf-interior {\\n  opacity: 1;\\n}\\n\\n.mf-paper {\\n  position: absolute;\\n  left: 26px;\\n  top: 36px;\\n  width: 28px;\\n  height: 18px;\\n  z-index: 3;\\n  transform: translate(0, 14px) rotate(0deg) scale(0.92);\\n  opacity: 0;\\n  transition: transform var(--d, 560ms) cubic-bezier(0.34, 1.3, 0.64, 1), opacity 240ms ease;\\n  filter: drop-shadow(0 1px 2px rgba(15, 23, 42, 0.18));\\n}\\n\\n[data-phase=\\\"open\\\"] .mf-paper {\\n  transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(var(--s, 1));\\n  opacity: 1;\\n}\\n\\n.mf-front {\\n  z-index: 4;\\n  transform-origin: 50% 100%;\\n  transform: rotateX(0deg);\\n  transition: transform 420ms cubic-bezier(0.4, 0, 0.2, 1);\\n}\\n\\n[data-phase=\\\"open\\\"] .mf-front {\\n  transform: translateY(3px) rotateX(-10deg);\\n}\\n\\n.mf-caption {\\n  font-size: 12px;\\n  font-weight: 500;\\n  letter-spacing: 0.01em;\\n  color: currentColor;\\n  opacity: 0.75;\\n  transition: color 150ms ease, opacity 150ms ease;\\n}\\n\\n.btn-mac-folder:hover .mf-caption {\\n  color: #0a84ff;\\n  opacity: 1;\\n}\\n\\n.btn-mac-folder:focus-visible {\\n  outline: none;\\n  border-radius: 14px;\\n  box-shadow: 0 0 0 4px rgba(10, 132, 255, 0.35);\\n}\\n\\n@media (prefers-reduced-motion: reduce) {\\n  .mf-stage,\\n  .mf-back,\\n  .mf-front,\\n  .mf-caption {\\n    transition: none;\\n  }\\n  .mf-interior,\\n  .mf-paper {\\n    transition: opacity 200ms ease;\\n  }\\n}\\n\";\n\nconst PAPERS = [\n  { i: 0, dx: \"-6px\", dy: \"6px\", rot: \"-5deg\", s: \"0.95\", d: \"460ms\" },\n  { i: 1, dx: \"0px\", dy: \"8px\", rot: \"0deg\", s: \"1\", d: \"560ms\" },\n  { i: 2, dx: \"6px\", dy: \"7px\", rot: \"4deg\", s: \"0.97\", d: \"480ms\" },\n];\n\nexport default function MacFolderButton() {\n  const [phase, setPhase] = useState(\"closed\");\n  useEffect(() => {\n    if (document.getElementById(\"mac-folder-styles\")) return;\n    const tag = document.createElement(\"style\");\n    tag.id = \"mac-folder-styles\";\n    tag.textContent = CSS;\n    document.head.appendChild(tag);\n  }, []);\n  return (\n    <button\n      type=\"button\"\n      data-mac-folder=\"\"\n      data-phase={phase}\n      aria-expanded={phase === \"open\"}\n      className=\"btn-mac-folder\"\n      onClick={() => setPhase((p) => (p === \"open\" ? \"closed\" : \"open\"))}\n    >\n      <span className=\"mf-stage\" aria-hidden=\"true\">\n        <span className=\"mf-back\">\n          <svg viewBox=\"0 0 80 56\" fill=\"none\">\n            <defs>\n              <linearGradient id=\"mf-lid\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n                <stop offset=\"0\" stopColor=\"#6ec6ff\" /><stop offset=\"1\" stopColor=\"#3ea0ff\" />\n              </linearGradient>\n            </defs>\n            <path d=\"M4 14 C4 9 7 6 12 6 L28 6 C30 6 32 7 33 9 L36 13 L68 13 C73 13 76 16 76 21 L76 46 C76 51 73 54 68 54 L12 54 C7 54 4 51 4 46 Z\" fill=\"url(#mf-lid)\" />\n          </svg>\n        </span>\n        <span className=\"mf-interior\">\n          <svg viewBox=\"0 0 80 56\" fill=\"none\">\n            <defs>\n              <linearGradient id=\"mf-inner\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n                <stop offset=\"0\" stopColor=\"#0c3f8e\" /><stop offset=\"1\" stopColor=\"#0a67d6\" />\n              </linearGradient>\n            </defs>\n            <path d=\"M8 12 L72 12 L72 46 C72 51 69 54 64 54 L16 54 C11 54 8 51 8 46 Z\" fill=\"url(#mf-inner)\" />\n          </svg>\n        </span>\n        {PAPERS.map((p) => (\n          <span className=\"mf-paper\" key={p.i} style={{ \"--i\": p.i, \"--dx\": p.dx, \"--dy\": p.dy, \"--rot\": p.rot, \"--s\": p.s, \"--d\": p.d }}>\n            <svg viewBox=\"0 0 14 9\" fill=\"none\">\n              <rect x=\"1\" y=\"1\" width=\"12\" height=\"7\" rx=\"2.5\" fill=\"#ffffff\" />\n              <path d=\"M4 3.5 H10 M4 5.5 H8\" stroke=\"#c7cdd8\" strokeWidth=\"1.2\" strokeLinecap=\"round\" />\n            </svg>\n          </span>\n        ))}\n        <span className=\"mf-front\">\n          <svg viewBox=\"0 0 80 56\" fill=\"none\">\n            <defs>\n              <linearGradient id=\"mf-face\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n                <stop offset=\"0\" stopColor=\"#54b8ff\" /><stop offset=\"1\" stopColor=\"#2890f0\" />\n              </linearGradient>\n            </defs>\n            <path d=\"M6 18 C6 13 9 10 14 10 L66 10 C71 10 74 13 74 18 L74 46 C74 51 71 54 66 54 L14 54 C9 54 6 51 6 46 Z\" fill=\"url(#mf-face)\" />\n            <path d=\"M10 16 L70 16\" stroke=\"#ffffff\" strokeOpacity=\"0.45\" strokeWidth=\"2\" strokeLinecap=\"round\" />\n          </svg>\n        </span>\n      </span>\n      <span className=\"mf-caption\">Documents</span>\n    </button>\n  );\n}\n",
  node: `const express = require("express");
const app = express();
const PAGE = ${JSON.stringify(HTML_PAGE)};
app.get("/", function (req, res) { res.type("html").send(PAGE); });
app.listen(3000, function () { console.log("http://localhost:3000"); });
`,
};

export const MAC_FOLDER_META = {
  id: "mac-folder",
  name: "Mac folder button",
  blurb: "An Apple-style folder in soft blue gradients; click tips the front open with spring restraint and floats three rounded file cards out in a gentle fan \u2014 fully reversible mid-motion.",
  states: "closed, hover, opening/open with fanned files, focus-visible, reduced motion",
  keywords: ["mac folder", "apple folder", "macos folder", "ios folder", "blue folder", "documents folder", "file folder", "modern folder", "files fly out", "file cards", "rounded cards", "fan out", "folder open", "open folder", "spring animation", "cubic bezier", "interruptible", "reversible", "system font", "sf pro", "gradient folder", "3d tilt", "rotateX", "perspective", "toggle", "animated button", "interactive button", "css button", "svg button", "hover effect", "press animation"],
};
