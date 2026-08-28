"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createFlameWrap, supportsHtmlInCanvas } from "./flame-wrap-engine.js";

const emptySubscribe = () => () => {};

export function FlameWrap({ children, className, style, ...options }) {
  const sourceRef = useRef(null);
  const contentRef = useRef(null);
  const outputRef = useRef(null);
  const instanceRef = useRef(null);
  const [initialOptions] = useState(options);
  const [failed, setFailed] = useState(false);

  const supported = useSyncExternalStore(emptySubscribe, supportsHtmlInCanvas, () => false);
  const native = supported && !failed;

  const reach = Math.round(Math.max(options.height ?? 170, 24) * 1.5) + 40;
  const glow = Math.round(Math.max(options.spread ?? 8, 8) * 3) + 16;

  useEffect(() => {
    const source = sourceRef.current;
    const content = contentRef.current;
    const output = outputRef.current;
    if (!source || !content || !output) return;
    instanceRef.current = createFlameWrap({ source, content, output }, initialOptions);
    if (native && !instanceRef.current) setFailed(true);
    return () => {
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [initialOptions, native]);

  useEffect(() => {
    instanceRef.current?.setOptions(options);
  });

  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <canvas
        ref={sourceRef}
        layoutsubtree="true"
        suppressHydrationWarning
        style={
          native
            ? { position: "absolute", inset: 0, width: "100%", height: "100%" }
            : { display: "none" }
        }
      >
        {native ? (
          <div
            ref={contentRef}
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "visible",
            }}
          >
            {children}
          </div>
        ) : null}
      </canvas>
      {!native ? (
        <div
          ref={contentRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          {children}
        </div>
      ) : null}
      <canvas
        ref={outputRef}
        aria-hidden
        style={{
          position: "absolute",
          zIndex: 2,
          top: -reach,
          right: -glow,
          bottom: -glow,
          left: -glow,
          width: `calc(100% + ${glow * 2}px)`,
          height: `calc(100% + ${reach + glow}px)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default FlameWrap;
export { createFlameWrap, supportsHtmlInCanvas } from "./flame-wrap-engine.js";
