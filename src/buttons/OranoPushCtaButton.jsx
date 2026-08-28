import "./orano-push-cta.css";

export function OranoPushCtaButton({
  label = "ENTER",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-orano-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      {...rest}
    >
      {/* RGB Chromatic Split Glitch Layers */}
      <span className="btn-orano-rgb red" aria-hidden="true" />
      <span className="btn-orano-rgb green" aria-hidden="true" />

      {/* Main Clipped Overflow Container */}
      <span className="btn-orano-overflow">
        {/* Electric Yellow Backing Layer with Noise */}
        <span className="btn-orano-hover" aria-hidden="true">
          <span className="btn-orano-hover-inner">
            <span className="btn-orano-noise" />
          </span>
        </span>

        {/* Base White Solid Cover Mask (starts after 10px yellow bar) */}
        <span className="btn-orano-bg" aria-hidden="true" />

        {/* Text Container */}
        <span className="btn-orano-label-container">
          <span className="btn-orano-label">{label}</span>
        </span>

        {/* Crossbar Strike Line */}
        <span className="btn-orano-stroke" aria-hidden="true" />
      </span>
    </button>
  );
}

export function OranoPushCtaPreview() {
  return (
    <div className="btn-orano-root">
      <OranoPushCtaButton />
    </div>
  );
}
