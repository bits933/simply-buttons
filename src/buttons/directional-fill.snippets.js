const DIRECTIONAL_FILL_CSS = `
.btn-directional-root,
.btn-directional-btn {
  --directional-ink: #0b0b0b;
  --directional-fill-color: #0b0b0b;
  --directional-on-fill: #f1f1f1;
  --directional-focus: #171717;
  --directional-ease: cubic-bezier(.65, 0, .35, 1);
}
:root[data-theme="dark"] .btn-directional-root,
:root[data-theme="dark"] .btn-directional-btn {
  --directional-ink: #f1f1f1;
  --directional-fill-color: #f1f1f1;
  --directional-on-fill: #0b0b0b;
  --directional-focus: #f5f5f5;
}
.btn-directional-root { display: grid; place-items: center; }
.btn-directional-btn {
  appearance: none; position: relative; isolation: isolate; overflow: hidden;
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 228px; min-height: 36px; padding: 8px 12px;
  border: 0; border-bottom: 1px solid color-mix(in srgb, var(--directional-ink) 20%, transparent); background: transparent;
  color: var(--directional-ink); font-family: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  font-size: 13px; font-weight: 400; letter-spacing: .06em; line-height: 1;
  text-transform: uppercase; cursor: pointer;
}
.btn-directional-btn *, .btn-directional-btn *::before, .btn-directional-btn *::after { box-sizing: border-box; }
.btn-directional-fill {
  position: absolute; inset: 0; z-index: 0; background: var(--directional-fill-color);
  transform: translateY(102%); transition: none; pointer-events: none;
}
.btn-directional-btn[data-motion="active"] .btn-directional-fill,
.btn-directional-btn[data-motion="exiting"] .btn-directional-fill { transition: transform .6s var(--directional-ease); }
.btn-directional-btn[data-motion="active"] .btn-directional-fill { transform: translateY(0); }
.btn-directional-btn[data-motion="exiting"] .btn-directional-fill { transform: translateY(-102%); }
.btn-directional-label { position: relative; z-index: 1; white-space: nowrap; transition: color .6s var(--directional-ease); }
.btn-directional-btn[data-motion="active"] { color: var(--directional-on-fill); }
.btn-directional-btn:focus { outline: none; }
.btn-directional-btn:focus-visible { outline: 2px solid var(--directional-focus); outline-offset: 4px; }
.btn-directional-btn:active:not(:disabled) { transform: translateY(1px); }
.btn-directional-btn:disabled { cursor: not-allowed; opacity: .42; }
.btn-directional-btn:disabled .btn-directional-fill { transform: translateY(102%); transition: none; }
@media (prefers-reduced-motion: reduce) {
  .btn-directional-btn, .btn-directional-fill, .btn-directional-label { transition: none; }
}
`.trim();

const DIRECTIONAL_FILL_MARKUP = `
<button class="btn-directional-btn" type="button" data-motion="idle">
  <span class="btn-directional-fill" aria-hidden="true"></span>
  <span class="btn-directional-label">Explore</span>
</button>
`.trim();

const DIRECTIONAL_FILL_SCRIPT = `
document.querySelectorAll(".btn-directional-btn").forEach((button) => {
  let activationFrame = 0;
  const setMotion = (motion) => { button.dataset.motion = button.disabled ? "idle" : motion; };
  const cancelActivation = () => {
    window.cancelAnimationFrame(activationFrame);
    activationFrame = 0;
  };
  const enter = () => {
    if (button.disabled) return;
    cancelActivation();
    if (button.dataset.motion === "exiting") {
      setMotion("idle");
      activationFrame = window.requestAnimationFrame(() => setMotion("active"));
      return;
    }
    setMotion("active");
  };
  const exit = () => {
    if (button.disabled) return;
    cancelActivation();
    setMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "idle" : "exiting");
  };
  button.addEventListener("pointerenter", enter);
  button.addEventListener("pointerleave", exit);
  button.addEventListener("focus", enter);
  button.addEventListener("blur", exit);
  button.querySelector(".btn-directional-fill").addEventListener("transitionend", (event) => {
    if (event.propertyName === "transform" && button.dataset.motion === "exiting") setMotion("idle");
  });
});
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Directional fill</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #eef0f3; }
    :root[data-theme="dark"] body { background: #121315; }
    ${DIRECTIONAL_FILL_CSS}
  </style>
</head>
<body>
  <div class="btn-directional-root">${DIRECTIONAL_FILL_MARKUP}</div>
  <script>${DIRECTIONAL_FILL_SCRIPT}</script>
</body>
</html>`;

export const DIRECTIONAL_FILL_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef, useState } from "react";

const DIRECTIONAL_FILL_CSS = ${JSON.stringify(DIRECTIONAL_FILL_CSS)};

export default function DirectionalFillButton({ label = "Explore", disabled = false, className = "", onClick, ...rest }) {
  const [motion, setMotion] = useState("idle");
  const activationFrame = useRef(0);
  const renderedMotion = disabled ? "idle" : motion;

  useEffect(() => {
    if (!disabled) return;
    window.cancelAnimationFrame(activationFrame.current);
    activationFrame.current = 0;
    setMotion("idle");
  }, [disabled]);

  useEffect(() => () => window.cancelAnimationFrame(activationFrame.current), []);

  function enter() {
    if (disabled) return;
    window.cancelAnimationFrame(activationFrame.current);
    if (motion === "exiting") {
      setMotion("idle");
      activationFrame.current = window.requestAnimationFrame(() => setMotion("active"));
      return;
    }
    setMotion("active");
  }

  function exit() {
    if (disabled) return;
    window.cancelAnimationFrame(activationFrame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion("idle");
      return;
    }
    setMotion("exiting");
  }

  useEffect(() => {
    if (document.getElementById("btn-directional-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-directional-styles";
    tag.textContent = DIRECTIONAL_FILL_CSS;
    document.head.appendChild(tag);
  }, []);

  return (
    <button
      className={["btn-directional-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
      {...rest}
      type="button"
      data-motion={renderedMotion}
      onPointerEnter={enter}
      onPointerLeave={exit}
      onFocus={enter}
      onBlur={exit}
    >
      <span
        className="btn-directional-fill"
        aria-hidden="true"
        onTransitionEnd={(event) => {
          if (event.propertyName === "transform" && motion === "exiting") setMotion("idle");
        }}
      />
      <span className="btn-directional-label">{label}</span>
    </button>
  );
}
`,
  node: `const http = require("node:http");
const PAGE = ${JSON.stringify(HTML_PAGE)};

http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(PAGE);
}).listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const DIRECTIONAL_FILL_META = {
  id: "directional-fill",
  name: "Directional fill",
  blurb: "Hover or focus fills from below, then exits through the top.",
  states: "default, hover, focus, active, disabled",
  keywords: [
    "directional fill",
    "fill up",
    "exit top",
    "vertical fill",
    "hover fill",
    "focus fill",
    "pass through fill",
    "rising wash",
    "fill sweep",
    "bottom to top",
    "fill exit",
    "directional hover",
    "wash fill",
    "fill button",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
