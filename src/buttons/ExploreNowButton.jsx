import { useEffect, useRef, useState } from "react";
import "@fontsource/unbounded/800.css";
import "./explore-now-button.css";

/* Explore now button — neo-brutalist yellow face (Unbounded 800) with a thick
   black border and a chunky dark offset block; on click the face glides
   down-right to align with the black area, then springs back to the hover
   position instead of staying pressed.
   Original specimen for the Simply Buttons gallery (not a replica). */

export function ExploreNowButton({ label = "EXPLORE NOW!", className = "", onClick, ...rest }) {
  const [pressed, setPressed] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <button
      type="button"
      data-explore-now=""
      className={["btn-explore-now", pressed ? "is--pressed" : "", className].filter(Boolean).join(" ")}
      onClick={(event) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setPressed(true);
        timerRef.current = setTimeout(() => setPressed(false), 220);
        if (onClick) onClick(event);
      }}
      {...rest}
    >
      <span className="btn-explore-now__face">{label}</span>
    </button>
  );
}

export function ExploreNowButtonPreview() {
  return (
    <div className="explore-now-root">
      <ExploreNowButton />
    </div>
  );
}
