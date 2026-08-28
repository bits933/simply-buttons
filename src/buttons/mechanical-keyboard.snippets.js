const CSS = `
.btn-mechanical-keyboard-preview { display:grid; width:100%; place-items:center; }
.btn-mechanical-keyboard-button { appearance:none; position:relative; display:block; width:176px; height:152px; padding:0; border:0; background:transparent; cursor:pointer; line-height:0; overflow:hidden; touch-action:manipulation; user-select:none; }
.btn-mechanical-keyboard-layer { position:absolute; display:block; pointer-events:none; }
.btn-mechanical-keyboard-layer--base { left:0; top:30.2969px; width:176px; height:122px; }
.btn-mechanical-keyboard-layer--keycap { left:13.6289px; top:0; width:152px; height:124px; transform:translateY(0); transition:transform 150ms cubic-bezier(.22,1,.36,1),filter 150ms cubic-bezier(.22,1,.36,1); will-change:transform; }
.btn-mechanical-keyboard-button.is-pressed .btn-mechanical-keyboard-layer--keycap { transform:translateY(6px); filter:drop-shadow(0 4px 6px rgba(18,19,21,.18)); transition-duration:55ms; transition-timing-function:cubic-bezier(.4,0,.2,1); }
.btn-mechanical-keyboard-button:focus { outline:none; }
.btn-mechanical-keyboard-button:focus-visible { outline:2px solid currentColor; outline-offset:3px; }
.btn-mechanical-keyboard-button:disabled { cursor:not-allowed; opacity:.46; }
@media (prefers-reduced-motion: reduce) { .btn-mechanical-keyboard-layer--keycap { transition:none; } }
`.trim();

const MARKUP = `<button type="button" class="btn-mechanical-keyboard-button" aria-label="OK key"><img class="btn-mechanical-keyboard-layer btn-mechanical-keyboard-layer--base" src="./base.svg" alt="" aria-hidden="true" draggable="false"><img class="btn-mechanical-keyboard-layer btn-mechanical-keyboard-layer--keycap" src="./clicked.svg" alt="" aria-hidden="true" draggable="false"></button>`;

const AUDIO = `
let sharedClick;
function playMechanicalClick() {
  try {
    if (!sharedClick) sharedClick = new Audio("./click.mp3");
    const player = sharedClick.cloneNode();
    player.currentTime = 0;
    player.play().catch(() => {});
  } catch {}
}
`.trim();

const INTERACTION = `
const button = document.querySelector(".btn-mechanical-keyboard-button");
function setHeld(held) { button.classList.toggle("is-pressed", held); }
function endPress() { setHeld(false); }
function isMechanicalPressKey(key) { return key === " " || key === "Enter"; }
${AUDIO}
button.addEventListener("pointerdown", (event) => {
  if (button.disabled || !event.isPrimary || event.button !== 0) return;
  try { button.setPointerCapture(event.pointerId); } catch {}
  setHeld(true);
});
button.addEventListener("pointerup", endPress);
button.addEventListener("pointercancel", endPress);
button.addEventListener("lostpointercapture", endPress);
button.addEventListener("keydown", (event) => {
  if (button.disabled || event.repeat || !isMechanicalPressKey(event.key)) return;
  setHeld(true);
});
button.addEventListener("keyup", (event) => { if (isMechanicalPressKey(event.key)) endPress(); });
button.addEventListener("blur", endPress);
button.addEventListener("click", (event) => { if (!button.disabled) playMechanicalClick(); });
`.trim();

const HTML_PAGE = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Mechanical keyboard</title><style>body{min-height:100vh;display:grid;place-items:center;margin:0;background:#171717;color:#fff}${CSS}</style></head>
<body>
  <!-- Put base.svg, clicked.svg, and click.mp3 beside this HTML file. -->
  ${MARKUP}
  <script>${INTERACTION}</script>
</body>
</html>`;

export const MECHANICAL_KEYBOARD_SNIPPETS = {
  html: HTML_PAGE,
  react: `import { useEffect, useRef, useState } from "react";
import base from "./base.svg";
import clicked from "./clicked.svg";
import clickUrl from "./click.mp3?url";

const CSS = ${JSON.stringify(CSS)};

let sharedClick;
function isMechanicalPressKey(key) { return key === " " || key === "Enter"; }
function playMechanicalClick() {
  try {
    if (!sharedClick) sharedClick = new Audio(clickUrl);
    const player = sharedClick.cloneNode();
    player.currentTime = 0;
    player.play().catch(() => {});
  } catch {}
}

export default function MechanicalKeyboardButton({ label = "OK key", disabled = false, onClick }) {
  const [pressed, setPressed] = useState(false);
  const pressedRef = useRef(false);
  function setHeld(nextPressed) { if (pressedRef.current !== nextPressed) { pressedRef.current = nextPressed; setPressed(nextPressed); } }
  function endPress() { setHeld(false); }
  useEffect(() => {
    if (disabled) endPress();
  }, [disabled]);
  function handlePointerDown(event) {
    if (disabled || !event.isPrimary || event.button !== 0) return;
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch {}
    setHeld(true);
  }
  function handleKeyDown(event) { if (!disabled && !event.repeat && isMechanicalPressKey(event.key)) setHeld(true); }
  function handleClick(event) { if (!disabled) { playMechanicalClick(); onClick?.(event); } }
  return <><style>{CSS}</style><button type="button" className={"btn-mechanical-keyboard-button" + (pressed ? " is-pressed" : "")} disabled={disabled} aria-label={label} onPointerDown={handlePointerDown} onPointerUp={endPress} onPointerCancel={endPress} onLostPointerCapture={endPress} onKeyDown={handleKeyDown} onKeyUp={(event) => { if (isMechanicalPressKey(event.key)) endPress(); }} onBlur={endPress} onClick={handleClick}><img className="btn-mechanical-keyboard-layer btn-mechanical-keyboard-layer--base" src={base} alt="" aria-hidden="true" draggable="false" /><img className="btn-mechanical-keyboard-layer btn-mechanical-keyboard-layer--keycap" src={clicked} alt="" aria-hidden="true" draggable="false" /></button></>;
}
`,
  node: `import { createReadStream } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const page = ${JSON.stringify(HTML_PAGE)};
const assets = new Map([
  ["/base.svg", { path: fileURLToPath(new URL("./base.svg", import.meta.url)), type: "image/svg+xml" }],
  ["/clicked.svg", { path: fileURLToPath(new URL("./clicked.svg", import.meta.url)), type: "image/svg+xml" }],
  ["/click.mp3", { path: fileURLToPath(new URL("./click.mp3", import.meta.url)), type: "audio/mpeg" }],
]);

createServer((request, response) => {
  if (request.url === "/") return response.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page);
  const asset = assets.get(request.url);
  if (!asset) return response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
  response.writeHead(200, { "content-type": asset.type });
  createReadStream(asset.path).on("error", () => response.destroy()).pipe(response);
}).listen(3000, () => console.log("http://localhost:3000"));
`,
};

export const MECHANICAL_KEYBOARD_META = {
  id: "mechanical-keyboard",
  name: "Mechanical keyboard",
  blurb: "Native momentary key with a fixed supplied base, one translating keycap, and a restrained mechanical click.",
  states: "idle, press, focus, disabled, reduced motion",
  keywords: [
    "mechanical keyboard",
    "mech key",
    "keycap press",
    "momentary key",
    "translating keycap",
    "mechanical click",
    "keyboard button",
    "switch click",
    "native key",
    "key travel",
    "clicky key",
    "fixed base",
    "tactile key",
    "keyboard switch",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
