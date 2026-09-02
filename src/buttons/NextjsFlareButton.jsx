import React, { useEffect, useRef } from "react";
import "./nextjs-flare-button.css";
import { initNextjsFlare } from "./nextjs-flare-webgl.js";

function FlareIcon() {
  return (
    <svg
      className="njf-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function NextjsFlareButton({
  label = "Next.js Flare",
  onClick,
  ...rest
}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const instance = initNextjsFlare(wrap);
    return () => {
      if (instance) instance.destroy();
    };
  }, []);

  return (
    <div ref={wrapRef} className="njf-wrap" data-nextjs-flare-wrap>
      <canvas className="njf-canvas" aria-hidden="true" />
      <button
        type="button"
        className="btn-nextjs-flare"
        aria-label={label}
        onClick={onClick}
        {...rest}
      >
        <span className="njf-label">{label}</span>
        <FlareIcon />
      </button>
    </div>
  );
}

export function NextjsFlareButtonPreview() {
  return (
    <div className="nextjs-flare-root" data-nextjs-flare>
      <NextjsFlareButton />
    </div>
  );
}

export default NextjsFlareButton;
