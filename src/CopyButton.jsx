import { CopySimple } from "@phosphor-icons/react";

export function CopyButton({
  copied,
  disabled,
  onClick,
  label = "Copy all",
  "aria-label": ariaLabel,
}) {
  return (
    <button
      type="button"
      className={copied ? "copy-btn is-copied" : "copy-btn"}
      disabled={disabled}
      aria-label={ariaLabel || label}
      onClick={onClick}
    >
      <span className="copy-btn-mark" aria-hidden="true">
        <CopySimple className="copy-btn-clone" size={14} weight="bold" />
        <svg className="copy-btn-tick" viewBox="0 0 14 14" fill="none">
          <path
            d="M2.2 7.1 5.4 10.4 11.8 3.4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="copy-btn-label">{copied ? "Copied" : label}</span>
      <span className="visually-hidden" role="status">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
