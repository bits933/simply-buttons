import { useEffect, useRef } from "react";
import "./plasma-button.css";
import { initAetherisDrive } from "./aetheris-webgl.js";

export function ShaderButtons({
  variant = "plasma-button",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
}) {
  const btnRef = useRef(null);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const api = initAetherisDrive(btn, { reduced });

    return () => {
      if (api) api.destroy();
    };
  }, []);

  if (variant !== "plasma-button") return null;

  const safeMode = mode === "light" ? "light" : "dark";
  const safeHue = Math.min(180, Math.max(-180, hue));
  const safeSaturation = Math.min(2, Math.max(0, saturation));
  const safeBrightness = Math.min(1.65, Math.max(0.35, brightness));
  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <div
      className="aetheris-root"
      data-aetheris
      data-mode={safeMode}
      style={filter ? { filter } : undefined}
    >
      <canvas className="aetheris-bg" aria-hidden="true" />
      <button ref={btnRef} type="button" className="group aetheris-btn" aria-label="Aether Drive">
        <canvas className="aetheris-canvas" aria-hidden="true" />
        <div className="aetheris-nogl" aria-hidden="true" />
        <span className="aetheris-label">AETHER DRIVE</span>
      </button>
    </div>
  );
}

export function PlasmaButtonPreview() {
  return (
    <ShaderButtons
      variant="plasma-button"
      mode="dark"
      hue={0}
      saturation={1.0}
      brightness={1.0}
    />
  );
}
