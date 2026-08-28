import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import modelUrl from "./superlist-notify/button.glb?url";
import orangeMatcapUrl from "./superlist-notify/matcap-orange.png?url";
import blackMatcapUrl from "./superlist-notify/matcap-black.png?url";
import clickUrl from "./superlist-notify/click.mp3?url";
import { getSuperlistButtonFrame } from "./superlist-notify-motion.js";
import "./superlist-notify.css";

const DEFAULT_LABEL = "Get notified";

function SuperlistModel({ controllerRef, openRef }) {
  const { scene: sourceScene } = useGLTF(modelUrl);
  const [orangeMatcap, blackMatcap] = useTexture([
    orangeMatcapUrl,
    blackMatcapUrl,
  ]);
  const invalidate = useThree((state) => state.invalidate);
  const frameRef = useRef(0);
  const scene = useMemo(() => sourceScene.clone(true), [sourceScene]);
  const button = useMemo(() => scene.getObjectByName("button-remesh"), [scene]);
  const border = useMemo(() => scene.getObjectByName("border"), [scene]);
  const orangeMaterial = useMemo(
    () => new THREE.MeshMatcapMaterial({ matcap: orangeMatcap }),
    [orangeMatcap],
  );
  const blackMaterial = useMemo(
    () => new THREE.MeshMatcapMaterial({ matcap: blackMatcap }),
    [blackMatcap],
  );

  useEffect(() => {
    orangeMatcap.colorSpace = THREE.SRGBColorSpace;
    blackMatcap.colorSpace = THREE.SRGBColorSpace;
    orangeMatcap.needsUpdate = true;
    blackMatcap.needsUpdate = true;
    button.material = orangeMaterial;
    border.material = blackMaterial;
    button.rotation.y = openRef.current ? Math.PI : 0;
    invalidate();

    return () => {
      orangeMaterial.dispose();
      blackMaterial.dispose();
    };
  }, [blackMatcap, blackMaterial, border, button, invalidate, openRef, orangeMatcap, orangeMaterial]);

  const animate = useCallback(
    (nextOpen, reducedMotion) => {
      cancelAnimationFrame(frameRef.current);
      const targetRotation = nextOpen ? Math.PI : 0;

      if (reducedMotion) {
        button.position.z = 0;
        button.rotation.y = targetRotation;
        invalidate();
        return;
      }

      const fromRotation = button.rotation.y;
      const startedAt = performance.now();
      const tick = (now) => {
        const frame = getSuperlistButtonFrame(
          now - startedAt,
          fromRotation,
          targetRotation,
        );
        button.position.z = frame.z;
        button.rotation.y = frame.rotationY;
        invalidate();
        frameRef.current = frame.done ? 0 : requestAnimationFrame(tick);
      };
      frameRef.current = requestAnimationFrame(tick);
    },
    [button, invalidate],
  );

  useEffect(() => {
    controllerRef.current = { animate };
    return () => {
      cancelAnimationFrame(frameRef.current);
      controllerRef.current = null;
    };
  }, [animate, controllerRef]);

  return <primitive object={scene} scale={3.35} />;
}

function SuperlistLabel({ label }) {
  return (
    <span className="btn-superlist-notify-label" aria-hidden="true">
      {[...label].map((character, index) => {
        const visibleCharacter = character === " " ? "\u00a0" : character;
        return (
          <span
            className="btn-superlist-notify-character"
            style={{ "--character-index": index }}
            key={`${character}-${index}`}
          >
            <span data-character={visibleCharacter}>{visibleCharacter}</span>
          </span>
        );
      })}
    </span>
  );
}

export function SuperlistNotifyButton({
  label = DEFAULT_LABEL,
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const controllerRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(
    () => () => {
      audioRef.current?.pause();
    },
    [],
  );

  function handleClick(event) {
    if (disabled) return;

    const nextOpen = !openRef.current;
    openRef.current = nextOpen;
    setOpen(nextOpen);

    const audio = audioRef.current ?? new Audio(clickUrl);
    audioRef.current = audio;
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    controllerRef.current?.animate(nextOpen, reducedMotion);
    onClick?.(event);
  }

  return (
    <span className="btn-superlist-notify-stage">
      <button
        {...rest}
        type="button"
        className={[
          "btn-superlist-notify",
          open ? "is-open" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        disabled={disabled}
        aria-label={label}
        aria-pressed={open}
        onClick={handleClick}
      >
        <SuperlistLabel label={label} />
        <span className="btn-superlist-notify-canvas" aria-hidden="true">
          <Canvas
            frameloop="demand"
            dpr={[1, 2]}
            camera={{ fov: 35, near: 5, far: 20, position: [0, 0, 10] }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
              stencil: false,
            }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <Suspense fallback={null}>
              <SuperlistModel
                controllerRef={controllerRef}
                openRef={openRef}
              />
            </Suspense>
          </Canvas>
        </span>
      </button>
    </span>
  );
}

export function SuperlistNotifyPreview() {
  return (
    <div className="btn-superlist-notify-preview">
      <SuperlistNotifyButton />
    </div>
  );
}

useGLTF.preload(modelUrl);
useTexture.preload(orangeMatcapUrl);
useTexture.preload(blackMatcapUrl);
