import "./orbit-stroke.css";

export function OrbitStrokeButton({ label = "Send", className = "", ...props }) {
  return (
    <button
      type="button"
      className={["btn-orbit-stroke", className].filter(Boolean).join(" ")}
      {...props}
    >
      <span>{label}</span>
    </button>
  );
}

export function OrbitStrokePreview() {
  return <div className="btn-orbit-stroke-root"><OrbitStrokeButton /></div>;
}
