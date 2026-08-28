import { Component, Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  isKeyboardActivation,
  shouldMountConcreteScene,
  toActivationEvent,
  VIEWPORT_ROOT_MARGIN,
} from "./concrete-destroy-logic.js";
import "./concrete-destroy.css";

const LazyConcreteScene = lazy(() =>
  import("./concrete/ConcreteScene.jsx").then((module) => ({
    default: module.ConcreteScene,
  })),
);

const SFX_BASE = `${import.meta.env.BASE_URL}sfx/`;

function supportsWebGL2() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

function stopAudio(sfx) {
  sfx?.elements.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

function releaseAudio(sfx) {
  stopAudio(sfx);
  sfx?.elements.forEach((audio) => {
    audio.removeAttribute("src");
    audio.load();
  });
}

function createSfx() {
  const crack = new Audio(`${SFX_BASE}concrete-crack.mp3`);
  const thuds = Array.from({ length: 3 }, () => new Audio(`${SFX_BASE}concrete-thud.mp3`));
  let nextThud = 0;
  const play = (audio) => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };
  crack.volume = 0.62;
  thuds.forEach((audio) => { audio.volume = 0.34; });
  return {
    elements: [crack, ...thuds],
    playCrack: () => play(crack),
    playThud: () => {
      const thud = thuds[nextThud];
      nextThud = (nextThud + 1) % thuds.length;
      play(thud);
    },
  };
}

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reducedMotion;
}

function Fallback({ label, broken }) {
  return <span className={`concrete-destroy-fallback${broken ? " is-broken" : ""}`} aria-hidden="true">{label}</span>;
}

class SceneBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    this.props.onFailure(error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export function ConcreteDestroyButton({
  label = "DESTROY",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const rootRef = useRef(null);
  const sfxRef = useRef(null);
  const activationEventRef = useRef(null);
  const [near, setNear] = useState(false);
  const [webgl2, setWebgl2] = useState(false);
  const [failed, setFailed] = useState(false);
  const [broken, setBroken] = useState(false);
  const [activateSignal, setActivateSignal] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: VIEWPORT_ROOT_MARGIN,
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setWebgl2(near && !reducedMotion ? supportsWebGL2() : false);
  }, [near, reducedMotion]);

  useEffect(() => {
    if (near) return;
    setBroken(false);
    setActivateSignal(0);
    setResetSignal((signal) => signal + 1);
    releaseAudio(sfxRef.current);
    sfxRef.current = null;
    activationEventRef.current = null;
  }, [near]);

  useEffect(() => () => releaseAudio(sfxRef.current), []);

  const ensureAudio = () => {
    if (!sfxRef.current) sfxRef.current = createSfx();
    return sfxRef.current;
  };
  const sfx = {
    playCrack: () => sfxRef.current?.playCrack(),
    playThud: () => sfxRef.current?.playThud(),
  };
  const showScene = shouldMountConcreteScene({ near, reducedMotion, webgl2, failed });
  const fallback = <Fallback label={label} broken={broken} />;

  const fractureFallback = (event) => {
    if (disabled || broken) return;
    ensureAudio().playCrack();
    setBroken(true);
    onClick?.(toActivationEvent(event));
    activationEventRef.current = null;
  };
  const activateCenter = (event) => {
    if (disabled || broken) return;
    ensureAudio();
    activationEventRef.current = toActivationEvent(event);
    setActivateSignal((signal) => signal + 1);
  };
  const handleClick = (event) => {
    if (showScene) {
      if (isKeyboardActivation(event)) activateCenter(event);
      return;
    }
    fractureFallback(event);
  };
  const handleSceneActivate = (event) => {
    if (disabled || broken) return;
    ensureAudio();
    setBroken(true);
    onClick?.(event);
    activationEventRef.current = null;
  };
  const reset = () => {
    stopAudio(sfxRef.current);
    activationEventRef.current = null;
    setBroken(false);
    setResetSignal((signal) => signal + 1);
  };

  return (
    <span className={["concrete-destroy-root", className].filter(Boolean).join(" ")} ref={rootRef}>
      <button
        {...rest}
        type="button"
        className="concrete-destroy-button"
        disabled={disabled}
        aria-label={label}
        onClick={handleClick}
      >
        {showScene ? (
          <SceneBoundary fallback={fallback} onFailure={() => setFailed(true)}>
            <Suspense fallback={fallback}>
              <LazyConcreteScene
                label={label}
                disabled={disabled}
                activateSignal={activateSignal}
                activationEvent={activationEventRef.current}
                resetSignal={resetSignal}
                sfx={sfx}
                onActivate={handleSceneActivate}
                onBrokenChange={setBroken}
                onFailure={() => setFailed(true)}
              />
            </Suspense>
          </SceneBoundary>
        ) : fallback}
      </button>
      {broken ? <button type="button" className="concrete-destroy-reset" disabled={disabled} onClick={reset}>Reset</button> : null}
    </span>
  );
}

export function ConcreteDestroyPreview() {
  return <ConcreteDestroyButton />;
}
