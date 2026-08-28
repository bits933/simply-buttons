const MORPH_CSS = `
.btn-morph-btn {
  --morph-fill: linear-gradient(180deg, #2a2a2a 0%, #111111 100%);
  --morph-fill-open: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
  --morph-border-open: rgba(34, 197, 94, 0.35);
  --morph-shadow-open: inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 2px 8px rgba(34, 197, 94, 0.12);
  --morph-ink: #f5f5f5;
  --morph-ink-open: #15803d;
  --morph-focus: #171717;
  --morph-ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --morph-tick-ease: cubic-bezier(0.22, 1, 0.36, 1);
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  min-width: 120px;
  padding: 13px 28px;
  border: 1px solid transparent;
  border-radius: 12px;
  background: var(--morph-fill);
  color: var(--morph-ink);
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  cursor: pointer;
  transition:
    min-width 0.35s var(--morph-ease),
    border-radius 0.35s var(--morph-ease),
    background 0.35s var(--morph-ease),
    color 0.35s var(--morph-ease),
    border-color 0.35s var(--morph-ease),
    box-shadow 0.35s var(--morph-ease),
    gap 0.35s var(--morph-ease);
}
.btn-morph-btn *,
.btn-morph-btn *::before,
.btn-morph-btn *::after { box-sizing: border-box; }
.btn-morph-btn.is-open {
  min-width: 224px;
  border-radius: 22px;
  background: var(--morph-fill-open);
  border-color: var(--morph-border-open);
  box-shadow: var(--morph-shadow-open);
  color: var(--morph-ink-open);
  gap: 8px;
}
.btn-morph-alt {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 0;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}
.btn-morph-btn.is-open .btn-morph-alt {
  display: inline-flex;
  animation: btn-morph-success-gap 0.32s var(--morph-tick-ease) 0.62s both;
}
.btn-morph-btn.is-open .btn-morph-lbl { display: none; }
.btn-morph-tick {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  overflow: visible;
}
.btn-morph-success {
  max-width: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateX(-6px);
}
.btn-morph-btn.is-open .btn-morph-success {
  animation: btn-morph-success-in 0.32s var(--morph-tick-ease) 0.62s both;
}
.btn-morph-tick-path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
}
.btn-morph-btn.is-open .btn-morph-tick-path {
  animation: btn-morph-tick-draw 0.45s var(--morph-tick-ease) 0.12s forwards;
}
.btn-morph-btn.is-open .btn-morph-tick {
  animation: btn-morph-tick-pop 0.4s var(--morph-tick-ease) 0.08s both;
}
@keyframes btn-morph-tick-draw {
  to { stroke-dashoffset: 0; }
}
@keyframes btn-morph-tick-pop {
  0% { transform: scale(0.55); opacity: 0; }
  60% { transform: scale(1.12); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes btn-morph-success-gap {
  to { gap: 8px; }
}
@keyframes btn-morph-success-in {
  to { max-width: 10em; opacity: 1; transform: translateX(0); }
}
.btn-morph-btn:focus-visible {
  outline: 2px solid var(--morph-focus);
  outline-offset: 3px;
}
.btn-morph-btn:disabled { cursor: not-allowed; opacity: 0.42; }
@media (prefers-reduced-motion: reduce) {
  .btn-morph-btn { transition: none; }
  .btn-morph-btn.is-open .btn-morph-tick,
  .btn-morph-btn.is-open .btn-morph-tick-path,
  .btn-morph-btn.is-open .btn-morph-alt,
  .btn-morph-btn.is-open .btn-morph-success { animation: none; }
  .btn-morph-tick-path { stroke-dashoffset: 0; }
  .btn-morph-btn.is-open .btn-morph-alt { gap: 8px; }
  .btn-morph-btn.is-open .btn-morph-success {
    max-width: 10em;
    opacity: 1;
    transform: none;
  }
}
`.trim();

const MORPH_MARKUP = `
<button class="btn-morph-btn" type="button" aria-live="polite" aria-label="Send">
  <span class="btn-morph-lbl">Send</span>
  <span class="btn-morph-alt">
    <svg class="btn-morph-tick" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path class="btn-morph-tick-path" d="M3.2 8.2 L6.4 11.2 L12.8 4.6" />
    </svg>
    <span class="btn-morph-success">Sent</span>
  </span>
</button>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Morph Button</title>
  <style>
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #f4f4f4; }
    ${MORPH_CSS}
  </style>
</head>
<body>
  ${MORPH_MARKUP}
  <script>
    (function () {
      var btn = document.querySelector(".btn-morph-btn");
      if (!btn) return;
      var timer = 0;
      btn.addEventListener("click", function () {
        if (btn.classList.contains("is-open") || btn.disabled) return;
        btn.classList.add("is-open");
        btn.setAttribute("aria-label", "Sent");
        window.clearTimeout(timer);
        timer = window.setTimeout(function () {
          btn.classList.remove("is-open");
          btn.setAttribute("aria-label", "Send");
        }, 2200);
      });
    })();
  </script>
</body>
</html>
`;

export const MORPH_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef, useState } from "react";

const OPEN_MS = 2200;
const MORPH_CSS = ${JSON.stringify(MORPH_CSS)};

function MorphTick() {
  return (
    <svg
      className="btn-morph-tick"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path className="btn-morph-tick-path" d="M3.2 8.2 L6.4 11.2 L12.8 4.6" />
    </svg>
  );
}

export default function MorphButton({
  label = "Send",
  successLabel = "Sent",
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const resetTimer = useRef(0);

  useEffect(() => {
    if (document.getElementById("btn-morph-styles")) return;
    const tag = document.createElement("style");
    tag.id = "btn-morph-styles";
    tag.textContent = MORPH_CSS;
    document.head.appendChild(tag);
  }, []);

  useEffect(
    () => () => {
      window.clearTimeout(resetTimer.current);
    },
    [],
  );

  function handleClick() {
    if (disabled || open) return;
    setOpen(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setOpen(false), OPEN_MS);
  }

  return (
    <button
      type="button"
      className={"btn-morph-btn" + (open ? " is-open" : "")}
      disabled={disabled}
      aria-live="polite"
      aria-label={open ? successLabel : label}
      onClick={handleClick}
    >
      <span className="btn-morph-lbl">{label}</span>
      <span className="btn-morph-alt">
        <MorphTick />
        <span className="btn-morph-success">{successLabel}</span>
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

export const MORPH_META = {
  id: "morph",
  name: "Morph send",
  blurb: "Draws a centered tick, reveals Sent, then settles back.",
  states: "default, open (light green + subtle stroke + tick), focus, disabled",
  keywords: [
    "morph",
    "morph send",
    "send button",
    "tick morph",
    "check mark",
    "sent state",
    "success morph",
    "centered tick",
    "submit morph",
    "confirm send",
    "settle back",
    "sent reveal",
    "morph cta",
    "checkmark draw",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
