const CSS = `
.btn-floema-button {
  --btn-floema-bg: #ffffff;
  --btn-floema-color: #241f21;
  --btn-floema-ease: cubic-bezier(0.19, 1, 0.22, 1);
  --btn-floema-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --btn-floema-icon-spring: cubic-bezier(0.12, 1.2, 0.16, 2.35);

  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  appearance: none;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 160ms var(--btn-floema-ease);
}

.btn-floema-button.theme-dark {
  --btn-floema-bg: #241f21;
  --btn-floema-color: #ebe7df;
}

.btn-floema-button.theme-light {
  --btn-floema-bg: #ffffff;
  --btn-floema-color: #241f21;
}

.btn-floema-container {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 44px;
}

/* Gooey Background Filter Layer */
.btn-floema-goo-layer {
  position: absolute;
  inset: -12px -16px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  pointer-events: none;
  filter: url(#floema-goo-effect);
  -webkit-filter: url(#floema-goo-effect);
  z-index: 1;
}

.btn-floema-blob {
  display: block;
  height: 44px;
  background: var(--btn-floema-bg);
  box-sizing: border-box;
}

.btn-floema-blob--icon {
  width: 44px;
  border-radius: 12px;
  margin-right: 0px;
  flex: 0 0 44px;
  transition: margin-right 480ms var(--btn-floema-spring);
}

.btn-floema-blob--label {
  height: 44px;
  border-radius: 22px;
  flex: 0 0 auto;
}

/* Crisp Content Layer */
.btn-floema-content-layer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  height: 44px;
}

.btn-floema-icon-side {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  margin-right: 0px;
  flex: 0 0 44px;
  box-sizing: border-box;
  transition: margin-right 480ms var(--btn-floema-spring);
}

.btn-floema-icon {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
  color: var(--btn-floema-color);
  transform: scale(1);
  transition: transform 480ms var(--btn-floema-icon-spring), color 300ms var(--btn-floema-ease);
}

.btn-floema-icon svg {
  display: block;
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.btn-floema-label-side {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 20px 0 16px;
  box-sizing: border-box;
}

.btn-floema-label {
  position: relative;
  color: var(--btn-floema-color);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.4em;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
  transition: color 300ms var(--btn-floema-ease);
}

@media (hover: hover) {
  .btn-floema-button:hover:not(:disabled) .btn-floema-blob--icon,
  .btn-floema-button.is-hover .btn-floema-blob--icon,
  .btn-floema-button:hover:not(:disabled) .btn-floema-icon-side,
  .btn-floema-button.is-hover .btn-floema-icon-side {
    margin-right: 14px;
  }

  .btn-floema-button:hover:not(:disabled) .btn-floema-icon,
  .btn-floema-button.is-hover .btn-floema-icon {
    transform: scale(1.07);
  }
}

.btn-floema-button:active:not(:disabled) {
  transform: scale(0.975);
  transition-duration: 80ms;
}

.btn-floema-button:focus-visible {
  outline: 2px solid var(--btn-floema-color);
  outline-offset: 4px;
  border-radius: 22px;
}

.btn-floema-button:disabled {
  opacity: 0.48;
  cursor: not-allowed;
  pointer-events: none;
}
`.trim();

const ICON_SVG = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M15.6492 14.7367H10.2453V6.81263C10.2453 6.51422 10.5349 6.29854 10.8214 6.38422L16.0953 7.96785V14.2906C16.0953 14.5358 15.8944 14.7367 15.6492 14.7367ZM8.78281 14.7367H7.32031V10.3492H2.93281V14.7367H1.91645C1.66827 14.7367 1.47031 14.5358 1.47031 14.2906V3.03672H8.33668C8.5819 3.03672 8.78281 3.23763 8.78281 3.48286V14.7367ZM4.39531 14.2906V11.8117H5.41168C5.6569 11.8117 5.85781 12.0126 5.85781 12.2579V14.7367H4.84145C4.59622 14.7367 4.39531 14.5358 4.39531 14.2906ZM10.2453 4.68535V1.57422H0.0078125V16.1992H17.5578V6.88058L10.2453 4.68831V4.68535Z" fill="currentColor"/><path d="M7.31719 7.42383H2.92969V8.88633H7.31719V7.42383Z" fill="currentColor"/><path d="M7.31719 4.5H2.92969V5.9625H7.31719V4.5Z" fill="currentColor"/><path d="M15.3641 8.88672H10.9766V10.3492H15.3641V8.88672Z" fill="currentColor"/><path d="M15.3641 11.8125H10.9766V13.275H15.3641V11.8125Z" fill="currentColor"/></svg>`;

const FILTER_SVG = `<svg class="btn-floema-filter-svg" aria-hidden="true" width="0" height="0" style="position:absolute;width:0;height:0;pointer-events:none;"><defs><filter id="floema-goo-effect" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/><feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo"/><feComposite in="SourceGraphic" in2="goo" operator="atop"/></filter></defs></svg>`;

const MARKUP = `
${FILTER_SVG}
<button class="btn-floema-button" type="button" aria-label="SEE URBAN PRODUCTS">
  <div class="btn-floema-container">
    <div class="btn-floema-goo-layer" aria-hidden="true">
      <span class="btn-floema-blob btn-floema-blob--icon"></span>
      <span class="btn-floema-blob btn-floema-blob--label" style="width: 180px;"></span>
    </div>
    <div class="btn-floema-content-layer">
      <span class="btn-floema-icon-side" aria-hidden="true">
        <span class="btn-floema-icon">${ICON_SVG}</span>
      </span>
      <span class="btn-floema-label-side">
        <span class="btn-floema-label">SEE URBAN PRODUCTS</span>
      </span>
    </div>
  </div>
</button>
`.trim();

const HTML_PAGE = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Floema Liquid Gooey CTA Button</title>
  <style>
    body { min-height: 100vh; display: grid; place-items: center; margin: 0; background: #121315; }
    ${CSS}
  </style>
</head>
<body>
  ${MARKUP}
  <script>
    var labelSide = document.querySelector('.btn-floema-label-side');
    var labelBlob = document.querySelector('.btn-floema-blob--label');
    function syncWidth() {
      if (labelSide && labelBlob) {
        labelBlob.style.width = labelSide.offsetWidth + 'px';
      }
    }
    syncWidth();
    window.addEventListener('resize', syncWidth);
    document.fonts && document.fonts.ready.then(syncWidth);
  </script>
</body>
</html>`;

export const FLOEMA_CTA_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";\n\nimport { useEffect, useRef, useState } from "react";\n\nconst CSS = ${JSON.stringify(
    CSS
  )};\n\nconst ICON_SVG = ${JSON.stringify(ICON_SVG)};\n\nexport default function FloemaCtaButton({ label = "SEE URBAN PRODUCTS", onClick, disabled = false }) {\n  const labelSideRef = useRef(null);\n  const [labelWidth, setLabelWidth] = useState(180);\n\n  useEffect(() => {\n    function measure() {\n      if (labelSideRef.current) {\n        const w = labelSideRef.current.getBoundingClientRect().width;\n        if (w > 0) setLabelWidth(w);\n      }\n    }\n    measure();\n    window.addEventListener("resize", measure);\n    return () => window.removeEventListener("resize", measure);\n  }, [label]);\n\n  return (\n    <>\n      <svg className="btn-floema-filter-svg" aria-hidden="true" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>\n        <defs>\n          <filter id="floema-goo-effect" x="-20%" y="-20%" width="140%" height="140%">\n            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />\n            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />\n            <feComposite in="SourceGraphic" in2="goo" operator="atop" />\n          </filter>\n        </defs>\n      </svg>\n      <button type="button" className="btn-floema-button" disabled={disabled} onClick={onClick} aria-label={label}>\n        <div className="btn-floema-container">\n          <div className="btn-floema-goo-layer" aria-hidden="true">\n            <span className="btn-floema-blob btn-floema-blob--icon" />\n            <span className="btn-floema-blob btn-floema-blob--label" style={{ width: \`\${labelWidth}px\` }} />\n          </div>\n          <div className="btn-floema-content-layer">\n            <span className="btn-floema-icon-side" aria-hidden="true">\n              <span className="btn-floema-icon" dangerouslySetInnerHTML={{ __html: ICON_SVG }} />\n            </span>\n            <span ref={labelSideRef} className="btn-floema-label-side">\n              <span className="btn-floema-label">{label}</span>\n            </span>\n          </div>\n        </div>\n      </button>\n    </>\n  );\n}\n`,
  node: `import { createServer } from "node:http";\n\nconst page = ${JSON.stringify(
    HTML_PAGE
  )};\n\ncreateServer((_req, res) => res.writeHead(200, { "content-type": "text/html; charset=utf-8" }).end(page)).listen(3000, () => console.log("http://localhost:3000"));\n`,
};

export const FLOEMA_CTA_META = {
  id: "floema-cta",
  name: "Floema liquid gooey CTA",
  blurb: "Authentic SVG gooey liquid morphing dual-pill CTA with spring hover separation and crisp foreground.",
  states: "gooey bridge, elastic hover stretch, active press, focus, disabled, reduced motion",
  keywords: [
    "floema cta",
    "gooey button",
    "liquid morph",
    "svg gooey",
    "dual pill",
    "spring separation",
    "elastic hover",
    "morphing cta",
    "liquid blob",
    "filter goo",
    "pill pair",
    "soft body",
    "stretch hover",
    "floema liquid",
    "gooey liquid",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
