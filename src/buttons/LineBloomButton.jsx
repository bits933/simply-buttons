import "./line-bloom-button.css";

/* Line bloom button — exact replication of https://osmo-button-054.webflow.io/
   (Osmo Button Pack #054 by Eduard Bodak,
   https://x.com/eduardbodak/status/2071521190477250933)
   Default variant only, original colors, scoped under .ob054-root. */

export function LineBloomButton({ label = "Button", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-button-054=""
      className={["button-054", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-054__default"><span className="button-054__text">Button</span><span className="button-054__bg is--default"></span></span><span aria-hidden="true" className="button-054__hover"><span className="button-054__hover-inner"><span className="button-054__text">Button</span><span className="button-054__bg is--hover"></span></span></span>
    </button>
  );
}

export function LineBloomButtonPreview() {
  return (
    <div className="ob054-root">
      <LineBloomButton />
    </div>
  );
}
