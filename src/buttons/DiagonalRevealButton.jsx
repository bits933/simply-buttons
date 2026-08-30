import "./diagonal-reveal-button.css";

/* Diagonal reveal button — exact replication of https://osmo-button-035.webflow.io/
   (Osmo Button Pack #035 by Eduard Bodak,
   https://x.com/eduardbodak/status/2064274370877370807)
   Default variant only, original colors, scoped under .ob035-root. */

export function DiagonalRevealButton({ label = "Button", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-button-035=""
      className={["button-035", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-035__hover"><span className="button-035__bg is--hover"></span><span className="button-035__inner"><span className="button-035__text">Button</span></span></span><span aria-hidden="true" className="button-035__default"><span className="button-035__bg is--default"></span><span className="button-035__inner"><span className="button-035__text">Button</span></span></span>
    </button>
  );
}

export function DiagonalRevealButtonPreview() {
  return (
    <div className="ob035-root">
      <DiagonalRevealButton />
    </div>
  );
}
