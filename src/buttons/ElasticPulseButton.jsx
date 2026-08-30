import { useEffect, useRef } from "react";
import "./elastic-pulse-button.css";

/* Elastic pulse button — exact replication of https://osmo-button-045.webflow.io/
   (Osmo Button Pack #045 by Eduard Bodak,
   https://x.com/eduardbodak/status/2067900864811962855)
   Default variant only, original colors, scoped under .ob045-root. */

export function ElasticPulseButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const inner = root.querySelector("[data-button-045-inner]") || root;
    const ELASTIC = "linear(0, 0.3695 6.94%, 0.7115 12.25%, 0.9387 16.59%, 1.0203 19.72%, 1.0558 22.36%, 1.05 24.86%, 1.0196 27.37%, 0.9757 30.06%, 0.9669 31.9%, 0.9735 34.18%, 0.9959 38.24%, 1.0053 41.66%, 1.0051 45.5%, 0.9992 51.6%, 0.9998 57.75%, 1)";
    const runPulse = (click) => {
      if (inner._locked) return;
      inner._locked = true;
      setTimeout(() => { inner._locked = false; }, click ? 100 : 350);
      const w = inner.offsetWidth, h = inner.offsetHeight;
      const fs = parseFloat(getComputedStyle(inner).fontSize);
      const stretch = 0.75 * fs;
      const sx = (w + stretch) / w, sy = (h - stretch * 0.33) / h;
      inner.animate(
        [
          { transform: "scale(1, 1)", easing: "cubic-bezier(0.5, 1, 0.89, 1)" },
          { transform: "scale(" + (click ? sy : sx) + ", " + (click ? sx * 1.3 : sy) + ")", easing: ELASTIC },
          { transform: "scale(1, 1)" },
        ],
        { duration: 1100 }
      );
      root.animate(
        [
          { scale: "1", easing: "cubic-bezier(0.5, 1, 0.89, 1)" },
          { scale: click ? "0.8" : "1", easing: ELASTIC },
          { scale: "1" },
        ],
        { duration: 1100 }
      );
    };
    const onEnter = () => runPulse(false);
    const onDown = () => runPulse(true);
    const onFocus = () => { if (root.matches(":focus-visible")) runPulse(false); };
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("pointerdown", onDown);
    root.addEventListener("focusin", onFocus);
    return () => {
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("pointerdown", onDown);
      root.removeEventListener("focusin", onFocus);
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-045=""
      className={["button-045", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span data-button-045-inner="" className="button-045__inner"><span className="button-045__text">Button</span></span>
    </button>
  );
}

export function ElasticPulseButtonPreview() {
  return (
    <div className="ob045-root">
      <ElasticPulseButton />
    </div>
  );
}
