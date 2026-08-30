import "./clip-fill-button.css";

/* Clip fill button — exact replication of https://osmo-button-050.webflow.io/
   (Osmo Button Pack #050 by Eduard Bodak,
   https://x.com/eduardbodak/status/2069707364970713175)
   Default variant only, original colors, scoped under .ob050-root. */

export function ClipFillButton({ label = "Button", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-button-050=""
      className={["button-050", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-050__bg-hover"></span><span className="button-050__bg"></span><span className="button-050__inner"><span className="button-050__text">Button</span></span>
    </button>
  );
}

export function ClipFillButtonPreview() {
  return (
    <div className="ob050-root">
      <ClipFillButton />
    </div>
  );
}
