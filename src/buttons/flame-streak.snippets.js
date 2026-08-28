import { FLAME_STREAK_LABEL, FLAME_STREAK_OPTIONS, flameGlow, flameReach } from "./flame-streak.js";

const CSS = `
.btn-fstreak-preview { display:grid; place-items:end center; width:100%; height:100%; padding:8px 12px 16px; overflow:visible; }
.btn-fstreak-wrap { display:inline-block; position:relative; isolation:isolate; width:max-content; max-width:100%; overflow:visible; }
.btn-fstreak-wrap > canvas[aria-hidden] { z-index:2; }
.btn-fstreak-btn {
  appearance:none; position:relative; z-index:0; display:inline-flex; align-items:center; justify-content:center; gap:10px;
  min-height:52px; padding:0 22px 0 16px; border:0; border-radius:999px;
  background:linear-gradient(180deg,#ffe7c4 0%,#ffc27a 46%,#ff9d4a 100%);
  color:#4a2308; font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
  font-size:16px; font-weight:600; letter-spacing:.01em; line-height:1; white-space:nowrap; cursor:pointer;
  box-shadow:0 1px 0 rgb(255 255 255 / 55%) inset, 0 8px 18px rgb(255 132 40 / 22%);
}
.btn-fstreak-fire { display:inline-flex; font-style:normal; font-size:20px; line-height:1; transform:translateY(1px); }
.btn-fstreak-btn:hover:not(:disabled) { background:linear-gradient(180deg,#ffefd4 0%,#ffcb8a 46%,#ffaa58 100%); }
.btn-fstreak-btn:active:not(:disabled) { transform:translateY(1px); }
.btn-fstreak-btn:focus { outline:none; }
.btn-fstreak-btn:focus-visible { outline:2px solid #c45c12; outline-offset:4px; }
.btn-fstreak-btn:disabled { cursor:not-allowed; opacity:.5; }
@media (prefers-reduced-motion: reduce) { .btn-fstreak-btn { transition:none; } }
`.trim();

const OPTIONS = JSON.stringify(FLAME_STREAK_OPTIONS);
const REACH = flameReach(FLAME_STREAK_OPTIONS);
const GLOW = flameGlow(FLAME_STREAK_OPTIONS);

const MARKUP = `<div class="btn-fstreak-wrap" id="flame-streak">
  <canvas data-flame-source layoutsubtree="true" style="position:absolute;inset:0;width:100%;height:100%"></canvas>
  <div data-flame-content>
    <button type="button" class="btn-fstreak-btn"><span class="btn-fstreak-fire" aria-hidden="true">🔥</span>${FLAME_STREAK_LABEL}</button>
  </div>
  <canvas data-flame-output aria-hidden style="position:absolute;z-index:2;top:-${REACH}px;right:-${GLOW}px;bottom:-${GLOW}px;left:-${GLOW}px;width:calc(100% + ${GLOW * 2}px);height:calc(100% + ${REACH + GLOW}px);pointer-events:none"></canvas>
</div>`;

const SCRIPT = `
import { createFlameWrap } from "./flame-wrap-engine.js";
const wrap = document.getElementById("flame-streak");
const source = wrap.querySelector("[data-flame-source]");
const content = wrap.querySelector("[data-flame-content]");
const output = wrap.querySelector("[data-flame-output]");
createFlameWrap({ source, content, output }, ${OPTIONS});
`.trim();

const HTML_PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Flame streak</title>
  <style>body{min-height:100vh;display:grid;place-items:center;margin:0;background:#141414;padding:80px 24px 32px}${CSS}</style>
</head>
<body>
  <!-- Keep flame-wrap-engine.js beside this HTML file (Canvas UI FlameWrap). -->
  ${MARKUP}
  <script type="module">${SCRIPT}</script>
</body>
</html>`;

export const FLAME_STREAK_SNIPPETS = {
  html: HTML_PAGE,
  react: `import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createFlameWrap, supportsHtmlInCanvas } from "./flame-wrap-engine.js";

const CSS = ${JSON.stringify(CSS)};
const OPTIONS = ${OPTIONS};
const emptySubscribe = () => () => {};

function FlameWrap({ children, className, style, ...options }) {
  const sourceRef = useRef(null);
  const contentRef = useRef(null);
  const outputRef = useRef(null);
  const instanceRef = useRef(null);
  const [initialOptions] = useState(options);
  const [failed, setFailed] = useState(false);
  const supported = useSyncExternalStore(emptySubscribe, supportsHtmlInCanvas, () => false);
  const native = supported && !failed;
  const reach = Math.round(Math.max(options.height ?? 170, 24) * 1.5) + 40;
  const glow = Math.round(Math.max(options.spread ?? 8, 8) * 3) + 16;
  useEffect(() => {
    const source = sourceRef.current;
    const content = contentRef.current;
    const output = outputRef.current;
    if (!source || !content || !output) return;
    instanceRef.current = createFlameWrap({ source, content, output }, initialOptions);
    if (native && !instanceRef.current) setFailed(true);
    return () => { instanceRef.current?.destroy(); instanceRef.current = null; };
  }, [initialOptions, native]);
  useEffect(() => { instanceRef.current?.setOptions(options); });
  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <canvas ref={sourceRef} layoutsubtree="true" style={native ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : { display: "none" }}>
        {native ? <div ref={contentRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}>{children}</div> : null}
      </canvas>
      {!native ? <div ref={contentRef} style={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}>{children}</div> : null}
      <canvas ref={outputRef} aria-hidden style={{ position: "absolute", zIndex: 2, top: -reach, right: -glow, bottom: -glow, left: -glow, width: \`calc(100% + \${glow * 2}px)\`, height: \`calc(100% + \${reach + glow}px)\`, pointerEvents: "none" }} />
    </div>
  );
}

export default function FlameStreakButton({ label = ${JSON.stringify(FLAME_STREAK_LABEL)}, disabled = false, onClick }) {
  return (
    <>
      <style>{CSS}</style>
      <FlameWrap className="btn-fstreak-wrap" {...OPTIONS}>
        <button type="button" className="btn-fstreak-btn" disabled={disabled} onClick={onClick}>
          <span className="btn-fstreak-fire" aria-hidden="true">🔥</span>
          {label}
        </button>
      </FlameWrap>
    </>
  );
}
`,
  node: `import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const page = ${JSON.stringify(HTML_PAGE)};
const engine = fileURLToPath(new URL("./flame-wrap-engine.js", import.meta.url));

createServer((request, response) => {
  if (request.url === "/") {
    return response.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page);
  }
  if (request.url === "/flame-wrap-engine.js") {
    response.writeHead(200, { "content-type": "text/javascript; charset=utf-8" });
    return createReadStream(engine).on("error", () => response.destroy()).pipe(response);
  }
  response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
}).listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const FLAME_STREAK_META = {
  id: "flame-streak",
  name: "Flame streak",
  blurb: "Helvetica Great Streak! pill with a fire emoji and Canvas UI fire hugging the button.",
  states: "idle, hover, focus, disabled, reduced motion",
  keywords: [
    "flame wrap",
    "fire button",
    "streak",
    "great streak",
    "helvetica button",
    "orange gradient",
    "emoji button",
    "canvas ui",
    "webgl fire",
    "heat distortion",
    "molten border",
    "sparks",
    "pill cta",
    "helvetica",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
