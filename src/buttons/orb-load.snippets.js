const ORB_CSS = `
.btn-orb-root,
.btn-orb-btn {
  --orb-face: #171717;
  --orb-face-hover: #262626;
  --orb-ink: #f5f5f5;
  --orb-loader-ink: #f5f5f5;
  --orb-focus: #171717;
  --orb-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --orb-core-edge: 0 1px 0 rgba(255, 255, 255, 0.08);
  --orb-hi: rgba(255, 255, 255, 0.78);
  --orb-sheen-mid: rgba(255, 255, 255, 0.05);
  --orb-sheen-end: rgba(255, 255, 255, 0.22);
  --orb-fill: radial-gradient(88% 78% at 28% 30%, rgba(255, 255, 255, 0.42), transparent 62%);
  --orb-sphere: radial-gradient(circle at 38% 32%, #2a2a2a 0%, #141414 40%, #070707 72%, #000 100%);
  --orb-sphere-shadow:
    0 0 36px rgba(255, 255, 255, 0.14),
    0 0 72px rgba(255, 255, 255, 0.06),
    0 12px 28px rgba(0, 0, 0, 0.32),
    inset 0 -16px 24px rgba(0, 0, 0, 0.6),
    inset 0 10px 18px rgba(255, 255, 255, 0.05);
}
:root[data-theme="dark"] .btn-orb-root,
:root[data-theme="dark"] .btn-orb-btn {
  --orb-face: #f5f5f5;
  --orb-face-hover: #e8e8e8;
  --orb-ink: #171717;
  --orb-focus: #f5f5f5;
  --orb-core-edge: 0 1px 0 rgba(0, 0, 0, 0.08);
  --orb-hi: rgba(255, 224, 244, 0.98);
  --orb-sheen-mid: rgba(244, 168, 220, 0.62);
  --orb-sheen-end: rgba(192, 92, 214, 0.48);
  --orb-fill: radial-gradient(
    70% 62% at 22% 28%,
    rgba(255, 210, 236, 0.36),
    rgba(168, 85, 247, 0.1) 40%,
    transparent 58%
  );
  --orb-sphere: radial-gradient(
    circle at 50% 50%,
    #0a0612 0%,
    #080410 42%,
    #05030a 72%,
    #020104 100%
  );
  --orb-sphere-shadow:
    0 0 28px rgba(196, 78, 192, 0.38),
    0 0 56px rgba(124, 58, 237, 0.24),
    0 10px 24px rgba(0, 0, 0, 0.4),
    inset 0 -14px 22px rgba(8, 0, 16, 0.7),
    inset 0 10px 16px rgba(232, 160, 216, 0.08);
}
.btn-orb-root {
  display: grid;
  place-items: center;
  min-height: 132px;
}
.btn-orb-btn {
  appearance: none;
  position: relative;
  isolation: isolate;
  overflow: visible;
  display: inline-grid;
  place-items: center;
  width: 52px;
  height: 52px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--orb-ink);
  cursor: pointer;
  transition:
    width 560ms var(--orb-ease),
    height 560ms var(--orb-ease);
}
.btn-orb-btn *,
.btn-orb-btn *::before,
.btn-orb-btn *::after { box-sizing: border-box; }
.btn-orb-btn.is-loading { width: 80px; height: 80px; }
.btn-orb-core {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--orb-face);
  box-shadow: var(--orb-core-edge);
  transition:
    background 420ms var(--orb-ease),
    box-shadow 420ms var(--orb-ease);
}
.btn-orb-btn:hover:not(:disabled) .btn-orb-core { background: var(--orb-face-hover); }
.btn-orb-btn.is-loading .btn-orb-core,
.btn-orb-btn.is-loading:hover:not(:disabled) .btn-orb-core {
  background: var(--orb-sphere);
  box-shadow: var(--orb-sphere-shadow);
}
.btn-orb-light {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
  transition: opacity 280ms ease;
}
.btn-orb-btn.is-loading .btn-orb-light {
  opacity: 1;
  animation: btn-orb-spin 6s linear infinite;
}
.btn-orb-fill {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: var(--orb-fill);
  filter: blur(2px);
}
.btn-orb-sheen {
  position: absolute;
  inset: -10%;
  border-radius: 50%;
  background: conic-gradient(
    from 200deg,
    transparent 0deg 170deg,
    var(--orb-sheen-mid) 200deg,
    var(--orb-hi) 236deg,
    var(--orb-sheen-end) 278deg,
    transparent 318deg 360deg
  );
  -webkit-mask: radial-gradient(farthest-side, transparent 38%, #000 54%, #000 76%, transparent 90%);
  mask: radial-gradient(farthest-side, transparent 38%, #000 54%, #000 76%, transparent 90%);
  filter: blur(7px);
}
.btn-orb-arrow,
.btn-orb-loader {
  position: relative;
  z-index: 2;
  display: grid;
  place-items: center;
  pointer-events: none;
}
.btn-orb-arrow {
  width: 18px;
  height: 18px;
  color: var(--orb-ink);
  transition:
    opacity 200ms ease,
    transform 200ms var(--orb-ease);
}
.btn-orb-arrow svg { display: block; width: 18px; height: 18px; }
.btn-orb-loader {
  position: absolute;
  width: 24px;
  height: 24px;
  color: var(--orb-loader-ink);
  opacity: 0;
  transform: scale(0.86);
  transition:
    opacity 280ms ease 90ms,
    transform 280ms var(--orb-ease) 90ms;
}
.btn-orb-loader svg { display: block; width: 24px; height: 24px; }
.btn-orb-btn.is-loading .btn-orb-arrow { opacity: 0; transform: scale(0.78); }
.btn-orb-btn.is-loading .btn-orb-loader { opacity: 1; transform: scale(1); }
.btn-orb-px { opacity: 0; }
.btn-orb-btn.is-loading .btn-orb-px--1 { animation: btn-orb-pixel 0.8s ease-in-out 0s infinite; }
.btn-orb-btn.is-loading .btn-orb-px--2 { animation: btn-orb-pixel 0.8s ease-in-out 0.1s infinite; }
.btn-orb-btn.is-loading .btn-orb-px--3 { animation: btn-orb-pixel 0.8s ease-in-out 0.2s infinite; }
.btn-orb-btn.is-loading .btn-orb-px--4 { animation: btn-orb-pixel 0.8s ease-in-out 0.3s infinite; }
.btn-orb-btn.is-loading .btn-orb-px--5 { animation: btn-orb-pixel 0.8s ease-in-out 0.4s infinite; }
.btn-orb-btn.is-loading .btn-orb-px--6 { animation: btn-orb-pixel 0.8s ease-in-out 0.5s infinite; }
.btn-orb-btn.is-loading .btn-orb-px--7 { animation: btn-orb-pixel 0.8s ease-in-out 0.6s infinite; }
.btn-orb-btn.is-loading .btn-orb-px--8 { animation: btn-orb-pixel 0.8s ease-in-out 0.7s infinite; }
.btn-orb-btn:focus { outline: none; }
.btn-orb-btn:focus-visible { outline: 2px solid var(--orb-focus); outline-offset: 4px; }
.btn-orb-btn:active:not(:disabled):not(.is-loading) .btn-orb-core { transform: scale(0.96); }
.btn-orb-btn:disabled:not([aria-busy="true"]) { cursor: not-allowed; opacity: 0.42; }
.btn-orb-btn[aria-busy="true"] { cursor: progress; }
@keyframes btn-orb-spin { to { transform: rotate(360deg); } }
@keyframes btn-orb-pixel {
  0% { opacity: 0; }
  1% { opacity: 1; }
  100% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .btn-orb-btn,
  .btn-orb-core,
  .btn-orb-light,
  .btn-orb-arrow,
  .btn-orb-loader { transition: none; animation: none; }
  .btn-orb-btn.is-loading .btn-orb-light { animation: none; }
  .btn-orb-btn.is-loading .btn-orb-px { animation: none; opacity: 0.85; }
}
`;

const ORB_MARKUP = `
<button class="btn-orb-btn" type="button" aria-label="Send">
  <span class="btn-orb-core" aria-hidden="true"></span>
  <span class="btn-orb-light" aria-hidden="true">
    <span class="btn-orb-fill"></span>
    <span class="btn-orb-sheen"></span>
  </span>
  <span class="btn-orb-arrow">
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M9 5.5 16.5 12 9 18.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
  <span class="btn-orb-loader">
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
      <rect class="btn-orb-px btn-orb-px--1" x="8" y="0" width="4" height="4"/>
      <rect class="btn-orb-px btn-orb-px--2" x="12" y="4" width="4" height="4"/>
      <rect class="btn-orb-px btn-orb-px--3" x="16" y="8" width="4" height="4"/>
      <rect class="btn-orb-px btn-orb-px--4" x="12" y="12" width="4" height="4"/>
      <rect class="btn-orb-px btn-orb-px--5" x="8" y="16" width="4" height="4"/>
      <rect class="btn-orb-px btn-orb-px--6" x="4" y="12" width="4" height="4"/>
      <rect class="btn-orb-px btn-orb-px--7" x="0" y="8" width="4" height="4"/>
      <rect class="btn-orb-px btn-orb-px--8" x="4" y="4" width="4" height="4"/>
    </svg>
  </span>
</button>
`;

const ORB_SCRIPT = `
(function () {
  var LOAD_MS = 3600;
  var btn = document.querySelector(".btn-orb-btn");
  if (!btn) return;
  var timer = 0;
  btn.addEventListener("click", function () {
    if (btn.disabled) return;
    btn.classList.add("is-loading");
    btn.disabled = true;
    btn.setAttribute("aria-busy", "true");
    btn.setAttribute("aria-label", "Loading");
    window.clearTimeout(timer);
    timer = window.setTimeout(function () {
      btn.classList.remove("is-loading");
      btn.disabled = false;
      btn.removeAttribute("aria-busy");
      btn.setAttribute("aria-label", "Send");
    }, LOAD_MS);
  });
})();
`;

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Orb load</title>
  <style>
    html, body { height: 100%; margin: 0; }
    body {
      display: grid;
      place-items: center;
      background: #e8eaee;
    }
    ${ORB_CSS}
  </style>
</head>
<body>
  <div class="btn-orb-root">
    ${ORB_MARKUP}
  </div>
  <script>
    ${ORB_SCRIPT}
  </script>
</body>
</html>
`;

export const ORB_LOAD_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useState } from "react";

const LOAD_MS = 3600;

const PIXELS = [
  { cls: "btn-orb-px--1", x: 8, y: 0 },
  { cls: "btn-orb-px--2", x: 12, y: 4 },
  { cls: "btn-orb-px--3", x: 16, y: 8 },
  { cls: "btn-orb-px--4", x: 12, y: 12 },
  { cls: "btn-orb-px--5", x: 8, y: 16 },
  { cls: "btn-orb-px--6", x: 4, y: 12 },
  { cls: "btn-orb-px--7", x: 0, y: 8 },
  { cls: "btn-orb-px--8", x: 4, y: 4 },
];

const ORB_CSS = ${JSON.stringify(ORB_CSS)};

export default function OrbLoadButton({
  disabled = false,
  className = "",
  loadMs = LOAD_MS,
  onClick,
  ...rest
}) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (document.getElementById("btn-orb-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-orb-styles";
    tag.textContent = ORB_CSS;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const id = window.setTimeout(() => setLoading(false), loadMs);
    return () => window.clearTimeout(id);
  }, [loading, loadMs]);

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || disabled || loading) return;
    setLoading(true);
  }

  return (
    <button
      type="button"
      className={["btn-orb-btn", loading ? "is-loading" : "", className]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={loading ? "Loading" : "Send"}
      onClick={handleClick}
      {...rest}
    >
      <span className="btn-orb-core" aria-hidden="true" />
      <span className="btn-orb-light" aria-hidden="true">
        <span className="btn-orb-fill" />
        <span className="btn-orb-sheen" />
      </span>
      <span className="btn-orb-arrow">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path
            d="M9 5.5 16.5 12 9 18.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="btn-orb-loader">
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
          {PIXELS.map((p) => (
            <rect
              key={p.cls}
              className={"btn-orb-px " + p.cls}
              x={p.x}
              y={p.y}
              width="4"
              height="4"
            />
          ))}
        </svg>
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

export const ORB_LOAD_META = {
  id: "orb-load",
  name: "Orb load",
  blurb: "Circular arrow that blooms into a thinking orb. Pixel diamond replaces the generating label.",
  states: "default, hover, focus, active, loading, disabled",
  keywords: [
    "orb load",
    "loader",
    "orb",
    "spinner",
    "thinking",
    "generating",
    "circular arrow",
    "pixel",
    "pixel diamond",
    "loading",
    "ai wait",
    "bloom",
    "hover",
    "busy",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
