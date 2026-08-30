import "./tetris-stack-button.css";

/* Exact replication of the Osmo Button Pack #036 demo
   (https://osmo-button-036.webflow.io/) from Eduard Bodak's
   "036/100 Buttons" post: https://x.com/eduardbodak/status/2064631381213225327
   Recolored from the original white/black to violet/amber. */

const SPAN_INDEXES = [0, 1, 2, 3, 4];

export function TetrisStackButton({
  label = "Button",
  className = "",
  onClick,
  ...rest
}) {
  return (
    <button
      type="button"
      data-button-036=""
      className={["button-036", className].filter(Boolean).join(" ")}
      onClick={onClick}
      {...rest}
    >
      <span className="button-036__bg">
        {SPAN_INDEXES.map((index) => (
          <span key={index} style={{ "--index": index }} className="button-036__bg-span" />
        ))}
      </span>
      <span className="button-036__inner">
        <span className="button-036__text is--default">{label}</span>
        <span aria-hidden="true" className="button-036__text is--hover">
          {label}
        </span>
      </span>
    </button>
  );
}

export function TetrisStackButtonPreview() {
  return (
    <div className="tetris-stack-root">
      <TetrisStackButton />
    </div>
  );
}
