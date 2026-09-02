const CSS = `.codex-agent {
  --codex-agent-surface:#1a1a1a;--codex-agent-command:#353535;--codex-agent-border:#3a3a3a;--codex-agent-text:#ededed;--codex-agent-muted:#7a7a7a;--codex-agent-accent:#5cc2e0;
  appearance:none;position:relative;display:inline-flex;align-items:center;height:48px;min-width:174px;padding:0 14px;gap:10px;overflow:hidden;border:1px solid var(--codex-agent-border);border-radius:6px;background:var(--codex-agent-surface);color:var(--codex-agent-text);font:500 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;cursor:pointer;isolation:isolate;transition:transform 140ms ease;
}
[data-theme="dark"] .codex-agent{--codex-agent-surface:#1a1a1a;--codex-agent-border:#4a4a4a;--codex-agent-text:#ededed}
.codex-agent::before{position:absolute;z-index:-1;inset:0;background:var(--codex-agent-command);content:"";opacity:0;transition:opacity 180ms ease}.codex-agent__mark,.codex-agent__label{position:relative}.codex-agent__mark{color:var(--codex-agent-muted);font-weight:800}.codex-agent__label{white-space:nowrap}
.codex-agent:hover,.codex-agent:focus-visible{border-color:var(--codex-agent-accent)}.codex-agent:hover::before,.codex-agent:focus-visible::before{opacity:1}.codex-agent:hover .codex-agent__label,.codex-agent:focus-visible .codex-agent__label{background:linear-gradient(100deg,var(--codex-agent-text) 35%,#fff 50%,var(--codex-agent-text) 65%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:codex-agent-shimmer 620ms ease-out both}
.codex-agent:active{transform:scale(.98)}.codex-agent:focus-visible{outline:2px solid var(--codex-agent-accent);outline-offset:3px}@keyframes codex-agent-shimmer{from{background-position:160% 0}to{background-position:-60% 0}}
@media (prefers-reduced-motion:reduce){.codex-agent,.codex-agent::before,.codex-agent__label,.codex-agent__mark{transition:none;animation:none}.codex-agent:hover .codex-agent__label,.codex-agent:focus-visible .codex-agent__label{background:none;color:var(--codex-agent-text)}.codex-agent:active{transform:none}}
`;

const BUTTON = `<button type="button" class="codex-agent" aria-label="Run Codex"><span class="codex-agent__mark" aria-hidden="true">>_</span><span class="codex-agent__label">Run Codex</span></button>`;
const PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Codex Button</title><style>body{min-height:100vh;margin:0;display:grid;place-items:center;background:#ededed}${CSS}</style></head><body>${BUTTON}</body></html>`;
const REACT = `const CSS = ${JSON.stringify(CSS)};
export default function CodexAgentButton({label="Run Codex",onClick,...props}){return <><style>{CSS}</style><button type="button" className="codex-agent" aria-label={label} onClick={onClick} {...props}><span className="codex-agent__mark" aria-hidden="true">&gt;_</span><span className="codex-agent__label">{label}</span></button></>}`;

export const CODEX_AGENT_SNIPPETS = {
  html: PAGE,
  react: REACT,
  node: `const { createServer } = require("node:http");\nconst page = ${JSON.stringify(PAGE)};\ncreateServer((_req,res)=>{res.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});res.end(page)}).listen(3000,()=>console.log("http://localhost:3000"));`,
};

export const CODEX_AGENT_META = {
  id: "codex-agent",
  name: "Codex",
  blurb: "A compact Codex command button with a bolder terminal mark and grayscale shimmer.",
  states: "default, hover, active, focus-visible, reduced motion",
  keywords: ["codex", "terminal", "command", "monochrome", "shimmer", "prompt", "ai button", "animated button", "interactive button", "openai", "coding agent", "developer tool", "command line", "terminal glyph", "code generation", "terminal ui", "assistant"],
};
