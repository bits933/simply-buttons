const CSS = `
.context-window-button {
  --context-bg:#f2f0f7; --context-bg-hover:#ebe8f4; --context-ink:#2c2835; --context-track:#d5cfdf; --context-arc:#7057a8;
  --context-dot-base:#d8cfee; --context-dot-fill:#fff; --context-dot-dense:#7057a8; --context-shimmer-base:#2c2835; --context-shimmer-accent:#7057a8;
  --context-ease-out:cubic-bezier(.23,1,.32,1); --context-ease-in-out:cubic-bezier(.77,0,.175,1);
  position:relative; isolation:isolate; display:inline-grid; box-sizing:border-box; height:38px; padding:0 12px; place-items:center; overflow:hidden;
  border:1px solid color-mix(in srgb,var(--context-ink) 11%,transparent); border-radius:999px; appearance:none; background:var(--context-bg);
  box-shadow:inset 0 1px 0 rgb(255 255 255/.62); color:var(--context-ink); cursor:pointer; font-family:inherit; font-size:12px; font-weight:500; line-height:1; white-space:nowrap;
  -webkit-tap-highlight-color:transparent; transition:background-color 160ms ease,border-color 160ms ease,transform 140ms var(--context-ease-out);
}
.context-window-button__idle { display:inline-flex; grid-area:1/1; align-items:center; gap:8px; opacity:1; transform:translateX(0); transition:opacity 220ms var(--context-ease-out),transform 220ms var(--context-ease-out); }
.context-window-button__pie { display:block; width:17px; height:17px; flex:0 0 17px; overflow:visible; }
.context-window-button__track,.context-window-button__arc { fill:none; stroke-width:2.5; }
.context-window-button__track { stroke:var(--context-track); }
.context-window-button__arc { stroke:var(--context-arc); stroke-linecap:round; transition:stroke-dashoffset 520ms var(--context-ease-in-out); }
.context-window-button__readout { font-variant-numeric:tabular-nums; letter-spacing:-.015em; }
.context-window-button__matrix { position:absolute; z-index:1; inset:4px 5px; overflow:hidden; contain:paint; opacity:0; pointer-events:none; transition:opacity 420ms var(--context-ease-out); }
.context-window-button__dot-field { position:absolute; inset:0; opacity:.14; background-image:radial-gradient(circle at center,var(--context-dot-base) 0 .7px,transparent 1.05px); background-size:6px 6px; }
.context-window-button__dot-fill { position:absolute; inset:0 auto 0 0; width:0; opacity:.26; background-image:radial-gradient(circle at center,var(--context-dot-fill) 0 .7px,transparent 1.05px); background-size:6px 6px; }
.context-window-button__dot-field,.context-window-button__dot-fill { -webkit-mask-image:linear-gradient(90deg,#000 0 20%,rgb(0 0 0/.92) 36%,rgb(0 0 0/.62) 67%,rgb(0 0 0/.32) 86%,rgb(0 0 0/.18) 100%); mask-image:linear-gradient(90deg,#000 0 20%,rgb(0 0 0/.92) 36%,rgb(0 0 0/.62) 67%,rgb(0 0 0/.32) 86%,rgb(0 0 0/.18) 100%); }
.context-window-button__dot-fill::after { content:""; position:absolute; inset:0 0 0 auto; width:12px; opacity:.34; background-image:radial-gradient(circle at center,var(--context-dot-dense) 0 .65px,transparent .95px); background-size:3px 3px; }
.context-window-button__status { position:absolute; z-index:2; inset:0; display:grid; place-items:center; pointer-events:none; }
.context-window-button__label { grid-area:1/1; opacity:0; font-weight:650; letter-spacing:-.01em; transition:opacity 420ms var(--context-ease-out); }
.context-window-button__label--compressing { color:var(--context-shimmer-base); background:linear-gradient(100deg,var(--context-shimmer-base) 0%,var(--context-shimmer-base) 35%,var(--context-shimmer-accent) 50%,var(--context-shimmer-base) 65%,var(--context-shimmer-base) 100%); background-size:220% 100%; background-clip:text; -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.context-window-button[data-phase="exiting"] .context-window-button__idle,.context-window-button[data-phase="compressing"] .context-window-button__idle,.context-window-button[data-phase="compressed"] .context-window-button__idle { opacity:0; transform:translateX(10px); }
.context-window-button[data-phase="returning"] .context-window-button__idle { opacity:1; transform:translateX(0); }
.context-window-button[data-phase="compressing"] .context-window-button__matrix { opacity:1; }
.context-window-button[data-phase="compressing"] .context-window-button__dot-fill { animation:context-dot-fill 3s var(--context-ease-in-out) both; }
.context-window-button[data-phase="compressed"] .context-window-button__dot-fill { width:100%; }
.context-window-button[data-phase="compressing"] .context-window-button__label--compressing,.context-window-button[data-phase="compressed"] .context-window-button__label--compressed { opacity:1; }
.context-window-button[data-phase="compressing"] .context-window-button__label--compressing { animation:context-text-shimmer 1.8s ease-in-out infinite; }
.context-window-button[data-phase="compressed"] .context-window-button__label--compressed { color:var(--context-ink); animation:context-compressed-pop 600ms var(--context-ease-out) both; }
.context-window-button[data-phase="idle"]:active { transform:scale(.98); }
.context-window-button:focus-visible { outline:2px solid var(--context-arc); outline-offset:3px; }
@media (hover:hover) and (pointer:fine) { .context-window-button[data-phase="idle"]:hover { background:var(--context-bg-hover); } }
@keyframes context-dot-fill { from { width:0; } to { width:100%; } }
@keyframes context-text-shimmer { to { background-position:-220% 0; } }
@keyframes context-compressed-pop { 0% { opacity:0; transform:scale(.82); } 55% { opacity:1; transform:scale(1.08); } 100% { opacity:1; transform:scale(1); } }
@media (prefers-color-scheme:dark) { .context-window-button { --context-bg:#211d2a; --context-bg-hover:#2a2436; --context-ink:#f0ebfa; --context-track:#4b405c; --context-arc:#c6adff; --context-dot-base:#514562; --context-dot-fill:#f8f6ff; --context-dot-dense:#c6adff; --context-shimmer-base:#f8f6ff; --context-shimmer-accent:#c8b5ff; box-shadow:inset 0 1px 0 rgb(255 255 255/.07); } }
:root[data-theme="light"] .context-window-button { --context-bg:#f2f0f7; --context-bg-hover:#ebe8f4; --context-ink:#2c2835; --context-track:#d5cfdf; --context-arc:#7057a8; --context-dot-base:#d8cfee; --context-dot-fill:#fff; --context-dot-dense:#7057a8; --context-shimmer-base:#2c2835; --context-shimmer-accent:#7057a8; box-shadow:inset 0 1px 0 rgb(255 255 255/.62); }
:root[data-theme="dark"] .context-window-button { --context-bg:#211d2a; --context-bg-hover:#2a2436; --context-ink:#f0ebfa; --context-track:#4b405c; --context-arc:#c6adff; --context-dot-base:#514562; --context-dot-fill:#f8f6ff; --context-dot-dense:#c6adff; --context-shimmer-base:#f8f6ff; --context-shimmer-accent:#c8b5ff; box-shadow:inset 0 1px 0 rgb(255 255 255/.07); }
@media (prefers-reduced-motion:reduce) { .context-window-button,.context-window-button__idle,.context-window-button__arc,.context-window-button__label { transform:none!important; } .context-window-button__matrix { display:none; } .context-window-button__idle,.context-window-button__label,.context-window-button__arc { transition:opacity 200ms ease!important; animation:none!important; } }
`.trim();

const MARKUP = `<button type="button" class="context-window-button" data-phase="idle" aria-label="Context 200K of 1M, compress" aria-busy="false"><span class="context-window-button__idle" aria-hidden="true"><svg class="context-window-button__pie" viewBox="0 0 18 18"><circle class="context-window-button__track" cx="9" cy="9" r="6.5"></circle><circle class="context-window-button__arc" cx="9" cy="9" r="6.5" transform="rotate(-90 9 9)"></circle></svg><span class="context-window-button__readout">200K / 1M</span></span><span class="context-window-button__matrix" aria-hidden="true"><span class="context-window-button__dot-field"></span><span class="context-window-button__dot-fill"></span></span><span class="context-window-button__status" aria-hidden="true"><span class="context-window-button__label context-window-button__label--compressing">compressing</span><span class="context-window-button__label context-window-button__label--compressed">compressed</span></span></button>`;

const BROWSER_JS = `
const usedTokens=200000,maxTokens=1000000,length=2*Math.PI*6.5;
const button=document.querySelector('.context-window-button'),arc=button.querySelector('.context-window-button__arc'),readout=button.querySelector('.context-window-button__readout');
let used=usedTokens,busy=false;
const format=value=>value>=1000000?Number((value/1000000).toFixed(1))+'M':value>=1000?Number((value/1000).toFixed(1))+'K':String(Math.round(value));
arc.setAttribute('stroke-dasharray',length);render();
function render(){const usedRatio=used/maxTokens;arc.setAttribute('stroke-dashoffset',length*(1-usedRatio));readout.textContent=format(used)+' / '+format(maxTokens);button.setAttribute('aria-label','Context '+format(used)+' of '+format(maxTokens)+', compress')}
function phase(value){button.dataset.phase=value}
function beginReturn(next){used=next;render();phase('returning')}
function finish(){phase('idle');button.setAttribute('aria-busy','false');busy=false;button.dispatchEvent(new CustomEvent('compress',{bubbles:true}))}
button.addEventListener('click',()=>{if(busy)return;busy=true;button.style.width=button.getBoundingClientRect().width+'px';button.setAttribute('aria-busy','true');const next=10000,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduce){phase('compressing');setTimeout(()=>phase('compressed'),500);setTimeout(()=>beginReturn(next),1100);setTimeout(finish,1350);return}phase('exiting');setTimeout(()=>phase('compressing'),220);setTimeout(()=>phase('compressed'),3220);setTimeout(()=>beginReturn(next),4120);setTimeout(finish,4700)});
`.trim();

const HTML_PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Context compression button</title>
  <style>html{color-scheme:light dark}body{min-height:100vh;display:grid;place-items:center;margin:0;background:Canvas;color:CanvasText;font-family:system-ui,sans-serif}${CSS}</style>
</head>
<body>
  ${MARKUP}
  <script>${BROWSER_JS}</script>
</body>
</html>`;

const REACT = `"use client";

import { useEffect, useRef, useState } from "react";

type Props = { usedTokens?: number; maxTokens?: number; onCompress?: () => void };
type Phase = "idle" | "exiting" | "compressing" | "compressed" | "returning";

const CSS=${JSON.stringify(CSS)};
const CIRCLE_LENGTH=2*Math.PI*6.5;
const clampTokens=(value:number,max:number)=>Math.min(max,Math.max(0,Number.isFinite(value)?value:0));
const formatTokens=(value:number)=>value>=1_000_000?\`${"${Number((value/1_000_000).toFixed(1))}"}M\`:value>=1_000?\`${"${Number((value/1_000).toFixed(1))}"}K\`:String(Math.round(value));

export default function ContextWindowStatusButton({usedTokens=200_000,maxTokens=1_000_000,onCompress}:Props){
  const safeMax=Math.max(1,Number.isFinite(maxTokens)?maxTokens:1_000_000);
  const [currentUsed,setCurrentUsed]=useState(()=>clampTokens(usedTokens,safeMax));
  const [phase,setPhase]=useState<Phase>("idle"),[lockedWidth,setLockedWidth]=useState<number|null>(null);
  const buttonRef=useRef<HTMLButtonElement>(null),busyRef=useRef(false),timers=useRef<number[]>([]);
  const usedRatio=currentUsed/safeMax;
  useEffect(()=>()=>timers.current.forEach(window.clearTimeout),[]);
  const schedule=(callback:()=>void,delay:number)=>timers.current.push(window.setTimeout(callback,delay));
  function beginReturn(nextUsed:number){setCurrentUsed(nextUsed);setPhase("returning")}
  function finish(){setPhase("idle");busyRef.current=false;timers.current=[];onCompress?.()}
  function handleClick(){
    if(busyRef.current)return;busyRef.current=true;
    setLockedWidth(width=>width??buttonRef.current?.getBoundingClientRect().width??null);
    const nextUsed=Math.round(safeMax*.01),reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(reduceMotion){setPhase("compressing");schedule(()=>setPhase("compressed"),500);schedule(()=>beginReturn(nextUsed),1100);schedule(()=>finish(),1350);return}
    setPhase("exiting");schedule(()=>setPhase("compressing"),220);schedule(()=>setPhase("compressed"),3220);schedule(()=>beginReturn(nextUsed),4120);schedule(()=>finish(),4700);
  }
  return <><style>{CSS}</style><button ref={buttonRef} type="button" className="context-window-button" data-phase={phase} aria-label={"Context "+formatTokens(currentUsed)+" of "+formatTokens(safeMax)+", compress"} aria-busy={phase!=="idle"} onClick={handleClick} style={lockedWidth===null?undefined:{width:lockedWidth}}><span className="context-window-button__idle" aria-hidden="true"><svg className="context-window-button__pie" viewBox="0 0 18 18"><circle className="context-window-button__track" cx="9" cy="9" r="6.5"/><circle className="context-window-button__arc" cx="9" cy="9" r="6.5" pathLength={CIRCLE_LENGTH} strokeDasharray={CIRCLE_LENGTH} strokeDashoffset={CIRCLE_LENGTH*(1-usedRatio)} transform="rotate(-90 9 9)"/></svg><span className="context-window-button__readout">{formatTokens(currentUsed)} / {formatTokens(safeMax)}</span></span><span className="context-window-button__matrix" aria-hidden="true"><span className="context-window-button__dot-field"/><span className="context-window-button__dot-fill"/></span><span className="context-window-button__status" aria-hidden="true"><span className="context-window-button__label context-window-button__label--compressing">compressing</span><span className="context-window-button__label context-window-button__label--compressed">compressed</span></span></button></>;
}`;

export const CONTEXT_WINDOW_STATUS_SNIPPETS = {
  html: HTML_PAGE,
  react: REACT,
  node: `import { createServer } from "node:http";\n\nconst page=${JSON.stringify(HTML_PAGE)};\ncreateServer((_request,response)=>response.writeHead(200,{"content-type":"text/html; charset=utf-8"}).end(page)).listen(3000,()=>console.log("http://localhost:3000"));`,
};

export const CONTEXT_WINDOW_STATUS_META = {
  id: "context-window-status",
  name: "Context compression",
  blurb: "Quiet left-to-right dot-matrix rain with a dense compression front.",
  states: "idle, exit, dot-matrix rain, compression sweep, compressed, return, focus, reduced motion",
  keywords: [
    "context window",
    "context meter",
    "token meter",
    "token compression",
    "compression button",
    "context status",
    "pie progress",
    "used tokens",
    "matrix rain",
    "dot field",
    "compression sweep",
    "dense leading edge",
    "text shimmer",
    "ai interface",
    "llm context",
    "animated button",
    "interactive button",
    "button microinteraction",
    "reduced motion",
    "ui animation",
  ],
};
