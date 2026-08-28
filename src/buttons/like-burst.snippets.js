const LIKE_CSS = `
.btn-like-btn {
  --like-face: #171717;
  --like-ink: #f5f5f5;
  --like-color: #f40051;
  --like-edge: #171717;
  --like-focus: #171717;
  --like-fill: 150ms;
  --like-pop: 350ms;
  --like-pop-ease: cubic-bezier(0.34, 1.96, 0.64, 1);
  --like-spring: 380ms;
  --like-spring-ease: cubic-bezier(0.34, 1.4, 0.64, 1);
  --like-particle-dur: 600ms;
  --like-particle-size: 2.5px;
  --like-ease: cubic-bezier(0.22, 1, 0.36, 1);
  appearance: none;
  position: relative;
  isolation: isolate;
  overflow: visible;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 0;
  min-height: 44px;
  padding: 0 12px 0 10px;
  border: 1px solid var(--like-edge);
  border-radius: 999px;
  background: var(--like-face);
  color: var(--like-ink);
  font-family: "Segoe UI", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1;
  cursor: pointer;
}
.btn-like-btn *,
.btn-like-btn *::before,
.btn-like-btn *::after { box-sizing: border-box; }
.btn-like-icon { display: grid; place-items: center; width: 18px; height: 18px; flex: 0 0 auto; }
.btn-like-heart { display: block; width: 18px; height: 18px; color: currentColor; transition: color var(--like-fill) var(--like-ease); }
.btn-like-heart path {
  fill: transparent; stroke: currentColor; stroke-width: 1.8; stroke-linejoin: round;
  transition: fill var(--like-fill) var(--like-ease), stroke var(--like-fill) var(--like-ease);
}
.btn-like-btn[data-liked="true"] .btn-like-heart { color: var(--like-color); }
.btn-like-btn[data-liked="true"] .btn-like-heart path { fill: currentColor; }
.btn-like-btn[data-liked="true"] .btn-like-icon { animation: btn-like-pop var(--like-pop) var(--like-pop-ease); }
.btn-like-btn.is-sprung { animation: btn-like-spring var(--like-spring) var(--like-spring-ease); }
.btn-like-particles {
  position: absolute; left: 19px; top: 50%; width: 0; height: 0; pointer-events: none; color: var(--like-color);
}
.btn-like-particles i {
  position: absolute;
  left: calc(var(--like-particle-size) * var(--psize, 1) / -2);
  top: calc(var(--like-particle-size) * var(--psize, 1) / -2);
  width: calc(var(--like-particle-size) * var(--psize, 1));
  height: calc(var(--like-particle-size) * var(--psize, 1));
  border-radius: 50%; background: currentColor; opacity: 0;
}
.btn-like-btn.is-bursting .btn-like-particles i {
  animation: btn-like-burst var(--pdur, var(--like-particle-dur)) ease-out var(--pdelay, 0ms) forwards;
}
.btn-like-label { white-space: nowrap; }
.btn-like-btn:focus { outline: none; }
.btn-like-btn:focus-visible { outline: 2px solid var(--like-focus); outline-offset: 3px; }
.btn-like-btn:hover:not(:disabled) { filter: brightness(1.06); }
.btn-like-btn:disabled { cursor: not-allowed; opacity: 0.42; }
@keyframes btn-like-pop {
  0% { transform: scale(1); }
  30% { transform: scale(0.82); }
  100% { transform: scale(1); }
}
@keyframes btn-like-spring {
  0% { transform: scale(1); }
  28% { transform: scale(0.96); }
  68% { transform: scale(1.025); }
  100% { transform: scale(1); }
}
@keyframes btn-like-burst {
  0% { opacity: 0; transform: translate(0, 0) scale(0.4); }
  20% { opacity: 1; transform: translate(calc(var(--px) * 0.25), calc(var(--py) * 0.25)) scale(1); }
  100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(var(--p-end-scale, 0.6)); }
}
@media (prefers-reduced-motion: reduce) {
  .btn-like-icon, .btn-like-btn.is-sprung, .btn-like-particles i { animation: none !important; }
  .btn-like-heart, .btn-like-heart path { transition: none; }
}
`.trim();

const LIKE_MARKUP = `
<button class="btn-like-btn" type="button" data-liked="false" aria-pressed="false" aria-label="Like">
  <span class="btn-like-icon">
    <svg class="btn-like-heart" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  </span>
  <span class="btn-like-particles" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
  <span class="btn-like-label">Like</span>
</button>
`.trim();

const LIKE_SCRIPT = `
(function () {
  var BURST = 640;
  var SPRING = 380;

  function spray(root) {
    root.querySelectorAll("i").forEach(function (dot) {
      var angle = Math.random() * Math.PI * 2;
      var dist = 12 + Math.random() * 14;
      dot.style.setProperty("--px", Math.cos(angle) * dist + "px");
      dot.style.setProperty("--py", Math.sin(angle) * dist + "px");
      dot.style.setProperty("--pdur", 480 + Math.random() * 220 + "ms");
      dot.style.setProperty("--pdelay", Math.random() * 40 + "ms");
      dot.style.setProperty("--p-end-scale", (0.35 + Math.random() * 0.4).toFixed(2));
      dot.style.setProperty("--psize", (0.7 + Math.random() * 0.7).toFixed(2));
    });
  }

  document.querySelectorAll(".btn-like-btn").forEach(function (button) {
    var particles = button.querySelector(".btn-like-particles");
    var burstId = 0;
    var springId = 0;

    button.addEventListener("click", function () {
      if (button.disabled) return;
      var next = button.getAttribute("data-liked") !== "true";
      button.setAttribute("data-liked", next ? "true" : "false");
      button.setAttribute("aria-pressed", next ? "true" : "false");
      button.setAttribute("aria-label", next ? "Unlike" : "Like");

      button.classList.remove("is-sprung");
      void button.offsetWidth;
      button.classList.add("is-sprung");
      window.clearTimeout(springId);
      springId = window.setTimeout(function () {
        button.classList.remove("is-sprung");
      }, SPRING);

      if (next && particles) {
        spray(particles);
        button.classList.remove("is-bursting");
        void button.offsetWidth;
        button.classList.add("is-bursting");
        window.clearTimeout(burstId);
        burstId = window.setTimeout(function () {
          button.classList.remove("is-bursting");
        }, BURST);
      }
    });
  });
})();
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Like burst</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #eef0f3; }
    ${LIKE_CSS}
  </style>
</head>
<body>
  ${LIKE_MARKUP}
  <script>
    ${LIKE_SCRIPT}
  </script>
</body>
</html>
`;

export const LIKE_BURST_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useRef, useState } from "react";

const LIKE_CSS = ${JSON.stringify(LIKE_CSS)};
const PARTICLE_COUNT = 8;
const BURST_MS = 640;
const SPRING_MS = 380;

function spray(root) {
  root.querySelectorAll("i").forEach((dot) => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 12 + Math.random() * 14;
    dot.style.setProperty("--px", Math.cos(angle) * dist + "px");
    dot.style.setProperty("--py", Math.sin(angle) * dist + "px");
    dot.style.setProperty("--pdur", 480 + Math.random() * 220 + "ms");
    dot.style.setProperty("--pdelay", Math.random() * 40 + "ms");
    dot.style.setProperty("--p-end-scale", (0.35 + Math.random() * 0.4).toFixed(2));
    dot.style.setProperty("--psize", (0.7 + Math.random() * 0.7).toFixed(2));
  });
}

export default function LikeBurstButton({ label = "Like", disabled = false }) {
  const [liked, setLiked] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [sprung, setSprung] = useState(false);
  const particlesRef = useRef(null);
  const burstTimer = useRef(0);
  const springTimer = useRef(0);
  const stylesReady = useRef(false);

  if (typeof document !== "undefined" && !stylesReady.current) {
    if (!document.getElementById("btn-like-styles")) {
      const tag = document.createElement("style");
      tag.id = "btn-like-styles";
      tag.textContent = LIKE_CSS;
      document.head.appendChild(tag);
    }
    stylesReady.current = true;
  }

  function handleClick() {
    if (disabled) return;
    const next = !liked;
    setLiked(next);
    setSprung(false);
    window.clearTimeout(springTimer.current);
    requestAnimationFrame(() => {
      setSprung(true);
      springTimer.current = window.setTimeout(() => setSprung(false), SPRING_MS);
    });
    if (next && particlesRef.current) {
      spray(particlesRef.current);
      setBursting(false);
      requestAnimationFrame(() => {
        setBursting(true);
        window.clearTimeout(burstTimer.current);
        burstTimer.current = window.setTimeout(() => setBursting(false), BURST_MS);
      });
    }
  }

  return (
    <button
      type="button"
      className={"btn-like-btn" + (bursting ? " is-bursting" : "") + (sprung ? " is-sprung" : "")}
      data-liked={liked ? "true" : "false"}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      disabled={disabled}
      onClick={handleClick}
    >
      <span className="btn-like-icon">
        <svg className="btn-like-heart" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </span>
      <span className="btn-like-particles" ref={particlesRef} aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => <i key={i} />)}
      </span>
      <span className="btn-like-label">{label}</span>
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

export const LIKE_BURST_META = {
  id: "like-burst",
  name: "Like burst",
  blurb: "Heart fills and sprays particles on like.",
  states: "default, hover, focus, active, pressed, disabled",
  keywords: [
    "like burst",
    "icon",
    "heart",
    "like",
    "favorite",
    "love",
    "reaction",
    "particles",
    "burst",
    "fill",
    "toggle",
    "heart fill",
    "spray",
    "hover",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
