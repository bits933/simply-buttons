const ROCKET_JSON_PATH = "/lottie/wired-outline-489-rocket-hover-flying.json";

const CSS = `
.rive-rocket {
  --btn-x: 0; --btn-y: 0; --lift: 0;
  appearance: none;
  position: relative;
  display: inline-flex;
  box-sizing: border-box;
  width: 252px;
  height: 64px;
  padding: 1px;
  overflow: visible;
  border: 0;
  background: #0f0f0f;
  color: #0f0f0f;
  font-size: 24px;
  cursor: pointer;
}
.rive-rocket-panel {
  position: relative;
  z-index: 2;
  display: flex;
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  border: 1px solid #0f0f0f;
  box-sizing: border-box;
  font: 700 0.5em/1.5 system-ui, sans-serif;
  letter-spacing: .1em;
  text-transform: uppercase;
  transform: translate3d(
    calc(var(--lift) * .8em + var(--btn-x) * -.5em),
    calc(var(--lift) * -.8em + var(--btn-y) * -.5em),
    0
  );
}
.rive-rocket-inner {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 1.5em 2em;
  overflow: hidden;
}
.rive-rocket-inner * { pointer-events: none; }
.rive-rocket-arrow {
  position: absolute;
  left: 2em;
  top: 50%;
  width: 18px;
  height: 18px;
  margin-top: -9px;
  transform: translateX(-4em);
  transition: transform .55s cubic-bezier(.22,1,.36,1) .08s;
}
.rive-rocket.is-hot .rive-rocket-arrow {
  transform: translateX(-.2em);
  transition-delay: .12s;
}
.rive-rocket-label {
  flex: 1;
  padding-right: 2.2em;
  text-align: left;
  transform: translateX(0);
  transition: transform .55s cubic-bezier(.22,1,.36,1) .06s;
}
.rive-rocket.is-hot .rive-rocket-label {
  transform: translateX(2em);
  transition-delay: .1s;
}
.rive-rocket-icon {
  position: relative;
  flex: 0 0 32px;
  width: 32px;
  height: 32px;
  margin-right: -.4em;
  overflow: visible;
}
.rive-rocket-icon svg,
.rive-rocket-icon .lottie {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.rive-rocket-icon svg,
.rive-rocket-icon .lottie { transition: opacity .4s ease .08s; }
.rive-rocket-icon .lottie { opacity: 0; }
.rive-rocket.is-hot svg.rest { opacity: 0; }
.rive-rocket.is-hot .lottie { opacity: 1; }
.rive-rocket:focus-visible { outline: 2px solid #171717; outline-offset: 3px; }
`.trim();

const REST_SVG = `<svg class="rest" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 430 430" fill="none" aria-hidden="true"><g stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"><path d="M185.56 148.57s-65.41-8.19-111.05 37.45c48.44 1.26 66.51 19.32 66.51 19.32m140.77 39.47s8.19 65.41-37.45 111.05c-1.26-48.44-19.32-66.51-19.32-66.51"/><path d="m208.21 284.57-14.82 4.63c-14.8 4.63-30.95.66-41.92-10.31a41.68 41.68 0 0 1-10.31-41.92l4.64-14.82m131.56-27.98c-11.63 11.63-30.48 11.63-42.11 0s-11.63-30.48 0-42.1 30.48-11.63 42.11 0c11.63 11.62 11.63 30.47 0 42.1"/><path d="M209.8 283.57c5.77 5.77 14.84 6.65 21.57 2.04 15.94-10.91 35.38-27.65 60.6-52.87 47.45-47.45 70-108.09 64.69-159.98-51.88-5.31-112.53 17.24-159.98 64.69-25.21 25.21-41.96 44.66-52.87 60.6-4.61 6.74-3.73 15.8 2.04 21.57z"/><path d="M276.94 86.52s1.79 19.83 24.37 42.41 41.6 23.55 41.6 23.55"/><path d="M135.81 335.34C124.55 346.6 95.65 355.11 73 357.37c3.26-23.66 10.76-51.55 22.03-62.81 11.26-11.26 29.52-11.26 40.78 0s11.26 29.52 0 40.78"/></g></svg>`;

const ARROW_SVG = `<svg class="rive-rocket-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4.77 11.943h13.321m1.025 0L11.943 4.77m7.173 7.173-7.173 7.173" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="square"/></svg>`;

const HTML_PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Wondermake Get Started</title>
  <style>body{min-height:100vh;display:grid;place-items:center;margin:0;background:#e8e8e8}${CSS}</style>
</head>
<body>
  <button class="rive-rocket" type="button">
    <span class="rive-rocket-panel">
      <span class="rive-rocket-inner">
        ${ARROW_SVG}
        <span class="rive-rocket-label">Get Started</span>
        <span class="rive-rocket-icon" aria-hidden="true">
          ${REST_SVG}
          <span class="lottie" id="rocket-lottie"></span>
        </span>
      </span>
    </span>
  </button>
  <script src="https://unpkg.com/lottie-web@5.12.2/build/player/lottie.min.js"></script>
  <script>
    const button = document.querySelector('.rive-rocket');
    const anim = lottie.loadAnimation({
      container: document.getElementById('rocket-lottie'),
      renderer: 'svg', loop: true, autoplay: false,
      path: '${ROCKET_JSON_PATH}'
    });
    let cx = 0, cy = 0, tx = 0, ty = 0, lift = 0, liftT = 0, edge;
    function setHot(next) {
      window.clearTimeout(edge);
      edge = window.setTimeout(function () {
        button.classList.toggle('is-hot', next);
        liftT = next ? 1 : 0;
        if (!next) { tx = 0; ty = 0; anim.goToAndStop(0, true); }
        else anim.play();
      }, next ? 40 : 90);
    }
    function track(e) {
      const r = button.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, (r.left + r.width/2 - e.clientX) / (r.width/2)));
      ty = Math.max(-1, Math.min(1, (r.top + r.height/2 - e.clientY) / (r.height/2)));
    }
    (function tick() {
      cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
      lift += (liftT - lift) * 0.12;
      button.style.setProperty('--btn-x', cx.toFixed(4));
      button.style.setProperty('--btn-y', cy.toFixed(4));
      button.style.setProperty('--lift', lift.toFixed(4));
      requestAnimationFrame(tick);
    })();
    button.addEventListener('pointerenter', (e) => { setHot(true); track(e); });
    button.addEventListener('pointermove', track);
    button.addEventListener('pointerleave', () => setHot(false));
    button.addEventListener('focus', () => setHot(true));
    button.addEventListener('blur', () => setHot(false));
  </script>
</body>
</html>`;

export const RIVE_ROCKET_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef } from "react";
import { Lottie } from "lottie-react";
import rocketHover from "./wired-outline-489-rocket-hover-flying.json";

export default function RocketButton({ label = "Get Started" }) {
  const buttonRef = useRef(null);
  const lottieRef = useRef(null);
  const cursor = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const c = cursor.current;
      c.x += (c.tx - c.x) * 0.18;
      c.y += (c.ty - c.y) * 0.18;
      buttonRef.current?.style.setProperty("--btn-x", c.x.toFixed(4));
      buttonRef.current?.style.setProperty("--btn-y", c.y.toFixed(4));
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  function setHot(next) {
    buttonRef.current?.classList.toggle("is-hot", next);
    if (!next) { cursor.current.tx = 0; cursor.current.ty = 0; lottieRef.current?.stop(); }
    else lottieRef.current?.play();
  }

  function track(event) {
    const r = buttonRef.current.getBoundingClientRect();
    cursor.current.tx = Math.max(-1, Math.min(1, (r.left + r.width / 2 - event.clientX) / (r.width / 2)));
    cursor.current.ty = Math.max(-1, Math.min(1, (r.top + r.height / 2 - event.clientY) / (r.height / 2)));
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className="rive-rocket"
      onPointerEnter={(e) => { setHot(true); track(e); }}
      onPointerMove={track}
      onPointerLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      <span className="rive-rocket-panel">
        <span className="rive-rocket-inner">
          <span className="rive-rocket-label">{label}</span>
          <span className="rive-rocket-icon" aria-hidden="true">
            <Lottie src={rocketHover} autoplay={false} loop lottieRef={lottieRef} className="lottie" />
          </span>
        </span>
      </span>
    </button>
  );
}
`,
  node: `const http = require("http");
const page = ${JSON.stringify(HTML_PAGE)};
http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(page);
}).listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const RIVE_ROCKET_META = {
  id: "rive-rocket",
  name: "Wondermake get started",
  blurb: "Light panel lifts off a dark base, tracks the cursor, and flies the rocket icon.",
  states: "default, hover lift + magnetic track, arrow in, rocket flying, press, focus",
  keywords: [
    "wondermake",
    "get started",
    "rive rocket",
    "lottie rocket",
    "magnetic cta",
    "panel lift",
    "cursor track",
    "rocket fly",
    "rocket icon",
    "lift off",
    "magnetic button",
    "launch cta",
    "flying rocket",
    "dark base panel",
    "pointer magnetism",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
