import "./item-box-button.css";

/* Item box button — exact replication of https://osmo-button-068.webflow.io/
   (Osmo Button Pack #068 by Eduard Bodak,
   https://x.com/eduardbodak/status/2076609720001941607)
   Default variant only, original colors, scoped under .ob068-root. */

export function ItemBoxButton({ label = "Button", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-button-068=""
      className={["button-068", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-068__inner"><span className="button-068__text is--first">Button</span><span aria-hidden="true" className="button-068__text is--second">Button</span><span aria-hidden="true" className="button-068__text is--third">Button</span></span>
    </button>
  );
}

export function ItemBoxButtonPreview() {
  return (
    <div className="ob068-root">
      <ItemBoxButton />
    </div>
  );
}
