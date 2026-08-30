import "./roll-fill-button.css";

/* Roll fill button — exact replication of https://osmo-button-049.webflow.io/
   (Osmo Button Pack #049 by Eduard Bodak,
   https://x.com/eduardbodak/status/2069352851797578020)
   Default variant only, original colors, scoped under .ob049-root. */

export function RollFillButton({ label = "Button", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-button-049=""
      className={["button-049", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-049__bg-hover"></span><span className="button-049__bg"></span><span className="button-049__inner"><span className="button-049__text">Button</span></span>
    </button>
  );
}

export function RollFillButtonPreview() {
  return (
    <div className="ob049-root">
      <RollFillButton />
    </div>
  );
}
