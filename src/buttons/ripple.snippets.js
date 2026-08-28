const RIPPLE_CSS = `
.btn-ripple-btn {
  --ripple-fill: #111111;
  --ripple-ink: #f5f5f5;
  --ripple-wave: rgba(245, 245, 245, 0.45);
  --ripple-shadow: 0 4px 12px rgba(0, 0, 0, 0.28);
  --ripple-focus: #171717;
  appearance: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 13px 32px;
  border: none;
  border-radius: 8px;
  background: var(--ripple-fill);
  color: var(--ripple-ink);
  box-shadow: var(--ripple-shadow);
  font-family: system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  cursor: pointer;
}
.btn-ripple-btn *,
.btn-ripple-btn *::before,
.btn-ripple-btn *::after { box-sizing: border-box; }
.btn-ripple-wave {
  position: absolute;
  border-radius: 50%;
  background: var(--ripple-wave);
  transform: scale(0);
  animation: btn-ripple-rip 0.6s ease-out;
  pointer-events: none;
}
@keyframes btn-ripple-rip {
  to { transform: scale(4); opacity: 0; }
}
.btn-ripple-btn:focus-visible {
  outline: 2px solid var(--ripple-focus);
  outline-offset: 3px;
}
.btn-ripple-btn:disabled {
  cursor: not-allowed;
  opacity: 0.42;
  box-shadow: none;
}
@media (prefers-reduced-motion: reduce) {
  .btn-ripple-wave { animation: none; opacity: 0; }
}
`.trim();

const RIPPLE_MARKUP = `
<button class="btn-ripple-btn" type="button" aria-label="Ripple">Ripple</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ripple Button</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f4f4; }
    ${RIPPLE_CSS}
  </style>
</head>
<body>
  ${RIPPLE_MARKUP}
  <script>
    (function () {
      var RIPPLE_MS = 650;
      var btn = document.querySelector(".btn-ripple-btn");
      if (!btn) return;
      btn.addEventListener("click", function (e) {
        if (btn.disabled) return;
        var r = btn.getBoundingClientRect();
        var s = document.createElement("span");
        var sz = Math.max(r.width, r.height) * 1.1;
        s.className = "btn-ripple-wave";
        s.style.width = s.style.height = sz + "px";
        s.style.left = (e.clientX - r.left - sz / 2) + "px";
        s.style.top = (e.clientY - r.top - sz / 2) + "px";
        btn.appendChild(s);
        window.setTimeout(function () { s.remove(); }, RIPPLE_MS);
      });
    })();
  </script>
</body>
</html>
`;

export const RIPPLE_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef } from "react";

const RIPPLE_MS = 650;
const RIPPLE_CSS = ${JSON.stringify(RIPPLE_CSS)};

function spawnRipple(btn, clientX, clientY) {
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.1;
  const wave = document.createElement("span");
  wave.className = "btn-ripple-wave";
  wave.style.width = size + "px";
  wave.style.height = size + "px";
  wave.style.left = clientX - rect.left - size / 2 + "px";
  wave.style.top = clientY - rect.top - size / 2 + "px";
  btn.appendChild(wave);
  window.setTimeout(function () { wave.remove(); }, RIPPLE_MS);
}

export default function RippleButton({
  label = "Ripple",
  disabled = false,
}) {
  const btnRef = useRef(null);

  useEffect(() => {
    if (document.getElementById("btn-ripple-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-ripple-styles";
    tag.textContent = RIPPLE_CSS;
    document.head.appendChild(tag);
  }, []);

  function handleClick(event) {
    if (disabled) return;
    const btn = btnRef.current;
    if (!btn) return;
    spawnRipple(btn, event.clientX, event.clientY);
  }

  return (
    <button
      ref={btnRef}
      type="button"
      className="btn-ripple-btn"
      disabled={disabled}
      aria-label={label}
      onClick={handleClick}
    >
      {label}
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

export const RIPPLE_META = {
  id: "ripple",
  name: "Material ripple",
  blurb: "Ink expands from the press point, then fades.",
  states: "default, active ripple, focus, disabled",
  keywords: [
    "material ripple",
    "ink ripple",
    "touch ripple",
    "press point",
    "expand fade",
    "material design",
    "circular ink",
    "click ripple",
    "android ripple",
    "ink splash",
    "tap feedback",
    "wave expand",
    "material button",
    "press ink",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
