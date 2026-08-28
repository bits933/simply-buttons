/** Shipped tokens for the ART+TECH Report "Download the full report" CTA. */

export const ARTTECH_DOWNLOAD = {
  labelPrimary: "download",
  labelSecondary: "the full report",
  label: "Download the full report",
  ink: "#171717",
  hoverInk: "#000000",
  text: "#ffffff",
  downloadWidth: "114px",
  reportWidth: "146px",
  hoverDownloadWidth: "138px",
  hoverReportWidth: "158px",
  height: "42px",
  hoverHeight: "48px",
  downloadRadius: "9999px",
  reportRadius: "8px",
  joinOffset: "-2px",
  fontSize: "12px",
  fontWeight: "600",
  letterSpacing: "0.03em",
  ease: "cubic-bezier(0.053, 0.001, 0.07, 0.995)",
  growDuration: "0.45s",
  colorDuration: "0.2s",
  iconDelay: "0.08s",
  iconSize: "16px",
  iconMargin: "8px",
};

export const ARTTECH_DOWNLOAD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M228 152v56a20 20 0 0 1-20 20H48a20 20 0 0 1-20-20v-56a12 12 0 0 1 24 0v52h152v-52a12 12 0 0 1 24 0Zm-108.49 16.49a12 12 0 0 0 16.98 0l40-40a12 12 0 1 0-16.98-16.98L140 131v-99a12 12 0 0 0-24 0v99l-19.51-19.49a12 12 0 0 0-16.98 16.98Z"/></svg>`;

export function buildArttechDownloadCss() {
  const t = ARTTECH_DOWNLOAD;
  return `
.btn-atr-root {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 12px 0;
}
.btn-atr-btn {
  --atr-ink: ${t.ink};
  --atr-hover: ${t.hoverInk};
  --atr-text: ${t.text};
  appearance: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
:root[data-theme="dark"] .btn-atr-btn {
  --atr-ink: #ecebe5;
  --atr-hover: #ffffff;
  --atr-text: #171717;
}
.btn-atr-btn *,
.btn-atr-btn *::before,
.btn-atr-btn *::after { box-sizing: border-box; }
.btn-atr-btn:focus { outline: none; }
.btn-atr-btn:focus-visible {
  outline: 2px solid var(--atr-ink);
  outline-offset: 4px;
  border-radius: ${t.downloadRadius} ${t.reportRadius} ${t.reportRadius} ${t.downloadRadius};
}
:root[data-theme="dark"] .btn-atr-btn:focus-visible {
  outline-color: #ecebe5;
}
.btn-atr-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${t.height};
  background: var(--atr-ink);
  color: var(--atr-text);
  overflow: hidden;
  font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: ${t.fontSize};
  font-weight: ${t.fontWeight};
  letter-spacing: ${t.letterSpacing};
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    width ${t.growDuration} ${t.ease},
    height ${t.growDuration} ${t.ease},
    background-color ${t.colorDuration} linear;
}
.btn-atr-pill--download {
  position: relative;
  z-index: 1;
  width: ${t.downloadWidth};
  border-radius: ${t.downloadRadius};
}
.btn-atr-pill--report {
  width: ${t.reportWidth};
  margin-left: ${t.joinOffset};
  border-radius: ${t.reportRadius};
}
.btn-atr-label {
  display: inline-block;
  line-height: 1;
}
.btn-atr-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0;
  height: ${t.iconSize};
  margin-left: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateX(-8px) scale(0.6);
  pointer-events: none;
  transition:
    width ${t.growDuration} ${t.ease},
    margin-left ${t.growDuration} ${t.ease},
    transform ${t.growDuration} ${t.ease},
    opacity ${t.colorDuration} linear ${t.iconDelay};
}
.btn-atr-icon svg {
  display: block;
  width: ${t.iconSize};
  height: ${t.iconSize};
  min-width: ${t.iconSize};
  flex: none;
}
.btn-atr-btn:hover .btn-atr-pill--download,
.btn-atr-btn:focus-visible .btn-atr-pill--download {
  width: ${t.hoverDownloadWidth};
  height: ${t.hoverHeight};
  background: var(--atr-hover);
}
.btn-atr-btn:hover .btn-atr-pill--report,
.btn-atr-btn:focus-visible .btn-atr-pill--report {
  width: ${t.hoverReportWidth};
  height: ${t.hoverHeight};
  background: var(--atr-hover);
}
.btn-atr-btn:hover .btn-atr-icon,
.btn-atr-btn:focus-visible .btn-atr-icon {
  width: ${t.iconSize};
  margin-left: ${t.iconMargin};
  transform: translateX(0) scale(1);
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .btn-atr-pill,
  .btn-atr-label,
  .btn-atr-icon { transition: none; }
}
`.trim();
}
