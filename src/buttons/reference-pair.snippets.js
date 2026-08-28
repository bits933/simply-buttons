const REFERENCE_CSS = `
.button {
  appearance: none;
  position: relative;
  display: inline-grid;
  place-items: center;
  overflow: hidden;
  padding: 0;
  background: #fff;
  color: #080808;
  cursor: pointer;
  transform: scale(1);
  transform-origin: center;
  transition: transform 160ms cubic-bezier(.22, 1, .36, 1);
}
.button:active { transform: scale(.92); transition-duration: 80ms; }
.button:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
`.trim();

const ORBIT_CSS = `
.orbit {
  width: 60px;
  height: 60px;
  border: 1.5px solid #080808;
  border-radius: 50%;
}
.orbit::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: #080808;
  pointer-events: none;
  transform: scale(0);
  transition: transform 380ms cubic-bezier(.22, 1, .36, 1);
}
.orbit-icon-window { position: relative; z-index: 1; width: 12px; height: 12px; overflow: hidden; }
.orbit-icon {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  transition: color 180ms ease, transform 380ms cubic-bezier(.22, 1, .36, 1);
}
.orbit-icon.next { color: #fff; transform: translateY(-100%); }
@media (hover: hover) {
  .orbit:hover::before { transform: scale(1); }
  .orbit:hover .current { color: #fff; transform: translateY(100%); }
  .orbit:hover .next { transform: translateY(0); }
}
`.trim();

const SIGNAL_CSS = `
.signal-wrap {
  position: relative;
  display: inline-grid;
  place-items: center;
}
.signal-pulse {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 1.5px solid rgba(8, 8, 8, 0.48);
  pointer-events: none;
  opacity: 0;
  box-sizing: border-box;
}
.signal-wrap.is-pulsing .signal-pulse {
  animation: signal-pulse-out 580ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes signal-pulse-out {
  0% { inset: 0; opacity: 0.85; }
  100% { inset: -15px; opacity: 0; }
}
.signal {
  --signal-stroke: #c9c9c9;
  width: 156px;
  height: 44px;
  border: 1.5px solid var(--signal-stroke);
  border-radius: 999px;
  background-clip: padding-box;
  font: 700 14px/1 Arial, Helvetica, sans-serif;
  letter-spacing: -.3px;
  transition: transform 160ms cubic-bezier(.22, 1, .36, 1), border-color 220ms ease;
}
.signal::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: #080808;
  pointer-events: none;
  transform: scaleX(0);
  transform-origin: center;
  transition: transform 440ms cubic-bezier(.22, 1, .36, 1);
}
.signal-label { position: relative; z-index: 1; transition: color 220ms ease; }
@media (hover: hover) {
  .signal:hover { border-color: #383838; }
  .signal:hover::before { transform: scaleX(1); }
  .signal:hover .signal-label { color: #fff; }
}
`.trim();

function page(title, markup, css, script = "") {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body { min-height: 100vh; margin: 0; display: grid; place-items: center; background: #fff; }
    ${REFERENCE_CSS}
    ${css}
  </style>
</head>
<body>
  ${markup}
  ${script ? `<script>${script}</script>` : ""}
</body>
</html>`;
}

const ORBIT_MARKUP = `<button class="button orbit" type="button" aria-label="Move down">
  <span class="orbit-icon-window" aria-hidden="true">
    <span class="orbit-icon current">▼</span>
    <span class="orbit-icon next">▼</span>
  </span>
</button>`;

const SIGNAL_MARKUP = `<div class="signal-wrap">
  <span class="signal-pulse" aria-hidden="true"></span>
  <button class="button signal" type="button">
    <span class="signal-label">What we do</span>
  </button>
</div>`;

const SIGNAL_SCRIPT = `
const wrap = document.querySelector('.signal-wrap');
const btn = document.querySelector('.signal');
btn.addEventListener('click', () => {
  wrap.classList.remove('is-pulsing');
  void wrap.offsetWidth;
  wrap.classList.add('is-pulsing');
});
`.trim();

const ORBIT_PAGE = page("Orbit Drop", ORBIT_MARKUP, ORBIT_CSS);
const SIGNAL_PAGE = page("Signal Capsule", SIGNAL_MARKUP, SIGNAL_CSS, SIGNAL_SCRIPT);

export const ORBIT_DROP_SNIPPETS = {
  html: ORBIT_PAGE,
  react: `"use client";

import { useEffect } from "react";

const CSS = ${JSON.stringify(`${REFERENCE_CSS}\n${ORBIT_CSS}`)};

export default function OrbitDropButton() {
  useEffect(() => {
    if (document.getElementById("orbit-styles")) return;
    const style = document.createElement("style");
    style.id = "orbit-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);

  return (
    <button className="button orbit" type="button" aria-label="Move down">
      <span className="orbit-icon-window" aria-hidden="true">
        <span className="orbit-icon current">▼</span>
        <span className="orbit-icon next">▼</span>
      </span>
    </button>
  );
}
`,
  node: `require("http").createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(${JSON.stringify(ORBIT_PAGE)});
}).listen(3000);`,
};

export const SIGNAL_CAPSULE_SNIPPETS = {
  html: SIGNAL_PAGE,
  react: `"use client";

import { useEffect, useRef, useState } from "react";

const CSS = ${JSON.stringify(`${REFERENCE_CSS}\n${SIGNAL_CSS}`)};

export default function SignalCapsuleButton({ label = "What we do" }) {
  const [pulsing, setPulsing] = useState(false);
  const timer = useRef(0);

  useEffect(() => {
    if (document.getElementById("signal-styles")) return;
    const style = document.createElement("style");
    style.id = "signal-styles";
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => clearTimeout(timer.current);
  }, []);

  function handleClick() {
    setPulsing(false);
    requestAnimationFrame(() => {
      setPulsing(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setPulsing(false), 650);
    });
  }

  return (
    <div className={"signal-wrap" + (pulsing ? " is-pulsing" : "")}>
      <span className="signal-pulse" aria-hidden="true" />
      <button className="button signal" type="button" onClick={handleClick}>
        <span className="signal-label">{label}</span>
      </button>
    </div>
  );
}
`,
  node: `require("http").createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(${JSON.stringify(SIGNAL_PAGE)});
}).listen(3000);`,
};

export const ORBIT_DROP_META = {
  name: "Orbit drop",
  blurb: "Outlined circular control with a clipped directional hover.",
  states: "default, hover, active, focus, disabled",
  keywords: [
    "orbit drop",
    "circular control",
    "outlined circle",
    "directional hover",
    "clipped hover",
    "orbit button",
    "round outline",
    "drop fill",
    "hover clip",
    "circle cta",
    "directional fill",
    "outlined control",
    "radial hover",
    "round button",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};

export const SIGNAL_CAPSULE_META = {
  name: "Signal capsule",
  blurb: "Measured outline pill with a smooth hover fill and click pulse emission.",
  states: "default, hover, active click pulse, focus, disabled",
  keywords: [
    "signal capsule",
    "outline pill",
    "hover fill",
    "click pulse",
    "pulse emission",
    "measured outline",
    "capsule button",
    "smooth fill",
    "signal pulse",
    "pill outline",
    "emit pulse",
    "fill hover",
    "outline cta",
    "capsule signal",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
