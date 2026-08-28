import { FlameWrap } from "../components/canvasui/FlameWrap.jsx";
import { FLAME_STREAK_LABEL, FLAME_STREAK_OPTIONS } from "./flame-streak.js";
import "./flame-streak.css";

export function FlameStreakButton({
  label = FLAME_STREAK_LABEL,
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <FlameWrap className="btn-fstreak-wrap" {...FLAME_STREAK_OPTIONS}>
      <button
        type="button"
        className={["btn-fstreak-btn", className].filter(Boolean).join(" ")}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        <span className="btn-fstreak-fire" aria-hidden="true">
          🔥
        </span>
        {label}
      </button>
    </FlameWrap>
  );
}

export function FlameStreakPreview() {
  return (
    <div className="btn-fstreak-preview">
      <FlameStreakButton />
    </div>
  );
}
