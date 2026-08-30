import { useEffect, useRef } from "react";
import "./blur-stagger-button.css";

/* Blur stagger button — exact replication of https://osmo-button-041.webflow.io/
   (Osmo Button Pack #041 by Eduard Bodak,
   https://x.com/eduardbodak/status/2066445667178873273)
   Default variant only, original colors, scoped under .ob041-root. */

export function BlurStaggerButton({ label = "Button", className = "", onClick, ...rest }) {
  useEffect(() => {
    document.querySelectorAll("[data-button-041-text]").forEach((el) => {
      if (el._split) return;
      el._split = true;
      const text = el.textContent;
      el.textContent = "";
      Array.from(text).forEach((ch, i) => {
        const s = document.createElement("span");
        s.className = "button-041__split-char";
        s.style.setProperty("--char", i + 1);
        s.textContent = ch === " " ? "\u00A0" : ch;
        el.appendChild(s);
      });
    });
  }, []);
  return (
    <button
      type="button"
      data-button-041=""
      className={["button-041", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-041__bg"></span><span className="button-041__inner"><span data-button-041-text="" className="button-041__text is--default">Button</span><span data-button-041-text="" aria-hidden="true" className="button-041__text is--hover">Button</span></span>
    </button>
  );
}

export function BlurStaggerButtonPreview() {
  return (
    <div className="ob041-root">
      <BlurStaggerButton />
    </div>
  );
}
