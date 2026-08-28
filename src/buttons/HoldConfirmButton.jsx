import { useEffect, useRef, useState } from "react";
import "./hold-confirm.css";

const IDLE_LABEL = "Hold to confirm";
const DONE_LABEL = "Confirmed";
const HOLD_MS = 850;
const RESET_MS = 2600;
const BURST_MS = 1000;
const PIECES = 14;

const COLORS = ["#22c55e", "#4ade80", "#86efac", "#d4d4d8", "#a3a3a3"];

function sprinkle(root) {
  if (!root) return;
  root.querySelectorAll("i").forEach((piece, i) => {
    const angle = (Math.PI * 2 * i) / PIECES + (Math.random() - 0.5) * 0.9;
    const dist = 26 + Math.random() * 44;
    piece.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
    piece.style.setProperty("--ty", `${Math.sin(angle) * dist - 6}px`);
    piece.style.setProperty("--rot", `${Math.round((Math.random() - 0.5) * 540)}deg`);
    piece.style.setProperty("--pw", `${(3 + Math.random() * 3.5).toFixed(1)}px`);
    piece.style.setProperty("--ph", `${(3 + Math.random() * 4).toFixed(1)}px`);
    piece.style.setProperty("--pcolor", COLORS[i % COLORS.length]);
    piece.style.setProperty("--shp", Math.random() > 0.5 ? "999px" : "1.5px");
    piece.style.setProperty("--cdur", `${520 + Math.round(Math.random() * 360)}ms`);
    piece.style.setProperty("--cdelay", `${Math.round(Math.random() * 90)}ms`);
  });
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

export function HoldConfirmButton({
  label = IDLE_LABEL,
  successLabel = DONE_LABEL,
  holdMs = HOLD_MS,
  resetMs = RESET_MS,
  disabled = false,
  className = "",
  onConfirm,
  ...rest
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState("idle");
  const [fill, setFill] = useState(0);
  const [draining, setDraining] = useState(false);
  const [bursting, setBursting] = useState(false);
  const confettiRef = useRef(null);
  const rafRef = useRef(0);
  const resetTimer = useRef(0);
  const burstTimer = useRef(0);
  const t0Ref = useRef(0);
  const startFillRef = useRef(0);
  const phaseRef = useRef("idle");

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(
    () => () => {
      window.cancelAnimationFrame(rafRef.current);
      window.clearTimeout(resetTimer.current);
      window.clearTimeout(burstTimer.current);
    },
    [],
  );

  function complete() {
    window.cancelAnimationFrame(rafRef.current);
    setFill(100);
    setDraining(false);
    setPhase("done");
    onConfirm?.();
    if (!reduceMotion) {
      sprinkle(confettiRef.current);
      setBursting(true);
      window.clearTimeout(burstTimer.current);
      burstTimer.current = window.setTimeout(() => setBursting(false), BURST_MS);
    }
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setPhase("idle");
      setFill(0);
    }, resetMs);
  }

  function beginHold() {
    if (disabled || phaseRef.current === "done") return;
    window.clearTimeout(resetTimer.current);
    setPhase("holding");
    setDraining(false);
    startFillRef.current = 0;
    t0Ref.current = performance.now();
    window.cancelAnimationFrame(rafRef.current);
    const tick = (now) => {
      const next = Math.min(
        100,
        startFillRef.current + ((now - t0Ref.current) / holdMs) * 100,
      );
      setFill(next);
      if (next >= 100) {
        complete();
        return;
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
  }

  function endHold() {
    if (phaseRef.current !== "holding") return;
    window.cancelAnimationFrame(rafRef.current);
    setPhase("idle");
    setDraining(true);
    setFill(0);
  }

  function handlePointerDown(event) {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}
    beginHold();
  }

  function handlePointerUp() {
    endHold();
  }

  function handleKeyDown(event) {
    if (event.key !== " " && event.key !== "Enter") return;
    if (event.repeat) return;
    event.preventDefault();
    beginHold();
  }

  function handleKeyUp(event) {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    endHold();
  }

  const holdClass = [
    "btn-hold-btn",
    phase === "holding" ? "is-holding" : "",
    phase === "done" ? "is-done" : "",
    draining ? "is-draining" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={bursting ? "btn-hold-wrap is-bursting" : "btn-hold-wrap"}>
      <button
        type="button"
        className={holdClass}
        style={{ "--hold": `${fill}%` }}
        disabled={disabled}
        aria-pressed={phase === "done" || undefined}
        aria-busy={phase === "holding" || undefined}
        aria-label={phase === "done" ? successLabel : label}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={endHold}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={endHold}
        onContextMenu={(event) => event.preventDefault()}
        {...rest}
      >
        <span className="btn-hold-bar" aria-hidden="true" />
        <span className="btn-hold-label" aria-hidden="true">
          <span className="btn-hold-word btn-hold-word--idle">{label}</span>
          <span className="btn-hold-word btn-hold-word--done">
            <svg className="btn-hold-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M4.5 12.5l5 5 10-11" />
            </svg>
            {successLabel}
          </span>
        </span>
      </button>
      <span className="btn-hold-confetti" ref={confettiRef} aria-hidden="true">
        {Array.from({ length: PIECES }, (_, i) => (
          <i key={i} />
        ))}
      </span>
    </span>
  );
}

export function HoldConfirmPreview() {
  return (
    <div className="btn-hold-root">
      <HoldConfirmButton />
    </div>
  );
}
