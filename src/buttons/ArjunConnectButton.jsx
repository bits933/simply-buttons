import "./arjun-connect-button.css";

export function ArjunConnectFilters() {
  return (
    <svg className="ac-filters-svg" aria-hidden="true">
      <defs>
        <filter id="ac-chalk" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.08" numOctaves="2" seed="31" result="wobble" />
          <feDisplacementMap in="SourceGraphic" in2="wobble" scale="1.2" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.4 0.8" numOctaves="3" seed="19" result="grain" />
          <feColorMatrix in="grain" type="luminanceToAlpha" result="grainA" />
          <feComponentTransfer in="grainA" result="grainMask">
            <feFuncA type="linear" slope="1.8" intercept="-0.08" />
          </feComponentTransfer>
          <feComposite in="rough" in2="grainMask" operator="in" />
        </filter>

        <filter id="ac-text-chalk" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.45 0.75" numOctaves="1" seed="14" result="grain" />
          <feColorMatrix in="grain" type="luminanceToAlpha" result="grainA" />
          <feComponentTransfer in="grainA" result="grainMask">
            <feFuncA type="linear" slope="0.85" intercept="0.3" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="grainMask" operator="in" />
        </filter>

        <filter id="ac-chalk-echo" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035 0.07" numOctaves="2" seed="52" result="wobble" />
          <feDisplacementMap in="SourceGraphic" in2="wobble" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.5 0.9" numOctaves="3" seed="27" result="grain" />
          <feColorMatrix in="grain" type="luminanceToAlpha" result="grainA" />
          <feComponentTransfer in="grainA" result="grainMask">
            <feFuncA type="linear" slope="1.7" intercept="-0.22" />
          </feComponentTransfer>
          <feComposite in="rough" in2="grainMask" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}

export function ArjunConnectButton({ label = "connect", onClick, ...rest }) {
  return (
    <>
      <ArjunConnectFilters />
      <button
        type="button"
        className="btn-arjun-connect"
        aria-label={label}
        onClick={onClick}
        {...rest}
      >
        <div className="ac-stamp-wrap" aria-hidden="true">
          <svg
            viewBox="0 0 100 44"
            preserveAspectRatio="none"
            className="ac-svg"
            aria-hidden="true"
          >
            <ellipse
              cx="50"
              cy="22"
              rx="44"
              ry="17.5"
              fill="currentColor"
              fillOpacity="0.88"
              filter="url(#ac-chalk)"
            />

            {/* Scribble Frame 1 */}
            <g className="ac-scribble-1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <g filter="url(#ac-chalk-echo)" opacity="0.38" transform="translate(0.5 -0.3)">
                <path d="M 8 22 C 6 9, 22 2, 50 2 C 78 2, 98 9, 96 22 C 94 35, 78 42, 50 42 C 22 42, 2 35, 6 20 C 8 11, 20 3, 46 2.5" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
                <path d="M 12 22 C 10 11, 22 6, 32 12 C 42 18, 32 32, 20 30 C 8 28, 14 12, 26 8 C 38 4, 48 14, 42 26 C 36 38, 48 40, 56 32 C 64 24, 56 8, 66 6 C 76 4, 86 12, 80 26 C 74 40, 86 38, 92 30 C 98 22, 86 8, 74 10 C 62 12, 72 26, 84 24 C 96 22, 92 36, 80 38 C 68 40, 50 36, 42 24 C 34 12, 48 6, 64 8 C 80 10, 86 26, 72 34 C 58 42, 28 40, 18 26 C 8 12, 28 4, 46 4 C 64 4, 82 6, 92 18 C 102 30, 82 40, 60 40 C 38 40, 14 38, 10 22" strokeWidth="3.4" vectorEffect="non-scaling-stroke" />
                <path d="M 18 15 C 24 6, 36 10, 34 22 C 32 34, 18 36, 16 24 C 14 12, 30 8, 44 10 C 58 12, 56 30, 44 34 C 32 38, 46 42, 60 38 C 74 34, 72 16, 62 12 C 52 8, 66 4, 76 8 C 86 12, 84 30, 72 36 C 60 42, 76 42, 88 34 C 100 26, 92 10, 80 12 C 68 14, 58 26, 48 32 C 38 38, 22 32, 20 18" strokeWidth="3.0" vectorEffect="non-scaling-stroke" />
              </g>
              <g filter="url(#ac-chalk)" opacity="0.95">
                <path d="M 8 22 C 6 9, 22 2, 50 2 C 78 2, 98 9, 96 22 C 94 35, 78 42, 50 42 C 22 42, 2 35, 6 20 C 8 11, 20 3, 46 2.5" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
                <path d="M 12 22 C 10 11, 22 6, 32 12 C 42 18, 32 32, 20 30 C 8 28, 14 12, 26 8 C 38 4, 48 14, 42 26 C 36 38, 48 40, 56 32 C 64 24, 56 8, 66 6 C 76 4, 86 12, 80 26 C 74 40, 86 38, 92 30 C 98 22, 86 8, 74 10 C 62 12, 72 26, 84 24 C 96 22, 92 36, 80 38 C 68 40, 50 36, 42 24 C 34 12, 48 6, 64 8 C 80 10, 86 26, 72 34 C 58 42, 28 40, 18 26 C 8 12, 28 4, 46 4 C 64 4, 82 6, 92 18 C 102 30, 82 40, 60 40 C 38 40, 14 38, 10 22" strokeWidth="3.4" vectorEffect="non-scaling-stroke" />
                <path d="M 18 15 C 24 6, 36 10, 34 22 C 32 34, 18 36, 16 24 C 14 12, 30 8, 44 10 C 58 12, 56 30, 44 34 C 32 38, 46 42, 60 38 C 74 34, 72 16, 62 12 C 52 8, 66 4, 76 8 C 86 12, 84 30, 72 36 C 60 42, 76 42, 88 34 C 100 26, 92 10, 80 12 C 68 14, 58 26, 48 32 C 38 38, 22 32, 20 18" strokeWidth="3.0" vectorEffect="non-scaling-stroke" />
              </g>
            </g>

            {/* Scribble Frame 2 */}
            <g className="ac-scribble-2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <g filter="url(#ac-chalk-echo)" opacity="0.38" transform="translate(0.6 -0.4)">
                <path d="M 9 21 C 7 10, 24 3, 51 2.5 C 77 2, 97 10, 95 23 C 93 34, 77 41.5, 49 41.5 C 23 41.5, 3 34, 7 21 C 9 12, 21 3.5, 47 3" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
                <path d="M 14 20 C 12 9, 25 7, 34 14 C 43 21, 31 34, 19 31 C 7 28, 16 11, 28 7 C 40 3, 46 16, 40 28 C 34 39, 49 39, 58 30 C 67 21, 54 7, 68 5 C 78 3, 88 14, 82 28 C 76 41, 88 36, 94 28 C 99 20, 84 6, 72 9 C 60 12, 74 27, 86 23 C 97 20, 90 38, 78 39 C 66 40, 48 34, 40 22 C 32 10, 50 5, 66 9 C 82 13, 84 28, 70 36 C 56 43, 26 39, 16 24 C 6 10, 26 3, 48 3 C 66 3, 84 7, 94 20 C 103 31, 80 41, 58 41 C 36 41, 12 36, 9 20" strokeWidth="3.4" vectorEffect="non-scaling-stroke" />
                <path d="M 16 17 C 22 7, 38 9, 36 24 C 34 36, 16 34, 14 22 C 12 10, 32 7, 46 11 C 60 15, 54 32, 42 36 C 30 40, 48 43, 62 36 C 76 31, 70 14, 60 10 C 50 6, 68 3, 78 9 C 88 15, 82 32, 70 38 C 58 43, 78 40, 90 32 C 101 24, 90 8, 78 10 C 66 12, 56 28, 46 34 C 36 39, 20 30, 18 16" strokeWidth="3.0" vectorEffect="non-scaling-stroke" />
              </g>
              <g filter="url(#ac-chalk)" opacity="0.95">
                <path d="M 9 21 C 7 10, 24 3, 51 2.5 C 77 2, 97 10, 95 23 C 93 34, 77 41.5, 49 41.5 C 23 41.5, 3 34, 7 21 C 9 12, 21 3.5, 47 3" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
                <path d="M 14 20 C 12 9, 25 7, 34 14 C 43 21, 31 34, 19 31 C 7 28, 16 11, 28 7 C 40 3, 46 16, 40 28 C 34 39, 49 39, 58 30 C 67 21, 54 7, 68 5 C 78 3, 88 14, 82 28 C 76 41, 88 36, 94 28 C 99 20, 84 6, 72 9 C 60 12, 74 27, 86 23 C 97 20, 90 38, 78 39 C 66 40, 48 34, 40 22 C 32 10, 50 5, 66 9 C 82 13, 84 28, 70 36 C 56 43, 26 39, 16 24 C 6 10, 26 3, 48 3 C 66 3, 84 7, 94 20 C 103 31, 80 41, 58 41 C 36 41, 12 36, 9 20" strokeWidth="3.4" vectorEffect="non-scaling-stroke" />
                <path d="M 16 17 C 22 7, 38 9, 36 24 C 34 36, 16 34, 14 22 C 12 10, 32 7, 46 11 C 60 15, 54 32, 42 36 C 30 40, 48 43, 62 36 C 76 31, 70 14, 60 10 C 50 6, 68 3, 78 9 C 88 15, 82 32, 70 38 C 58 43, 78 40, 90 32 C 101 24, 90 8, 78 10 C 66 12, 56 28, 46 34 C 36 39, 20 30, 18 16" strokeWidth="3.0" vectorEffect="non-scaling-stroke" />
              </g>
            </g>

            {/* Scribble Frame 3 */}
            <g className="ac-scribble-3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <g filter="url(#ac-chalk-echo)" opacity="0.38" transform="translate(0.4 -0.2)">
                <path d="M 7 23 C 5 8, 20 2, 49 2 C 79 2, 99 8, 97 21 C 95 36, 79 42.5, 51 42.5 C 21 42.5, 1 36, 5 19 C 7 10, 19 2.5, 45 2" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
                <path d="M 10 24 C 8 13, 20 5, 30 10 C 40 16, 33 30, 21 29 C 9 27, 12 13, 24 9 C 36 5, 50 12, 44 24 C 38 36, 44 41, 54 34 C 63 26, 58 9, 64 7 C 74 5, 84 10, 78 24 C 72 38, 82 40, 90 32 C 97 24, 88 10, 76 11 C 64 12, 70 25, 82 25 C 94 24, 94 34, 82 37 C 70 40, 52 38, 44 26 C 36 14, 46 7, 62 7 C 78 8, 88 24, 74 32 C 60 41, 30 41, 20 28 C 10 14, 30 5, 44 5 C 62 5, 80 5, 90 16 C 100 28, 84 39, 62 39 C 40 39, 16 40, 11 24" strokeWidth="3.4" vectorEffect="non-scaling-stroke" />
                <path d="M 20 13 C 26 5, 34 11, 32 20 C 30 31, 20 38, 18 26 C 16 14, 28 9, 42 9 C 56 10, 58 28, 46 32 C 34 36, 44 41, 58 40 C 72 36, 74 20, 64 14 C 54 10, 60 5, 70 7 C 80 10, 86 26, 74 34 C 62 41, 72 44, 86 36 C 97 28, 94 12, 82 14 C 70 16, 62 24, 50 30 C 39 36, 24 34, 22 20" strokeWidth="3.0" vectorEffect="non-scaling-stroke" />
              </g>
              <g filter="url(#ac-chalk)" opacity="0.95">
                <path d="M 7 23 C 5 8, 20 2, 49 2 C 79 2, 99 8, 97 21 C 95 36, 79 42.5, 51 42.5 C 21 42.5, 1 36, 5 19 C 7 10, 19 2.5, 45 2" strokeWidth="2.4" vectorEffect="non-scaling-stroke" />
                <path d="M 10 24 C 8 13, 20 5, 30 10 C 40 16, 33 30, 21 29 C 9 27, 12 13, 24 9 C 36 5, 50 12, 44 24 C 38 36, 44 41, 54 34 C 63 26, 58 9, 64 7 C 74 5, 84 10, 78 24 C 72 38, 82 40, 90 32 C 97 24, 88 10, 76 11 C 64 12, 70 25, 82 25 C 94 24, 94 34, 82 37 C 70 40, 52 38, 44 26 C 36 14, 46 7, 62 7 C 78 8, 88 24, 74 32 C 60 41, 30 41, 20 28 C 10 14, 30 5, 44 5 C 62 5, 80 5, 90 16 C 100 28, 84 39, 62 39 C 40 39, 16 40, 11 24" strokeWidth="3.4" vectorEffect="non-scaling-stroke" />
                <path d="M 20 13 C 26 5, 34 11, 32 20 C 30 31, 20 38, 18 26 C 16 14, 28 9, 42 9 C 56 10, 58 28, 46 32 C 34 36, 44 41, 58 40 C 72 36, 74 20, 64 14 C 54 10, 60 5, 70 7 C 80 10, 86 26, 74 34 C 62 41, 72 44, 86 36 C 97 28, 94 12, 82 14 C 70 16, 62 24, 50 30 C 39 36, 24 34, 22 20" strokeWidth="3.0" vectorEffect="non-scaling-stroke" />
              </g>
            </g>
          </svg>

          {/* Text layer */}
          <svg viewBox="0 0 100 44" preserveAspectRatio="none" className="ac-text-svg" aria-hidden="true">
            <g stroke="none" fill="#ffffff">
              <g filter="url(#ac-text-chalk)">
                <text
                  x="50"
                  y="22.5"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="ac-text"
                >
                  {label}
                </text>
              </g>
            </g>
          </svg>
        </div>
      </button>
    </>
  );
}

export function ArjunConnectButtonPreview() {
  return (
    <div className="arjun-connect-root" data-arjun-connect>
      <ArjunConnectButton />
    </div>
  );
}

export default ArjunConnectButton;
