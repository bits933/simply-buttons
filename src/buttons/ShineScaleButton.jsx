import { useEffect, useRef } from "react";
import "./shine-scale-button.css";

/* Shine scale button — exact replication of https://osmo-button-079.webflow.io/
   (Osmo Button Pack #079 by Eduard Bodak,
   https://x.com/eduardbodak/status/2080578984132125010)
   Default variant only, original colors, scoped under .ob079-root. */

export function ShineScaleButton({ label = "Button", className = "", onClick, ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const widthIncrease = Number(root.getAttribute("data-button-079-width-increase")) || 16;
    const heightIncrease = Number(root.getAttribute("data-button-079-height-increase")) || 8;
    let updateScale = null;
    if (widthIncrease && heightIncrease) {
      updateScale = () => {
        const w = root.offsetWidth;
        const h = root.offsetHeight;
        if (!w || !h) return;
        root.style.setProperty("--button-079-scale-x", (w + widthIncrease) / w);
        root.style.setProperty("--button-079-scale-y", (h + heightIncrease) / h);
      };
      updateScale();
      window.addEventListener("resize", updateScale);
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is--inview", entry.isIntersecting);
      });
    });
    io.observe(root);
    return () => {
      io.disconnect();
      if (updateScale) window.removeEventListener("resize", updateScale);
    };
  }, []);
  return (
    <button ref={ref}
      type="button"
      data-button-079-height-increase="8" data-button-079="" data-button-079-width-increase="16"
      className={["button-079", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-079__bg-animation"><span className="button-079__bg-shine-wrap"><span className="button-079__bg-shine is--first"></span><span className="button-079__bg-shine is--second"></span></span></span><span className="button-079__bg"></span><span className="button-079__inner"><span className="button-079__text">Button</span></span>
    </button>
  );
}

export function ShineScaleButtonPreview() {
  return (
    <div className="ob079-root">
      <ShineScaleButton />
    </div>
  );
}
