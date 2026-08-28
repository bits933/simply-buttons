import React from "react";

export function DotMatrixIcon({
  iconIndex = 2,
  size = 48,
  className = "",
  ...rest
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 56 56"
      width={size}
      height={size}
      role="img"
      aria-label={`Dot Matrix Icon ${iconIndex}`}
      className={`btn-dotmatrix-wave-svg ${className}`.trim()}
      {...rest}
    >
      <title>Wave</title>
      <desc>A breathing sine wave drifts left to right.</desc>
      <defs>
        <circle id="dmi-b" r="2.4" fill="#ffffff" opacity="0.12" />
        <circle id="dmi-l" r="3.1" />
      </defs>
      <style>{`
        .dmi-l {
          fill: #22d3ee;
          opacity: 0.05;
          animation: dmi-icon-wave 2400ms cubic-bezier(0.65, 0, 0.35, 1) infinite both;
        }
        @keyframes dmi-icon-wave {
          0% { opacity: 0.05; }
          20% { opacity: 1; }
          55% { opacity: 0.18; }
          100% { opacity: 0.05; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dmi-l { animation: none; opacity: 0.45; }
        }
        .dmi-d00 { animation-delay: 0ms; }
        .dmi-d01 { animation-delay: 480ms; }
        .dmi-d02 { animation-delay: 960ms; }
        .dmi-d03 { animation-delay: 1440ms; }
        .dmi-d04 { animation-delay: 1920ms; }
        .dmi-d10 { animation-delay: 48ms; }
        .dmi-d11 { animation-delay: 528ms; }
        .dmi-d12 { animation-delay: 1008ms; }
        .dmi-d13 { animation-delay: 1488ms; }
        .dmi-d14 { animation-delay: 1968ms; }
        .dmi-d20 { animation-delay: 96ms; }
        .dmi-d21 { animation-delay: 576ms; }
        .dmi-d22 { animation-delay: 1056ms; }
        .dmi-d23 { animation-delay: 1536ms; }
        .dmi-d24 { animation-delay: 2016ms; }
        .dmi-d30 { animation-delay: 144ms; }
        .dmi-d31 { animation-delay: 624ms; }
        .dmi-d32 { animation-delay: 1104ms; }
        .dmi-d33 { animation-delay: 1584ms; }
        .dmi-d34 { animation-delay: 2064ms; }
        .dmi-d40 { animation-delay: 192ms; }
        .dmi-d41 { animation-delay: 672ms; }
        .dmi-d42 { animation-delay: 1152ms; }
        .dmi-d43 { animation-delay: 1632ms; }
        .dmi-d44 { animation-delay: 2112ms; }
      `}</style>
      <use href="#dmi-b" x="6" y="6" />
      <use href="#dmi-b" x="17" y="6" />
      <use href="#dmi-b" x="28" y="6" />
      <use href="#dmi-b" x="39" y="6" />
      <use href="#dmi-b" x="50" y="6" />
      <use href="#dmi-b" x="6" y="17" />
      <use href="#dmi-b" x="17" y="17" />
      <use href="#dmi-b" x="28" y="17" />
      <use href="#dmi-b" x="39" y="17" />
      <use href="#dmi-b" x="50" y="17" />
      <use href="#dmi-b" x="6" y="28" />
      <use href="#dmi-b" x="17" y="28" />
      <use href="#dmi-b" x="28" y="28" />
      <use href="#dmi-b" x="39" y="28" />
      <use href="#dmi-b" x="50" y="28" />
      <use href="#dmi-b" x="6" y="39" />
      <use href="#dmi-b" x="17" y="39" />
      <use href="#dmi-b" x="28" y="39" />
      <use href="#dmi-b" x="39" y="39" />
      <use href="#dmi-b" x="50" y="39" />
      <use href="#dmi-b" x="6" y="50" />
      <use href="#dmi-b" x="17" y="50" />
      <use href="#dmi-b" x="28" y="50" />
      <use href="#dmi-b" x="39" y="50" />
      <use href="#dmi-b" x="50" y="50" />
      <use className="dmi-l dmi-d00" href="#dmi-l" x="6" y="6" />
      <use className="dmi-l dmi-d01" href="#dmi-l" x="17" y="6" />
      <use className="dmi-l dmi-d02" href="#dmi-l" x="28" y="6" />
      <use className="dmi-l dmi-d03" href="#dmi-l" x="39" y="6" />
      <use className="dmi-l dmi-d04" href="#dmi-l" x="50" y="6" />
      <use className="dmi-l dmi-d10" href="#dmi-l" x="6" y="17" />
      <use className="dmi-l dmi-d11" href="#dmi-l" x="17" y="17" />
      <use className="dmi-l dmi-d12" href="#dmi-l" x="28" y="17" />
      <use className="dmi-l dmi-d13" href="#dmi-l" x="39" y="17" />
      <use className="dmi-l dmi-d14" href="#dmi-l" x="50" y="17" />
      <use className="dmi-l dmi-d20" href="#dmi-l" x="6" y="28" />
      <use className="dmi-l dmi-d21" href="#dmi-l" x="17" y="28" />
      <use className="dmi-l dmi-d22" href="#dmi-l" x="28" y="28" />
      <use className="dmi-l dmi-d23" href="#dmi-l" x="39" y="28" />
      <use className="dmi-l dmi-d24" href="#dmi-l" x="50" y="28" />
      <use className="dmi-l dmi-d30" href="#dmi-l" x="6" y="39" />
      <use className="dmi-l dmi-d31" href="#dmi-l" x="17" y="39" />
      <use className="dmi-l dmi-d32" href="#dmi-l" x="28" y="39" />
      <use className="dmi-l dmi-d33" href="#dmi-l" x="39" y="39" />
      <use className="dmi-l dmi-d34" href="#dmi-l" x="50" y="39" />
      <use className="dmi-l dmi-d40" href="#dmi-l" x="6" y="50" />
      <use className="dmi-l dmi-d41" href="#dmi-l" x="17" y="50" />
      <use className="dmi-l dmi-d42" href="#dmi-l" x="28" y="50" />
      <use className="dmi-l dmi-d43" href="#dmi-l" x="39" y="50" />
      <use className="dmi-l dmi-d44" href="#dmi-l" x="50" y="50" />
    </svg>
  );
}
