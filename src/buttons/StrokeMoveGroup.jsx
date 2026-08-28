import { useEffect, useRef, useState } from "react";
import { KRISS_CTA, stepKrissBorderFrame } from "./kriss-cta.tokens.js";
import {
  STROKE_MOVE_GROUP,
  getStrokeMoveGroupGeometry,
  getStrokeMoveGroupTargets,
} from "./stroke-move-group.tokens.js";
import "./stroke-move-group.css";

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

export function StrokeMoveGroup({ className = "", onSelect }) {
  const groupRef = useRef(null);
  const rectRefs = useRef([]);
  const frameRef = useRef(null);
  const perimeterRef = useRef(null);
  const hoverIndexRef = useRef(-1);
  const focusIndexRef = useRef(-1);
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
    const refs = rectRefs.current;
    const perimeter = perimeterRef.current
      ?? refs[0]?.getTotalLength()
      ?? getStrokeMoveGroupGeometry().perimeter;
    perimeterRef.current = perimeter;
    frameRef.current ??= getStrokeMoveGroupTargets(perimeter, -1);
    let lastTime = 0;
    let animationFrame;
    const activeIndex = () => hoverIndexRef.current >= 0
      ? hoverIndexRef.current
      : focusIndexRef.current;
    const target = () => getStrokeMoveGroupTargets(perimeter, activeIndex());
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

  const syncIfReduced = () => { if (reducedMotion) syncRef.current(); };
  const clearHover = () => {
    hoverIndexRef.current = -1;
    const focused = groupRef.current?.querySelector(":focus-visible");
    focusIndexRef.current = focused ? Number(focused.dataset.index) : -1;
    syncIfReduced();
  };

  return (
    <div
      ref={groupRef}
      className={["btn-stroke-group", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Creative workflow"
      onMouseLeave={clearHover}
    >
      {STROKE_MOVE_GROUP.labels.map((label, index) => (
        <button
          key={label}
          type="button"
          className="btn-stroke-group-item"
          data-index={index}
          onClick={(event) => onSelect?.(label, index, event)}
          onMouseEnter={() => { hoverIndexRef.current = index; syncIfReduced(); }}
          onFocus={(event) => {
            focusIndexRef.current = event.currentTarget.matches(":focus-visible") ? index : -1;
            syncIfReduced();
          }}
          onBlur={() => { focusIndexRef.current = -1; syncIfReduced(); }}
        >
          {label}
        </button>
      ))}
      <span className="btn-stroke-group-border" aria-hidden="true">
        <svg className="btn-stroke-group-svg" width="382" height="60" viewBox="0 0 382 60" focusable="false">
          <rect ref={(node) => { rectRefs.current[0] = node; }} className="btn-stroke-group-segment btn-stroke-group-segment--thick" x="1.5" y="1.5" width="379" height="57" rx="8" />
          <rect ref={(node) => { rectRefs.current[1] = node; }} className="btn-stroke-group-segment btn-stroke-group-segment--thick" x="1.5" y="1.5" width="379" height="57" rx="8" />
          <rect ref={(node) => { rectRefs.current[2] = node; }} className="btn-stroke-group-segment btn-stroke-group-segment--faint" x="1.5" y="1.5" width="379" height="57" rx="8" />
          <rect ref={(node) => { rectRefs.current[3] = node; }} className="btn-stroke-group-segment btn-stroke-group-segment--faint" x="1.5" y="1.5" width="379" height="57" rx="8" />
        </svg>
      </span>
    </div>
  );
}

export function StrokeMoveGroupPreview() {
  return (
    <div className="btn-stroke-group-root">
      <StrokeMoveGroup />
    </div>
  );
}
