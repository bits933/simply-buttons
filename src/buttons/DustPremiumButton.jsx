import { useEffect, useRef } from "react";
import { initDustPremium } from "./dust-premium.gl.js";
import "./dust-premium-button.css";

export function DustPremiumButton({
  label = "Go Premium",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const canvasRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const button = buttonRef.current;
    if (!canvas || !button) return undefined;

    if (disabled) {
      button.dataset.dustFallback = "true";
      return undefined;
    }

    delete button.dataset.dustFallback;
    const handle = initDustPremium(canvas, button, { label });
    return () => handle.destroy();
  }, [label, disabled]);

  return (
    <div className={["dust-premium-root", className].filter(Boolean).join(" ")}>
      <canvas ref={canvasRef} className="dust-premium-gl" aria-hidden="true" />
      <div className="dust-premium-wrap">
        <button
          ref={buttonRef}
          type="button"
          className="dust-premium"
          disabled={disabled}
          aria-label={label}
          onClick={onClick}
          {...rest}
        >
          {label}
        </button>
      </div>
    </div>
  );
}

export function DustPremiumButtonPreview() {
  return <DustPremiumButton />;
}
