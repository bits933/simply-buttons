import "./corner-frame-button.css";

/* Corner frame button — exact replication of https://osmo-button-070.webflow.io/
   (Osmo Button Pack #070 by Eduard Bodak,
   https://x.com/eduardbodak/status/2077316428093337696)
   Default variant only, original colors, scoped under .ob070-root. */

export function CornerFrameButton({ label = "Button", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-button-070=""
      className={["button-070", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-070__bg-wrap"><span className="button-070__corner-wrap"><span className="button-070__corner is--top-left"></span><span className="button-070__corner is--top-right"></span><span className="button-070__corner is--bottom-left"></span><span className="button-070__corner is--bottom-right"></span></span><span className="button-070__bg"></span></span><span className="button-070__inner"><span className="button-070__text">Button</span></span>
    </button>
  );
}

export function CornerFrameButtonPreview() {
  return (
    <div className="ob070-root">
      <CornerFrameButton />
    </div>
  );
}
