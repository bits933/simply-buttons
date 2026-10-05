import { flushSync } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";

const RAY_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function readTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function circleFrom(el) {
  const { left, top, width, height } = el.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const r = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  return { x, y, r };
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme);
  const busyRef = useRef(false);
  const btnRef = useRef(null);
  const maskId = `themeMoonMask${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  function applyTheme(next, snapIcon = false) {
    const root = document.documentElement;
    if (snapIcon) root.classList.add("theme-icon-snap");
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    flushSync(() => setTheme(next));
  }

  function onToggle() {
    if (busyRef.current) return;
    const next = theme === "dark" ? "light" : "dark";

    if (reducedMotion() || typeof document.startViewTransition !== "function") {
      applyTheme(next);
      return;
    }

    const root = document.documentElement;
    const origin = btnRef.current ? circleFrom(btnRef.current) : null;
    if (origin) {
      root.style.setProperty("--theme-x", `${origin.x}px`);
      root.style.setProperty("--theme-y", `${origin.y}px`);
      root.style.setProperty("--theme-r", `${origin.r}px`);
    }

    const update = () => applyTheme(next, true);
    const release = () => {
      busyRef.current = false;
      root.classList.remove("theme-icon-snap");
      root.style.removeProperty("--theme-x");
      root.style.removeProperty("--theme-y");
      root.style.removeProperty("--theme-r");
    };

    busyRef.current = true;

    let transition;
    try {
      transition = document.startViewTransition({
        update,
        types: ["theme-reveal"],
      });
    } catch {
      try {
        transition = document.startViewTransition(update);
      } catch {
        applyTheme(next);
        release();
        return;
      }
    }

    transition.finished.catch(() => {}).finally(release);
  }

  const next = theme === "dark" ? "light" : "dark";
  const icon = theme === "dark" ? "sun" : "moon";

  return (
    <button
      ref={btnRef}
      type="button"
      className="theme-toggle"
      data-icon={icon}
      onClick={onToggle}
      aria-label={`Switch to ${next} mode`}
      aria-pressed={theme === "dark"}
    >
      <svg
        className="theme-icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="24" height="24" fill="#fff" />
            <circle className="theme-icon-cut" cx="12" cy="12" r="6" fill="#000" />
          </mask>
        </defs>
        <g className="theme-icon-rays">
          {RAY_ANGLES.map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="3"
              x2="12"
              y2="6.2"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </g>
        <circle
          className="theme-icon-disc"
          cx="12"
          cy="12"
          r="5"
          mask={`url(#${maskId})`}
        />
      </svg>
    </button>
  );
}
