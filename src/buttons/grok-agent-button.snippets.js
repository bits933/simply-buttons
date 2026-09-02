const CSS = `.grok-agent {
  --grok-agent-surface:#1a1a1a;--grok-agent-border:#505058;--grok-agent-border-muted:#2f2f33;--grok-agent-text:#ededed;--grok-agent-muted:#96969d;--grok-agent-accent:#e0af68;
  appearance:none;position:relative;display:inline-flex;align-items:center;height:48px;min-width:164px;padding:0 14px;gap:10px;overflow:hidden;border:1px solid var(--grok-agent-border);border-radius:6px;background:var(--grok-agent-surface);box-shadow:inset 0 0 0 1px var(--grok-agent-border-muted);color:var(--grok-agent-text);font:500 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;cursor:pointer;transition:transform 140ms ease;
}
[data-theme="dark"] .grok-agent{--grok-agent-surface:#1a1a1a;--grok-agent-border:#505058;--grok-agent-text:#f2f2f3;--grok-agent-muted:#b2b2b8}
.grok-agent__mark{position:relative;display:grid;width:24px;height:24px;overflow:hidden;color:var(--grok-agent-muted)}.grok-agent__mark svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-dasharray:.01 2.7;stroke-linecap:round;stroke-width:1.8}.grok-agent__mark::after{position:absolute;inset:0;background:linear-gradient(90deg,transparent 30%,rgba(255,255,255,.9) 50%,transparent 70%);content:"";opacity:0;transform:translateX(-140%)}.grok-agent__label{white-space:nowrap}
.grok-agent:hover,.grok-agent:focus-visible{border-color:var(--grok-agent-accent)}.grok-agent:hover .grok-agent__mark::after,.grok-agent:focus-visible .grok-agent__mark::after{opacity:1;animation:grok-agent-scan 620ms ease-out both}.grok-agent:active{transform:scale(.98)}.grok-agent:focus-visible{outline:2px solid var(--grok-agent-accent);outline-offset:3px}@keyframes grok-agent-scan{from{transform:translateX(-140%)}to{transform:translateX(140%)}}
@media (prefers-reduced-motion:reduce){.grok-agent,.grok-agent__mark::after{transition:none;animation:none}.grok-agent:active,.grok-agent:hover .grok-agent__mark::after,.grok-agent:focus-visible .grok-agent__mark::after{transform:none}}
`;

const MARK = `<span class="grok-agent__mark" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M3 20V9a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H9"/><path d="M1 23 23 1"/></svg></span>`;
const BUTTON = `<button type="button" class="grok-agent" aria-label="Ask Grok">${MARK}<span class="grok-agent__label">Ask Grok</span></button>`;
const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Grok Button</title><style>body{min-height:100vh;margin:0;display:grid;place-items:center;background:#f1f1f2}${CSS}</style></head><body>${BUTTON}</body></html>`;
const REACT = `const CSS = ${JSON.stringify(CSS)};
const Mark=()=> <span className="grok-agent__mark" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M3 20V9a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v6a6 6 0 0 1-6 6H9"/><path d="M1 23 23 1"/></svg></span>;
export default function GrokAgentButton({label="Ask Grok",onClick,...props}){return <><style>{CSS}</style><button type="button" className="grok-agent" aria-label={label} onClick={onClick} {...props}><Mark/><span className="grok-agent__label">{label}</span></button></>}`;

export const GROK_AGENT_SNIPPETS = {
  html: PAGE,
  react: REACT,
  node: `const { createServer } = require("node:http");\nconst page = ${JSON.stringify(PAGE)};\ncreateServer((_req,res)=>{res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});res.end(page)}).listen(3000,()=>console.log("http://localhost:3000"));`,
};

export const GROK_AGENT_META = {
  id: "grok-agent",
  name: "Grok",
  blurb: "A compact Grok button with a dotted orbital mark and an amber scan shimmer.",
  states: "default, hover, active, focus-visible, reduced motion",
  keywords: ["grok", "dot matrix", "orbital mark", "charcoal", "amber", "shimmer", "agent", "ai button", "animated button", "interactive button", "xai", "coding assistant", "developer tool", "terminal ui", "dotted icon", "command button", "assistant"],
};
