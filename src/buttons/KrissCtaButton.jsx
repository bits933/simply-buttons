import { useEffect, useRef, useState } from "react";
import {
  KRISS_CTA,
  getKrissBorderGeometry,
  getKrissBorderTargets,
  stepKrissBorderFrame,
} from "./kriss-cta.tokens.js";
import "./kriss-cta.css";

function writeBorder(frame, refs) {
  const [first, second, faintOne, faintTwo] = refs;
  if (!first || !second || !faintOne || !faintTwo) return;
  first.style.strokeDasharray = frame.thickDash;
  first.style.strokeDashoffset = frame.first;
  second.style.strokeDasharray = frame.thickDash;
  second.style.strokeDashoffset = frame.second;
  faintOne.style.strokeDasharray = frame.faintOneDash;
  faintOne.style.strokeDashoffset = frame.faintOneOffset;
  faintTwo.style.strokeDasharray = frame.faintTwoDash;
  faintTwo.style.strokeDashoffset = frame.faintTwoOffset;
}

export function KrissCtaButton({
  label = KRISS_CTA.label,
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const firstRef = useRef(null);
  const secondRef = useRef(null);
  const faintOneRef = useRef(null);
  const faintTwoRef = useRef(null);
  const frameRef = useRef(null);
  const perimeterRef = useRef(null);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const disabledRef = useRef(disabled);
  const syncRef = useRef(() => {});
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    disabledRef.current = disabled;
    if (reducedMotion) syncRef.current();
  }, [disabled, reducedMotion]);

  useEffect(() => {
    const refs = [firstRef.current, secondRef.current, faintOneRef.current, faintTwoRef.current];
    const perimeter = perimeterRef.current ?? firstRef.current?.getTotalLength() ?? getKrissBorderGeometry().perimeter;
    perimeterRef.current = perimeter;
    frameRef.current ??= getKrissBorderTargets(perimeter, false);
    let lastTime = 0;
    let animationFrame;
    const target = () => getKrissBorderTargets(perimeter, !disabledRef.current && (hoverRef.current || focusRef.current));
    const sync = () => {
      frameRef.current = target();
      writeBorder(stepKrissBorderFrame(frameRef.current, frameRef.current), refs);
    };
    syncRef.current = sync;

    if (reducedMotion) {
      sync();
      return () => { syncRef.current = () => {}; };
    }

    writeBorder(stepKrissBorderFrame(frameRef.current, frameRef.current), refs);
    const tick = (time) => {
      if (time - lastTime >= 1000 / KRISS_CTA.fps) {
        frameRef.current = stepKrissBorderFrame(frameRef.current, target());
        writeBorder(frameRef.current, refs);
        lastTime = time;
      }
      animationFrame = window.requestAnimationFrame(tick);
    };
    animationFrame = window.requestAnimationFrame(tick);
    return () => {
      syncRef.current = () => {};
      window.cancelAnimationFrame(animationFrame);
    };
  }, [reducedMotion]);

  return (
    <button
      {...rest}
      type="button"
      className={["btn-kriss-button", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => { hoverRef.current = true; if (reducedMotion) syncRef.current(); }}
      onMouseLeave={() => { hoverRef.current = false; if (reducedMotion) syncRef.current(); }}
      onFocus={() => { focusRef.current = true; if (reducedMotion) syncRef.current(); }}
      onBlur={() => { focusRef.current = false; if (reducedMotion) syncRef.current(); }}
    >
      <span className="btn-kriss-label">{label}</span>
      <span className="btn-kriss-border" aria-hidden="true">
        <svg className="btn-kriss-border-svg" width="142" height="60" viewBox="0 0 142 60" focusable="false">
          <rect ref={firstRef} className="btn-kriss-segment btn-kriss-segment--thick" x="1.5" y="1.5" width="139" height="57" rx="8" />
          <rect ref={secondRef} className="btn-kriss-segment btn-kriss-segment--thick" x="1.5" y="1.5" width="139" height="57" rx="8" />
          <rect ref={faintOneRef} className="btn-kriss-segment btn-kriss-segment--faint" x="1.5" y="1.5" width="139" height="57" rx="8" />
          <rect ref={faintTwoRef} className="btn-kriss-segment btn-kriss-segment--faint" x="1.5" y="1.5" width="139" height="57" rx="8" />
        </svg>
      </span>
    </button>
  );
}

export function KrissCtaPreview() {
  return (
    <div className="btn-kriss-root">
      <KrissCtaButton />
    </div>
  );
}
