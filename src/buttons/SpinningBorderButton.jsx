import "./spinning-border-button.css";

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function ArrowIcon() {
  return (
    <svg
      className="spinning-arrow"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function RectangleButtons({
  variant = "spinning-border-button",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
}) {
  if (variant !== "spinning-border-button") return null;

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
      className="shader-frame spinning-border-root"
      data-spinning-border
      data-mode={safeMode}
      style={filter ? { filter } : undefined}
    >
      <button type="button" className="group spinning-btn" aria-label="Request Demo">
        <span className="spinning-beam" aria-hidden="true" />
        <span className="spinning-ring" aria-hidden="true" />
        <span className="spinning-surface">
          <span className="spinning-label">Request Demo</span>
          <ArrowIcon />
        </span>
      </button>
    </div>
  );
}

export function SpinningBorderButtonPreview() {
  return (
    <RectangleButtons
      variant="spinning-border-button"
      mode="dark"
      hue={0}
      saturation={1.0}
      brightness={1.0}
    />
  );
}
