import { useEffect, useRef } from "react";
import "./chromatic-rise-button.css";

/* Chromatic rise button — exact replication of https://osmo-button-067.webflow.io/
   (Osmo Button Pack #067 by Eduard Bodak,
   https://x.com/eduardbodak/status/2076233941644714437)
   Default variant only, original colors, scoped under .ob067-root. */

export function ChromaticRiseButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const text = root.querySelector("[data-button-067-text]");
    const bgHover = root.querySelector("[data-button-067-bg-hover]");
    if (!text) return;
    const original = text.textContent;
    text.setAttribute("aria-label", original);
    text.textContent = "";
    const chars = [];
    Array.from(original).forEach((ch) => {
      const s = document.createElement("span");
      s.className = "split-char";
      s.setAttribute("aria-hidden", "true");
      s.textContent = ch === " " ? "\u00A0" : ch;
      text.appendChild(s);
      chars.push(s);
    });
    const styles = getComputedStyle(root);
    const baseColor = styles.getPropertyValue("--button-067-color").trim();
    const hoverColor = styles.getPropertyValue("--button-067-hover-color").trim();
    const step = chars.length > 1 ? 150 / (chars.length - 1) : 0;
    let timers = [];
    const later = (fn, t) => timers.push(setTimeout(fn, t));
    const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
    const settleChars = () => {
      chars.forEach((c) => {
        c.style.transition = "color 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        c.style.color = baseColor;
        c.style.opacity = "1";
      });
    };
    const hideBg = () => {
      if (!bgHover) return;
      bgHover.style.transition = "transform 0.3s cubic-bezier(0.55, 0.055, 0.675, 0.19)";
      bgHover.style.transform = "translateY(101%)";
    };
    const enter = () => {
      clearTimers();
      chars.forEach((c, i) => {
        c.style.transition = "opacity 0.1s linear " + i * step + "ms";
        c.style.opacity = "0";
        later(() => {
          c.style.transition = "color 0.1s linear " + i * step + "ms, opacity 0.1s linear " + i * step + "ms";
          c.style.color = hoverColor;
          c.style.opacity = "1";
        }, 250);
      });
      if (bgHover) later(() => {
        bgHover.style.transition = "transform 0.25s cubic-bezier(0.215, 0.61, 0.355, 1)";
        bgHover.style.transform = "translateY(0%)";
      }, 235);
    };
    const leave = () => { clearTimers(); settleChars(); hideBg(); };
    const onEnter = () => enter();
    const onLeave = () => leave();
    const onFocusIn = () => { if (root.matches(":focus-visible")) enter(); };
    const onFocusOut = () => { if (!root.matches(":hover")) leave(); };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      clearTimers();
      text.textContent = original;
      text.removeAttribute("aria-label");
      chars.forEach((c) => { c.style.transition = ""; c.style.color = ""; c.style.opacity = ""; });
      if (bgHover) { bgHover.style.transition = ""; bgHover.style.transform = ""; }
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-067=""
      className={["button-067", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-067__bg"><span data-button-067-bg-hover="" className="button-067__bg-hover"></span></span><span className="button-067__inner"><span data-button-067-text="" className="button-067__text">Button</span></span>
    </button>
  );
}

export function ChromaticRiseButtonPreview() {
  return (
    <div className="ob067-root">
      <ChromaticRiseButton />
    </div>
  );
}
