import { useEffect, useRef } from "react";
import "./jelly-switch-button.css";
import { initJellySwitch } from "./jelly-switch-webgl.js";

const WELL_RGB = [0x12 / 255, 0x13 / 255, 0x15 / 255]; /* #121315 */

function JellySwitchButton() {
  const btnRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    const canvas = canvasRef.current;
    if (!btn || !canvas) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const api = initJellySwitch(canvas, { start: !reduced, dark: true, ground: WELL_RGB });
    if (!api) {
      btn.dataset.gl = "off";
      const onClick = () => {
        const on = btn.dataset.jellyOn === "true";
        btn.dataset.jellyOn = on ? "false" : "true";
        btn.setAttribute("aria-pressed", on ? "false" : "true");
        btn.dataset.jiggle = "1";
        window.setTimeout(() => {
          btn.dataset.jiggle = "0";
        }, 420);
      };
      btn.addEventListener("click", onClick);
      return () => btn.removeEventListener("click", onClick);
    }

    btn.dataset.gl = "on";
    api.setDark(true, WELL_RGB);

    const onDown = (event) => {
      event.preventDefault();
      api.press();
    };
    const onUp = () => {
      if (!api.releaseAndToggle()) return;
      const { toggled } = api.getState();
      btn.dataset.jellyOn = toggled ? "true" : "false";
      btn.setAttribute("aria-pressed", toggled ? "true" : "false");
    };

    btn.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    return () => {
      btn.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      api.destroy();
    };
  }, []);

  return (
    <div className="jelly-switch-root" data-jelly-switch>
      <button
        type="button"
        className="btn-jelly-switch"
        ref={btnRef}
        aria-pressed="false"
        aria-label="Jelly switch"
        data-jelly-on="false"
      >
        <canvas className="jelly-canvas" ref={canvasRef} aria-hidden="true" />
        <span className="jelly-fallback" aria-hidden="true" />
      </button>
    </div>
  );
}

export function JellySwitchButtonPreview() {
  return <JellySwitchButton />;
}
