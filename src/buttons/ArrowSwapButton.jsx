import "./arrow-swap-button.css";

/* Arrow swap button — exact replication of https://osmo-button-052.webflow.io/
   (Osmo Button Pack #052 by Eduard Bodak,
   https://x.com/eduardbodak/status/2070808566571708685)
   Default variant only, original colors, scoped under .ob052-root. */

export function ArrowSwapButton({ label = "Button", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-button-052=""
      className={["button-052", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-052__icon-wrap is--default"><span className="button-052__icon-bg"></span><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="button-052__icon"><path d="M14 19L21 12L14 5" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"></path><path d="M21 12H2" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"></path></svg></span><span className="button-052__text-wrap"><span className="button-052__text">Button</span></span><span className="button-052__icon-wrap is--hover"><span className="button-052__icon-bg"></span><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="button-052__icon"><path d="M14 19L21 12L14 5" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"></path><path d="M21 12H2" stroke="currentColor" stroke-width="2" stroke-miterlimit="10"></path></svg></span>
    </button>
  );
}

export function ArrowSwapButtonPreview() {
  return (
    <div className="ob052-root">
      <ArrowSwapButton />
    </div>
  );
}
