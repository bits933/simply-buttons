import { useEffect, useRef } from "react";
import "./cursor-circle-button.css";

/* Cursor circle button — exact replication of https://osmo-button-046.webflow.io/
   (Osmo Button Pack #046 by Eduard Bodak,
   https://x.com/eduardbodak/status/2068271478613688494)
   Default variant only, original colors, scoped under .ob046-root. */

export function CursorCircleButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const wrap = root.querySelector("[data-button-046-circle]");
    if (!wrap) return;
    const getXY = (e) => {
      const b = root.getBoundingClientRect();
      return {
        x: Math.min(Math.max(((e.clientX - b.left) / b.width) * 100, 0), 100),
        y: Math.min(Math.max(((e.clientY - b.top) / b.height) * 100, 0), 100),
      };
    };
    const onEnter = (e) => {
      const p = getXY(e);
      wrap.style.transition = "translate 0s, scale 1.25s cubic-bezier(0.32, 0.72, 0, 1)";
      wrap.style.translate = p.x + "% " + p.y + "%";
      wrap.style.scale = "1";
    };
    const onMove = (e) => {
      const p = getXY(e);
      wrap.style.transition = "translate 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), scale 0.25s ease-out";
      wrap.style.translate = p.x + "% " + p.y + "%";
      wrap.style.scale = "1";
    };
    const onLeave = (e) => {
      const p = getXY(e);
      const px = p.x > 90 ? p.x + 25 : p.x < 12.5 ? p.x - 25 : p.x;
      const py = p.y > 90 ? p.y + 25 : p.y < 12.5 ? p.y - 25 : p.y;
      wrap.style.transition = "translate 0.45s cubic-bezier(0.32, 0.72, 0, 1), scale 0.45s cubic-bezier(0.32, 0.72, 0, 1)";
      wrap.style.translate = px + "% " + py + "%";
      wrap.style.scale = "0";
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
      data-button-046=""
      className={["button-046", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-046__bg"></span><span className="button-046__bg-circle"><span data-button-046-circle="" className="button-046__circle-wrap"><span className="button-046__circle"></span></span></span><span className="button-046__inner"><span className="button-046__text">Button</span></span>
    </button>
  );
}

export function CursorCircleButtonPreview() {
  return (
    <div className="ob046-root">
      <CursorCircleButton />
    </div>
  );
}
