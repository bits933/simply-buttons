const CSS = `.superhuman-cta {
  appearance: none;
  display: inline-flex;
  align-items: center;
  width: 212px;
  height: 50px;
  padding: 6px 6px 6px 16px;
  gap: 16px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 12px;
  background: linear-gradient(#1b1938 0%, #1b1938 100%);
  box-shadow: 0 1px 2px rgba(20, 20, 19, .24), 0 0 0 1px #353088;
  color: #fff;
  font-family: system-ui, sans-serif;
  font-size: 16px;
  font-weight: 460;
  line-height: 1.2;
  cursor: pointer;
  white-space: nowrap;
  transform-origin: center;
  transition: transform 120ms cubic-bezier(.2,.8,.2,1);
}
.superhuman-cta__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 48px;
  width: 48px;
  height: 36px;
  border: 1px solid transparent;
  border-radius: 8px;
  background:
    linear-gradient(rgba(255,255,255,.12), transparent) border-box,
    radial-gradient(circle at 68% 50%, rgba(133,125,250,.6), transparent 50%),
    radial-gradient(circle at 50% 98%, rgba(255,51,102,.6), transparent 50%),
    radial-gradient(circle at 93% 50%, rgba(75,105,227,.5), transparent 50%),
    radial-gradient(circle at 50% 75%, rgba(104,222,255,.5), transparent 50%),
    linear-gradient(#554dcb, #4a43b0);
}
.superhuman-cta__icon svg { transition: translate 300ms ease-in-out; }
.superhuman-cta:hover { background: linear-gradient(#1b1938 0%, #2d2a5c 100%); }
.superhuman-cta:hover .superhuman-cta__icon svg { translate: 4px; }
.superhuman-cta:active { transform: scale(.98); }
.superhuman-cta:focus-visible { outline: 2px solid #857dfa; outline-offset: 3px; }
@media (prefers-reduced-motion: reduce) {
  .superhuman-cta { transition: none; }
  .superhuman-cta:active { transform: none; }
  .superhuman-cta__icon svg { transition: none; }
}`;

const BUTTON = `<button type="button" class="superhuman-cta" aria-label="Get Superhuman">
  <span>Get Superhuman</span>
  <span class="superhuman-cta__icon" aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M11.333 3.333 18 10l-6.667 6.667M18 10H2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
</button>`;

const PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Superhuman CTA</title>
  <style>body{min-height:100vh;margin:0;display:grid;place-items:center;background:#f7f7f5}${CSS}</style>
</head>
<body>${BUTTON}</body>
</html>`;

const REACT = `import { ArrowRight } from "@phosphor-icons/react";

const CSS = ${JSON.stringify(CSS)};

export default function SuperhumanCtaButton({ onClick }) {
  return (
    <>
      <style>{CSS}</style>
      <button type="button" className="superhuman-cta" aria-label="Get Superhuman" onClick={onClick}>
        <span>Get Superhuman</span>
        <span className="superhuman-cta__icon" aria-hidden="true">
          <ArrowRight size={20} weight="bold" />
        </span>
      </button>
    </>
  );
}`;

export const SUPERHUMAN_CTA_SNIPPETS = {
  html: PAGE,
  react: REACT,
  node: `const express = require("express");
const app = express();
const page = ${JSON.stringify(PAGE)};
app.get("/", (_req, res) => res.type("html").send(page));
app.listen(3000, () => console.log("http://localhost:3000"));`,
};

export const SUPERHUMAN_CTA_META = {
  id: "superhuman-cta",
  name: "Superhuman CTA",
  blurb: "A faithful recreation of Superhuman's hero CTA with a deep navy shell, luminous gradient arrow tile, fixed-width directional hover motion, and a subtle press scale.",
  states: "default, hover, active, focus-visible, reduced motion",
  keywords: ["superhuman", "get superhuman", "hero cta", "navy button", "purple gradient", "arrow tile", "arrow button", "premium cta", "signup button", "gradient icon", "hover arrow", "dark button", "animated button", "interactive button", "hover animation", "directional motion", "rounded rectangle"],
};
