/** Shipped wipe tokens for the gallery button. */

export const MITKO_CTA = {
  title: "this is a button",
  restPosition: "100% 50%",
  hoverPosition: "0% 50%",
  size: "201%",
  duration: "0.3s",
  easing: "cubic-bezier(0, 0, 0.58, 1)",
  gray: "rgb(150, 150, 150)",
  ink: "rgb(36, 33, 38)",
  underlineHeight: "2px",
  underlineEm: "0.075em",
  fontSize: "16px",
  pressedFontSize: "14px",
  fontWeight: "500",
  lineHeight: "1.6",
  rowGap: "4px",
};

export function mitkoCtaGradient() {
  return `linear-gradient(to left, ${MITKO_CTA.gray} 50%, ${MITKO_CTA.ink} 50%)`;
}

export function mitkoRgb(cssRgb) {
  const match = String(cssRgb).match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (!match) return null;
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}

/** Live site paint: rest 100% shows the gray stop; hover 0% shows the ink stop. */
export function mitkoRestPaint() {
  return mitkoRgb(MITKO_CTA.gray);
}

export function mitkoHoverPaint() {
  return mitkoRgb(MITKO_CTA.ink);
}

export function buildMitkoCtaCss() {
  const t = MITKO_CTA;
  return `
.btn-mitko-root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-mitko-btn {
  --mitko-ink: ${t.ink};
  --mitko-gray: ${t.gray};
  --mitko-focus: ${t.ink};
  appearance: none;
  display: grid;
  grid-template-rows: auto;
  row-gap: ${t.rowGap};
  column-gap: 0;
  width: min-content;
  min-width: unset;
  height: min-content;
  padding: 0;
  border: none;
  border-radius: 1px;
  background: transparent;
  color: var(--mitko-ink);
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  font-size: ${t.fontSize};
  font-weight: ${t.fontWeight};
  line-height: ${t.lineHeight};
  letter-spacing: 0;
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: font-size 80ms ease;
}
:root[data-theme="dark"] .btn-mitko-root,
:root[data-theme="dark"] .btn-mitko-btn {
  --mitko-ink: #ecebe5;
  --mitko-gray: ${t.gray};
  --mitko-focus: #f5f5f5;
}
.btn-mitko-btn *,
.btn-mitko-btn *::before,
.btn-mitko-btn *::after { box-sizing: border-box; }
.btn-mitko-bar {
  display: block;
  grid-column: 1 / -1;
  width: 100%;
  height: ${t.underlineEm};
  min-height: ${t.underlineHeight};
  background-image: ${mitkoCtaGradient()};
  background-size: ${t.size} auto;
  background-position: ${t.restPosition};
  background-repeat: no-repeat;
  transition: background-position ${t.duration} ${t.easing};
  pointer-events: none;
}
:root[data-theme="dark"] .btn-mitko-bar {
  background-image: linear-gradient(to left, var(--mitko-gray) 50%, var(--mitko-ink) 50%);
}
.btn-mitko-btn:hover .btn-mitko-bar,
.btn-mitko-btn:focus-visible .btn-mitko-bar {
  background-position: ${t.hoverPosition};
}
.btn-mitko-btn:active {
  font-size: ${t.pressedFontSize};
}
.btn-mitko-btn:focus-visible {
  outline: 2px solid var(--mitko-focus);
  outline-offset: 8px;
}
@media (prefers-reduced-motion: reduce) {
  .btn-mitko-btn,
  .btn-mitko-bar { transition: none; }
}
`.trim();
}
