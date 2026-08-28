const HULY_CTA_CSS = `
/* Huly Solar Flare CTA Button - High Performance GPU Optimized */

.btn-huly-root {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 12px;
  contain: layout style;
}

/* Outer Atmosphere Halo Glow Ring Base */
.btn-huly-blur-ring {
  position: absolute;
  left: 50%;
  top: 50%;
  width: calc(100% - 12px);
  height: calc(100% - 12px);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 0;
  will-change: transform, opacity;
  transform-origin: center center;
}

/* Right Glow (normal orientation) */
.btn-huly-glow-right {
  transform: translate3d(-50%, -50%, 0);
  opacity: var(--glow-right-op, 0.64);
}

/* Left Glow (horizontally flipped, shows on left side) */
.btn-huly-glow-left {
  transform: translate3d(-50%, -50%, 0) scaleX(-1);
  opacity: var(--glow-left-op, 0);
}

/* Compact Inner Glow Layer */
.btn-huly-blur-ring::before {
  content: "";
  position: absolute;
  inset: -1px;
  z-index: 10;
  border-radius: 9999px;
  border: 1.5px solid transparent;
  filter: blur(2.5px);
  background:
    linear-gradient(transparent, transparent) padding-box,
    linear-gradient(97.68deg, rgba(255, 177, 153, 0) 35%, rgba(255, 177, 153, 0.4) 75%, #ff7950 94%) border-box;
  opacity: 0.95;
}

/* Compact Outer Atmosphere Drop Glow */
.btn-huly-blur-ring::after {
  content: "";
  position: absolute;
  inset: -3px;
  z-index: 20;
  border-radius: 9999px;
  border: 2px solid transparent;
  filter: blur(8px);
  background:
    linear-gradient(transparent, transparent) padding-box,
    linear-gradient(91.88deg, rgba(255, 137, 100, 0) 38%, rgba(255, 137, 100, 0.5) 65%, #cd3100 98%) border-box;
  opacity: 0.8;
}

/* Precision Inner Edge Light Ring */
.btn-huly-light-ring {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  border: 1px solid transparent;
  background:
    linear-gradient(transparent, transparent) padding-box,
    linear-gradient(103.7deg, rgba(215, 185, 175, 0.15) 38%, rgba(233, 132, 99, 0.25) 68%, #e98463 85%, #ffffff 93%) border-box;
}

.btn-huly-light-ring::before {
  content: "";
  position: absolute;
  inset: -1px;
  z-index: 30;
  border-radius: 9999px;
  border: 1.5px solid transparent;
  filter: blur(5px);
  background:
    linear-gradient(transparent, transparent) padding-box,
    linear-gradient(91.96deg, rgba(255, 177, 153, 0) 6%, rgba(255, 177, 153, 0.45) 53%, #ff7950 94%) border-box;
  opacity: 0.85;
}

/* Main Button */
.btn-huly-btn {
  appearance: none;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 178px;
  height: 44px;
  padding: 0 28px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background-color: #d1d1d1;
  color: #5a250a;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.015em;
  text-transform: uppercase;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  z-index: 1;
  box-shadow:
    0 4px 14px rgba(255, 105, 50, 0.22),
    0 2px 6px rgba(0, 0, 0, 0.18),
    inset 0 1px 1px #ffffff,
    inset 0 -1px 2px rgba(0, 0, 0, 0.14);
  transition:
    transform 140ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 200ms ease,
    box-shadow 250ms ease;
  contain: paint layout;
}

.btn-huly-btn *,
.btn-huly-btn *::before,
.btn-huly-btn *::after {
  box-sizing: border-box;
}

/* Precision Outer Rim Stroke */
.btn-huly-btn::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 9999px;
  padding: 1px;
  background: linear-gradient(
    104deg,
    rgba(215, 185, 175, 0.2) 38%,
    rgba(233, 132, 99, 0.25) 68%,
    #e98463 85%,
    #ffffff 93%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

/* Solar Flare Pod with pure GPU compositing */
.btn-huly-flare {
  position: absolute;
  top: 50%;
  left: 0;
  width: 180px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: -1;
  transform: translate3d(calc(var(--flare-x, 82%) - 90px), -50%, 0);
  will-change: transform;
}

.btn-huly-flare-core {
  position: absolute;
  width: 110px;
  height: 110px;
  border-radius: 100%;
  will-change: transform;
  background: radial-gradient(
    50% 50% at 50% 50%,
    #fffff5 4%,
    #ffaa81 27%,
    #ffda9f 38%,
    rgba(255, 170, 129, 0.5) 50%,
    rgba(210, 106, 58, 0) 92%
  );
}

.btn-huly-flare-glow {
  position: absolute;
  width: 180px;
  height: 96px;
  border-radius: 100%;
  will-change: transform;
  background: radial-gradient(
    44% 44% at 50% 50%,
    #fffff7 28%,
    #fffacd 48%,
    #f4d2bf 61%,
    rgba(214, 211, 210, 0) 100%
  );
  filter: blur(4px);
}

/* Foreground Label & Arrow Icon */
.btn-huly-label {
  position: relative;
  z-index: 2;
  color: #5a250a;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.45);
}

.btn-huly-arrow {
  position: relative;
  z-index: 2;
  width: 16px;
  height: 9px;
  color: #5a250a;
  transition: transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Hover & Focus Interactions */
@media (hover: hover) {
  .btn-huly-root:hover .btn-huly-arrow {
    transform: translateX(3px);
  }

  .btn-huly-root:hover .btn-huly-btn {
    transform: translateY(-1px);
    border-color: #ffffff;
    box-shadow:
      0 6px 18px rgba(255, 105, 50, 0.32),
      0 3px 8px rgba(0, 0, 0, 0.22),
      inset 0 1px 1px #ffffff,
      inset 0 -1px 2px rgba(0, 0, 0, 0.14);
  }
}

.btn-huly-btn:focus {
  outline: none;
}

.btn-huly-btn:focus-visible {
  outline: 2px solid #ff7950;
  outline-offset: 4px;
}

.btn-huly-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-huly-btn:disabled {
  cursor: not-allowed;
  opacity: 0.45;
  transform: none;
  box-shadow: none;
}
`.trim();

const HULY_CTA_MARKUP = `
<div class="btn-huly-root" style="--glow-right-op: 0.64; --glow-left-op: 0;">
  <div class="btn-huly-blur-ring btn-huly-glow-right" aria-hidden="true">
    <div class="btn-huly-light-ring"></div>
  </div>
  <div class="btn-huly-blur-ring btn-huly-glow-left" aria-hidden="true">
    <div class="btn-huly-light-ring"></div>
  </div>
  <button class="btn-huly-btn" type="button" aria-label="Get Started">
    <span class="btn-huly-flare" aria-hidden="true">
      <span class="btn-huly-flare-core"></span>
      <span class="btn-huly-flare-glow"></span>
    </span>
    <span class="btn-huly-label">Get Started</span>
    <svg class="btn-huly-arrow" viewBox="0 0 17 9" fill="none" aria-hidden="true">
      <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"></path>
    </svg>
  </button>
</div>
`.trim();

const HTML_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Huly Solar Flare CTA</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #090a0c;
      font-family: system-ui, -apple-system, sans-serif;
    }
    ${HULY_CTA_CSS}
  </style>
</head>
<body>
  ${HULY_CTA_MARKUP}
  <script>
    const root = document.querySelector('.btn-huly-root');
    const btn = document.querySelector('.btn-huly-btn');
    if (root && btn) {
      const RESTING_X = 82;
      let currentX = RESTING_X;
      let targetX = RESTING_X;
      let isHovered = false;
      let isReturning = false;
      let rafId = 0;
      let leaveTimer = 0;

      function computeOpacities(x) {
        const right = x > 50 ? (x - 50) / 50 : 0;
        const left = x < 50 ? (50 - x) / 50 : 0;
        return {
          right: Math.max(0, Math.min(1, right)),
          left: Math.max(0, Math.min(1, left)),
        };
      }

      function applyValues(x) {
        btn.style.setProperty('--flare-x', x.toFixed(2) + '%');
        const ops = computeOpacities(x);
        root.style.setProperty('--glow-right-op', ops.right.toFixed(3));
        root.style.setProperty('--glow-left-op', ops.left.toFixed(3));
      }

      applyValues(RESTING_X);

      function loop() {
        if (isHovered) {
          const dx = targetX - currentX;
          if (Math.abs(dx) > 0.01) {
            currentX += dx * 0.35;
            applyValues(currentX);
          }
          rafId = requestAnimationFrame(loop);
        } else if (isReturning) {
          const dx = RESTING_X - currentX;
          if (Math.abs(dx) > 0.05) {
            currentX += dx * 0.09;
            applyValues(currentX);
            rafId = requestAnimationFrame(loop);
          } else {
            currentX = RESTING_X;
            applyValues(RESTING_X);
            isReturning = false;
            cancelAnimationFrame(rafId);
          }
        }
      }

      btn.addEventListener('pointerenter', (e) => {
        clearTimeout(leaveTimer);
        const rect = btn.getBoundingClientRect();
        isHovered = true;
        isReturning = false;
        root.classList.add('is-hovered');
        btn.classList.add('is-hovered');
        targetX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(loop);
      });

      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        targetX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
        if (!isHovered) {
          isHovered = true;
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(loop);
        }
      });

      btn.addEventListener('pointerleave', () => {
        isHovered = false;
        root.classList.remove('is-hovered');
        btn.classList.remove('is-hovered');
        clearTimeout(leaveTimer);
        leaveTimer = setTimeout(() => {
          isReturning = true;
          cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(loop);
        }, 160);
      });
    }
  </script>
</body>
</html>
`;

export const HULY_CTA_SNIPPETS = {
  html: HTML_PAGE,
  react: `"use client";

import React, { useEffect, useRef } from "react";

const CSS = ${JSON.stringify(HULY_CTA_CSS)};
const RESTING_X = 82;

function computeOpacities(x) {
  const right = x > 50 ? (x - 50) / 50 : 0;
  const left = x < 50 ? (50 - x) / 50 : 0;
  return {
    right: Math.max(0, Math.min(1, right)),
    left: Math.max(0, Math.min(1, left)),
  };
}

export default function HulyCtaButton({
  label = "Get Started",
  disabled = false,
  onClick,
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
    if (!document.getElementById("btn-huly-styles")) {
      const tag = document.createElement("style");
      tag.id = "btn-huly-styles";
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }

    const root = rootRef.current;
    const btn = btnRef.current;
    if (!root || !btn) return;

    const state = stateRef.current;

    const applyValues = (x) => {
      btn.style.setProperty("--flare-x", \`\${x.toFixed(2)}%\`);
      const ops = computeOpacities(x);
      root.style.setProperty("--glow-right-op", ops.right.toFixed(3));
      root.style.setProperty("--glow-left-op", ops.left.toFixed(3));
    };

    applyValues(RESTING_X);

    const frameLoop = () => {
      if (state.isHovered) {
        const dx = state.targetX - state.currentX;
        if (Math.abs(dx) > 0.01) {
          state.currentX += dx * 0.35;
          applyValues(state.currentX);
        }
        state.rafId = requestAnimationFrame(frameLoop);
      } else if (state.isReturning) {
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
        Math.min(100, ((e.clientX - state.rect.left) / state.rect.width) * 100)
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
        Math.min(100, ((e.clientX - state.rect.left) / state.rect.width) * 100)
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
      <div className="btn-huly-blur-ring btn-huly-glow-right" aria-hidden="true">
        <div className="btn-huly-light-ring" />
      </div>
      <div className="btn-huly-blur-ring btn-huly-glow-left" aria-hidden="true">
        <div className="btn-huly-light-ring" />
      </div>
      <button
        ref={btnRef}
        type="button"
        className="btn-huly-btn"
        disabled={disabled}
        aria-label={label}
        onClick={onClick}
      >
        <span className="btn-huly-flare" aria-hidden="true">
          <span className="btn-huly-flare-core" />
          <span className="btn-huly-flare-glow" />
        </span>
        <span className="btn-huly-label">{label}</span>
        <svg
          className="btn-huly-arrow"
          viewBox="0 0 17 9"
          fill="none"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="m12.495 0 4.495 4.495-4.495 4.495-.99-.99 2.805-2.805H0v-1.4h14.31L11.505.99z"
          />
        </svg>
      </button>
    </div>
  );
}
`,
  node: `const express = require("express");

const app = express();

const PAGE = ${JSON.stringify(HTML_PAGE)};

app.get("/", function (req, res) {
  res.type("html").send(PAGE);
});

app.listen(3000, function () {
  console.log("http://localhost:3000");
});
`,
};

export const HULY_CTA_META = {
  id: "huly-cta",
  name: "Huly CTA",
  blurb: "Solar flare glow pill with interactive cursor light tracking & atmosphere halo.",
  states: "default, hover, focus, active, disabled",
  keywords: [
    "huly cta",
    "solar flare",
    "glow pill",
    "cursor light",
    "light tracking",
    "atmosphere halo",
    "interactive glow",
    "flare button",
    "pointer follow",
    "halo hover",
    "luminous pill",
    "call to action",
    "spotlight track",
    "warm glow",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};
