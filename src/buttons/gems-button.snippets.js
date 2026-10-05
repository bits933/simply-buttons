const CSS = `/* Gems — TokenMeter circular add button (Figma 207:135 idle / 207:146 pressed).
   52px orange gloss disc, white plus, top-right specular, diagonal rim stroke.
   Press interpolates the inner shadow from a 4px inset well to a 1px edge kiss. */

.gems-root,
.gems-btn {
  --gems-marker: 1;
  --gems-size: 52px;
  --gems-fill-top: #ff7032;
  --gems-fill-bot: #e95a37;
  --gems-base: #f3f3f3;
  --gems-ease: cubic-bezier(0.23, 1, 0.32, 1);
  --gems-shadow:
    0 0 15.4px rgba(0, 0, 0, 0.25),
    0 4px 4px rgba(0, 0, 0, 0.25);
  --gems-inset:
    inset 1px -1px 4px rgba(0, 0, 0, 0.21),
    inset -1px 0 0 rgba(0, 0, 0, 0);
  --gems-inset-press:
    inset 1px 0 0 rgba(0, 0, 0, 0.05),
    inset -1px 0 0 rgba(0, 0, 0, 0.05);
  --gems-focus: #ff7032;
}

.gems-root {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 18px;
}

.gems-root *,
.gems-root *::before,
.gems-root *::after {
  box-sizing: border-box;
}

.gems-btn {
  appearance: none;
  position: relative;
  display: inline-grid;
  place-items: center;
  width: var(--gems-size);
  height: var(--gems-size);
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  border-radius: 50%;
  box-shadow: var(--gems-shadow);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
  transform: scale(1);
  transform-origin: center;
  transition: transform 200ms var(--gems-ease);
}

.gems-face {
  position: relative;
  display: block;
  width: var(--gems-size);
  height: var(--gems-size);
  border-radius: 50%;
  overflow: hidden;
  background-color: var(--gems-base);
  background-image: linear-gradient(180deg, var(--gems-fill-top) 0%, var(--gems-fill-bot) 100%);
  box-shadow: var(--gems-inset);
  pointer-events: none;
  transition: box-shadow 260ms var(--gems-ease);
}

.gems-art {
  position: absolute;
  inset: 0;
  width: var(--gems-size);
  height: var(--gems-size);
  display: block;
  pointer-events: none;
}

.gems-btn:hover,
.gems-btn:focus-visible {
  transform: scale(1);
}

.gems-btn:active,
.gems-btn.is-pressed {
  transform: scale(0.97);
}

.gems-btn:active .gems-face,
.gems-btn.is-pressed .gems-face {
  box-shadow: var(--gems-inset-press);
}

.gems-btn:focus {
  outline: none;
}

.gems-btn:focus-visible {
  outline: 2px solid var(--gems-focus);
  outline-offset: 3px;
}

@media (hover: hover) and (pointer: fine) {
  .gems-btn:hover:not(:active) {
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .gems-btn,
  .gems-face {
    transition: none;
  }

  .gems-btn:active {
    transform: none;
  }
}`;

const ART = `<svg class="gems-art" viewBox="15.4004 15.3999 42 42" width="52" height="52" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <filter id="gemsPlusGlow" x="28.6832" y="28.7266" width="15.4412" height="15.6467" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="0.2" />
          <feGaussianBlur stdDeviation="0.05" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.13 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
        <filter id="gemsSpecTex" x="35.0535" y="8.79766" width="30.5736" height="33.4052" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="5.15" result="effect1_foregroundBlur" />
          <feTurbulence type="fractalNoise" baseFrequency="0.5 0.5" numOctaves="3" seed="6985" />
          <feDisplacementMap in="effect1_foregroundBlur" scale="4" xChannelSelector="R" yChannelSelector="G" result="displacedImage" width="100%" height="100%" />
          <feMerge result="effect2_texture">
            <feMergeNode in="displacedImage" />
          </feMerge>
        </filter>
        <linearGradient id="gemsPlusStroke" x1="36.4711" y1="36.4349" x2="36.4711" y2="38.8265" gradientUnits="userSpaceOnUse">
          <stop offset="0.235828" stop-color="white" />
          <stop offset="0.0376415" stop-color="white" stop-opacity="0.159614" />
          <stop offset="1" stop-color="white" stop-opacity="0.159614" />
        </linearGradient>
        <linearGradient id="gemsRim" x1="50.6912" y1="22.454" x2="22.6626" y2="51.747" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F4F4F4" />
          <stop offset="0.287772" stop-color="#F4F4F4" stop-opacity="0" />
          <stop offset="0.689458" stop-color="#F4F4F4" stop-opacity="0" />
          <stop offset="1" stop-color="#F4F4F4" />
        </linearGradient>
      </defs>
      <g filter="url(#gemsPlusGlow)">
        <path d="M35.2092 42.8075V37.764C35.2092 37.6536 35.1197 37.564 35.0092 37.564H30.0749C29.4164 37.564 28.8828 37.0426 28.8828 36.3992C28.8829 35.7558 29.4165 35.2343 30.0749 35.2343H35.0092C35.1197 35.2343 35.2092 35.1448 35.2092 35.0343V29.9915C35.2092 29.3481 35.7429 28.8268 36.4013 28.8267C37.0599 28.8267 37.5935 29.3481 37.5935 29.9915V35.0343C37.5935 35.1448 37.683 35.2343 37.7935 35.2343L42.7309 35.2343C43.3893 35.2343 43.924 35.7558 43.9241 36.3992C43.9241 37.0426 43.3894 37.564 42.7309 37.564L37.7935 37.564C37.683 37.564 37.5935 37.6536 37.5935 37.764V42.8075C37.5935 43.451 37.0599 43.9735 36.4013 43.9735C35.7429 43.9733 35.2092 43.4509 35.2092 42.8075Z" fill="black" fill-opacity="0.26" />
        <path d="M36.4014 28.7769C37.0864 28.7769 37.6436 29.3196 37.6436 29.9917V35.0347C37.6437 35.1174 37.7112 35.1841 37.7939 35.1841H42.7305C43.4153 35.1841 43.9734 35.7269 43.9736 36.3989C43.9736 37.0711 43.4154 37.6138 42.7305 37.6138H37.7939C37.7111 37.6138 37.6436 37.6813 37.6436 37.7642V42.8071C37.6436 43.4792 37.0865 44.0239 36.4014 44.0239C35.7164 44.0238 35.1592 43.4792 35.1592 42.8071V37.7642C35.1592 37.6813 35.0916 37.6138 35.0088 37.6138H30.0752C29.3902 37.6138 28.833 37.0711 28.833 36.3989C28.8333 35.727 29.3903 35.1841 30.0752 35.1841H35.0088C35.0915 35.1841 35.159 35.1174 35.1592 35.0347V29.9917C35.1592 29.3196 35.7165 28.777 36.4014 28.7769Z" stroke="url(#gemsPlusStroke)" stroke-opacity="0.6" stroke-width="0.1" stroke-linecap="round" />
      </g>
      <path d="M35.3506 42.6997V37.4497H30.1006C29.5207 37.4497 29.0508 36.9798 29.0508 36.3999C29.0509 35.8201 29.5208 35.3501 30.1006 35.3501H35.3506V30.1001C35.3506 29.5203 35.8206 29.0504 36.4004 29.0503C36.9803 29.0503 37.4502 29.5202 37.4502 30.1001V35.3501H42.7002C43.28 35.3501 43.7509 35.8201 43.751 36.3999C43.751 36.9798 43.2801 37.4497 42.7002 37.4497H37.4502V42.6997C37.4502 43.2796 36.9803 43.7505 36.4004 43.7505C35.8206 43.7504 35.3506 43.2795 35.3506 42.6997Z" fill="white" />
      <g filter="url(#gemsSpecTex)">
        <ellipse cx="2.37523" cy="7.75803" rx="2.37523" ry="7.75803" transform="matrix(-0.804819 0.59352 0.59352 0.804819 47.6475 17.8467)" fill="white" fill-opacity="0.67" />
      </g>
      <rect x="15.9004" y="15.8999" width="41" height="41" rx="20.5" stroke="url(#gemsRim)" stroke-opacity="0.77" fill="none" />
    </svg>`;

const MARKUP = `<button type="button" class="gems-btn" aria-label="Add" data-gems="">
      <span class="gems-face">${ART}</span>
    </button>`;

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Gems</title>
<style>
html, body { margin: 0; height: 100%; }
body { min-height: 100vh; display: grid; place-items: center; background: #e8eaee; }
${CSS}
</style>
</head>
<body>
  <div class="gems-root" data-gems="">
    ${MARKUP}
  </div>
</body>
</html>`;

const REACT = `import React from "react";

const CSS = ${JSON.stringify(CSS)};

export default function GemsButton({ onClick, ...rest }) {
  return (
    <div className="gems-root" data-gems="">
      <style>{CSS}</style>
      <button type="button" className="gems-btn" aria-label="Add" data-gems="" onClick={onClick} {...rest}>
        <span className="gems-face" dangerouslySetInnerHTML={{ __html: ${JSON.stringify(ART)} }} />
      </button>
    </div>
  );
}
`;

export const GEMS_SNIPPETS = {
  html: PAGE,
  react: REACT,
  node: `const { createServer } = require("node:http");
const page = ${JSON.stringify(PAGE)};
createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(page);
}).listen(3000, () => console.log("http://localhost:3000"));`,
};

export const GEMS_META = {
  id: "gems",
  name: "Gems",
  blurb: "A 52px glossy orange add disc from TokenMeter: vertical #FF7032–#E95A37 fill, white plus, grainy specular, and a press that eases the inner shadow from a 4px well into a 1px edge kiss.",
  states: "idle, pressed, focus-visible, reduced-motion",
  keywords: [
    "animated button",
    "interactive button",
    "gems",
    "add button",
    "plus button",
    "circular button",
    "glossy button",
    "orange button",
    "tokenmeter",
    "skeuomorphic",
    "inner shadow",
    "specular highlight",
    "press state",
    "icon button",
    "fab",
    "3d button",
    "css button",
  ],
};
