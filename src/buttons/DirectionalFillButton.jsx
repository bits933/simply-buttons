import { useEffect, useRef, useState } from "react";
import "./directional-fill.css";

export function DirectionalFillButton({
  label = "Explore",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [motion, setMotion] = useState("idle");
  const activationFrame = useRef(0);
  const renderedMotion = disabled ? "idle" : motion;

  useEffect(() => {
    if (!disabled) return;
    window.cancelAnimationFrame(activationFrame.current);
    activationFrame.current = 0;
    setMotion("idle");
  }, [disabled]);

  useEffect(() => () => window.cancelAnimationFrame(activationFrame.current), []);

  function enter() {
    if (disabled) return;
    window.cancelAnimationFrame(activationFrame.current);
    if (motion === "exiting") {
      setMotion("idle");
      activationFrame.current = window.requestAnimationFrame(() => setMotion("active"));
      return;
    }
    setMotion("active");
  }

  function exit() {
    if (disabled) return;
    window.cancelAnimationFrame(activationFrame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMotion("idle");
      return;
    }
    setMotion("exiting");
  }

  return (
    <button
      className={["btn-directional-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
      {...rest}
      type="button"
      data-motion={renderedMotion}
      onPointerEnter={enter}
      onPointerLeave={exit}
      onFocus={enter}
      onBlur={exit}
    >
      <span
        className="btn-directional-fill"
        aria-hidden="true"
        onTransitionEnd={(event) => {
          if (event.propertyName === "transform" && motion === "exiting") setMotion("idle");
        }}
      />
      <span className="btn-directional-label">{label}</span>
    </button>
  );
}

export function DirectionalFillPreview() {
  return (
    <div className="btn-directional-root">
      <DirectionalFillButton />
    </div>
  );
}
