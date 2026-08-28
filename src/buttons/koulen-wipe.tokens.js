export const KOULEN_WIPE = {
  label: "BUTTON",
  fill: "#FFC800",
  restInk: "#FFFFFF",
  hotInk: "#000000",
  stage: "#141414",
  focus: "#f5f5f5",
  width: "199px",
  height: "90px",
  font: "Koulen",
  fontSize: "36px",
  duration: "480ms",
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
};

export function buildKoulenWipeCss({ previewStage = true } = {}) {
  const t = KOULEN_WIPE;
  const rootStage = previewStage
    ? `.btn-koulen-root {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  background: ${t.stage};
}`
    : `.btn-koulen-root { display: grid; place-items: center; }`;

  return `
.btn-koulen-root,
.btn-koulen-btn {
  --koulen-fill: ${t.fill};
  --koulen-rest: ${t.restInk};
  --koulen-hot: ${t.hotInk};
  --koulen-focus: ${t.focus};
  --koulen-ms: ${t.duration};
  --koulen-ease: ${t.ease};
}
${rootStage}
.btn-koulen-btn {
  appearance: none;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: grid;
  place-items: center;
  width: ${t.width};
  height: ${t.height};
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--koulen-rest);
  font-family: ${t.font}, Impact, Haettenschweiler, sans-serif;
  font-size: ${t.fontSize};
  font-weight: 400;
  font-style: normal;
  letter-spacing: 0;
  line-height: 1;
  text-transform: uppercase;
  cursor: pointer;
  contain: paint;
  -webkit-font-smoothing: antialiased;
}
.btn-koulen-btn *,
.btn-koulen-btn *::before,
.btn-koulen-btn *::after { box-sizing: border-box; }
.btn-koulen-fill {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--koulen-fill);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--koulen-ms) var(--koulen-ease);
  pointer-events: none;
  will-change: transform;
  backface-visibility: hidden;
}
.btn-koulen-ink--rest {
  position: relative;
  z-index: 1;
  color: var(--koulen-rest);
  white-space: nowrap;
  line-height: 1;
  pointer-events: none;
}
.btn-koulen-hot {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: grid;
  place-items: center;
  clip-path: inset(0 100% 0 0);
  transition: clip-path var(--koulen-ms) var(--koulen-ease);
  pointer-events: none;
  will-change: clip-path;
}
.btn-koulen-ink--hot {
  color: var(--koulen-hot);
  white-space: nowrap;
  line-height: 1;
}
.btn-koulen-btn:hover:not(:disabled) .btn-koulen-fill,
.btn-koulen-btn:active:not(:disabled) .btn-koulen-fill {
  transform: scaleX(1);
}
.btn-koulen-btn:hover:not(:disabled) .btn-koulen-hot,
.btn-koulen-btn:active:not(:disabled) .btn-koulen-hot {
  clip-path: inset(0 0% 0 0);
}
.btn-koulen-btn:focus { outline: none; }
.btn-koulen-btn:focus-visible {
  outline: 2px solid var(--koulen-focus);
  outline-offset: 4px;
}
.btn-koulen-btn:focus-visible .btn-koulen-fill {
  transform: scaleX(1);
}
.btn-koulen-btn:focus-visible .btn-koulen-hot {
  clip-path: inset(0 0% 0 0);
}
.btn-koulen-btn:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}
@media (prefers-reduced-motion: reduce) {
  .btn-koulen-fill,
  .btn-koulen-hot { transition: none; will-change: auto; }
}
`.trim();
}
