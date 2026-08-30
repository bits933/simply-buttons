import { useEffect, useRef } from "react";
import "./draw-arrow-button.css";

/* Draw arrow button — exact replication of https://osmo-button-077.webflow.io/
   (Osmo Button Pack #077 by Eduard Bodak,
   https://x.com/eduardbodak/status/2079863933708493255)
   Default variant only, original colors, scoped under .ob077-root. */

export function DrawArrowButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;
    const CIRC_OUT = "cubic-bezier(0, 0.55, 0.45, 1)";
    const CIRC_IN_OUT = "cubic-bezier(0.85, 0, 0.15, 1)";
    const text = root.querySelector("[data-button-077-text]");
    const icon = root.querySelector("[data-button-077-icon]");
    if (!icon || !text) return;
    const paths = icon.querySelectorAll("path");
    if (paths.length < 2) return;
    const linePath = paths[0];
    const tipPath = paths[1];
    const lens = new Map();
    [linePath, tipPath].forEach((p) => {
      lens.set(p, p.getTotalLength());
      p.style.strokeDasharray = lens.get(p) + " " + lens.get(p);
      p.style.strokeDashoffset = "0";
    });
    const animateWindow = (p, from, to, dur, ease, delay) => {
      const L = lens.get(p);
      const da = (w) => (w[1] - w[0]) * L + " " + L;
      const off = (w) => String(-w[0] * L);
      return p.animate(
        [
          { strokeDasharray: da(from), strokeDashoffset: off(from) },
          { strokeDasharray: da(to), strokeDashoffset: off(to) }
        ],
        { duration: dur, delay: delay, easing: ease, fill: "both" }
      );
    };
    let running = false;
    const playSequence = () => {
      if (running) return;
      running = true;
      setTimeout(() => { running = false; }, 850);
      const anims = [
        animateWindow(linePath, [0, 1], [1, 1], 250, CIRC_OUT, 0),
        animateWindow(tipPath, [0, 1], [0.5, 0.5], 250, CIRC_OUT, 125),
        animateWindow(linePath, [0, 0], [0, 1], 300, CIRC_IN_OUT, 375),
        animateWindow(tipPath, [0.5, 0.5], [0, 1], 300, CIRC_IN_OUT, 525),
        text.animate(
          [{ transform: "translateX(0)" }, { transform: "translateX(0.375em)" }],
          { duration: 200, easing: CIRC_OUT, fill: "both" }
        ),
        text.animate(
          [{ transform: "translateX(0.375em)" }, { transform: "translateX(0)" }],
          { duration: 250, delay: 200, easing: CIRC_IN_OUT, fill: "both" }
        ),
      ];
      animsRef.current = anims;
    };
    const animsRef = { current: [] };
    const onEnter = () => playSequence();
    const onFocusIn = () => { if (root.matches(":focus-visible")) playSequence(); };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("focusin", onFocusIn);
    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("focusin", onFocusIn);
      animsRef.current.forEach((a) => a.cancel());
      [linePath, tipPath].forEach((p) => {
        const L = lens.get(p);
        p.style.strokeDasharray = L + " " + L;
        p.style.strokeDashoffset = "0";
      });
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-077=""
      className={["button-077", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-077__bg"></span><span className="button-077__inner"><span data-button-077-text="" className="button-077__text">Button</span><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-button-077-icon="" className="button-077__icon"><path d="M2 12H21" stroke="currentColor" strokeWidth="2"></path><path d="M14 5L21 12L14 19" stroke="currentColor" strokeWidth="2"></path></svg></span>
    </button>
  );
}

export function DrawArrowButtonPreview() {
  return (
    <div className="ob077-root">
      <DrawArrowButton />
    </div>
  );
}
