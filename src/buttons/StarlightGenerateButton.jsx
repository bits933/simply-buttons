import { useState } from "react";
import { StarFour } from "@phosphor-icons/react";
import "./starlight-generate.css";

export function StarlightGenerateButton({
  label = "Generate Site",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [active, setActive] = useState(false);

  function handleClick(event) {
    if (event.defaultPrevented || disabled || active) return;
    setActive(true);
    window.setTimeout(() => setActive(false), 3000);
    onClick?.(event);
  }

  return (
    <button
      type="button"
      className={["btn-starlight-btn", active && "is-active", className]
        .filter(Boolean)
        .join(" ")}
      aria-pressed={active}
      aria-busy={active}
      disabled={disabled}
      onClick={handleClick}
      {...rest}
    >
      <span className="btn-starlight-stars" aria-hidden="true">
        <StarFour className="btn-starlight-star btn-starlight-star--one" weight="fill" />
        <StarFour className="btn-starlight-star btn-starlight-star--two" weight="fill" />
      </span>
      <span className="btn-starlight-label">
        {active ? "Generating" : label}
      </span>
    </button>
  );
}

export function StarlightGeneratePreview() {
  return (
    <div className="btn-starlight-root">
      <StarlightGenerateButton />
    </div>
  );
}
