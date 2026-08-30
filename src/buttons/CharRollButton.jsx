import { useEffect, useRef } from "react";
import "./char-roll-button.css";

/* Char roll button — exact replication of https://osmo-button-071.webflow.io/
   (Osmo Button Pack #071 by Eduard Bodak,
   https://x.com/eduardbodak/status/2077678856975045107)
   Default variant only, original colors, scoped under .ob071-root. */

export function CharRollButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const parseTimeToMs = (value) => {
      if (!value) return 0;
      const v = String(value).trim();
      if (v.endsWith("ms")) return parseFloat(v);
      if (v.endsWith("s")) return parseFloat(v) * 1000;
      const n = parseFloat(v);
      return Number.isFinite(n) ? n * 1000 : 0;
    };
    const getStaggerIndex = (i, count, from) => {
      if (from === "right") return count - 1 - i;
      if (from === "center") return Math.abs(i - (count - 1) / 2);
      return i;
    };
    const textElements = Array.from(root.querySelectorAll("[data-button-071-text]"));
    if (!textElements.length) return;
    const styles = getComputedStyle(root);
    const speedMs = parseTimeToMs(styles.getPropertyValue("--button-071-speed"));
    const staggerMs = parseTimeToMs(styles.getPropertyValue("--button-071-stagger"));
    const staggerFrom = (root.getAttribute("data-button-071-stagger-from") || "left").toLowerCase();
    const originals = new Map();
    const groups = [];
    const allChars = [];
    textElements.forEach((textEl) => {
      const original = textEl.textContent;
      originals.set(textEl, original);
      textEl.setAttribute("aria-label", original);
      textEl.textContent = "";
      const chars = [];
      Array.from(original).forEach((ch) => {
        const s = document.createElement("span");
        s.className = "button-071__split-char";
        s.setAttribute("aria-hidden", "true");
        s.textContent = ch === " " ? "\u00A0" : ch;
        textEl.appendChild(s);
        chars.push(s);
      });
      groups.push(chars);
      allChars.push(...chars);
    });
    let timers = [];
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    const reset = () => {
      allChars.forEach((c) => c.classList.remove("is--animating"));
      void root.offsetWidth;
    };
    const play = () => {
      groups.forEach((chars) => {
        const count = chars.length;
        chars.forEach((char, i) => {
          const startAt = getStaggerIndex(i, count, staggerFrom) * staggerMs;
          const endAt = startAt + speedMs;
          timers.push(setTimeout(() => char.classList.add("is--animating"), startAt));
          timers.push(setTimeout(() => char.classList.remove("is--animating"), endAt));
        });
      });
    };
    const onEnter = () => { clearTimers(); reset(); play(); };
    const onFocusIn = () => { if (root.matches(":focus-visible")) { clearTimers(); reset(); play(); } };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("focusin", onFocusIn);
    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("focusin", onFocusIn);
      clearTimers();
      allChars.forEach((c) => c.classList.remove("is--animating"));
      originals.forEach((original, textEl) => {
        textEl.textContent = original;
        textEl.removeAttribute("aria-label");
      });
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-071-stagger-from="center" data-button-071=""
      className={["button-071", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-071__bg"></span><span className="button-071__inner"><span data-button-071-text="" className="button-071__text is--default">Button</span><span data-button-071-text="" aria-hidden="true" className="button-071__text is--hover">Button</span></span>
    </button>
  );
}

export function CharRollButtonPreview() {
  return (
    <div className="ob071-root">
      <CharRollButton />
    </div>
  );
}
