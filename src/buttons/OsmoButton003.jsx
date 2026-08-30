import { useId } from "react";
import "./osmo-button-003.css";

/* Exact replication of the Osmo Button Pack #003 demo
   (https://osmo-button-003.webflow.io/) from Eduard Bodak's
   "003/100 Buttons" post: https://x.com/eduardbodak/status/2051949088912925107
   Each variant from the post's demo is its own gallery slot. */

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="button-003__icon"
    >
      <path d="M14 19L21 12L14 5" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
      <path d="M21 12H2" stroke="currentColor" strokeWidth="2" strokeMiterlimit="10" />
    </svg>
  );
}

function CircleLines() {
  /* The "circular positioned lines": a dashed circle revealed through an
     animated SVG mask (stroke-dashoffset 300 -> 110 on hover). */
  const rawId = useId();
  const maskId = `button-003-circle-mask-${rawId.replace(/:/g, "")}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 68 68"
      width="100%"
      aria-hidden="true"
      className="button-003__circle"
    >
      <mask width="68" height="68" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} id={maskId}>
        <circle cx="34" cy="34" r="30" stroke="currentColor" strokeWidth="4" className="button-003__circle-mask" />
      </mask>
      <g mask={`url(#${maskId})`}>
        <circle cx="34" cy="34" r="30" stroke="currentColor" strokeDasharray="1 6" strokeWidth="4" />
      </g>
    </svg>
  );
}

export function OsmoButton003({
  label = "Button",
  theme,
  flip = false,
  pill = false,
  iconOnly = false,
  textOnly = false,
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      data-button-003=""
      data-button-theme={theme || undefined}
      aria-label={iconOnly ? label : undefined}
      className={["button-003", flip && "button-003--flip", pill && "button-003--pill", className]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      {...rest}
    >
      {!iconOnly && (
        <span className="button-003__text-wrap">
          <span className="button-003__text is--default">{label}</span>
          <span aria-hidden="true" className="button-003__text is--hover">
            {label}
          </span>
          <span className="button-003__text-bg" />
        </span>
      )}
      {!textOnly && (
        <span className="button-003__icon-wrap">
          <CircleLines />
          <ArrowIcon />
          <span className="button-003__icon-bg" />
        </span>
      )}
    </button>
  );
}

function OsmoButton003Stage({ children }) {
  return <div className="osmo003-root">{children}</div>;
}

export function OsmoButton003DefaultPreview() {
  return (
    <OsmoButton003Stage>
      <OsmoButton003 label="Button" />
    </OsmoButton003Stage>
  );
}

export function OsmoButton003AltPreview() {
  return (
    <OsmoButton003Stage>
      <OsmoButton003 label="Button" theme="secondary" />
    </OsmoButton003Stage>
  );
}

export function OsmoButton003LongPreview() {
  return (
    <OsmoButton003Stage>
      <OsmoButton003 label="Long Button Label" />
    </OsmoButton003Stage>
  );
}

export function OsmoButton003IconCirclePreview() {
  return (
    <OsmoButton003Stage>
      <OsmoButton003 label="Button" flip />
    </OsmoButton003Stage>
  );
}

export function OsmoButton003TextPreview() {
  return (
    <OsmoButton003Stage>
      <OsmoButton003 label="Button" pill textOnly />
    </OsmoButton003Stage>
  );
}

export function OsmoButton003IconPreview() {
  return (
    <OsmoButton003Stage>
      <OsmoButton003 label="Button" pill iconOnly />
    </OsmoButton003Stage>
  );
}
