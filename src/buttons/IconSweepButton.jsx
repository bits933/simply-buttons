import "./icon-sweep-button.css";

/* Icon sweep button — exact replication of https://osmo-button-043.webflow.io/
   (Osmo Button Pack #043 by Eduard Bodak,
   https://x.com/eduardbodak/status/2067170556965736675)
   Default variant only, original colors, scoped under .ob043-root. */

export function IconSweepButton({ label = "Button", className = "", onClick, ...rest }) {
  return (
    <button
      type="button"
      data-button-043=""
      className={["button-043", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-043__bg"><span className="button-043__bg-hover"></span></span><span className="button-043__inner"><span className="button-043__mask"><span className="button-043__text">Button</span></span><span className="button-043__icon-wrap"><span className="button-043__icon-bg"></span><span className="button-043__icon-mask"><span className="button-043__icon-list"><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="button-043__icon"><path d="M10.685 3.42h3.776l7.862 8.583-7.862 8.583h-3.776l7.083-7.193h-16.1v-2.748H17.8L10.685 3.42Z" fill="currentColor"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="button-043__icon"><path d="M10.685 3.42h3.776l7.862 8.583-7.862 8.583h-3.776l7.083-7.193h-16.1v-2.748H17.8L10.685 3.42Z" fill="currentColor"></path></svg><svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="button-043__icon"><path d="M10.685 3.42h3.776l7.862 8.583-7.862 8.583h-3.776l7.083-7.193h-16.1v-2.748H17.8L10.685 3.42Z" fill="currentColor"></path></svg></span></span></span></span>
    </button>
  );
}

export function IconSweepButtonPreview() {
  return (
    <div className="ob043-root">
      <IconSweepButton />
    </div>
  );
}
