const CSS = `
/* Put your licensed krissai-normal.woff2 beside this file and add a local @font-face if available. */
.stroke-move-group { position:relative; display:grid; width:360px; height:38px; grid-template-columns:repeat(3,120px); border-radius:3px; }
.stroke-move-group button { position:relative; box-sizing:border-box; width:120px; height:38px; padding:10px 15px; border:0; margin:0; background-color:rgba(255,255,255,.2); color:rgb(15,15,15); cursor:pointer; font:400 12px/18px Krissai,Arial,sans-serif; transition:background-color 300ms ease,color 300ms ease; }
.stroke-move-group button:first-child { border-radius:3px 0 0 3px; }
.stroke-move-group button:last-of-type { border-radius:0 3px 3px 0; }
.stroke-move-group button:hover,.stroke-move-group:not(:hover) button:focus-visible { z-index:1; background-color:white; color:rgb(15,15,15); }
.stroke-move-group button:focus-visible { z-index:1; outline:1px solid rgba(255,255,255,.9); outline-offset:-2px; }
.stroke-move-border { position:absolute; inset:-11px; pointer-events:none; }
.stroke-move-border svg { display:block; width:382px; height:60px; overflow:visible; }
.stroke-move-border rect { fill:none; stroke-linecap:round; }
.stroke-move-border .thick { stroke:white; stroke-width:3; }
.stroke-move-border .faint { stroke:rgba(255,255,255,.3); stroke-width:1; }
html[data-theme="light"] .stroke-move-group button { background-color:#222326; color:#f3f4f6; }
html[data-theme="light"] .stroke-move-group button:hover,html[data-theme="light"] .stroke-move-group:not(:hover) button:focus-visible { background-color:#050505; color:#fff; }
html[data-theme="light"] .stroke-move-group button:focus-visible { outline-color:#050505; }
html[data-theme="light"] .stroke-move-border .thick { stroke:#050505; }
html[data-theme="light"] .stroke-move-border .faint { stroke:rgba(0,0,0,.3); }
@media (prefers-reduced-motion:reduce) { .stroke-move-group button { transition:none; } }
`.trim();

const MARKUP = `<div class="stroke-move-group" role="group" aria-label="Creative workflow"><button type="button" data-index="0">Design</button><button type="button" data-index="1">Build</button><button type="button" data-index="2">Launch</button><span class="stroke-move-border" aria-hidden="true"><svg width="382" height="60" viewBox="0 0 382 60" focusable="false"><rect class="thick" x="1.5" y="1.5" width="379" height="57" rx="8"/><rect class="thick" x="1.5" y="1.5" width="379" height="57" rx="8"/><rect class="faint" x="1.5" y="1.5" width="379" height="57" rx="8"/><rect class="faint" x="1.5" y="1.5" width="379" height="57" rx="8"/></svg></span></div>`;

const MOTION = `
const group = document.querySelector(".stroke-move-group");
const buttons = [...group.querySelectorAll("button")];
const rects = [...group.querySelectorAll("rect")];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const perimeter = rects[0].getTotalLength();
const dashLength = Math.PI * 4 + 20;
const idleFirst = Math.PI * 4 + 10;
let hoverIndex = -1;
let focusIndex = -1;
let frame = target(-1);
let lastTime = 0;
let animationFrame = 0;

function target(index) {
  if (index < 0) return { first:idleFirst, second:idleFirst-perimeter/2 };
  const delta = 120 * (index - 1);
  const topCenterPath = 181.5;
  return { first:dashLength/2-(topCenterPath+delta), second:dashLength/2-(topCenterPath+perimeter/2-delta) };
}
function activeIndex() { return hoverIndex >= 0 ? hoverIndex : focusIndex; }
function write(next) {
  const faintOneLength = -next.second + next.first - 20 - dashLength;
  const faintTwoLength = perimeter + next.second - next.first - 20 - dashLength;
  [[rects[0],dashLength,next.first],[rects[1],dashLength,next.second],[rects[2],faintOneLength,next.first-dashLength-10],[rects[3],faintTwoLength,next.second-dashLength-10+perimeter*2]].forEach(([rect,length,offset]) => {
    rect.style.strokeDasharray = length + ", " + (perimeter - length);
    rect.style.strokeDashoffset = offset;
  });
}
function sync() { frame = target(activeIndex()); write(frame); }
function tick(time) {
  if (time - lastTime >= 1000 / 70) {
    const next = target(activeIndex());
    frame = { first:frame.first+(next.first-frame.first)*.1, second:frame.second+(next.second-frame.second)*.1 };
    write(frame);
    lastTime = time;
  }
  animationFrame = requestAnimationFrame(tick);
}
function restart() {
  cancelAnimationFrame(animationFrame);
  reducedMotion.matches ? sync() : (animationFrame = requestAnimationFrame(tick));
}
buttons.forEach((button, index) => {
  button.addEventListener("mouseenter", () => { hoverIndex=index; if (reducedMotion.matches) sync(); });
  button.addEventListener("focus", () => { focusIndex=button.matches(":focus-visible") ? index : -1; if (reducedMotion.matches) sync(); });
  button.addEventListener("blur", () => { focusIndex=-1; if (reducedMotion.matches) sync(); });
});
group.addEventListener("mouseleave", () => {
  hoverIndex = -1;
  const focused = group.querySelector(":focus-visible");
  focusIndex = focused ? Number(focused.dataset.index) : -1;
  if (reducedMotion.matches) sync();
});
reducedMotion.addEventListener("change", restart);
restart();
window.addEventListener("pagehide", () => { cancelAnimationFrame(animationFrame); reducedMotion.removeEventListener("change", restart); }, { once:true });
`.trim();

const HTML_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Stroke Move 2.0</title><style>body{min-height:100vh;display:grid;place-items:center;margin:0;background:#121315}\n${CSS}</style></head><body>${MARKUP}<script>${MOTION}</script></body></html>`;

export const STROKE_MOVE_GROUP_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import { useEffect, useRef, useState } from "react";

const CSS = ${JSON.stringify(CSS)};
const LABELS = ["Design", "Build", "Launch"];

export default function StrokeMoveGroup({ onSelect }) {
  const groupRef = useRef(null);
  const rects = useRef([]);
  const frame = useRef(null);
  const perimeter = useRef(null);
  const hover = useRef(-1);
  const focus = useRef(-1);
  const sync = useRef(() => {});
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const nodes = rects.current;
    const p = perimeter.current ?? nodes[0].getTotalLength();
    perimeter.current = p;
    const dash = Math.PI * 4 + 20;
    const target = (index) => {
      if (index < 0) { const first=Math.PI*4+10; return { first,second:first-p/2 }; }
      const delta=120*(index-1), topCenterPath=181.5;
      return { first:dash/2-(topCenterPath+delta),second:dash/2-(topCenterPath+p/2-delta) };
    };
    const active = () => hover.current >= 0 ? hover.current : focus.current;
    const write = (next) => {
      const a=-next.second+next.first-20-dash, b=p+next.second-next.first-20-dash;
      [[nodes[0],dash,next.first],[nodes[1],dash,next.second],[nodes[2],a,next.first-dash-10],[nodes[3],b,next.second-dash-10+p*2]].forEach(([node,length,offset]) => { node.style.strokeDasharray=length+", "+(p-length); node.style.strokeDashoffset=offset; });
    };
    frame.current ??= target(-1);
    sync.current = () => { frame.current=target(active()); write(frame.current); };
    if (reduced) { sync.current(); return () => { sync.current=()=>{}; }; }
    let raf=0, last=0;
    const tick = (time) => { if (time-last>=1000/70) { const next=target(active()); frame.current={first:frame.current.first+(next.first-frame.current.first)*.1,second:frame.current.second+(next.second-frame.current.second)*.1}; write(frame.current); last=time; } raf=requestAnimationFrame(tick); };
    write(frame.current); raf=requestAnimationFrame(tick);
    return () => { sync.current=()=>{}; cancelAnimationFrame(raf); };
  }, [reduced]);

  const syncReduced = () => { if (reduced) sync.current(); };
  return <><style>{CSS}</style><div ref={groupRef} className="stroke-move-group" role="group" aria-label="Creative workflow" onMouseLeave={() => { hover.current=-1; const focused=groupRef.current.querySelector(":focus-visible"); focus.current=focused ? Number(focused.dataset.index) : -1; syncReduced(); }}>{LABELS.map((label,index) => <button key={label} type="button" data-index={index} onClick={(event) => onSelect?.(label,index,event)} onMouseEnter={() => { hover.current=index; syncReduced(); }} onFocus={(event) => { focus.current=event.currentTarget.matches(":focus-visible") ? index : -1; syncReduced(); }} onBlur={() => { focus.current=-1; syncReduced(); }}>{label}</button>)}<span className="stroke-move-border" aria-hidden="true"><svg width="382" height="60" viewBox="0 0 382 60" focusable="false">{["thick","thick","faint","faint"].map((kind,index) => <rect key={index} ref={(node) => { rects.current[index]=node; }} className={kind} x="1.5" y="1.5" width="379" height="57" rx="8" />)}</svg></span></div></>;
}
`,
  node: `import { createServer } from "node:http";\n\nconst page = String.raw\`${HTML_PAGE}\`;\n\ncreateServer((_req,res) => res.writeHead(200,{"content-type":"text/html; charset=utf-8"}).end(page)).listen(3000,() => console.log("http://localhost:3000"));\n`,
};

export const STROKE_MOVE_GROUP_META = {
  id: "stroke-move-2",
  name: "Stroke Move 2.0",
  blurb: "Three-button control with a shared segmented stroke that follows intent.",
  states: "idle, hover per option, focus, reduced motion",
  keywords: [
    "stroke move 2",
    "stroke move",
    "segmented stroke",
    "three button",
    "button group",
    "shared stroke",
    "intent follow",
    "control group",
    "outline follow",
    "tab stroke",
    "option group",
    "stroke chase",
    "segmented border",
    "multi button",
    "stroke move 2.0",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
