const CSS = `
.btn-orbit-stroke { --orbit-stroke-stops:#f5f5f5,#505050 25%,#111 45%,#f5f5f5 65%,#505050 85%,#f5f5f5; position:relative; isolation:isolate; display:inline-grid; box-sizing:border-box; place-items:center; width:108px; height:42px; margin:0; border:2px solid #f5f5f5; border-radius:11px; appearance:none; background:#111; color:#f5f5f5; cursor:pointer; font:600 14px/1 system-ui,sans-serif; transition:transform 120ms ease,opacity 180ms ease; }
.btn-orbit-stroke::before { position:absolute; inset:0; z-index:0; padding:2px; border-radius:inherit; background:conic-gradient(from var(--orbit-stroke-angle), var(--orbit-stroke-stops)); content:""; opacity:0; transition:opacity 180ms ease; -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
:root[data-theme="light"] .btn-orbit-stroke { --orbit-stroke-stops:#111,#8a8a8a 25%,#fff 45%,#111 65%,#8a8a8a 85%,#111; background:#fff; border-color:#111; color:#111; }
.btn-orbit-stroke > span { position:relative; z-index:1; }
.btn-orbit-stroke:hover:not(:disabled)::before,.btn-orbit-stroke:focus-visible::before { opacity:1; animation:orbit-stroke 3.2s infinite; }
.btn-orbit-stroke:active:not(:disabled) { transform:scale(.98); }
.btn-orbit-stroke:focus-visible { outline:none; box-shadow:inset 0 0 0 2px currentColor; }
.btn-orbit-stroke:disabled { cursor:not-allowed; opacity:.45; }
@property --orbit-stroke-angle { syntax:"<angle>"; inherits:false; initial-value:0deg; }
@keyframes orbit-stroke { 0% { --orbit-stroke-angle:0deg; animation-timing-function:cubic-bezier(.65, 0, .35, 1); } 50% { --orbit-stroke-angle:180deg; animation-timing-function:cubic-bezier(.65, 0, .35, 1); } 100% { --orbit-stroke-angle:360deg; } }
@media (prefers-reduced-motion: reduce) { .btn-orbit-stroke:hover:not(:disabled)::before,.btn-orbit-stroke:focus-visible::before { animation:none; } }
@media (forced-colors: active) { .btn-orbit-stroke:focus-visible { outline:2px solid CanvasText; outline-offset:2px; box-shadow:none; } }
`.trim();

const MARKUP = `<button class="btn-orbit-stroke" type="button"><span>Send</span></button>`;
const HTML_PAGE = `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Orbit Stroke</title><style>body{min-height:100vh;display:grid;place-items:center;margin:0;background:#161616}${CSS}</style></head><body>${MARKUP}</body></html>`;

export const ORBIT_STROKE_SNIPPETS = {
  html: HTML_PAGE,
  react: `const CSS = \`${CSS}\`;

export function OrbitStrokeButton({ label = "Send", className = "", ...props }) {
  return <><style>{CSS}</style><button type="button" className={["btn-orbit-stroke", className].filter(Boolean).join(" ")} {...props}><span>{label}</span></button></>;
}
`,
  node: `import { createServer } from "node:http";

const page = \`${HTML_PAGE}\`;

createServer((_request, response) => response.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page)).listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const ORBIT_STROKE_META = {
  id: "orbit-stroke",
  name: "Orbit stroke",
  blurb: "A minimal Send button whose thin gradient outline orbits smoothly on hover.",
  states: "idle, hover orbit, pressed, focus, disabled, reduced motion",
  keywords: [
    "orbit stroke", "send button", "gradient border", "animated outline",
    "conic gradient", "thin border", "black button", "white button",
    "hover border", "smooth stroke", "cta", "theme button",
    "animated button", "interactive button", "button microinteraction", "ui animation",
  ],
};
