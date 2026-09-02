import { ArrowRight } from "@phosphor-icons/react";
import "./superhuman-cta-button.css";

export function SuperhumanCtaButton({
  label = "Get Superhuman",
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      className={["btn-superhuman-cta", className].filter(Boolean).join(" ")}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span>{label}</span>
      <span className="btn-superhuman-cta__icon" aria-hidden="true">
        <ArrowRight size={20} weight="bold" />
      </span>
    </button>
  );
}

export function SuperhumanCtaPreview() {
  return (
    <div className="btn-superhuman-cta-root">
      <SuperhumanCtaButton />
    </div>
  );
}
