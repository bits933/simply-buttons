import { useEffect, useRef } from "react";
import "./pangeam-bend-button.css";

/* Pangeam elastic bend button — kinetic Gaussian wave character deformation
   replicated from Sasha Martynchuk's portfolio (sashamartynchuk.com).
   Original specimen for the Simply Buttons gallery. */

const RADIUS_FACTOR = 1.75;
const Y_STRENGTH = 0.2;
const X_STRENGTH = 0.045;
const REST_FACTOR = 0.026;
const MAX_ROTATE = 8;
const ROTATE_STRENGTH = 26;
const SCALE_FACTOR = 0.035;
const BASE_STIFFNESS = 0.135;
const DAMPING = 0.8;
const VARIATION = 0.22;
const VELOCITY_THRESHOLD = 0.0015;

export function PangeamBendButton({
  label = "PANGEAM",
  className = "",
  onClick,
  ...rest
}) {
  const btnRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;

    let rafId = null;
    const pointer = { x: 0, y: 0, on: 0 };
    let fontSize = 60;

    const measureAndInit = () => {
      fontSize = parseFloat(getComputedStyle(btn).fontSize) || 60;
      const spans = charsRef.current.filter(Boolean);
      return spans.map((el, index) => {
        let left = 0;
        let p = el;
        while (p && p !== btn) {
          left += p.offsetLeft;
          p = p.offsetParent;
        }
        const cx = left + el.offsetWidth / 2;
        const cy = el.offsetHeight / 2;
        const stiff =
          BASE_STIFFNESS *
          (1 +
            VARIATION *
              (index % 2 ? 1 : -1) *
              (0.6 + 0.4 * ((index * 7) % 5) / 4));
        return {
          el,
          cx,
          cy,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          stiff,
          last: "",
        };
      });
    };

    let charStates = measureAndInit();

    const updatePhysics = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        rafId = null;
        return;
      }

      const s = RADIUS_FACTOR * fontSize;
      let active = false;

      for (const char of charStates) {
        let targetY = 0;
        let targetX = 0;
        if (pointer.on > 0) {
          const f = (char.cx - pointer.x) / s;
          const influence = Math.exp(-f * f * 2.2) * pointer.on;
          targetY = ((pointer.y - char.cy) * Y_STRENGTH - REST_FACTOR * fontSize) * influence;
          targetX = (pointer.x - char.cx) * X_STRENGTH * influence;
        }

        char.vy += (targetY - char.y) * char.stiff;
        char.vy *= DAMPING;
        char.y += char.vy;

        char.vx += (targetX - char.x) * char.stiff;
        char.vx *= DAMPING;
        char.x += char.vx;

        if (
          Math.abs(char.vy) > VELOCITY_THRESHOLD ||
          Math.abs(char.y - targetY) > VELOCITY_THRESHOLD ||
          Math.abs(char.vx) > VELOCITY_THRESHOLD ||
          Math.abs(char.x - targetX) > VELOCITY_THRESHOLD
        ) {
          active = true;
        }
      }

      const len = charStates.length;
      for (let i = 0; i < len; i += 1) {
        const char = charStates[i];
        const prev = charStates[i - 1] || char;
        const next = charStates[i + 1] || char;
        const dx = next.cx - prev.cx || 1;
        const slope = (next.y - prev.y) / dx;
        const rot = Math.max(-MAX_ROTATE, Math.min(MAX_ROTATE, slope * ROTATE_STRENGTH));
        const w = Math.abs(char.y) / (fontSize * 0.5);
        const scale = 1 + Math.min(1, w) * SCALE_FACTOR;
        const transform = `translate3d(${char.x.toFixed(2)}px, ${char.y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

        if (transform !== char.last) {
          char.last = transform;
          char.el.style.transform = transform;
        }
      }

      if (!active && pointer.on === 0) {
        for (const char of charStates) {
          char.x = 0;
          char.y = 0;
          char.vx = 0;
          char.vy = 0;
          if (char.last !== "") {
            char.last = "";
            char.el.style.transform = "";
          }
        }
        rafId = null;
        return;
      }

      rafId = requestAnimationFrame(updatePhysics);
    };

    const startLoop = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updatePhysics);
      }
    };

    const handlePointerMove = (e) => {
      if (e.pointerType === "touch") return;
      const rect = btn.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.on = 1;
      startLoop();
    };

    const handlePointerLeave = () => {
      pointer.on = 0;
      startLoop();
    };

    const handleResize = () => {
      charStates = measureAndInit();
    };

    btn.addEventListener("pointermove", handlePointerMove);
    btn.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", handleResize);

    return () => {
      btn.removeEventListener("pointermove", handlePointerMove);
      btn.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", handleResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [label]);

  const chars = [...label];

  return (
    <button
      ref={btnRef}
      type="button"
      data-pangeam-bend=""
      aria-label={label}
      className={["btn-pangeam-bend", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          ref={(el) => {
            charsRef.current[i] = el;
          }}
          className="pangeam-bend__char"
          aria-hidden="true"
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </button>
  );
}

export function PangeamBendButtonPreview() {
  return (
    <div className="pangeam-bend-root">
      <PangeamBendButton />
    </div>
  );
}
