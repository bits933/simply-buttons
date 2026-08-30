import { useEffect, useRef } from "react";
import "./stripe-scroll-button.css";

/* Stripe scroll button — exact replication of https://osmo-button-085.webflow.io/
   (Osmo Button Pack #085 by Eduard Bodak,
   https://x.com/eduardbodak/status/2082754146868895911)
   Default variant only, original colors, scoped under .ob085-root. */

export function StripeScrollButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is--inview", entry.isIntersecting);
      });
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-085=""
      className={["button-085", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-085__bg"><span className="button-085__bg-overlay"></span><span className="button-085__bg-animation-top"></span><span className="button-085__bg-animation-bottom"></span></span><span className="button-085__inner"><span className="button-085__text">Button</span></span>
    </button>
  );
}

export function StripeScrollButtonPreview() {
  return (
    <div className="ob085-root">
      <StripeScrollButton />
    </div>
  );
}
