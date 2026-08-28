import { useEffect, useState } from "react";
import "./pixel-load.css";

const chevron = Array.from({ length: 9 }, (_, i) => {
  const r = Math.floor(i / 3),
    c = i % 3;
  return (c + Math.abs(r - 1)) * 90;
});

const DRIVE = { delays: chevron, dur: 650 };

function formatElapsed(ms) {
  const total = Math.max(0, ms) / 1000;
  if (total < 60) return `${total.toFixed(1)}s`;
  return `${Math.floor(total / 60)}m ${(total % 60).toFixed(1)}s`;
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

export function PixelLoadButton({
  disabled = false,
  resetMs = 8000,
  className = "",
  onClick,
  ...rest
}) {
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!loading) {
      setElapsed(0);
      return;
    }
    setElapsed(0);
    const t0 = performance.now();
    const tick = window.setInterval(() => {
      setElapsed(performance.now() - t0);
    }, 100);
    const stop = window.setTimeout(() => {
      setLoading(false);
    }, resetMs);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(stop);
    };
  }, [loading, resetMs]);

  function handleClick(event) {
    onClick?.(event);
    if (event.defaultPrevented || disabled || loading) return;
    setLoading(true);
  }

  return (
    <button
      type="button"
      className={["btn-pixel-btn", className].filter(Boolean).join(" ")}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={handleClick}
      {...rest}
    >
      <span className="btn-pixel-face">
        {loading ? (
          <>
            <span className="btn-pixel-grid" aria-hidden="true">
              {DRIVE.delays.map((d, i) => (
                <span
                  key={i}
                  className="btn-pixel-cell"
                  style={{
                    opacity: 0.15,
                    animation: !reduceMotion
                      ? `pixel-on ${DRIVE.dur}ms ease-in-out ${d}ms infinite`
                      : undefined,
                  }}
                />
              ))}
            </span>
            <span
              className={[
                "btn-pixel-label",
                reduceMotion ? "" : "btn-pixel-shimmer",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              Churning
            </span>
            <span className="btn-pixel-timer">{formatElapsed(elapsed)}</span>
          </>
        ) : (
          <span className="btn-pixel-label">Run job</span>
        )}
      </span>
    </button>
  );
}

export function PixelLoadPreview() {
  return (
    <div className="btn-pixel-root">
      <PixelLoadButton />
    </div>
  );
}
