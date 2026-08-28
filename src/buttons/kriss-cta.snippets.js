const CSS = `
/* Put your licensed krissai-normal.woff2 beside this file and add a local @font-face if available. */
.kriss-cta { position: relative; box-sizing: border-box; display: inline-grid; width: 120px; height: 38px; padding: 10px 15px; border: 0; border-radius: 3px; place-items: center; margin: 0; background-color: rgba(255, 255, 255, .2); color: rgb(15, 15, 15); cursor: pointer; font: 400 12px/18px Krissai, Arial, sans-serif; letter-spacing: 0; transition: background-color 300ms ease; }
.kriss-cta:hover:not(:disabled), .kriss-cta:focus-visible:not(:disabled) { background-color: rgba(255, 255, 255, 1); }
.kriss-cta:focus-visible { outline: 1px solid rgba(255, 255, 255, .9); outline-offset: 3px; }
.kriss-cta:disabled { cursor: not-allowed; opacity: .5; }
.kriss-cta-border { position: absolute; inset: -11px; pointer-events: none; }
.kriss-cta-border svg { display: block; width: 142px; height: 60px; overflow: visible; }
.kriss-cta-border rect { fill: none; stroke-linecap: round; }
.kriss-cta-border .thick { stroke: white; stroke-width: 3; }
.kriss-cta-border .faint { stroke: rgba(255, 255, 255, .3); stroke-width: 1; }
@media (prefers-reduced-motion: reduce) { .kriss-cta { transition: none; } }
`.trim();

const MARKUP = `<button class="kriss-cta" type="button"><span>Learn More</span><span class="kriss-cta-border" aria-hidden="true"><svg width="142" height="60" viewBox="0 0 142 60" focusable="false"><rect class="thick" x="1.5" y="1.5" width="139" height="57" rx="8"/><rect class="thick" x="1.5" y="1.5" width="139" height="57" rx="8"/><rect class="faint" x="1.5" y="1.5" width="139" height="57" rx="8"/><rect class="faint" x="1.5" y="1.5" width="139" height="57" rx="8"/></svg></span></button>`;

const MOTION = `
const button = document.querySelector(".kriss-cta");
const rects = [...button.querySelectorAll("rect")];
const FPS = 70;
const EASE = 0.1;
const perimeter = rects[0].getTotalLength();
const dashLength = Math.PI * 4 + 20;
const targets = (active) => active
  ? { first: -45.21681469282042, second: -234.1875146928204 }
  : { first: 22.566370614359172, second: 22.566370614359172 - perimeter * .5 };
let frame = targets(false);
let hovered = false;
let focused = false;
let lastTime = 0;
let animationFrame = 0;
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
function write(next) {
  const faintOneLength = -next.second + next.first - 20 - dashLength;
  const faintTwoLength = perimeter + next.second - next.first - 20 - dashLength;
  rects[0].style.cssText = "stroke-dasharray:" + dashLength + ", " + (perimeter - dashLength) + ";stroke-dashoffset:" + next.first;
  rects[1].style.cssText = "stroke-dasharray:" + dashLength + ", " + (perimeter - dashLength) + ";stroke-dashoffset:" + next.second;
  rects[2].style.cssText = "stroke-dasharray:" + faintOneLength + ", " + (perimeter - faintOneLength) + ";stroke-dashoffset:" + (next.first - dashLength - 10);
  rects[3].style.cssText = "stroke-dasharray:" + faintTwoLength + ", " + (perimeter - faintTwoLength) + ";stroke-dashoffset:" + (next.second - dashLength - 10 + perimeter * 2);
}
function target() { return targets((hovered || focused) && !button.disabled); }
function tick(time) {
  if (time - lastTime >= 1000 / FPS) {
    const next = target();
    frame = { first: frame.first + (next.first - frame.first) * EASE, second: frame.second + (next.second - frame.second) * EASE };
    write(frame); lastTime = time;
  }
  animationFrame = requestAnimationFrame(tick);
}
function sync() { frame = target(); write(frame); }
function start() { cancelAnimationFrame(animationFrame); reducedMotion.matches ? sync() : (animationFrame = requestAnimationFrame(tick)); }
button.addEventListener("mouseenter", () => { hovered = true; if (reducedMotion.matches) sync(); });
button.addEventListener("mouseleave", () => { hovered = false; if (reducedMotion.matches) sync(); });
button.addEventListener("focus", () => { focused = true; if (reducedMotion.matches) sync(); });
button.addEventListener("blur", () => { focused = false; if (reducedMotion.matches) sync(); });
reducedMotion.addEventListener("change", start);
start();
window.addEventListener("pagehide", () => { cancelAnimationFrame(animationFrame); reducedMotion.removeEventListener("change", start); }, { once: true });
`.trim();

const HTML_PAGE = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Kriss CTA</title><style>body { min-height: 100vh; display: grid; place-items: center; margin: 0; background: #121315; }\n${CSS}</style></head><body>${MARKUP}<script>${MOTION}</script></body></html>`;

export const KRISS_CTA_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef, useState } from "react";

const CSS = ${JSON.stringify(CSS)};

export default function KrissCtaButton({ disabled = false, onClick }) {
  const refs = useRef([]);
  const frameRef = useRef(null);
  const perimeterRef = useRef(null);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const disabledRef = useRef(disabled);
  const syncRef = useRef(() => {});
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReducedMotion(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    disabledRef.current = disabled;
    if (reducedMotion) syncRef.current();
  }, [disabled, reducedMotion]);

  useEffect(() => {
    const [first, second, faintOne, faintTwo] = refs.current;
    if (!first || !second || !faintOne || !faintTwo) return undefined;
    const FPS = 70;
    const EASE = 0.1;
    const perimeter = perimeterRef.current ?? first.getTotalLength();
    perimeterRef.current = perimeter;
    const dashLength = Math.PI * 4 + 20;
    const targets = (hover) => hover ? { first: -45.21681469282042, second: -234.1875146928204 } : { first: 22.566370614359172, second: 22.566370614359172 - perimeter * .5 };
    frameRef.current ??= targets(false);
    let lastTime = 0, animationFrame;
    const write = (next) => {
      const faintOneLength = -next.second + next.first - 20 - dashLength;
      const faintTwoLength = perimeter + next.second - next.first - 20 - dashLength;
      [[first, dashLength, next.first], [second, dashLength, next.second], [faintOne, faintOneLength, next.first - dashLength - 10], [faintTwo, faintTwoLength, next.second - dashLength - 10 + perimeter * 2]].forEach(([rect, length, offset]) => { rect.style.strokeDasharray = length + ", " + (perimeter - length); rect.style.strokeDashoffset = offset; });
    };
    const target = () => targets((hoverRef.current || focusRef.current) && !disabledRef.current);
    const sync = () => { frameRef.current = target(); write(frameRef.current); };
    syncRef.current = sync;
    if (reducedMotion) { sync(); return () => { syncRef.current = () => {}; }; }
    write(frameRef.current);
    const tick = (time) => { if (time - lastTime >= 1000 / FPS) { const next = target(); frameRef.current = { first: frameRef.current.first + (next.first - frameRef.current.first) * EASE, second: frameRef.current.second + (next.second - frameRef.current.second) * EASE }; write(frameRef.current); lastTime = time; } animationFrame = requestAnimationFrame(tick); };
    animationFrame = requestAnimationFrame(tick);
    return () => { syncRef.current = () => {}; cancelAnimationFrame(animationFrame); };
  }, [reducedMotion]);

  return <><style>{CSS}</style><button className="kriss-cta" type="button" disabled={disabled} onClick={onClick} onMouseEnter={() => { hoverRef.current = true; if (reducedMotion) syncRef.current(); }} onMouseLeave={() => { hoverRef.current = false; if (reducedMotion) syncRef.current(); }} onFocus={() => { focusRef.current = true; if (reducedMotion) syncRef.current(); }} onBlur={() => { focusRef.current = false; if (reducedMotion) syncRef.current(); }}><span>Learn More</span><span className="kriss-cta-border" aria-hidden="true"><svg width="142" height="60" viewBox="0 0 142 60" focusable="false"><rect ref={(node) => { refs.current[0] = node; }} className="thick" x="1.5" y="1.5" width="139" height="57" rx="8" /><rect ref={(node) => { refs.current[1] = node; }} className="thick" x="1.5" y="1.5" width="139" height="57" rx="8" /><rect ref={(node) => { refs.current[2] = node; }} className="faint" x="1.5" y="1.5" width="139" height="57" rx="8" /><rect ref={(node) => { refs.current[3] = node; }} className="faint" x="1.5" y="1.5" width="139" height="57" rx="8" /></svg></span></button></>;
}
`,
  node: `import { createServer } from "node:http";

const page = String.raw\`${HTML_PAGE}\`;

createServer((_req, res) => res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page)).listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const KRISS_CTA_META = {
  id: "kriss-cta",
  name: "Stoke Move",
  blurb: "Glass CTA with source-faithful segmented border choreography.",
  states: "idle, hover, focus, disabled, reduced motion",
  keywords: [
    "kriss cta",
    "stoke move",
    "stroke move",
    "glass cta",
    "segmented border",
    "border choreography",
    "glass button",
    "stroke animation",
    "segmented stroke",
    "frosted cta",
    "border dance",
    "krissai",
    "hover stroke",
    "glass panel",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
