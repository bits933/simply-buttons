import { useState } from "react";
import "./kultiveret-menu.css";

export function KultiveretMenuButton({
  label = "MENU",
  isOpen,
  defaultOpen = false,
  onToggle,
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isOpen !== undefined ? isOpen : internalOpen;

  function handleClick(e) {
    if (disabled) return;
    if (isOpen === undefined) {
      setInternalOpen((prev) => !prev);
    }
    onToggle?.(!open);
    onClick?.(e);
  }

  return (
    <button
      type="button"
      className={[
        "btn-kult-btn",
        open ? "is-open" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      onClick={handleClick}
      {...rest}
    >
      <span className="btn-kult-text-wrapper">
        <span className="btn-kult-text">{label}</span>
        <span className="btn-kult-text btn-kult-text--dup" aria-hidden="true">
          {label}
        </span>
      </span>

      <span className="btn-kult-icon" aria-hidden="true">
        {/* Open state (parallel horizontal lines) */}
        <span className="btn-kult-open">
          <span className="btn-kult-open-line">
            <span className="btn-kult-line" />
          </span>
          <span className="btn-kult-open-line">
            <span className="btn-kult-line" />
          </span>
        </span>

        {/* Close state (45deg / -45deg cross lines) */}
        <span className="btn-kult-close">
          <span className="btn-kult-close-line btn-kult-close-line--left">
            <span className="btn-kult-line" />
          </span>
          <span className="btn-kult-close-line btn-kult-close-line--right">
            <span className="btn-kult-line" />
          </span>
        </span>
      </span>
    </button>
  );
}

export function KultiveretMenuPreview() {
  return (
    <div className="btn-kult-root">
      <KultiveretMenuButton label="MENU" />
    </div>
  );
}
