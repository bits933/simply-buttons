import { useEffect } from "react";
import { MITKO_CTA, buildMitkoCtaCss } from "./mitko-cta.tokens.js";

const STYLE_ID = "btn-mitko-styles";

function ensureMitkoStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const tag = document.createElement("style");
  tag.id = STYLE_ID;
  tag.textContent = buildMitkoCtaCss();
  document.head.appendChild(tag);
}

if (typeof document !== "undefined") ensureMitkoStyles();

export function MitkoCtaButton({
  title = MITKO_CTA.title,
  className = "",
  ...rest
}) {
  useEffect(() => {
    ensureMitkoStyles();
  }, []);

  return (
    <button
      type="button"
      className={["btn-mitko-btn", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {title}
      <div className="btn-mitko-bar" aria-hidden="true" />
    </button>
  );
}

export function MitkoCtaPreview() {
  useEffect(() => {
    ensureMitkoStyles();
  }, []);

  return (
    <div className="btn-mitko-root">
      <MitkoCtaButton />
    </div>
  );
}
