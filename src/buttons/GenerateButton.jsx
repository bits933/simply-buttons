import "./generate-button.css";

const LETTERS = ["G", "e", "n", "e", "r", "a", "t", "e"];
const LETTERS_ACTIVE = ["G", "e", "n", "e", "r", "a", "t", "i", "n", "g"];

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function SparkleIcon() {
  return (
    <svg className="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  );
}

export function RectangleButtons({
  variant = "generate-button",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
}) {
  if (variant !== "generate-button") return null;

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
      className="shader-frame generate-root"
      data-generate
      data-mode={safeMode}
      style={filter ? { filter } : undefined}
    >
      <div className="btn-wrapper">
        <button
          type="button"
          className="btn px-3 py-2 md:px-4 md:py-2 focus:outline-none"
          aria-label="Generate"
          title="Generate"
        >
          <SparkleIcon />
          <div className="txt-wrapper">
            <div className="txt-1">
              {LETTERS.map((letter, index) => (
                <span className="btn-letter" key={index}>{letter}</span>
              ))}
            </div>
            <div className="txt-2">
              {LETTERS_ACTIVE.map((letter, index) => (
                <span className="btn-letter" key={index}>{letter}</span>
              ))}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

export function GenerateButtonPreview() {
  return (
    <RectangleButtons
      variant="generate-button"
      mode="dark"
      hue={0}
      saturation={1.0}
      brightness={1.0}
    />
  );
}
