import { useEffect, useRef } from "react";
import "./magnetic-button.css";

/* Magnetic button — exact replication of https://osmo-button-037.webflow.io/
   (Osmo Button Pack #037 by Eduard Bodak,
   https://x.com/eduardbodak/status/2065002989014614466)
   Default variant only, original colors, scoped under .ob037-root. */

export function MagneticButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const inner = root.querySelector("[data-button-037-inner]");
    const strength = parseFloat(root.getAttribute("data-button-037-strength")) || 25;
    const innerStrength = parseFloat(root.getAttribute("data-button-037-strength-inner")) || strength;
    let follow = null;
    const animateFrom = (el, from, duration) => {
      const start = performance.now();
      const easeOutElastic = (t) => {
        const c4 = (2 * Math.PI) / 0.45;
        const v = t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
        return 1 + (v - 1) * 0.35;
      };
      const frame = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const e = easeOutElastic(t);
        el.style.translate = from.x * (1 - e) + "em " + from.y * (1 - e) + "em";
        if (t < 1) el._raf = requestAnimationFrame(frame);
      };
      cancelAnimationFrame(el._raf);
      el._raf = requestAnimationFrame(frame);
    };
    const loop = () => {
      const dx = root._tx - root._x, dy = root._ty - root._y;
      root._x += dx * 0.12; root._y += dy * 0.12;
      inner._x += (inner._tx - inner._x) * 0.1;
      inner._y += (inner._ty - inner._y) * 0.1;
      root.style.translate = root._x + "em " + root._y + "em";
      inner.style.translate = inner._x + "em " + inner._y + "em";
      if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) follow = requestAnimationFrame(loop);
      else follow = null;
    };
    const onEnter = () => {
      root._x = 0; root._y = 0; inner._x = 0; inner._y = 0;
      if (root._resetRaf) { cancelAnimationFrame(root._resetRaf); root._resetRaf = null; }
    };
    const onMove = (e) => {
      const b = root.getBoundingClientRect();
      const w = b.width || 1, h = b.height || 1;
      root._tx = ((e.clientX - b.left) / w - 0.5) * (strength / 16);
      root._ty = ((e.clientY - b.top) / h - 0.5) * (strength / 16);
      inner._tx = ((e.clientX - b.left) / w - 0.5) * (innerStrength / 16);
      inner._ty = ((e.clientY - b.top) / h - 0.5) * (innerStrength / 16);
      if (!follow) follow = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      if (follow) { cancelAnimationFrame(follow); follow = null; }
      animateFrom(root, { x: root._x, y: root._y }, 800);
      animateFrom(inner, { x: inner._x, y: inner._y }, 1000);
    };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-037=""
      data-button-037-strength="30"
      data-button-037-strength-inner="15"
      className={["button-037", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-037__bg"></span><span data-button-037-inner="" className="button-037__inner"><span className="button-037__text">Button</span></span>
    </button>
  );
}

export function MagneticButtonPreview() {
  return (
    <div className="ob037-root">
      <MagneticButton />
    </div>
  );
}
