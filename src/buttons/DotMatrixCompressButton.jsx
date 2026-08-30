import { useEffect, useRef, useState } from "react";
import { DotMatrixIcon } from "./DotMatrixIcon.jsx";
import "./dot-matrix-compress.css";

const RADIUS = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ~50.265

export function DotMatrixCompressButton({
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  // Phase: "idle" | "compressing" | "compressed-holding" | "compressed"
  const [phase, setPhase] = useState("idle");
  const [label, setLabel] = useState("276K/500K");
  const [gaugePercent, setGaugePercent] = useState(0.552); // 276 / 500
  const [pulse, setPulse] = useState(false);
  const [fillFading, setFillFading] = useState(false);
  const [slideState, setSlideState] = useState("normal"); // "normal" | "exiting-left" | "entering-right"

  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  const handleClick = (e) => {
    if (disabled) return;
    if (phase === "compressing" || phase === "compressed-holding") return;

    onClick?.(e);

    if (phase === "compressed") {
      // Toggle / reset back to initial 276K/500K
      clearAllTimeouts();
      setPhase("idle");
      setLabel("276K/500K");
      setGaugePercent(0.552);
      setFillFading(false);
      setSlideState("normal");
      return;
    }

    // Begin Compression (3.6s duration)
    clearAllTimeouts();
    setPhase("compressing");
    setLabel("Compressing...");
    setFillFading(false);
    setSlideState("normal");

    // 1. Compressing lasts 3.6 seconds (3600ms)
    const tFill = setTimeout(() => {
      // 2. Signal Capsule pulse triggers at the end of compression
      setPulse(true);
      const tPulse = setTimeout(() => setPulse(false), 600);
      timeoutsRef.current.push(tPulse);

      // Fade out the pill gradient fill
      setFillFading(true);
      setGaugePercent(0.02);

      // 3. Morph transition to "Compressed" (without left icon)
      setSlideState("exiting-left");

      const tSlideInCompressed = setTimeout(() => {
        setLabel("Compressed");
        setPhase("compressed-holding");
        setSlideState("entering-right");

        const tSettle = setTimeout(() => {
          setSlideState("normal");

          // 4. "Compressed" stays visible for 1000ms
          const tHold = setTimeout(() => {
            // 5. Seamlessly slide out "Compressed" to left
            setSlideState("exiting-left");

            const tSlideInFinal = setTimeout(() => {
              setLabel("10K/500K");
              setSlideState("entering-right");
              setPhase("compressed");
              setFillFading(false);

              // 6. Settle "10K/500K" with 2% arc gauge
              const tFinalSettle = setTimeout(() => {
                setSlideState("normal");
              }, 40);
              timeoutsRef.current.push(tFinalSettle);
            }, 260);
            timeoutsRef.current.push(tSlideInFinal);
          }, 1000);
          timeoutsRef.current.push(tHold);
        }, 40);
        timeoutsRef.current.push(tSettle);
      }, 260);
      timeoutsRef.current.push(tSlideInCompressed);
    }, 3600);

    timeoutsRef.current.push(tFill);
  };

  const strokeDashoffset = CIRCUMFERENCE * (1 - gaugePercent);
  const showIcon = phase !== "compressed-holding";

  return (
    <div className="btn-dotmatrix-root">
      <div className="btn-dotmatrix-stage">
        <button
          {...rest}
          type="button"
          disabled={disabled}
          onClick={handleClick}
          className={[
            "btn-dotmatrix-btn",
            phase === "compressing" ? "is-compressing" : "",
            phase === "compressed-holding" ? "is-compressed-holding" : "",
            phase === "compressed" ? "is-compressed" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-label={label}
        >
          {/* Inner Pill-Shaped Gradient Fill (Dark Left to Light Right) */}
          <span className="btn-dotmatrix-fill-wrap" aria-hidden="true">
            <span
              className={[
                "btn-dotmatrix-fill-progress",
                fillFading ? "is-fading" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </span>

          {/* Signal Capsule Outward Boundary Pulse */}
          <span
            className={["btn-dotmatrix-pulse", pulse ? "is-active" : ""]
              .filter(Boolean)
              .join(" ")}
            aria-hidden="true"
          />

          {/* Foreground Content */}
          <span className="btn-dotmatrix-content">
            <span
              className={[
                "btn-dotmatrix-icon-slot",
                !showIcon ? "is-hidden" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            >
              {phase === "compressing" ? (
                <DotMatrixIcon iconIndex={2} size={48} />
              ) : (
                <svg
                  className="btn-dotmatrix-gauge"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="btn-dotmatrix-gauge-track"
                    cx="12"
                    cy="12"
                    r={RADIUS}
                  />
                  <circle
                    className="btn-dotmatrix-gauge-arc"
                    cx="12"
                    cy="12"
                    r={RADIUS}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
              )}
            </span>

            {/* Sliding Text Window */}
            <span className="btn-dotmatrix-text-window">
              <span
                className={[
                  "btn-dotmatrix-slide-item",
                  slideState === "exiting-left" ? "is-exiting-left" : "",
                  slideState === "entering-right" ? "is-entering-right" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {label}
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}

export function DotMatrixCompressPreview() {
  return <DotMatrixCompressButton />;
}
