import { useEffect, useRef } from "react";
import "./water-ripple-button.css";
import { initWaterRipple, makeWaterTexture } from "./water-ripple-webgl.js";

function WaterRippleButton() {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return undefined;

    const url = makeWaterTexture();
    btn.style.backgroundImage = `url(${url})`;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const api = initWaterRipple(btn, {
      imageUrl: url,
      resolution: 160,
      dropRadius: 25,
      perturbance: 0.08,
      interactive: !reduced,
      start: !reduced,
    });

    return () => {
      if (api) api.destroy();
      btn.style.backgroundImage = "";
    };
  }, []);

  return (
    <div className="water-ripple-root" data-water-ripple>
      <button type="button" className="btn-water-ripple" ref={btnRef} aria-label="Click Me — water ripple button">
        <span className="wr-label">Click Me</span>
      </button>
    </div>
  );
}

export function WaterRippleButtonPreview() {
  return <WaterRippleButton />;
}
