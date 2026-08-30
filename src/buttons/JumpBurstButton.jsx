import { useEffect, useRef } from "react";
import "./jump-burst-button.css";

/* Jump burst button — exact replication of https://osmo-button-078.webflow.io/
   (Osmo Button Pack #078 by Eduard Bodak,
   https://x.com/eduardbodak/status/2080221712822497430)
   Default variant only, original colors, scoped under .ob078-root. */

export function JumpBurstButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const SPARK_ELEMENT_WIDTH = 10;
    const COOLDOWN_TIME = 250;
    const JUMP_EASE = "cubic-bezier(0.2, 0.5, 0.5, 1)";
    const text = root.querySelector("[data-button-078-text]");
    const place = root.querySelector("[data-button-078-place]");
    if (!text) return;
    let styleSheet = null;
    const createDynamicAnimation = (name, rotation, directionX) => {
      if (!styleSheet) {
        styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        document.head.appendChild(styleSheet);
      }
      const s1 = "translate(-50%, -50%) rotate(" + rotation + "deg) translate(0.0625em, 0)";
      const s2 = "translate(-50%, -50%) rotate(" + rotation + "deg) translate(0.5625em, 0) scale(1, 1)";
      const s3 = "translate(-50%, -50%) rotate(" + rotation + "deg) translate(0.3125em, 0) scale(0, 0)";
      styleSheet.sheet.insertRule(
        "@keyframes " + name + " { 0% { transform: " + s1 + "; translate: " + (directionX / 16) + "em 0; } 65% { transform: " + s2 + "; } 100% { transform: " + s3 + "; translate: 0 0; } }",
        styleSheet.sheet.cssRules.length
      );
    };
    const makeSpark = (container, center, rotation, side, offsetX, offsetY) => {
      const div = document.createElement("span");
      const aniName = "button-078-spark-" + rotation + "-" + Date.now() + "-" + Math.floor(Math.random() * 100000);
      const directionX = side === "left" ? 3 : -3;
      createDynamicAnimation(aniName, rotation, directionX);
      div.className = "button-078__spark";
      div.style.position = "absolute";
      div.style.left = (center.x + offsetX) + "px";
      div.style.top = (center.y + offsetY) + "px";
      div.style.animationName = aniName;
      div.style.animationDuration = "500ms";
      div.style.animationTimingFunction = "ease-out";
      div.style.animationFillMode = "both";
      div.style.pointerEvents = "none";
      div.setAttribute("aria-hidden", "true");
      container.appendChild(div);
      setTimeout(() => div.remove(), 500);
    };
    const makeBurst = (container, center, side) => {
      const sparks = side === "right"
        ? [
            { rotation: -35, offsetX: 0, offsetY: -12 },
            { rotation: 0, offsetX: 4, offsetY: 0 },
            { rotation: 35, offsetX: 0, offsetY: 12 },
          ]
        : [
            { rotation: 145, offsetX: 0, offsetY: 12 },
            { rotation: 180, offsetX: -4, offsetY: 0 },
            { rotation: 215, offsetX: 0, offsetY: -12 },
          ];
      sparks.forEach((s) => makeSpark(container, center, s.rotation, side, s.offsetX, s.offsetY));
    };
    const getBurstPositions = (container) => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      return {
        left: { x: -10, y: height * 0.5 },
        right: { x: width + 10, y: height * 0.5 },
      };
    };
    let isAnimating = false;
    let burstTimer = null;
    const onPointerDown = () => {
      if (isAnimating) return;
      const positions = place ? getBurstPositions(place) : null;
      burstTimer = setTimeout(() => {
        if (!positions) return;
        makeBurst(place, positions.left, "left");
        makeBurst(place, positions.right, "right");
      }, 100);
      isAnimating = true;
      setTimeout(() => { isAnimating = false; }, COOLDOWN_TIME);
    };
    root.addEventListener("pointerdown", onPointerDown);
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return () => root.removeEventListener("pointerdown", onPointerDown);
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
    let jumps = [];
    const jump = () => {
      jumps.forEach((a) => a.cancel());
      jumps = [];
      chars.forEach((c, i) => {
        jumps.push(c.animate(
          [
            { transform: "translateY(0em)", easing: JUMP_EASE },
            { transform: "translateY(-0.25em)", easing: JUMP_EASE, offset: 0.55 },
            { transform: "translateY(0.0625em)", easing: JUMP_EASE, offset: 0.9 },
            { transform: "translateY(0em)" },
          ],
          { duration: 450, delay: i * 34, fill: "both" }
        ));
      });
    };
    const settle = () => {
      jumps.forEach((a) => a.cancel());
      jumps = [];
      chars.forEach((c) => {
        const from = getComputedStyle(c).transform;
        c.animate([{ transform: from }, { transform: "translateY(0em)" }],
          { duration: 200, easing: "cubic-bezier(0.215, 0.61, 0.355, 1)", fill: "both" });
      });
    };
    const onEnter = () => jump();
    const onLeave = () => settle();
    const onFocusIn = () => { if (root.matches(":focus-visible")) jump(); };
    const onFocusOut = () => settle();
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);
    return () => {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      if (burstTimer) clearTimeout(burstTimer);
      jumps.forEach((a) => a.cancel());
      text.textContent = original;
      text.removeAttribute("aria-label");
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-078=""
      className={["button-078", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span data-button-078-place="" className="button-078__place"></span><span className="button-078__container"><span className="button-078__bg"></span><span className="button-078__inner"><span data-button-078-text="" className="button-078__text">Button</span></span></span>
    </button>
  );
}

export function JumpBurstButtonPreview() {
  return (
    <div className="ob078-root">
      <JumpBurstButton />
    </div>
  );
}
