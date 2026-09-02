import { useEffect, useRef, useState } from "react";
import "./claude-code-button.css";
import { initClaudeWebgl } from "./claude-code-webgl.js";

function ClaudeMascot() {
  return (
    <span className="btn-claude-code__mascot" aria-hidden="true">
      <svg width="1280" height="1280" viewBox="0 0 1280 1280" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M303.969 378.747L975.937 378.742L975.962 600.73L1088.04 600.707L1088.06 716.464L976.049 716.427L976.056 829.477L920.531 829.458L920.524 938.745L864.031 938.752C863.243 903.364 863.987 865.102 863.987 829.477L808.524 829.464L808.512 879.845L808.506 938.745L751.993 938.752C751.549 902.652 751.974 865.645 751.974 829.47L528.057 829.464L528.051 938.752H471.557L471.617 829.483L416.057 829.464L416.041 938.745L359.479 938.758L359.496 829.477L304.019 829.464C303.296 792.645 303.982 753.47 303.979 716.452L191.981 716.427L191.953 600.706L304.011 600.714L303.969 378.747Z" fill="#D87757"/>
        <path d="M808.324 494.462L863.974 494.445L863.999 600.714L808.33 600.737L808.324 494.462Z" fill="#090A0A"/>
        <path d="M416.072 494.43L471.577 494.455L471.59 600.617C454.805 601.363 433.23 600.732 416.074 600.727L416.072 494.43Z" fill="#090A0A"/>
      </svg>
    </span>
  );
}

export function ClaudeCodeButton({
  label = "Ask Claude",
  loadingLabel = "Thinking...",
  className = "",
  onClick,
  ...rest
}) {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const webglRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      webglRef.current = initClaudeWebgl(canvasRef.current);
    }
    return () => {
      webglRef.current?.destroy();
    };
  }, []);

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (loading) return;

    setLoading(true);
    webglRef.current?.start(2200, () => {
      setLoading(false);
      webglRef.current?.reset();
    });
  };

  return (
    <button
      type="button"
      data-claude-code=""
      data-loading={loading ? "true" : "false"}
      className={["btn-claude-code", className].filter(Boolean).join(" ")}
      aria-label={label}
      onClick={handleClick}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        className="btn-claude-code__canvas"
        aria-hidden="true"
      />
      <ClaudeMascot />
      <span
        className={[
          "btn-claude-code__label",
          loading && "btn-claude-code__label--loading",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {loading ? loadingLabel : label}
      </span>
    </button>
  );
}

export function ClaudeCodeButtonPreview() {
  return (
    <div className="btn-claude-code-root">
      <ClaudeCodeButton />
    </div>
  );
}
