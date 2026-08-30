import { useEffect, useRef } from "react";
import "./direction-stagger-button.css";

/* Direction stagger button — exact replication of https://osmo-button-066.webflow.io/
   (Osmo Button Pack #066 by Eduard Bodak,
   https://x.com/eduardbodak/status/2075879690254868896)
   Default variant only, original colors, scoped under .ob066-root. */

export function DirectionStaggerButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current && ref.current.querySelector("[data-button-066-text]");
    if (!el) return;
    const original = el.textContent;
    el.setAttribute("aria-label", original);
    el.textContent = "";
    Array.from(original).forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "button-066__split-char";
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--char", i + 1);
      s.style.setProperty("--button-066-char-direction", i % 2 === 0 ? "-1" : "1");
      s.textContent = ch === " " ? "\u00A0" : ch;
      el.appendChild(s);
    });
    return () => {
      el.textContent = original;
      el.removeAttribute("aria-label");
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-066=""
      className={["button-066", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-066__bg"></span><span className="button-066__inner"><span data-button-066-text="" className="button-066__text">Button</span></span>
    </button>
  );
}

export function DirectionStaggerButtonPreview() {
  return (
    <div className="ob066-root">
      <DirectionStaggerButton />
    </div>
  );
}
