import "./dot-border-button.css";

const WRAPPER_STYLE = {
  "--dot-size": "8px",
  "--line-weight": "1px",
  "--line-distance": "0.8rem 1rem",
  "--animation-speed": "0.35s",
  "--dot-color": "#fffa",
  "--line-color": "#fffa",
  "--grid-color": "#fff3",
  position: "relative",
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  width: "auto",
  height: "auto",
  padding: "var(--line-distance)",
  backgroundColor: "rgba(0, 0, 0, 0)",
  userSelect: "none",
};

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function PencilIcon() {
  return (
    <svg className="btn-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.6744 11.4075L15.7691 17.1233C15.7072 17.309 15.5586 17.4529 15.3709 17.5087L3.69348 20.9803C3.22819 21.1186 2.79978 20.676 2.95328 20.2155L6.74467 8.84131C6.79981 8.67588 6.92419 8.54263 7.08543 8.47624L12.472 6.25822C12.696 6.166 12.9535 6.21749 13.1248 6.38876L17.5294 10.7935C17.6901 10.9542 17.7463 11.1919 17.6744 11.4075Z" />
      <path d="M3.2959 20.6016L9.65986 14.2376" />
      <path d="M17.7917 11.0557L20.6202 8.22724C21.4012 7.44619 21.4012 6.17986 20.6202 5.39881L18.4989 3.27749C17.7178 2.49645 16.4515 2.49645 15.6704 3.27749L12.842 6.10592" />
      <path d="M11.7814 12.1163C11.1956 11.5305 10.2458 11.5305 9.66004 12.1163C9.07426 12.7021 9.07426 13.6519 9.66004 14.2376C10.2458 14.8234 11.1956 14.8234 11.7814 14.2376C12.3671 13.6519 12.3671 12.7021 11.7814 14.2376Z" />
    </svg>
  );
}

export function RectangleButtons({
  variant = "dot-border-button",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
}) {
  if (variant !== "dot-border-button") return null;

  const safeMode = mode === "light" ? "light" : "dark";
  const safeHue = clamp(hue, -180, 180);
  const safeSaturation = clamp(saturation, 0, 2);
  const safeBrightness = clamp(brightness, 0.35, 1.65);
  const filter =
    safeHue === 0 && safeSaturation === 1 && safeBrightness === 1
      ? undefined
      : `hue-rotate(${safeHue}deg) saturate(${safeSaturation}) brightness(${safeBrightness})`;

  return (
    <div
      className="shader-frame dot-border-root"
      data-dot-border
      data-mode={safeMode}
      style={filter ? { filter } : undefined}
    >
      <a
        href="#"
        className="btn-wrapper"
        style={WRAPPER_STYLE}
        onClick={(event) => {
          event.preventDefault();
        }}
      >
        <div className="line horizontal top" />
        <div className="line vertical right" />
        <div className="line horizontal bottom" />
        <div className="line vertical left" />
        <div className="dot top left" />
        <div className="dot top right" />
        <div className="dot bottom right" />
        <div className="dot bottom left" />
        <button type="button" className="btn bg-[#ffffff]" aria-label="Start Creating">
          <span className="btn-text">Start Creating</span>
          <PencilIcon />
        </button>
      </a>
    </div>
  );
}

export function DotBorderButtonPreview() {
  return (
    <RectangleButtons
      variant="dot-border-button"
      mode="dark"
      hue={0}
      saturation={1.0}
      brightness={1.0}
    />
  );
}
