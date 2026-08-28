const CSS = `
.btn-ascii-scramble-button {
  --ascii-surface: #ffffff;
  --ascii-ink: #111111;
  --ascii-active-surface: #000000;
  --ascii-active-ink: #ffffff;
  appearance: none;
  position: relative;
  display: grid;
  width: 172px;
  height: 90px;
  place-items: center;
  padding: 0;
  overflow: hidden;
  border: 0;
  background-color: var(--ascii-surface);
  color: var(--ascii-ink);
  cursor: pointer;
  font-family: "IBM Plex Mono", monospace;
  transition: background-color 420ms cubic-bezier(0.22, 1, 0.36, 1), color 420ms cubic-bezier(0.22, 1, 0.36, 1);
  touch-action: manipulation;
  user-select: none;
}
[data-theme="dark"] .btn-ascii-scramble-button { --ascii-surface: #000000; --ascii-ink: #ffffff; --ascii-active-surface: #ffffff; --ascii-active-ink: #111111; }
.btn-ascii-scramble-button.is-active { background-color: var(--ascii-active-surface); color: var(--ascii-active-ink); }
.btn-ascii-scramble-visual { display: flex; gap: 1.3ch; align-items: center; font-size: 16px; font-weight: 600; letter-spacing: .05em; line-height: 1; }
.btn-ascii-scramble-label { display: flex; flex: 0 0 4ch; width: 4ch; min-height: 1em; white-space: nowrap; font-variant-ligatures: none; }
.btn-ascii-scramble-cell { display: block; flex: 0 0 1ch; width: 1ch; height: 1em; line-height: 1; text-align: center; }
.btn-ascii-scramble-symbol { white-space: nowrap; }
.btn-ascii-scramble-button:focus { outline: none; }
.btn-ascii-scramble-button:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.btn-ascii-scramble-button:disabled { cursor: not-allowed; opacity: .46; }
@media (prefers-reduced-motion: reduce) { .btn-ascii-scramble-button { transition: none; } }
`.trim();

const MARKUP = `<button type="button" class="btn-ascii-scramble-button" aria-label="WORK"><span class="btn-ascii-scramble-visual" aria-hidden="true"><span class="btn-ascii-scramble-label"><span class="btn-ascii-scramble-cell">W</span><span class="btn-ascii-scramble-cell">O</span><span class="btn-ascii-scramble-cell">R</span><span class="btn-ascii-scramble-cell">K</span></span><span class="btn-ascii-scramble-symbol">( + )</span></span></button>`;

const INTERACTION = `
const glyphs = "#*?>%0";
const duration = 720;
const button = document.querySelector(".btn-ascii-scramble-button");
const cells = button.querySelectorAll(".btn-ascii-scramble-cell");
let frame = 0;
let active = false;
let hover = false;
let focus = false;
function cancelAnimation() { if (frame) cancelAnimationFrame(frame); frame = 0; }
function restore() { cells.forEach((cell, index) => { cell.textContent = "WORK"[index]; }); }
function setActive(next) {
  cancelAnimation();
  active = next && !button.disabled;
  button.classList.toggle("is-active", active);
  if (!active || matchMedia("(prefers-reduced-motion: reduce)").matches) return restore();
  const startedAt = performance.now();
  const frameInterval = 1000 / 30;
  let lastTextUpdate = -Infinity;
  let tick = 0;
  function render(now) {
    if (!active) return;
    const progress = Math.min(1, (now - startedAt) / duration);
    if (now - lastTextUpdate >= frameInterval || progress === 1) {
      const frameText = [..."WORK"].map((character, index) => index < Math.floor(4 * progress) ? character : glyphs[(index + tick) % glyphs.length]);
      cells.forEach((cell, index) => { cell.textContent = frameText[index]; });
      lastTextUpdate = now;
      tick += 1;
    }
    if (progress < 1) frame = requestAnimationFrame(render);
    else frame = 0;
  }
  frame = requestAnimationFrame(render);
}
function sync() { setActive(hover || focus); }
button.addEventListener("pointerenter", (event) => { if (event.pointerType !== "touch") { hover = true; sync(); } });
button.addEventListener("pointerleave", (event) => { if (event.pointerType !== "touch") { hover = false; sync(); } });
button.addEventListener("focus", () => { focus = button.matches(":focus-visible"); sync(); });
button.addEventListener("blur", () => { focus = false; sync(); });
`.trim();

const HTML_PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ASCII scramble</title><style>body{min-height:100vh;display:grid;place-items:center;margin:0;background:#f4f2ee}${CSS}</style></head>
<body>${MARKUP}<script>${INTERACTION}</script></body></html>`;

export const ASCII_SCRAMBLE_SNIPPETS = {
  html: HTML_PAGE,
  react: `import { useEffect, useRef, useState } from "react";

const CSS = ${JSON.stringify(CSS)};
const glyphs = "#*?>%0";
const duration = 720;

export default function AsciiScrambleButton({ label = "WORK", disabled = false, onClick }) {
  const [active, setActive] = useState(false);
  const [displayedLabel, setDisplayedLabel] = useState(label);
  const frameRef = useRef(0);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const activeRef = useRef(false);
  const cancelAnimation = () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); frameRef.current = 0; };
  const setInteraction = (next) => {
    cancelAnimation();
    activeRef.current = next && !disabled;
    setActive(activeRef.current);
    if (!activeRef.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return setDisplayedLabel(label);
    const startedAt = performance.now();
    const frameInterval = 1000 / 30;
    let lastTextUpdate = -Infinity;
    let tick = 0;
    const renderFrame = (now) => {
      if (!activeRef.current) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      if (now - lastTextUpdate >= frameInterval || progress === 1) {
        setDisplayedLabel([...label].map((character, index) => index < Math.floor(label.length * progress) ? character : glyphs[(index + tick) % glyphs.length]).join(""));
        lastTextUpdate = now;
        tick += 1;
      }
      if (progress < 1) frameRef.current = requestAnimationFrame(renderFrame);
      else frameRef.current = 0;
    };
    frameRef.current = requestAnimationFrame(renderFrame);
  };
  const sync = () => setInteraction(hoverRef.current || focusRef.current);
  useEffect(() => { if (disabled) { hoverRef.current = false; focusRef.current = false; setInteraction(false); } else if (!activeRef.current) setDisplayedLabel(label); }, [disabled, label]);
  useEffect(() => () => cancelAnimation(), []);
  return <><style>{CSS}</style><button type="button" className={"btn-ascii-scramble-button" + (active ? " is-active" : "")} disabled={disabled} aria-label={label} onPointerEnter={(event) => { if (event.pointerType !== "touch") { hoverRef.current = true; sync(); } }} onPointerLeave={(event) => { if (event.pointerType !== "touch") { hoverRef.current = false; sync(); } }} onFocus={(event) => { focusRef.current = event.currentTarget.matches(":focus-visible"); sync(); }} onBlur={() => { focusRef.current = false; sync(); }} onClick={onClick}><span className="btn-ascii-scramble-visual" aria-hidden="true"><span className="btn-ascii-scramble-label">{[...displayedLabel].map((character, index) => <span key={index} className="btn-ascii-scramble-cell">{character}</span>)}</span><span className="btn-ascii-scramble-symbol">( + )</span></span></button></>;
}
`,
  node: `import { createServer } from "node:http";

const page = ${JSON.stringify(HTML_PAGE)};

createServer((request, response) => {
  if (request.url !== "/") return response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
  response.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page);
}).listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const ASCII_SCRAMBLE_META = {
  id: "ascii-scramble",
  name: "ASCII scramble",
  blurb: "Theme-aware monochrome inversion with a smooth deterministic text scramble.",
  states: "idle, hover, focus, disabled, reduced motion",
  keywords: [
    "ascii scramble",
    "text scramble",
    "monochrome invert",
    "theme aware",
    "deterministic scramble",
    "letter scramble",
    "ascii glitch",
    "invert hover",
    "scramble text",
    "mono inversion",
    "decode scramble",
    "character shuffle",
    "ascii hover",
    "smooth scramble",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
