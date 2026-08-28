import { useState } from "react";
import { Power } from "@phosphor-icons/react";
import "./radial-metal.css";

export function RadialMetalButton({
  label = "Activate power",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className={["btn-radial-metal-mount", className].filter(Boolean).join(" ")}>
      <button
        {...rest}
        type="button"
        className={["btn-radial-metal", isOn && "is-on"].filter(Boolean).join(" ")}
        aria-label={label}
        aria-pressed={isOn}
        disabled={disabled}
        onClick={(event) => {
          setIsOn((value) => !value);
          onClick?.(event);
        }}
      >
        <Power className="btn-radial-metal-icon" weight="bold" aria-hidden="true" />
      </button>
    </div>
  );
}

export function RadialMetalPreview() {
  return (
    <div className="btn-radial-metal-root">
      <RadialMetalButton />
    </div>
  );
}
