import "./dual-block-fill-button.css";

/* Dual block fill button — exact replication of https://osmo-button-076.webflow.io/
   (Osmo Button Pack #076 by Eduard Bodak,
   https://x.com/eduardbodak/status/2079478198736204003)
   Default variant only, original colors, scoped under .ob076-root. */

export function DualBlockFillButton({ label = "Button", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-button-076=""
      className={["button-076", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-076__hover"><span className="button-076__bg is--hover"></span><span className="button-076__inner"><span className="button-076__text">Button</span></span></span><span aria-hidden="true" className="button-076__default"><span className="button-076__bg is--default"></span><span className="button-076__inner"><span className="button-076__text">Button</span></span></span>
    </button>
  );
}

export function DualBlockFillButtonPreview() {
  return (
    <div className="ob076-root">
      <DualBlockFillButton />
    </div>
  );
}
