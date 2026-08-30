import { useEffect, useRef } from "react";
import "./letter-rotate-button.css";

/* Letter rotate button — exact replication of https://osmo-button-069.webflow.io/
   (Osmo Button Pack #069 by Eduard Bodak,
   https://x.com/eduardbodak/status/2076952869643727250)
   Default variant only, original colors, scoped under .ob069-root. */

export function LetterRotateButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const textEl = root.querySelector("[data-button-069-text]") || root;
    const rotateRight = (s) => (s && s.length > 1 ? s.slice(-1) + s.slice(0, -1) : s);
    const tokenize = (text) => {
      const parts = text.match(/\S+|\s+/g) || [];
      return parts.map((p) => {
        if (/^\s+$/.test(p)) return { type: "raw", raw: p };
        const m = p.match(/^([\p{L}'\u2019]+)(.*)$/u);
        if (!m) return { type: "raw", raw: p };
        return { type: "word", letters: m[1], trailing: m[2] || "" };
      });
    };
    const speed = Number(root.getAttribute("data-button-069-speed")) || 46;
    let timer = null;
    let original = "";
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
      if (original) textEl.textContent = original;
    };
    const start = () => {
      stop();
      original = textEl.textContent;
      const tokens = tokenize(original);
      const wordTokens = tokens.filter((t) => t.type === "word");
      if (!wordTokens.length) return;
      const maxLen = wordTokens.reduce((m, t) => Math.max(m, t.letters.length), 0);
      let tick = 0;
      timer = setInterval(() => {
        wordTokens.forEach((t) => { t.letters = rotateRight(t.letters); });
        textEl.textContent = tokens.map((t) => (t.type === "word" ? t.letters + t.trailing : t.raw)).join("");
        if (++tick >= maxLen) stop();
      }, speed);
    };
    const onLeave = () => { if (!root.matches(":focus-visible")) stop(); };
    const onFocusIn = () => { if (root.matches(":focus-visible")) start(); };
    const onFocusOut = () => { if (!root.matches(":hover")) stop(); };
    root.addEventListener("pointerenter", start);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    return () => {
      root.removeEventListener("pointerenter", start);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      if (timer) clearInterval(timer);
      if (original) textEl.textContent = original;
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-069=""
      className={["button-069", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-069__bg"></span><span data-button-069-text="" className="button-069__text">Button</span>
    </button>
  );
}

export function LetterRotateButtonPreview() {
  return (
    <div className="ob069-root">
      <LetterRotateButton />
    </div>
  );
}
