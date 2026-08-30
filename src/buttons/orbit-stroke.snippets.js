import REACT from "./OrbitStrokeButton.jsx?raw";

const CSS = `
.btn-orbit-stroke { --orbit-stroke-angle:0deg; --orbit-stroke-stops:rgba(255,255,255,0.1) 0deg, #ffffff 45deg, rgba(255,255,255,0.4) 75deg, rgba(255,255,255,0.08) 120deg, rgba(255,255,255,0.08) 180deg, #ffffff 225deg, rgba(255,255,255,0.4) 255deg, rgba(255,255,255,0.08) 300deg, rgba(255,255,255,0.1) 360deg; position:relative; isolation:isolate; display:inline-grid; box-sizing:border-box; place-items:center; min-width:114px; height:42px; padding:0 16px; margin:0; border:2px solid #f5f5f5; border-radius:11px; appearance:none; background:#111; color:#f5f5f5; cursor:pointer; font:600 14px/1 system-ui,sans-serif; transition:transform 120ms ease,opacity 180ms ease,min-width 200ms ease; }
:root[data-theme="light"] .btn-orbit-stroke { background:#fff; border-color:#111; color:#111; --orbit-stroke-stops:rgba(0,0,0,0.1) 0deg, #111111 45deg, rgba(0,0,0,0.4) 75deg, rgba(0,0,0,0.08) 120deg, rgba(0,0,0,0.08) 180deg, #111111 225deg, rgba(0,0,0,0.4) 255deg, rgba(0,0,0,0.08) 300deg, rgba(0,0,0,0.1) 360deg; }
.btn-orbit-stroke-content { position:relative; z-index:1; display:inline-flex; align-items:center; justify-content:center; gap:6px; white-space:nowrap; }
.btn-orbit-stroke:hover:not(:disabled):not(.is-sending):not(.is-sent) { opacity:0.92; }
.btn-orbit-stroke.is-sending { border:2px solid transparent; background:linear-gradient(#111,#111) padding-box, conic-gradient(from var(--orbit-stroke-angle) at 50% 50%, var(--orbit-stroke-stops)) border-box; animation:orbit-stroke 2.2s linear infinite; cursor:default; }
:root[data-theme="light"] .btn-orbit-stroke.is-sending { background:linear-gradient(#fff,#fff) padding-box, conic-gradient(from var(--orbit-stroke-angle) at 50% 50%, var(--orbit-stroke-stops)) border-box; }
.btn-orbit-stroke.is-sent { border:2px solid #f5f5f5; background:#111; cursor:default; }
:root[data-theme="light"] .btn-orbit-stroke.is-sent { border-color:#111; background:#fff; }
.btn-orbit-stroke-tick { display:inline-block; width:15px; height:15px; flex-shrink:0; }
.btn-orbit-stroke-tick-path { stroke-dasharray:20; stroke-dashoffset:20; animation:orbit-stroke-tick-draw 350ms cubic-bezier(.16,1,.3,1) forwards; }
@keyframes orbit-stroke-tick-draw { to { stroke-dashoffset:0; } }
.btn-orbit-stroke:active:not(:disabled):not(.is-sending):not(.is-sent) { transform:scale(.98); }
.btn-orbit-stroke:focus-visible { outline:none; box-shadow:inset 0 0 0 2px currentColor; }
.btn-orbit-stroke:disabled { cursor:not-allowed; opacity:.45; }
@property --orbit-stroke-angle { syntax:"<angle>"; inherits:false; initial-value:0deg; }
@keyframes orbit-stroke { from { --orbit-stroke-angle:0deg; } to { --orbit-stroke-angle:360deg; } }
@media (prefers-reduced-motion: reduce) { .btn-orbit-stroke.is-sending { animation:none; } .btn-orbit-stroke-tick-path { animation:none; stroke-dashoffset:0; } }
@media (forced-colors: active) { .btn-orbit-stroke:focus-visible { outline:2px solid CanvasText; outline-offset:2px; box-shadow:none; } }
`.trim();

const MARKUP = `<button class="btn-orbit-stroke" type="button"><span class="btn-orbit-stroke-content"><span>Send</span></span></button>`;
const HTML_PAGE = `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Orbit Stroke</title><style>body{min-height:100vh;display:grid;place-items:center;margin:0;background:#161616}${CSS}</style></head><body>${MARKUP}</body></html>`;

export const ORBIT_STROKE_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `import { createServer } from "node:http";

const page = \`${HTML_PAGE}\`;

createServer((_request, response) => response.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page)).listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const ORBIT_STROKE_META = {
  id: "orbit-stroke",
  name: "Orbit stroke",
  blurb: "A clean Send button whose solid outline remains static on hover, activates an orbiting dual-specular gradient on click with a 4s wave, and confirms with an animated tick.",
  states: "idle, sending wave, sent tick, auto-reset, focus, disabled, reduced motion",
  keywords: [
    "orbit stroke", "send button", "specular gradient border", "smooth outline",
    "conic gradient", "thin border", "black button", "white button",
    "text shimmer wave", "sending", "sent checkmark", "animated tick",
    "smooth stroke", "cta", "theme button",
    "animated button", "interactive button", "button microinteraction", "ui animation",
  ],
};
