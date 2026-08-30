import { useEffect, useRef } from "react";
import "./random-rise-button.css";

/* Random rise button — exact replication of https://osmo-button-072.webflow.io/
   (Osmo Button Pack #072 by Eduard Bodak,
   https://x.com/eduardbodak/status/2078042170192244991)
   Default variant only, original colors, scoped under .ob072-root. */

export function RandomRiseButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const EASE = "linear(0, 0.0131 1%, 0.0488 2%, 0.1019 3%, 0.1678 4%, 0.2425 5%, 0.3223 6%, 0.4043 7%, 0.486 8%, 0.5655 9%, 0.641 10%, 0.7114 11%, 0.7759 12%, 0.834 13%, 0.8854 14%, 0.93 15%, 0.968 16%, 0.9997 17%, 1.0255 18%, 1.0457 19%, 1.061 20%, 1.0719 21%, 1.0789 22%, 1.0826 23%, 1.0835 24%, 1.0821 25%, 1.0789 26%, 1.0743 27%, 1.0687 28%, 1.0624 29%, 1.0557 30%, 1.0488 31%, 1.042 32%, 1.0354 33%, 1.0291 34%, 1.0233 35%, 1.018 36%, 1.0132 37%, 1.009 38%, 1.0054 39%, 1.0023 40%, 0.9997 41%, 0.9976 42%, 0.996 43%, 0.9948 44%, 0.9939 45%, 0.9933 46%, 0.9931 47%, 0.993 48%, 0.9932 49%, 0.9935 50%, 0.9939 51%, 0.9943 52%, 0.9949 53%, 0.9954 54%, 0.996 55%, 0.9966 56%, 0.9971 57%, 0.9976 58%, 0.9981 59%, 0.9986 60%, 0.9989 61%, 0.9993 62%, 0.9996 63%, 0.9998 64%, 1.0001 65%, 1.0002 66%, 1.0004 67%, 1.0005 68%, 1.0005 69%, 1.0006 70%, 1.0006 71%, 1.0006 72%, 1.0006 73%, 1.0005 74%, 1.0005 75%, 1.0005 76%, 1.0004 77%, 1.0004 78%, 1.0003 79%, 1.0003 80%, 1.0002 81%, 1.0002 82%, 1.0002 83%, 1.0001 84%, 1.0001 85%, 1.0001 86%, 1 87%, 1 88%, 1 89%, 1 90%, 1 91%, 1 92%, 1 93%, 1 94%, 1 95%, 1 96%, 1 97%, 1 98%, 1 99%, 1 100%)";
    const text = root.querySelector("[data-button-072-text]");
    if (!text) return;
    const original = text.textContent;
    text.setAttribute("aria-label", original);
    text.textContent = "";
    const chars = [];
    Array.from(original).forEach((ch) => {
      const s = document.createElement("span");
      s.className = "button-072__split-char";
      s.setAttribute("aria-hidden", "true");
      s.textContent = ch === " " ? "\u00A0" : ch;
      text.appendChild(s);
      chars.push(s);
    });
    let anims = [];
    const play = (toY, baseDelay) => {
      anims.forEach((a) => a.cancel());
      anims = [];
      const n = chars.length;
      const startIdx = Math.floor(Math.random() * n);
      chars.forEach((c, i) => {
        const delay = baseDelay + ((i - startIdx + n) % n) * 17;
        const from = getComputedStyle(c).transform;
        anims.push(c.animate(
          [{ transform: from }, { transform: "translateY(" + toY + ")" }],
          { duration: 860, delay: delay, easing: EASE, fill: "both" }
        ));
      });
    };
    const onEnter = () => play("1.3em", 50);
    const onLeave = () => play("0em", 0);
    const onFocusIn = () => { if (root.matches(":focus-visible")) onEnter(); };
    const onFocusOut = () => onLeave();
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      anims.forEach((a) => a.cancel());
      text.textContent = original;
      text.removeAttribute("aria-label");
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-072=""
      className={["button-072", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-072__bg"></span><span data-button-042-inner="" className="button-072__inner"><span className="button-072__text-outer"><span data-button-072-text="" className="button-072__text">Button</span></span></span>
    </button>
  );
}

export function RandomRiseButtonPreview() {
  return (
    <div className="ob072-root">
      <RandomRiseButton />
    </div>
  );
}
