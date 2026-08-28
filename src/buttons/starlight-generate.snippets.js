const CSS = `
.btn-starlight-btn { --starlight-ease:cubic-bezier(.65,0,.35,1); --starlight-orbit:0deg; position:relative; isolation:isolate; display:inline-flex; align-items:center; justify-content:center; gap:10px; height:62px; padding:0 18px; overflow:visible; border:1px solid rgb(255 255 255 / 4%); border-radius:999px; appearance:none; background:#1d1d1e; box-shadow:inset 0 1px 0 rgb(255 255 255 / 3%),inset 0 -2px 3px rgb(0 0 0 / 22%); color:#505054; cursor:pointer; font:600 18px/1 system-ui,sans-serif; letter-spacing:-.025em; transition:background 600ms var(--starlight-ease),color 600ms var(--starlight-ease),box-shadow 600ms var(--starlight-ease),border-color 600ms var(--starlight-ease),transform 160ms var(--starlight-ease); }
.btn-starlight-btn::before { position:absolute; z-index:0; inset:-4px; padding:3px; border-radius:inherit; background:conic-gradient(from var(--starlight-orbit),#c893ff 0%,#f7dcff 11%,#c795ff 24%,#ad78e5 39%,#b986ec 54%,#ffe6ff 70%,#c893ff 86%,#c893ff 100%); content:""; opacity:0; transition:opacity 460ms var(--starlight-ease); -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
.btn-starlight-btn.is-active { border-color:rgb(225 179 255 / 65%); background:linear-gradient(118deg,#6234f4 0%,#7935ff 54%,#8447fb 100%); box-shadow:0 0 0 1px rgb(177 109 255 / 58%),0 0 19px rgb(141 67 255 / 74%),0 14px 36px rgb(76 20 176 / 48%),inset 0 1px 1px rgb(255 255 255 / 48%),inset 0 -4px 8px rgb(56 16 154 / 30%); color:#fff; }
.btn-starlight-btn.is-active::before,.btn-starlight-btn:hover:not(:disabled)::before { opacity:1; }
.btn-starlight-btn.is-active .btn-starlight-label,.btn-starlight-btn.is-active .btn-starlight-stars { color:#fff; }
.btn-starlight-btn:hover:not(:disabled)::before { animation:starlight-orbit 3.2s infinite; }
.btn-starlight-btn:active:not(:disabled) { transform:scale(.975); transition-duration:80ms; }
.btn-starlight-btn:focus-visible { outline:2px solid #e9d6ff; outline-offset:6px; }
.btn-starlight-btn:disabled { cursor:not-allowed; opacity:.48; }
.btn-starlight-stars,.btn-starlight-label { position:relative; z-index:1; }
.btn-starlight-stars { display:flex; align-items:center; gap:3px; width:28px; height:26px; color:currentColor; transform:translateX(10.75px); }
.btn-starlight-label { min-width:12ch; }
.btn-starlight-star { display:block; flex:0 0 auto; opacity:.88; transform-origin:center; transition:filter 600ms var(--starlight-ease); }
.btn-starlight-star--one { align-self:flex-start; width:15px; height:15px; margin-top:2px; }
.btn-starlight-star--two { align-self:flex-end; width:10px; height:10px; margin-bottom:2px; }
.btn-starlight-btn.is-active .btn-starlight-star { filter:drop-shadow(0 0 5px rgb(255 234 255 / 46%)); }
.btn-starlight-btn:hover:not(:disabled) .btn-starlight-star { animation:starlight-twinkle 1.7s var(--starlight-ease) infinite; }
.btn-starlight-btn:hover:not(:disabled) .btn-starlight-star--two { animation-delay:.27s; }
@property --starlight-orbit { syntax:"<angle>"; inherits:false; initial-value:0deg; }
@keyframes starlight-orbit { 0% { --starlight-orbit:0deg; animation-timing-function:cubic-bezier(.65,0,.35,1); } 50% { --starlight-orbit:180deg; animation-timing-function:cubic-bezier(.65,0,.35,1); } 100% { --starlight-orbit:360deg; } }
@keyframes starlight-twinkle { 0%,100% { opacity:.52; transform:scale(.78) rotate(0); } 48% { opacity:1; transform:scale(1.2) rotate(18deg); } }
@media (prefers-reduced-motion:reduce) { .btn-starlight-btn,.btn-starlight-btn::before,.btn-starlight-star { transition:none; animation:none !important; } }
`.trim();

const MARKUP = `<button class="btn-starlight-btn" type="button" aria-label="Generate Site" aria-pressed="false" aria-busy="false"><span class="btn-starlight-stars" aria-hidden="true"><i class="ph-fill ph-star-four btn-starlight-star btn-starlight-star--one"></i><i class="ph-fill ph-star-four btn-starlight-star btn-starlight-star--two"></i></span><span class="btn-starlight-label">Generate Site</span></button>`;

const HTML_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Starlight Generate</title><link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.2/src/fill/style.css"><style>body{min-height:100vh;display:grid;place-items:center;margin:0;background:#121315}${CSS}</style></head><body>${MARKUP}<script>const button=document.querySelector('.btn-starlight-btn');button.addEventListener('click',()=>{if(button.getAttribute('aria-busy')==='true')return;button.classList.add('is-active');button.setAttribute('aria-pressed','true');button.setAttribute('aria-busy','true');button.querySelector('.btn-starlight-label').textContent='Generating';window.setTimeout(()=>{button.classList.remove('is-active');button.setAttribute('aria-pressed','false');button.setAttribute('aria-busy','false');button.querySelector('.btn-starlight-label').textContent='Generate Site';},3000);});</script></body></html>`;

export const STARLIGHT_GENERATE_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";\n\nimport { useState } from "react";\nimport { StarFour } from "@phosphor-icons/react";\n\nconst CSS = ${JSON.stringify(CSS)};\n\nexport default function StarlightGenerateButton({ disabled = false, onClick }) {\n  const [generating, setGenerating] = useState(false);\n  function handleClick(event) { if (event.defaultPrevented || disabled || generating) return; setGenerating(true); window.setTimeout(() => setGenerating(false), 3000); onClick?.(event); }\n  return <button type="button" className={["btn-starlight-btn", generating && "is-active"].filter(Boolean).join(" ")} aria-pressed={generating} aria-busy={generating} disabled={disabled} onClick={handleClick}><span className="btn-starlight-stars" aria-hidden="true"><StarFour className="btn-starlight-star btn-starlight-star--one" weight="fill" /><StarFour className="btn-starlight-star btn-starlight-star--two" weight="fill" /></span><span className="btn-starlight-label">{generating ? "Generating" : "Generate Site"}</span></button>;\n}\n`,
  node: `import { createServer } from "node:http";\n\nconst page = ${JSON.stringify(HTML_PAGE)};\n\ncreateServer((_request, response) => response.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page)).listen(3000, () => console.log("http://localhost:3000"));\n`,
};

export const STARLIGHT_GENERATE_META = {
  id: "starlight-generate",
  name: "Starlight generate",
  blurb: "Compact charcoal-to-violet Generate Site action with an orbiting highlight and two stars.",
  states: "inactive, hover orbit, generating, press, focus, disabled, reduced motion",
  keywords: [
    "starlight generate",
    "generate site",
    "generate button",
    "orbiting highlight",
    "charcoal violet",
    "two stars",
    "starlight cta",
    "site generate",
    "orbit glow",
    "violet gradient",
    "compact generate",
    "star accent",
    "generate action",
    "orbital shine",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
