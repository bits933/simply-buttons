const CSS = `
.btn-dotmatrix-root {
  display: grid;
  place-items: center;
  width: 100%;
}

.btn-dotmatrix-stage {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-dotmatrix-btn {
  --dm-bg: #121316;
  --dm-border: rgba(255, 255, 255, 0.09);
  --dm-cyan: #22d3ee;
  --dm-text: #ffffff;
  --dm-track: #26282e;

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  min-width: 154px;
  padding: 0 22px;
  margin: 0;
  border: 1px solid var(--dm-border);
  border-radius: 9999px;
  background: var(--dm-bg);
  color: var(--dm-text);
  font-family: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  cursor: pointer;
  appearance: none;
  isolation: isolate;
  user-select: none;
  overflow: visible;
  box-sizing: border-box;
  transition: border-color 0.25s ease, background-color 0.25s ease, transform 0.12s ease, padding 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn-dotmatrix-btn:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.18);
  background-color: #17181d;
}

.btn-dotmatrix-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-dotmatrix-btn:focus-visible {
  outline: 2px solid var(--dm-cyan);
  outline-offset: 3px;
}

.btn-dotmatrix-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-dotmatrix-fill-wrap {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
}

.btn-dotmatrix-fill-progress {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background: linear-gradient(270deg, rgba(34, 211, 238, 0.42) 0%, rgba(6, 182, 212, 0.20) 45%, rgba(34, 211, 238, 0.03) 100%);
  box-shadow: inset -2px 0 10px rgba(34, 211, 238, 0.5), inset 0 0 16px rgba(34, 211, 238, 0.18);
  transform-origin: left center;
  transform: scaleX(0);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.btn-dotmatrix-btn.is-compressing .btn-dotmatrix-fill-progress {
  animation: btn-dotmatrix-compress-rtl 3600ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes btn-dotmatrix-compress-rtl {
  0% {
    transform: scaleX(1);
    opacity: 1;
  }
  92% {
    transform: scaleX(0.04);
    opacity: 1;
  }
  100% {
    transform: scaleX(0);
    opacity: 0;
  }
}

.btn-dotmatrix-fill-progress.is-fading {
  opacity: 0;
}

.btn-dotmatrix-content {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 2;
  pointer-events: none;
  transition: gap 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn-dotmatrix-btn.is-compressed-holding .btn-dotmatrix-content {
  gap: 0;
}

.btn-dotmatrix-icon-slot {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  transition: width 0.32s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease, transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.btn-dotmatrix-icon-slot.is-hidden {
  width: 0;
  opacity: 0;
  transform: scale(0.6);
  pointer-events: none;
}

.btn-dotmatrix-gauge {
  width: 20px;
  height: 20px;
  display: block;
  transform: rotate(-90deg);
}

.btn-dotmatrix-gauge-track {
  stroke: var(--dm-track);
  stroke-width: 3.5;
  fill: transparent;
}

.btn-dotmatrix-gauge-arc {
  stroke: var(--dm-cyan);
  stroke-width: 3.5;
  stroke-linecap: round;
  fill: transparent;
  transition: stroke-dasharray 0.65s cubic-bezier(0.34, 1.56, 0.64, 1), stroke-dashoffset 0.65s ease;
}

.btn-dotmatrix-wave-svg {
  width: 20px !important;
  height: 20px !important;
  display: block;
  overflow: visible;
}

.btn-dotmatrix-text-window {
  position: relative;
  display: inline-block;
  overflow: hidden;
  height: 22px;
  line-height: 22px;
  vertical-align: middle;
}

.btn-dotmatrix-slide-item {
  display: inline-block;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
  transform: translateX(0);
  opacity: 1;
  transition: transform 340ms cubic-bezier(0.16, 1, 0.3, 1), opacity 280ms ease;
}

.btn-dotmatrix-slide-item.is-entering-right {
  transform: translateX(24px);
  opacity: 0;
}

.btn-dotmatrix-slide-item.is-exiting-left {
  transform: translateX(-24px);
  opacity: 0;
  transition: transform 280ms cubic-bezier(0.7, 0, 0.84, 0), opacity 240ms ease;
}

.btn-dotmatrix-pulse {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1.5px solid #ffffff;
  pointer-events: none;
  opacity: 0;
  box-sizing: border-box;
  z-index: 3;
}

.btn-dotmatrix-pulse.is-active {
  animation: btn-dotmatrix-signal-pulse 580ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes btn-dotmatrix-signal-pulse {
  0% { inset: 0; opacity: 0.10; }
  100% { inset: -14px; opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .btn-dotmatrix-btn,
  .btn-dotmatrix-gauge-arc,
  .btn-dotmatrix-slide-item,
  .btn-dotmatrix-icon-slot,
  .btn-dotmatrix-fill-progress {
    transition: none !important;
    animation: none !important;
  }
  .btn-dotmatrix-pulse.is-active {
    animation: none !important;
    opacity: 0 !important;
  }
}
`.trim();

const WAVE_SVG_STRING = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" role="img" aria-label="Wave" class="btn-dotmatrix-wave-svg"><title>Wave</title><desc>A breathing sine wave drifts left to right.</desc><defs><circle id="dmi-b" r="2.4" fill="#ffffff" opacity="0.12"/><circle id="dmi-l" r="3.1"/></defs><style>.dmi-l{fill:#ffffff;opacity:0.05;animation:dmi-icon-wave 2400ms cubic-bezier(0.65, 0, 0.35, 1) infinite both;}@keyframes dmi-icon-wave{0%{opacity:0.05;}20%{opacity:1;}55%{opacity:0.18;}100%{opacity:0.05;}}@media (prefers-reduced-motion:reduce){.dmi-l{animation:none;opacity:0.45;}}.dmi-d00{animation-delay:0ms;}.dmi-d01{animation-delay:480ms;}.dmi-d02{animation-delay:960ms;}.dmi-d03{animation-delay:1440ms;}.dmi-d04{animation-delay:1920ms;}.dmi-d10{animation-delay:48ms;}.dmi-d11{animation-delay:528ms;}.dmi-d12{animation-delay:1008ms;}.dmi-d13{animation-delay:1488ms;}.dmi-d14{animation-delay:1968ms;}.dmi-d20{animation-delay:96ms;}.dmi-d21{animation-delay:576ms;}.dmi-d22{animation-delay:1056ms;}.dmi-d23{animation-delay:1536ms;}.dmi-d24{animation-delay:2016ms;}.dmi-d30{animation-delay:144ms;}.dmi-d31{animation-delay:624ms;}.dmi-d32{animation-delay:1104ms;}.dmi-d33{animation-delay:1584ms;}.dmi-d34{animation-delay:2064ms;}.dmi-d40{animation-delay:192ms;}.dmi-d41{animation-delay:672ms;}.dmi-d42{animation-delay:1152ms;}.dmi-d43{animation-delay:1632ms;}.dmi-d44{animation-delay:2112ms;}</style><use href="#dmi-b" x="6" y="6"/><use href="#dmi-b" x="17" y="6"/><use href="#dmi-b" x="28" y="6"/><use href="#dmi-b" x="39" y="6"/><use href="#dmi-b" x="50" y="6"/><use href="#dmi-b" x="6" y="17"/><use href="#dmi-b" x="17" y="17"/><use href="#dmi-b" x="28" y="17"/><use href="#dmi-b" x="39" y="17"/><use href="#dmi-b" x="50" y="17"/><use href="#dmi-b" x="6" y="28"/><use href="#dmi-b" x="17" y="28"/><use href="#dmi-b" x="28" y="28"/><use href="#dmi-b" x="39" y="28"/><use href="#dmi-b" x="50" y="28"/><use href="#dmi-b" x="6" y="39"/><use href="#dmi-b" x="17" y="39"/><use href="#dmi-b" x="28" y="39"/><use href="#dmi-b" x="39" y="39"/><use href="#dmi-b" x="50" y="39"/><use href="#dmi-b" x="6" y="50"/><use href="#dmi-b" x="17" y="50"/><use href="#dmi-b" x="28" y="50"/><use href="#dmi-b" x="39" y="50"/><use href="#dmi-b" x="50" y="50"/><use class="dmi-l dmi-d00" href="#dmi-l" x="6" y="6"/><use class="dmi-l dmi-d01" href="#dmi-l" x="17" y="6"/><use class="dmi-l dmi-d02" href="#dmi-l" x="28" y="6"/><use class="dmi-l dmi-d03" href="#dmi-l" x="39" y="6"/><use class="dmi-l dmi-d04" href="#dmi-l" x="50" y="6"/><use class="dmi-l dmi-d10" href="#dmi-l" x="6" y="17"/><use class="dmi-l dmi-d11" href="#dmi-l" x="17" y="17"/><use class="dmi-l dmi-d12" href="#dmi-l" x="28" y="17"/><use class="dmi-l dmi-d13" href="#dmi-l" x="39" y="17"/><use class="dmi-l dmi-d14" href="#dmi-l" x="50" y="17"/><use class="dmi-l dmi-d20" href="#dmi-l" x="6" y="28"/><use class="dmi-l dmi-d21" href="#dmi-l" x="17" y="28"/><use class="dmi-l dmi-d22" href="#dmi-l" x="28" y="28"/><use class="dmi-l dmi-d23" href="#dmi-l" x="39" y="28"/><use class="dmi-l dmi-d24" href="#dmi-l" x="50" y="28"/><use class="dmi-l dmi-d30" href="#dmi-l" x="6" y="39"/><use class="dmi-l dmi-d31" href="#dmi-l" x="17" y="39"/><use class="dmi-l dmi-d32" href="#dmi-l" x="28" y="39"/><use class="dmi-l dmi-d33" href="#dmi-l" x="39" y="39"/><use class="dmi-l dmi-d34" href="#dmi-l" x="50" y="39"/><use class="dmi-l dmi-d40" href="#dmi-l" x="6" y="50"/><use class="dmi-l dmi-d41" href="#dmi-l" x="17" y="50"/><use class="dmi-l dmi-d42" href="#dmi-l" x="28" y="50"/><use class="dmi-l dmi-d43" href="#dmi-l" x="39" y="50"/><use class="dmi-l dmi-d44" href="#dmi-l" x="50" y="50"/></svg>`;

const GAUGE_SVG_STRING = `<svg class="btn-dotmatrix-gauge" viewBox="0 0 24 24" aria-hidden="true"><circle class="btn-dotmatrix-gauge-track" cx="12" cy="12" r="8"/><circle class="btn-dotmatrix-gauge-arc" id="dotmatrix-arc" cx="12" cy="12" r="8" stroke-dasharray="50.265" stroke-dashoffset="22.518"/></svg>`;

const HTML_SNIPPET = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dot Matrix Compress Button</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #090a0c;
      font-family: "IBM Plex Sans", sans-serif;
    }
    ${CSS}
  </style>
</head>
<body>
  <div class="btn-dotmatrix-root">
    <div class="btn-dotmatrix-stage">
      <button type="button" class="btn-dotmatrix-btn" id="dotmatrix-btn" aria-label="276K/500K">
        <span class="btn-dotmatrix-fill-wrap" aria-hidden="true">
          <span class="btn-dotmatrix-fill-progress" id="dotmatrix-fill"></span>
        </span>
        <span class="btn-dotmatrix-pulse" id="dotmatrix-pulse" aria-hidden="true"></span>
        <span class="btn-dotmatrix-content">
          <span class="btn-dotmatrix-icon-slot" id="dotmatrix-icon">
            ${GAUGE_SVG_STRING}
          </span>
          <span class="btn-dotmatrix-text-window">
            <span class="btn-dotmatrix-slide-item" id="dotmatrix-label">276K/500K</span>
          </span>
        </span>
      </button>
    </div>
  </div>

  <script>
    const btn = document.getElementById("dotmatrix-btn");
    const fill = document.getElementById("dotmatrix-fill");
    const iconSlot = document.getElementById("dotmatrix-icon");
    const label = document.getElementById("dotmatrix-label");
    const pulse = document.getElementById("dotmatrix-pulse");
    const CIRCUMFERENCE = 2 * Math.PI * 8;
    const waveSvg = \`${WAVE_SVG_STRING}\`;
    const gaugeSvg = \`${GAUGE_SVG_STRING}\`;

    let state = "idle";

    btn.addEventListener("click", () => {
      if (state === "compressing" || state === "holding") return;
      if (state === "compressed") {
        state = "idle";
        btn.classList.remove("is-compressed", "is-compressed-holding");
        label.textContent = "276K/500K";
        iconSlot.classList.remove("is-hidden");
        iconSlot.innerHTML = gaugeSvg;
        const arc = document.getElementById("dotmatrix-arc");
        arc.style.strokeDashoffset = CIRCUMFERENCE * (1 - 0.552);
        fill.classList.remove("is-fading");
        return;
      }

      state = "compressing";
      btn.classList.add("is-compressing");
      label.textContent = "Compressing...";
      iconSlot.classList.remove("is-hidden");
      iconSlot.innerHTML = waveSvg;
      fill.classList.remove("is-fading");

      setTimeout(() => {
        pulse.classList.add("is-active");
        setTimeout(() => pulse.classList.remove("is-active"), 600);

        fill.classList.add("is-fading");
        label.classList.add("is-exiting-left");

        setTimeout(() => {
          label.textContent = "Compressed";
          btn.classList.add("is-compressed-holding");
          iconSlot.classList.add("is-hidden");
          label.classList.remove("is-exiting-left");
          label.classList.add("is-entering-right");

          setTimeout(() => {
            label.classList.remove("is-entering-right");
            state = "holding";

            setTimeout(() => {
              label.classList.add("is-exiting-left");

              setTimeout(() => {
                label.textContent = "10K/500K";
                btn.classList.remove("is-compressed-holding");
                iconSlot.classList.remove("is-hidden");
                label.classList.remove("is-exiting-left");
                label.classList.add("is-entering-right");
                iconSlot.innerHTML = gaugeSvg;
                const arc = document.getElementById("dotmatrix-arc");
                arc.style.strokeDashoffset = CIRCUMFERENCE * (1 - 0.02);

                btn.classList.remove("is-compressing");
                btn.classList.add("is-compressed");
                fill.classList.remove("is-fading");
                state = "compressed";

                setTimeout(() => {
                  label.classList.remove("is-entering-right");
                }, 40);
              }, 260);
            }, 1000);
          }, 40);
        }, 260);
      }, 3600);
    });
  </script>
</body>
</html>`;

const REACT_SNIPPET = `"use client";

import React, { useEffect, useRef, useState } from "react";

const RADIUS = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DotMatrixIcon({ iconIndex = 2, size = 48, className = "", ...rest }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" width={size} height={size} role="img" aria-label="Wave" className={\`btn-dotmatrix-wave-svg \${className}\`.trim()} {...rest}>
      <defs>
        <circle id="dmi-b" r="2.4" fill="#ffffff" opacity="0.12" />
        <circle id="dmi-l" r="3.1" />
      </defs>
      <style>{\`
        .dmi-l { fill: #ffffff; opacity: 0.05; animation: dmi-icon-wave 2400ms cubic-bezier(0.65, 0, 0.35, 1) infinite both; }
        @keyframes dmi-icon-wave { 0% { opacity: 0.05; } 20% { opacity: 1; } 55% { opacity: 0.18; } 100% { opacity: 0.05; } }
        @media (prefers-reduced-motion: reduce) { .dmi-l { animation: none; opacity: 0.45; } }
        .dmi-d00 { animation-delay: 0ms; } .dmi-d01 { animation-delay: 480ms; } .dmi-d02 { animation-delay: 960ms; } .dmi-d03 { animation-delay: 1440ms; } .dmi-d04 { animation-delay: 1920ms; }
        .dmi-d10 { animation-delay: 48ms; } .dmi-d11 { animation-delay: 528ms; } .dmi-d12 { animation-delay: 1008ms; } .dmi-d13 { animation-delay: 1488ms; } .dmi-d14 { animation-delay: 1968ms; }
        .dmi-d20 { animation-delay: 96ms; } .dmi-d21 { animation-delay: 576ms; } .dmi-d22 { animation-delay: 1056ms; } .dmi-d23 { animation-delay: 1536ms; } .dmi-d24 { animation-delay: 2016ms; }
        .dmi-d30 { animation-delay: 144ms; } .dmi-d31 { animation-delay: 624ms; } .dmi-d32 { animation-delay: 1104ms; } .dmi-d33 { animation-delay: 1584ms; } .dmi-d34 { animation-delay: 2064ms; }
        .dmi-d40 { animation-delay: 192ms; } .dmi-d41 { animation-delay: 672ms; } .dmi-d42 { animation-delay: 1152ms; } .dmi-d43 { animation-delay: 1632ms; } .dmi-d44 { animation-delay: 2112ms; }
      \`}</style>
      <use href="#dmi-b" x="6" y="6" /><use href="#dmi-b" x="17" y="6" /><use href="#dmi-b" x="28" y="6" /><use href="#dmi-b" x="39" y="6" /><use href="#dmi-b" x="50" y="6" />
      <use href="#dmi-b" x="6" y="17" /><use href="#dmi-b" x="17" y="17" /><use href="#dmi-b" x="28" y="17" /><use href="#dmi-b" x="39" y="17" /><use href="#dmi-b" x="50" y="17" />
      <use href="#dmi-b" x="6" y="28" /><use href="#dmi-b" x="17" y="28" /><use href="#dmi-b" x="28" y="28" /><use href="#dmi-b" x="39" y="28" /><use href="#dmi-b" x="50" y="28" />
      <use href="#dmi-b" x="6" y="39" /><use href="#dmi-b" x="17" y="39" /><use href="#dmi-b" x="28" y="39" /><use href="#dmi-b" x="39" y="39" /><use href="#dmi-b" x="50" y="39" />
      <use href="#dmi-b" x="6" y="50" /><use href="#dmi-b" x="17" y="50" /><use href="#dmi-b" x="28" y="50" /><use href="#dmi-b" x="39" y="50" /><use href="#dmi-b" x="50" y="50" />
      <use className="dmi-l dmi-d00" href="#dmi-l" x="6" y="6" /><use className="dmi-l dmi-d01" href="#dmi-l" x="17" y="6" /><use className="dmi-l dmi-d02" href="#dmi-l" x="28" y="6" /><use className="dmi-l dmi-d03" href="#dmi-l" x="39" y="6" /><use className="dmi-l dmi-d04" href="#dmi-l" x="50" y="6" />
      <use className="dmi-l dmi-d10" href="#dmi-l" x="6" y="17" /><use className="dmi-l dmi-d11" href="#dmi-l" x="17" y="17" /><use className="dmi-l dmi-d12" href="#dmi-l" x="28" y="17" /><use className="dmi-l dmi-d13" href="#dmi-l" x="39" y="17" /><use className="dmi-l dmi-d14" href="#dmi-l" x="50" y="17" />
      <use className="dmi-l dmi-d20" href="#dmi-l" x="6" y="28" /><use className="dmi-l dmi-d21" href="#dmi-l" x="17" y="28" /><use className="dmi-l dmi-d22" href="#dmi-l" x="28" y="28" /><use className="dmi-l dmi-d23" href="#dmi-l" x="39" y="28" /><use className="dmi-l dmi-d24" href="#dmi-l" x="50" y="28" />
      <use className="dmi-l dmi-d30" href="#dmi-l" x="6" y="39" /><use className="dmi-l dmi-d31" href="#dmi-l" x="17" y="39" /><use className="dmi-l dmi-d32" href="#dmi-l" x="28" y="39" /><use className="dmi-l dmi-d33" href="#dmi-l" x="39" y="39" /><use className="dmi-l dmi-d34" href="#dmi-l" x="50" y="39" />
      <use className="dmi-l dmi-d40" href="#dmi-l" x="6" y="50" /><use className="dmi-l dmi-d41" href="#dmi-l" x="17" y="50" /><use className="dmi-l dmi-d42" href="#dmi-l" x="28" y="50" /><use className="dmi-l dmi-d43" href="#dmi-l" x="39" y="50" /><use className="dmi-l dmi-d44" href="#dmi-l" x="50" y="50" />
    </svg>
  );
}

export function DotMatrixCompressButton({
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [phase, setPhase] = useState("idle");
  const [label, setLabel] = useState("276K/500K");
  const [gaugePercent, setGaugePercent] = useState(0.552);
  const [pulse, setPulse] = useState(false);
  const [fillFading, setFillFading] = useState(false);
  const [slideState, setSlideState] = useState("normal");
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  useEffect(() => () => clearAllTimeouts(), []);

  const handleClick = (e) => {
    if (disabled) return;
    if (phase === "compressing" || phase === "compressed-holding") return;

    onClick?.(e);

    if (phase === "compressed") {
      clearAllTimeouts();
      setPhase("idle");
      setLabel("276K/500K");
      setGaugePercent(0.552);
      setFillFading(false);
      setSlideState("normal");
      return;
    }

    clearAllTimeouts();
    setPhase("compressing");
    setLabel("Compressing...");
    setFillFading(false);
    setSlideState("normal");

    const tFill = setTimeout(() => {
      setPulse(true);
      const tPulse = setTimeout(() => setPulse(false), 600);
      timeoutsRef.current.push(tPulse);

      setFillFading(true);
      setGaugePercent(0.02);
      setSlideState("exiting-left");

      const tSlideInCompressed = setTimeout(() => {
        setLabel("Compressed");
        setPhase("compressed-holding");
        setSlideState("entering-right");

        const tSettle = setTimeout(() => {
          setSlideState("normal");

          const tHold = setTimeout(() => {
            setSlideState("exiting-left");

            const tSlideInFinal = setTimeout(() => {
              setLabel("10K/500K");
              setSlideState("entering-right");
              setPhase("compressed");
              setFillFading(false);

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
      >
        <span className="btn-dotmatrix-fill-wrap" aria-hidden="true">
          <span className={["btn-dotmatrix-fill-progress", fillFading ? "is-fading" : ""].filter(Boolean).join(" ")} />
        </span>
        <span className={["btn-dotmatrix-pulse", pulse ? "is-active" : ""].filter(Boolean).join(" ")} aria-hidden="true" />
        <span className="btn-dotmatrix-content">
          <span className={["btn-dotmatrix-icon-slot", !showIcon ? "is-hidden" : ""].filter(Boolean).join(" ")} aria-hidden="true">
            {phase === "compressing" ? (
              <DotMatrixIcon iconIndex={2} size={48} />
            ) : (
              <svg className="btn-dotmatrix-gauge" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="btn-dotmatrix-gauge-track" cx="12" cy="12" r={RADIUS} />
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
  );
}`;

const NODE_SNIPPET = `// Server-rendered stub for Dot Matrix Compress Button (supports "276K/500K" and "10K/500K" states)
import React from "react";

export function DotMatrixCompressButtonStatic({
  label = "276K/500K",
  gaugePercent = 0.552,
}) {
  const RADIUS = 8;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - gaugePercent);

  return (
    <div className="btn-dotmatrix-root">
      <button type="button" className="btn-dotmatrix-btn" aria-label={label}>
        <span className="btn-dotmatrix-content">
          <span className="btn-dotmatrix-icon-slot">
            <svg className="btn-dotmatrix-gauge" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="btn-dotmatrix-gauge-track" cx="12" cy="12" r={RADIUS} />
              <circle
                className="btn-dotmatrix-gauge-arc"
                cx="12"
                cy="12"
                r={RADIUS}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
          </span>
          <span className="btn-dotmatrix-text-window">
            <span className="btn-dotmatrix-slide-item">{label}</span>
          </span>
        </span>
      </button>
    </div>
  );
}`;

export const DOT_MATRIX_COMPRESS_META = {
  id: "dot-matrix-compress",
  name: "Dot matrix compress",
  blurb: "Context compression button with circular ring gauge, dynamic left-to-right dot matrix wave SVG, Signal Capsule pulse, and Morph-style Compressed state.",
  states: "idle 276K, compressing 2.5s pill gradient fill & wave SVG, signal capsule pulse, morph compressed (no icon), compressed 10K, hover, active, focus, disabled, reduced motion",
  keywords: [
    "dot matrix compress",
    "dot matrix",
    "dotmatrixicon",
    "signal capsule pulse",
    "morph send transition",
    "pill gradient fill",
    "wave svg",
    "s curve fill",
    "matrix fill",
    "context compression",
    "token compress",
    "token counter",
    "276k 500k",
    "10k 500k",
    "pie chart",
    "ring gauge",
    "circular gauge",
    "cyan accent",
    "tactile pulse",
    "shockwave ripple",
    "text squish",
    "monochrome digital",
    "animated button",
    "interactive button",
    "button microinteraction",
    "ui animation",
  ],
};

export const DOT_MATRIX_COMPRESS_SNIPPETS = {
  html: HTML_SNIPPET,
  react: REACT_SNIPPET,
  node: NODE_SNIPPET,
};
