const PIXEL_CSS = `
.btn-pixel-btn {
  --ink: #ffffff;
  --ink-3: #a3a3a3;
  --fill: #171717;
  --fill-hover: #262626;
  --fill-active: #0a0a0a;
  --edge: #262626;
  --focus: #171717;
  box-sizing: border-box;
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 212px;
  min-height: 40px;
  padding: 0 14px;
  border: 1px solid var(--edge);
  border-radius: 8px;
  background: var(--fill);
  color: var(--ink);
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1;
  cursor: pointer;
  transition: background-color 120ms ease, border-color 120ms ease, transform 90ms ease;
}
.btn-pixel-btn *,
.btn-pixel-btn *::before,
.btn-pixel-btn *::after { box-sizing: border-box; }
.btn-pixel-btn:hover:not(:disabled) { background: var(--fill-hover); border-color: color-mix(in srgb, var(--ink) 22%, var(--fill-hover)); }
.btn-pixel-btn:focus { outline: none; }
.btn-pixel-btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }
.btn-pixel-btn:active:not(:disabled) { transform: scale(0.98); background: var(--fill-active); }
.btn-pixel-btn:disabled:not([aria-busy="true"]) { cursor: not-allowed; opacity: 0.42; }
.btn-pixel-btn[aria-busy="true"] { cursor: progress; border-color: color-mix(in srgb, var(--ink) 28%, var(--fill)); }
.btn-pixel-face {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}
.btn-pixel-face[hidden] { display: none; }
.btn-pixel-grid {
  display: grid;
  grid-template-columns: repeat(3, 4px);
  grid-template-rows: repeat(3, 4px);
  gap: 1.5px;
  flex: 0 0 auto;
}
.btn-pixel-cell {
  width: 4px;
  height: 4px;
  background: var(--ink);
  border-radius: 0.5px;
}
.btn-pixel-label {
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}
.btn-pixel-shimmer {
  background-image: linear-gradient(90deg, var(--ink-3) 35%, var(--ink) 50%, var(--ink-3) 65%);
  background-size: 200% 100%;
  animation: shimmer-text 1.4s linear infinite;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
}
.btn-pixel-timer {
  min-width: 3.4em;
  color: var(--ink-3);
  font-family: ui-monospace, "Cascadia Mono", Consolas, monospace;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
@keyframes pixel-on {
  0%, 100% { opacity: 0.15; }
  32% { opacity: 1; }
  58% { opacity: 0.42; }
}
@keyframes shimmer-text {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .btn-pixel-btn { transition: none; }
  .btn-pixel-btn:active:not(:disabled) { transform: none; }
  .btn-pixel-cell, .btn-pixel-shimmer { animation: none !important; }
  .btn-pixel-shimmer {
    background-image: none;
    color: var(--ink);
    -webkit-text-fill-color: var(--ink);
  }
}
`.trim();

const PIXEL_SCRIPT = `
(function () {
  var chevron = Array.from({ length: 9 }, function (_, i) {
    var r = Math.floor(i / 3), c = i % 3;
    return (c + Math.abs(r - 1)) * 90;
  });
  var DRIVE = { delays: chevron, dur: 650 };

  function formatElapsed(tenths) {
    var total = tenths / 10;
    if (total < 60) return total.toFixed(1) + "s";
    return Math.floor(total / 60) + "m " + (total % 60).toFixed(1) + "s";
  }

  function paint(grid) {
    grid.textContent = "";
    DRIVE.delays.forEach(function (d) {
      var cell = document.createElement("span");
      cell.className = "btn-pixel-cell";
      cell.style.opacity = "0.15";
      cell.style.animation = "pixel-on " + DRIVE.dur + "ms ease-in-out " + d + "ms infinite";
      grid.appendChild(cell);
    });
  }

  document.querySelectorAll(".btn-pixel-btn").forEach(function (button) {
    var idle = button.querySelector("[data-idle]");
    var busy = button.querySelector("[data-busy]");
    var grid = button.querySelector(".btn-pixel-grid");
    var timer = button.querySelector(".btn-pixel-timer");
    var loading = false;
    var tenths = 0;
    var tickId = 0;
    var resetId = 0;

    function reset() {
      loading = false;
      tenths = 0;
      window.clearInterval(tickId);
      window.clearTimeout(resetId);
      button.disabled = false;
      button.removeAttribute("aria-busy");
      idle.hidden = false;
      busy.hidden = true;
      timer.textContent = "0.0s";
    }

    button.addEventListener("click", function () {
      if (loading) return;
      loading = true;
      tenths = 0;
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
      idle.hidden = true;
      busy.hidden = false;
      paint(grid);
      timer.textContent = "0.0s";
      tickId = window.setInterval(function () {
        tenths += 1;
        timer.textContent = formatElapsed(tenths);
      }, 100);
      resetId = window.setTimeout(reset, 8000);
    });
  });
})();
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pixel load</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #eef0f3; }
    ${PIXEL_CSS}
  </style>
</head>
<body>
  <button class="btn-pixel-btn" type="button">
    <span class="btn-pixel-face" data-idle>
      <span class="btn-pixel-label">Run job</span>
    </span>
    <span class="btn-pixel-face" data-busy hidden>
      <span class="btn-pixel-grid" aria-hidden="true"></span>
      <span class="btn-pixel-label btn-pixel-shimmer">Churning</span>
      <span class="btn-pixel-timer">0.0s</span>
    </span>
  </button>
  <script>
    ${PIXEL_SCRIPT}
  </script>
</body>
</html>
`;

export const PIXEL_LOAD_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useState } from "react";

const chevron = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3), c = i % 3;
  return (c + Math.abs(r - 1)) * 90;
});
const DRIVE = { delays: chevron, dur: 650 };

const PIXEL_CSS = ${JSON.stringify(PIXEL_CSS)};

function formatElapsed(tenths) {
  const total = tenths / 10;
  if (total < 60) return total.toFixed(1) + "s";
  return Math.floor(total / 60) + "m " + (total % 60).toFixed(1) + "s";
}

export default function PixelLoadButton({
  label = "Run job",
  loadingLabel = "Churning",
  disabled = false,
}) {
  const [loading, setLoading] = useState(false);
  const [tenths, setTenths] = useState(0);

  useEffect(() => {
    if (document.getElementById("btn-pixel-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-pixel-styles";
    tag.textContent = PIXEL_CSS;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    if (!loading) return;
    setTenths(0);
    const tick = window.setInterval(() => setTenths((n) => n + 1), 100);
    const stop = window.setTimeout(() => setLoading(false), 8000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(stop);
    };
  }, [loading]);

  return (
    <button
      type="button"
      className="btn-pixel-btn"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={() => {
        if (!loading && !disabled) setLoading(true);
      }}
    >
      <span className="btn-pixel-face">
        {loading ? (
          <>
            <span className="btn-pixel-grid" aria-hidden="true">
              {DRIVE.delays.map((d, i) => (
                <span
                  key={i}
                  className="btn-pixel-cell"
                  style={{
                    opacity: 0.15,
                    animation: "pixel-on " + DRIVE.dur + "ms ease-in-out " + d + "ms infinite",
                  }}
                />
              ))}
            </span>
            <span className="btn-pixel-label btn-pixel-shimmer">{loadingLabel}</span>
            <span className="btn-pixel-timer">{formatElapsed(tenths)}</span>
          </>
        ) : (
          <span className="btn-pixel-label">{label}</span>
        )}
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

export const PIXEL_LOAD_META = {
  id: "pixel-load",
  name: "Pixel load",
  blurb: "In-button pixel-grid wait for long work.",
  states: "default, hover, focus, active, loading, disabled",
  keywords: [
    "pixel load",
    "loader",
    "pixel",
    "spinner",
    "loading",
    "pixel grid",
    "wait",
    "busy",
    "progress",
    "8bit",
    "retro",
    "hover",
    "in button loader",
    "grid wait",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
