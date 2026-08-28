const CSS = `
.btn-orano-btn {
  --orano-ease: cubic-bezier(0.75, 0, 0.25, 1);
  --orano-yellow: #ffe600;
  --orano-ink: #161611;
  --orano-bg: #ffffff;
  --orano-notch-width: 10px;

  display: inline-block;
  position: relative;
  height: 50px;
  min-width: 230px;
  line-height: 50px;
  margin: 0;
  padding: 0;
  border: none;
  background: var(--orano-yellow);
  text-transform: uppercase;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "IBM Plex Mono", monospace;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: var(--orano-ink);
  text-decoration: none;
  cursor: pointer;
  appearance: none;
  isolation: isolate;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 120ms ease;
}

.btn-orano-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-orano-btn:focus-visible {
  outline: 2px solid var(--orano-yellow);
  outline-offset: 4px;
}

.btn-orano-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-orano-rgb {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateX(0) translateY(0);
  opacity: 0;
  transition: transform 0.6s var(--orano-ease), opacity 0.6s ease;
  will-change: transform, opacity;
  pointer-events: none;
  z-index: 1;
}

.btn-orano-rgb.red {
  background: #ff2a2a;
}

.btn-orano-rgb.green {
  background: #0aff15;
}

.btn-orano-overflow {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 2;
}

.btn-orano-hover {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--orano-yellow);
  z-index: 2;
}

.btn-orano-hover-inner {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.btn-orano-noise {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.42'/%3E%3C/svg%3E");
  background-size: 60px 60px;
  animation: btn-orano-noise 0.1s linear infinite;
  opacity: 0;
  transition: opacity 0.3s 0.1s;
  will-change: transform, opacity;
  pointer-events: none;
}

@keyframes btn-orano-noise {
  0% { transform: translateX(0) translateY(0); }
  15% { transform: translateX(-5%) translateY(-20%); }
  30% { transform: translateX(-10%) translateY(-35%); }
  45% { transform: translateX(-45%) translateY(-30%); }
  60% { transform: translateX(-15%) translateY(-50%); }
  75% { transform: translateX(-30%) translateY(-5%); }
  90% { transform: translateX(-20%) translateY(-10%); }
}

.btn-orano-bg {
  position: absolute;
  top: 0;
  left: var(--orano-notch-width);
  width: calc(100% - var(--orano-notch-width));
  height: 100%;
  background: var(--orano-bg);
  transform: translateX(0);
  transition: transform 0.6s var(--orano-ease);
  will-change: transform;
  z-index: 3;
}

.btn-orano-label-container {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding-left: 36px;
  box-sizing: border-box;
  transform: translateX(0);
  opacity: 1;
  z-index: 4;
}

.btn-orano-label {
  display: inline-block;
  transform: translateX(0);
  color: var(--orano-ink);
  white-space: nowrap;
  transition: transform 0.5s var(--orano-ease);
  will-change: transform;
}

.btn-orano-stroke {
  display: block;
  position: absolute;
  top: 50%;
  left: 24px;
  width: 28px;
  height: 1.5px;
  background: var(--orano-ink);
  transform: translateX(-12px) scaleX(0.001) translateZ(0);
  transform-origin: 0 0;
  transition: transform 0.5s var(--orano-ease);
  will-change: transform;
  z-index: 5;
}

@media (hover: hover) {
  .btn-orano-btn:hover:not(:disabled) .btn-orano-bg,
  .btn-orano-btn.is-hover .btn-orano-bg {
    transform: translateX(100%);
  }

  .btn-orano-btn:hover:not(:disabled) .btn-orano-label,
  .btn-orano-btn.is-hover .btn-orano-label {
    transform: translateX(24px);
  }

  .btn-orano-btn:hover:not(:disabled) .btn-orano-stroke,
  .btn-orano-btn.is-hover .btn-orano-stroke {
    transform: scaleX(1);
    transition-delay: 0.05s;
  }

  .btn-orano-btn:hover:not(:disabled) .btn-orano-noise,
  .btn-orano-btn.is-hover .btn-orano-noise {
    opacity: 1;
  }

  .btn-orano-btn:hover:not(:disabled) .btn-orano-rgb,
  .btn-orano-btn.is-hover .btn-orano-rgb {
    opacity: 1;
  }

  .btn-orano-btn:hover:not(:disabled) .btn-orano-rgb.red,
  .btn-orano-btn.is-hover .btn-orano-rgb.red {
    transform: translateX(2px) translateY(-2px);
  }

  .btn-orano-btn:hover:not(:disabled) .btn-orano-rgb.green,
  .btn-orano-btn.is-hover .btn-orano-rgb.green {
    transform: translateX(-2px) translateY(2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .btn-orano-btn,
  .btn-orano-bg,
  .btn-orano-label,
  .btn-orano-stroke,
  .btn-orano-rgb {
    transition: none !important;
  }

  .btn-orano-noise {
    animation: none !important;
  }
}
`.trim();

const MARKUP = `
<button class="btn-orano-btn" type="button" aria-label="ENTER">
  <span class="btn-orano-rgb red" aria-hidden="true"></span>
  <span class="btn-orano-rgb green" aria-hidden="true"></span>
  <span class="btn-orano-overflow">
    <span class="btn-orano-hover" aria-hidden="true">
      <span class="btn-orano-hover-inner">
        <span class="btn-orano-noise"></span>
      </span>
    </span>
    <span class="btn-orano-bg" aria-hidden="true"></span>
    <span class="btn-orano-label-container">
      <span class="btn-orano-label">ENTER</span>
    </span>
    <span class="btn-orano-stroke" aria-hidden="true"></span>
  </span>
</button>
`.trim();

const HTML_PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Orano Innovation Push CTA Button</title>
  <style>
    body { min-height: 100vh; display: grid; place-items: center; margin: 0; background: #0c0d0f; }
    ${CSS}
  </style>
</head>
<body>
  ${MARKUP}
</body>
</html>`;

export const ORANO_PUSH_CTA_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";\n\nconst CSS = ${JSON.stringify(
    CSS
  )};\n\nexport default function OranoPushCtaButton({ label = "ENTER", onClick, disabled = false }) {\n  return (\n    <button type=\"button\" className=\"btn-orano-btn\" disabled={disabled} onClick={onClick} aria-label={label}>\n      <span className=\"btn-orano-rgb red\" aria-hidden=\"true\" />\n      <span className=\"btn-orano-rgb green\" aria-hidden=\"true\" />\n      <span className=\"btn-orano-overflow\">\n        <span className=\"btn-orano-hover\" aria-hidden=\"true\">\n          <span className=\"btn-orano-hover-inner\">\n            <span className=\"btn-orano-noise\" />\n          </span>\n        </span>\n        <span className=\"btn-orano-bg\" aria-hidden=\"true\" />\n        <span className=\"btn-orano-label-container\">\n          <span className=\"btn-orano-label\">{label}</span>\n        </span>\n        <span className=\"btn-orano-stroke\" aria-hidden=\"true\" />\n      </span>\n    </button>\n  );\n}\n`,
  node: `import { createServer } from "node:http";\n\nconst page = ${JSON.stringify(
    HTML_PAGE
  )};\n\ncreateServer((_req, res) => res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page)).listen(3000, () => console.log("http://localhost:3000"));\n`,
};

export const ORANO_PUSH_CTA_META = {
  id: "orano-push-cta",
  name: "Color slide in",
  blurb: "High-tech nuclear experience CTA featuring yellow side notch, dual-layer chromatic RGB glitch split, radioactive noise grain, and wipe reveal.",
  states: "rest with yellow side notch, chromatic RGB split, radioactive static noise, slide wipe reveal, active press, focus, disabled, reduced motion",
  keywords: [
    "color slide in",
    "orano push cta",
    "orano",
    "nuclear",
    "glitch",
    "noise",
    "rgb",
    "hologram",
    "push",
    "explore",
    "enter",
    "yellow notch",
    "chromatic aberration",
    "slide wipe",
    "futuristic button",
    "sci-fi cta",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
