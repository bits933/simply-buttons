import { useEffect } from "react";
import {
  ARTTECH_DOWNLOAD,
  buildArttechDownloadCss,
} from "./arttech-download.tokens.js";

const STYLE_ID = "btn-atr-styles";

function ensureArttechDownloadStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = buildArttechDownloadCss();
  document.head.appendChild(tag);
}

if (typeof document !== "undefined") ensureArttechDownloadStyles();

export function ArttechDownloadButton({
  downloadLabel = ARTTECH_DOWNLOAD.labelPrimary,
  reportLabel = ARTTECH_DOWNLOAD.labelSecondary,
  className = "",
  onClick,
  ...rest
}) {
  useEffect(() => {
    ensureArttechDownloadStyles();
  }, []);

  return (
    <button
      type="button"
      className={["btn-atr-btn", className].filter(Boolean).join(" ")}
      aria-label={ARTTECH_DOWNLOAD.label}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-atr-pill btn-atr-pill--download">
        <span className="btn-atr-label">{downloadLabel}</span>
        <span className="btn-atr-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
            <path d="M228 152v56a20 20 0 0 1-20 20H48a20 20 0 0 1-20-20v-56a12 12 0 0 1 24 0v52h152v-52a12 12 0 0 1 24 0Zm-108.49 16.49a12 12 0 0 0 16.98 0l40-40a12 12 0 1 0-16.98-16.98L140 131v-99a12 12 0 0 0-24 0v99l-19.51-19.49a12 12 0 0 0-16.98 16.98Z" />
          </svg>
        </span>
      </span>
      <span className="btn-atr-pill btn-atr-pill--report">
        <span className="btn-atr-label">{reportLabel}</span>
      </span>
    </button>
  );
}

export function ArttechDownloadPreview() {
  useEffect(() => {
    ensureArttechDownloadStyles();
  }, []);

  return (
    <div className="btn-atr-root">
      <ArttechDownloadButton />
    </div>
  );
}
