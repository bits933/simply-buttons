const CSS = `/* Arrow fill — Framer ArrowFillButton (hpx-afb).
   Orange pill, white end-cap circle that expands to fill on hover,
   clipped fill label, and a swapping arrow. Gallery size is locked to
   the Framer intrinsic 56px height (vw units from the source would
   explode inside a slot). */

.arrow-fill-root,
.hpx-afb {
  --hpx-afb-marker: 1;
  --btn-bg: #ff5f00;
  --btn-text: #ffffff;
  --btn-fill-bg: #ffffff;
  --btn-fill-text: #ff5f00;
  --btn-fill-bg-hover: #ffffff;
  --btn-fill-text-hover: #ff5f00;
  --btn-arrow: #ff5f00;
  --btn-arrow-hover: #ff5f00;
  --btn-duration: 450ms;
  --btn-ease: cubic-bezier(0.785, 0.135, 0.15, 0.86);
  --icon-circle: 41px;
  --icon-right: 7px;
  --pad-x: 40px;
  --pad-tail: 27px;
  --circle-inset-y: calc((100% - var(--icon-circle)) / 2);
}

.arrow-fill-root {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 12px;
}

.arrow-fill-root *,
.arrow-fill-root *::before,
.arrow-fill-root *::after {
  box-sizing: border-box;
}

.hpx-afb {
  appearance: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 56px;
  width: fit-content;
  max-width: 100%;
  margin: 0;
  padding: 0 var(--pad-x);
  padding-right: calc(var(--icon-circle) + var(--icon-right) + var(--pad-tail));
  overflow: hidden;
  border: 0;
  border-radius: 9999px;
  background-color: var(--btn-bg);
  color: var(--btn-text);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 1;
  letter-spacing: 0;
  white-space: nowrap;
  text-rendering: geometricPrecision;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  transform: scale(1);
  transform-origin: center;
  transition: transform 200ms var(--btn-ease);
}

.hpx-afb__label {
  position: relative;
  z-index: 1;
  padding-bottom: 1px;
}

.hpx-afb__circle {
  pointer-events: none;
  position: absolute;
  z-index: 2;
  border-radius: 9999px;
  background-color: var(--btn-fill-bg);
  top: var(--circle-inset-y);
  bottom: var(--circle-inset-y);
  right: var(--icon-right);
  left: calc(100% - var(--icon-right) - var(--icon-circle));
  transition:
    background-color var(--btn-duration) var(--btn-ease),
    inset var(--btn-duration) var(--btn-ease);
}

.hpx-afb:hover .hpx-afb__circle,
.hpx-afb:focus-visible .hpx-afb__circle,
.hpx-afb[data-pressed="true"] .hpx-afb__circle {
  background-color: var(--btn-fill-bg-hover);
  inset: 0;
}

.hpx-afb__mask {
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 0 var(--pad-x);
  padding-right: calc(var(--icon-circle) + var(--icon-right) + var(--pad-tail));
  color: var(--btn-fill-text);
  clip-path: inset(
    var(--circle-inset-y)
    var(--icon-right)
    var(--circle-inset-y)
    calc(100% - var(--icon-right) - var(--icon-circle))
  );
  transition:
    color var(--btn-duration) var(--btn-ease),
    clip-path var(--btn-duration) var(--btn-ease);
}

.hpx-afb:hover .hpx-afb__mask,
.hpx-afb:focus-visible .hpx-afb__mask,
.hpx-afb[data-pressed="true"] .hpx-afb__mask {
  color: var(--btn-fill-text-hover);
  clip-path: inset(0 0 0 0);
}

.hpx-afb__mask-label {
  position: relative;
  z-index: 1;
  padding-bottom: 1px;
  white-space: nowrap;
}

.hpx-afb__icon {
  pointer-events: none;
  position: absolute;
  right: var(--icon-right);
  top: 50%;
  z-index: 3;
  display: inline-flex;
  height: var(--icon-circle);
  width: var(--icon-circle);
  flex-shrink: 0;
  transform: translateY(-50%);
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 9999px;
  background-color: var(--btn-fill-bg);
  color: var(--btn-arrow);
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
  transition:
    background-color var(--btn-duration) var(--btn-ease),
    color var(--btn-duration) var(--btn-ease);
}

.hpx-afb:hover .hpx-afb__icon,
.hpx-afb:focus-visible .hpx-afb__icon,
.hpx-afb[data-pressed="true"] .hpx-afb__icon {
  background-color: var(--btn-fill-bg-hover);
  color: var(--btn-arrow-hover);
}

.hpx-afb__icon-svg {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 20px;
  height: 20px;
  transform-origin: center;
  color: currentColor;
  transition: transform var(--btn-duration) var(--btn-ease);
}

.hpx-afb__icon-svg--enter {
  transform: translate(-170%, -50%) scale(0);
}

.hpx-afb:hover .hpx-afb__icon-svg--enter,
.hpx-afb:focus-visible .hpx-afb__icon-svg--enter,
.hpx-afb[data-pressed="true"] .hpx-afb__icon-svg--enter {
  transform: translate(-50%, -50%) scale(1);
}

.hpx-afb__icon-svg--exit {
  transform: translate(-50%, -50%) scale(1);
}

.hpx-afb:hover .hpx-afb__icon-svg--exit,
.hpx-afb:focus-visible .hpx-afb__icon-svg--exit,
.hpx-afb[data-pressed="true"] .hpx-afb__icon-svg--exit {
  transform: translate(70%, -50%) scale(0);
}

.hpx-afb:active {
  transform: scale(0.98);
}

.hpx-afb:focus {
  outline: none;
}

.hpx-afb:focus-visible {
  outline: 2px solid var(--btn-bg);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .hpx-afb,
  .hpx-afb__circle,
  .hpx-afb__mask,
  .hpx-afb__icon,
  .hpx-afb__icon-svg {
    transition: none;
  }

  .hpx-afb:active {
    transform: none;
  }
}`;

const ARROW = `<svg class="hpx-afb__icon-svg hpx-afb__icon-svg--CLASS" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>`;

const MARKUP = `<button type="button" class="hpx-afb" aria-label="Hover Me" data-hpx-afb="" data-pressed="false">
      <span class="hpx-afb__label">Hover Me</span>
      <span aria-hidden="true" class="hpx-afb__circle"></span>
      <span aria-hidden="true" class="hpx-afb__mask">
        <span class="hpx-afb__mask-label">Hover Me</span>
      </span>
      <span aria-hidden="true" class="hpx-afb__icon">
        ${ARROW.replace("CLASS", "enter")}
        ${ARROW.replace("CLASS", "exit")}
      </span>
    </button>`;

const JS = `(function () {
  var compact = window.matchMedia("(max-width: 1279px)");
  document.querySelectorAll("[data-hpx-afb].hpx-afb").forEach(function (btn) {
    var hold = 0;
    function isTouch(event) {
      return compact.matches && event.pointerType !== "mouse";
    }
    function clearPressed() {
      window.clearTimeout(hold);
      hold = window.setTimeout(function () {
        btn.setAttribute("data-pressed", "false");
      }, 450);
    }
    btn.addEventListener("pointerdown", function (event) {
      if (!isTouch(event)) return;
      window.clearTimeout(hold);
      btn.setAttribute("data-pressed", "true");
    });
    btn.addEventListener("pointerup", function (event) {
      if (!isTouch(event)) return;
      clearPressed();
    });
    btn.addEventListener("pointercancel", function (event) {
      if (!isTouch(event)) return;
      clearPressed();
    });
  });
})();`;

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Arrow fill</title>
<style>
html, body { margin: 0; height: 100%; }
body { min-height: 100vh; display: grid; place-items: center; background: #111318; }
${CSS}
</style>
</head>
<body>
  <div class="arrow-fill-root" data-hpx-afb="">
    ${MARKUP}
  </div>
  <script>${JS}</script>
</body>
</html>`;

const REACT = `import { useEffect, useRef, useState } from "react";

const CSS = ${JSON.stringify(CSS)};

function ArrowRightIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function ArrowFillButton({ label = "Hover Me", onClick, ...rest }) {
  const [isPressed, setIsPressed] = useState(false);
  const compactRef = useRef(false);
  const holdRef = useRef(0);

  useEffect(() => {
    if (document.getElementById("hpx-afb-styles")) return;
    const tag = document.createElement("style");
    tag.id = "hpx-afb-styles";
    tag.textContent = CSS;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1279px)");
    const sync = (event) => {
      compactRef.current = "matches" in event ? event.matches : mq.matches;
      if (!compactRef.current) setIsPressed(false);
    };
    sync(mq);
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      window.clearTimeout(holdRef.current);
    };
  }, []);

  const onPointerDown = (event) => {
    if (!compactRef.current || event.pointerType === "mouse") return;
    window.clearTimeout(holdRef.current);
    setIsPressed(true);
  };
  const onPointerUp = (event) => {
    if (!compactRef.current || event.pointerType === "mouse") return;
    window.clearTimeout(holdRef.current);
    holdRef.current = window.setTimeout(() => setIsPressed(false), 450);
  };

  return (
    <div className="arrow-fill-root" data-hpx-afb="">
      <button
        type="button"
        className="hpx-afb"
        aria-label={label}
        data-hpx-afb=""
        data-pressed={isPressed ? "true" : "false"}
        onClick={onClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        {...rest}
      >
        <span className="hpx-afb__label">{label}</span>
        <span aria-hidden="true" className="hpx-afb__circle" />
        <span aria-hidden="true" className="hpx-afb__mask">
          <span className="hpx-afb__mask-label">{label}</span>
        </span>
        <span aria-hidden="true" className="hpx-afb__icon">
          <ArrowRightIcon className="hpx-afb__icon-svg hpx-afb__icon-svg--enter" />
          <ArrowRightIcon className="hpx-afb__icon-svg hpx-afb__icon-svg--exit" />
        </span>
      </button>
    </div>
  );
}
`;

export const ARROW_FILL_SNIPPETS = {
  html: PAGE,
  react: REACT,
  node: `const { createServer } = require("node:http");
const page = ${JSON.stringify(PAGE)};
createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(page);
}).listen(3000, () => console.log("http://localhost:3000"));`,
};

export const ARROW_FILL_META = {
  id: "arrow-fill",
  name: "Arrow fill",
  blurb:
    "An orange pill whose white end-cap circle expands across the label on hover, swapping the arrow as the fill text clips in over 450ms.",
  states: "idle, hover, focus-visible, pressed, reduced-motion",
  keywords: [
    "animated button",
    "interactive button",
    "arrow fill",
    "pill button",
    "circle expand",
    "clip path",
    "hover fill",
    "arrow swap",
    "orange button",
    "framer button",
    "cta",
    "icon button",
    "css button",
    "button microinteraction",
    "hover animation",
    "press state",
    "rounded button",
  ],
};
