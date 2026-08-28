import { useEffect, useRef, useState } from "react";
import "./fill-load.css";

const STAGGER_MS = 45;
const ROLL_MS = 320;
const IDLE_LABEL = "Get started";
const START_COUNT = "0%";

export function sCurve(t) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * x * (x * (x * 6 - 15) + 10);
}

function rollMs(length) {
  return Math.max(0, length - 1) * STAGGER_MS + ROLL_MS;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

function CharLine({ text, incoming }) {
  return (
    <span
      className={
        incoming ? "btn-fill-line btn-fill-line--in" : "btn-fill-line btn-fill-line--out"
      }
    >
      {Array.from(text).map((char, i) => (
        <span
          key={`${incoming ? "in" : "out"}-${i}`}
          className={char === " " ? "btn-fill-char is-space" : "btn-fill-char"}
        >
          <span className="btn-fill-glyph" style={{ "--i": i }}>
            {char === " " ? "\u00a0" : char}
          </span>
        </span>
      ))}
    </span>
  );
}

export function FillLoadButton({
  label = IDLE_LABEL,
  durationMs = 2400,
  holdMs = 600,
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState("rest");
  const [armed, setArmed] = useState(false);
  const [percent, setPercent] = useState(0);
  const btnRef = useRef(null);
  const rafRef = useRef(0);
  const timersRef = useRef([]);

  function clearTimers() {
    window.cancelAnimationFrame(rafRef.current);
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    if (phase !== "exiting" && phase !== "entering") {
      setArmed(false);
      return;
    }
    const frame = window.requestAnimationFrame(() => setArmed(true));
    return () => window.cancelAnimationFrame(frame);
  }, [phase]);

  function writeFill(next) {
    const node = btnRef.current;
    if (node) node.style.setProperty("--fill", `${next}%`);
    setPercent(next);
  }

  function reset() {
    clearTimers();
    writeFill(0);
    setPhase("rest");
    setArmed(false);
  }

  function startLoad() {
    setPhase("loading");
    writeFill(0);
    const t0 = performance.now();

    const tick = (now) => {
      const linear = Math.min(1, (now - t0) / durationMs);
      const eased = reduceMotion ? linear : sCurve(linear);
      writeFill(Math.round(eased * 100));
      if (linear < 1) {
        rafRef.current = window.requestAnimationFrame(tick);
        return;
      }
      writeFill(100);
      setPhase("done");
      const hold = window.setTimeout(reset, holdMs);
      timersRef.current.push(hold);
    };

    rafRef.current = window.requestAnimationFrame(tick);
  }

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || disabled || phase !== "rest") return;

    writeFill(0);

    if (reduceMotion) {
      startLoad();
      return;
    }

    setPhase("exiting");
    const exitWait = rollMs(label.length);
    const enterWait = rollMs(START_COUNT.length);
    const enter = window.setTimeout(() => {
      setPhase("entering");
      const load = window.setTimeout(startLoad, enterWait);
      timersRef.current.push(load);
    }, exitWait);
    timersRef.current.push(enter);
  }

  const busy = phase !== "rest";
  const exiting = phase === "exiting";
  const entering = phase === "entering";
  const loading = phase === "loading" || phase === "done";

  return (
    <button
      ref={btnRef}
      type="button"
      className={[
        "btn-fill-btn",
        exiting && armed ? "is-exiting" : "",
        entering && armed ? "is-entering" : "",
        loading ? "is-loading" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      aria-label={
        phase === "rest" || phase === "exiting" ? label : `${percent} percent`
      }
      onClick={handleClick}
      {...rest}
    >
      <span className="btn-fill-bar" aria-hidden="true" />
      <span className="btn-fill-label" aria-hidden="true">
        {exiting ? (
          <span className="btn-fill-window">
            <CharLine text={label} />
          </span>
        ) : entering ? (
          <span className="btn-fill-window">
            <CharLine text={START_COUNT} incoming />
          </span>
        ) : phase === "rest" ? (
          label
        ) : (
          `${percent}%`
        )}
      </span>
    </button>
  );
}

export function FillLoadPreview() {
  return (
    <div className="btn-fill-root">
      <FillLoadButton />
    </div>
  );
}
