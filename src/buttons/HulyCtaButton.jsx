import { useEffect, useRef } from "react";
import "./huly-cta.css";

const RESTING_X = 82; // %

function computeOpacities(x) {
  const right = x > 50 ? (x - 50) / 50 : 0;
  const left = x < 50 ? (50 - x) / 50 : 0;
  return {
    right: Math.max(0, Math.min(1, right)),
    left: Math.max(0, Math.min(1, left)),
  };
}

function HulyArrowIcon() {
  return (
    <svg
      className="btn-huly-arrow"
      viewBox="0 0 17 9"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
      />
    </svg>
  );
}

export function HulyCtaButton({
  label = "Get Started",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const rootRef = useRef(null);
  const btnRef = useRef(null);
  const stateRef = useRef({
    currentX: RESTING_X,
    targetX: RESTING_X,
    isHovered: false,
    rafId: 0,
    rect: null,
    leaveTimer: 0,
    isReturning: false,
  });

  useEffect(() => {
    const root = rootRef.current;
    const btn = btnRef.current;
    if (!root || !btn) return;

    const state = stateRef.current;

    const applyValues = (x) => {
      btn.style.setProperty("--flare-x", `${x.toFixed(2)}%`);
      const ops = computeOpacities(x);
      root.style.setProperty("--glow-right-op", ops.right.toFixed(3));
      root.style.setProperty("--glow-left-op", ops.left.toFixed(3));
    };

    // Initial resting paint
    applyValues(RESTING_X);

    const frameLoop = () => {
      if (state.isHovered) {
        // High-precision smooth fluid tracking (0.35 spring lerp)
        const dx = state.targetX - state.currentX;
        if (Math.abs(dx) > 0.01) {
          state.currentX += dx * 0.35;
          applyValues(state.currentX);
        }
        state.rafId = requestAnimationFrame(frameLoop);
      } else if (state.isReturning) {
        // Smooth S-curve glide deceleration back to resting 82%
        const dx = RESTING_X - state.currentX;
        if (Math.abs(dx) > 0.05) {
          state.currentX += dx * 0.09;
          applyValues(state.currentX);
          state.rafId = requestAnimationFrame(frameLoop);
        } else {
          state.currentX = RESTING_X;
          applyValues(RESTING_X);
          state.isReturning = false;
          cancelAnimationFrame(state.rafId);
        }
      }
    };

    const handlePointerEnter = (e) => {
      if (disabled) return;
      clearTimeout(state.leaveTimer);
      state.rect = btn.getBoundingClientRect();
      state.isHovered = true;
      state.isReturning = false;
      root.classList.add("is-hovered");
      btn.classList.add("is-hovered");

      const x = Math.max(
        0,
        Math.min(100, ((e.clientX - state.rect.left) / state.rect.width) * 100),
      );
      state.targetX = x;
      cancelAnimationFrame(state.rafId);
      state.rafId = requestAnimationFrame(frameLoop);
    };

    const handlePointerMove = (e) => {
      if (disabled) return;
      if (!state.rect) state.rect = btn.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(100, ((e.clientX - state.rect.left) / state.rect.width) * 100),
      );
      state.targetX = x;
      if (!state.isHovered) {
        state.isHovered = true;
        cancelAnimationFrame(state.rafId);
        state.rafId = requestAnimationFrame(frameLoop);
      }
    };

    const handlePointerLeave = () => {
      state.isHovered = false;
      root.classList.remove("is-hovered");
      btn.classList.remove("is-hovered");

      // 160ms delay before smooth S-curve return
      clearTimeout(state.leaveTimer);
      state.leaveTimer = setTimeout(() => {
        state.isReturning = true;
        cancelAnimationFrame(state.rafId);
        state.rafId = requestAnimationFrame(frameLoop);
      }, 160);
    };

    btn.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    btn.addEventListener("pointermove", handlePointerMove, { passive: true });
    btn.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      btn.removeEventListener("pointerenter", handlePointerEnter);
      btn.removeEventListener("pointermove", handlePointerMove);
      btn.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(state.rafId);
      clearTimeout(state.leaveTimer);
    };
  }, [disabled]);

  return (
    <div ref={rootRef} className="btn-huly-root">
      {/* Right Glow Ring */}
      <div
        className="btn-huly-blur-ring btn-huly-glow-right"
        aria-hidden="true"
      >
        <div className="btn-huly-light-ring" />
      </div>

      {/* Left Glow Ring */}
      <div
        className="btn-huly-blur-ring btn-huly-glow-left"
        aria-hidden="true"
      >
        <div className="btn-huly-light-ring" />
      </div>

      {/* Main button core */}
      <button
        ref={btnRef}
        type="button"
        className={["btn-huly-btn", className].filter(Boolean).join(" ")}
        disabled={disabled}
        aria-label={label}
        onClick={onClick}
        {...rest}
      >
        {/* Internal Solar Flare Light Pod */}
        <span className="btn-huly-flare" aria-hidden="true">
          <span className="btn-huly-flare-core" />
          <span className="btn-huly-flare-glow" />
        </span>

        {/* Content */}
        <span className="btn-huly-label">{label}</span>
        <HulyArrowIcon />
      </button>
    </div>
  );
}

export function HulyCtaPreview() {
  return <HulyCtaButton label="Get Started" />;
}
