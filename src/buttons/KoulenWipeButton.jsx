import "./koulen-wipe.css";
import { KOULEN_WIPE } from "./koulen-wipe.tokens.js";

export function KoulenWipeButton({
  label = KOULEN_WIPE.label,
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-koulen-btn", className].filter(Boolean).join(" ")}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <span className="btn-koulen-fill" aria-hidden="true" />
      <span className="btn-koulen-ink btn-koulen-ink--rest">{label}</span>
      <span className="btn-koulen-hot" aria-hidden="true">
        <span className="btn-koulen-ink btn-koulen-ink--hot">{label}</span>
      </span>
    </button>
  );
}

export function KoulenWipePreview() {
  return (
    <div className="btn-koulen-root">
      <KoulenWipeButton />
    </div>
  );
}
