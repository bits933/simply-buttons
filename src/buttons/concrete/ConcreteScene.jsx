import { Component, useEffect, useMemo, useRef, useState } from "react";
import { createRoot, events, extend, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { DestructibleMesh, FractureOptions } from "@dgreenheck/three-pinata";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { BLOCK_H, BLOCK_W, createConcreteTextures, remapExtrudeUVsForAtlas } from "./textures.js";
import {
  ConcretePhysics,
  disposeSceneFragments,
  initializePhysicsSafely,
} from "./physics.js";
import { DustBurst } from "./dust.js";

const BLOCK_D = 1;
const CORNER_R = 0.14;
const BEVEL_T = 0.07;
const BEVEL_S = 0.055;
const BASE_Y = 1.35;
const CAM = new THREE.Vector3(0, 2.05, 7.6);
const LOOK_AT = new THREE.Vector3(0, 1.28, 0);
const FRAG_COUNT = window.innerWidth < 640 ? 22 : 30;
const REFRACTURE_COUNT = 6;
const MAX_BODIES = 140;
const REFRACTURE_MIN_SIZE = 0.13;
const REFRACTURE_MIN_SPEED = 3.4;

extend(THREE);

function roundedRectShape(width, height, radius) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.absarc(x + width - radius, y + radius, radius, -Math.PI / 2, 0, false);
  shape.lineTo(x + width, y + height - radius);
  shape.absarc(x + width - radius, y + height - radius, radius, 0, Math.PI / 2, false);
  shape.lineTo(x + radius, y + height);
  shape.absarc(x + radius, y + height - radius, radius, Math.PI / 2, Math.PI, false);
  shape.lineTo(x, y + radius);
  shape.absarc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5, false);
  return shape;
}

function Stage({ label, resetSignal, activateSignal, activationEvent, disabled, sfx, onActivate, onBrokenChange, onFailure }) {
  const { scene, camera, gl, invalidate } = useThree();
  const physicsRef = useRef(null);
  const stateRef = useRef("idle");
  const chunksRef = useRef([]);
  const impactQueue = useRef([]);
  const pressTime = useRef(0);
  const pendingPoint = useRef(new THREE.Vector3());
  const pendingActivationEvent = useRef(null);
  const pressOffset = useRef(new THREE.Vector3());
  const shake = useRef(0);
  const lastThud = useRef(0);
  const disposedFragments = useRef(new Set());
  const onFailureRef = useRef(onFailure);
  onFailureRef.current = onFailure;
  const [broken, setBroken] = useState(false);

  const blockResource = useMemo(() => {
    const textures = createConcreteTextures(label);
    let geometry = new THREE.ExtrudeGeometry(roundedRectShape(BLOCK_W, BLOCK_H, CORNER_R), {
      depth: BLOCK_D - 2 * BEVEL_T,
      bevelEnabled: true,
      bevelThickness: BEVEL_T,
      bevelSize: BEVEL_S,
      bevelSegments: 4,
      curveSegments: 12,
      steps: 1,
    });
    geometry = mergeVertices(geometry);
    geometry.center();
    remapExtrudeUVsForAtlas(geometry, BLOCK_W, BLOCK_H);
    const outer = new THREE.MeshStandardMaterial({ map: textures.map, normalMap: textures.normalMap, normalScale: new THREE.Vector2(0.7, 0.7), roughnessMap: textures.roughnessMap, roughness: 1, metalness: 0 });
    const inner = new THREE.MeshStandardMaterial({ map: textures.innerMap, normalMap: textures.innerNormalMap, normalScale: new THREE.Vector2(1.1, 1.1), roughness: 1, metalness: 0 });
    const block = new DestructibleMesh(geometry, outer, inner);
    block.castShadow = true;
    block.receiveShadow = true;
    block.position.set(0, BASE_Y, 0);
    return { block, textures, materials: [outer, inner] };
  }, [label]);
  const block = blockResource.block;
  const dust = useMemo(() => new DustBurst(240), []);

  const removeChunk = (chunk) => {
    if (disposedFragments.current.has(chunk.mesh)) return;
    disposedFragments.current.add(chunk.mesh);
    scene.remove(chunk.mesh);
    chunk.mesh.geometry.dispose();
    physicsRef.current?.removeChunk(chunk);
    chunksRef.current = chunksRef.current.filter((item) => item !== chunk);
  };

  const clearFragments = () => {
    disposeSceneFragments({
      chunks: chunksRef.current,
      impactQueue: impactQueue.current,
      disposedFragments: disposedFragments.current,
      removeMesh: (mesh) => scene.remove(mesh),
      removeBody: (chunk) => physicsRef.current?.removeChunk(chunk),
    });
  };

  useEffect(() => {
    let cancelled = false;
    const physics = new ConcretePhysics();
    initializePhysicsSafely(physics).then(() => {
      if (cancelled) {
        physics.dispose();
        return;
      }
      physics.setImpactHandler((chunk, speed) => impactQueue.current.push({ chunk, speed }));
      physicsRef.current = physics;
      invalidate();
    }).catch((error) => {
      if (!cancelled) onFailureRef.current?.(error);
    });
    return () => {
      cancelled = true;
      clearFragments();
      if (physicsRef.current === physics) physicsRef.current = null;
      physics.dispose();
    };
  }, []); // one world per mount; the failure callback is read through its current ref

  useEffect(() => () => {
    clearFragments();
    block.geometry.dispose();
    blockResource.materials.forEach((material) => material.dispose());
    blockResource.textures.dispose();
    dust.dispose();
  }, [block, blockResource, dust]);

  const spawnFragments = (fragments, origin, generation, basePower, inheritedVelocity) => {
    const physics = physicsRef.current;
    if (!physics) return;
    const cameraDirection = camera.getWorldDirection(new THREE.Vector3());
    for (const fragment of fragments) {
      fragment.castShadow = true;
      fragment.receiveShadow = true;
      scene.add(fragment);
      const direction = fragment.position.clone().sub(origin);
      const distance = direction.length();
      direction.normalize().addScaledVector(cameraDirection, 0.22);
      direction.y += 0.34;
      direction.normalize();
      const power = THREE.MathUtils.lerp(basePower, basePower * 0.16, Math.min(distance / 2.4, 1));
      const chunk = physics.addChunk(fragment, generation, direction, power);
      if (inheritedVelocity) chunk.body.setLinvel({ x: inheritedVelocity.x + direction.x * 0.7, y: Math.max(inheritedVelocity.y, 0) + direction.y * 0.7, z: inheritedVelocity.z + direction.z * 0.7 }, true);
      chunksRef.current.push(chunk);
    }
  };

  const fractureBlock = (point) => {
    if (stateRef.current !== "pressing" || !physicsRef.current) return;
    if (disabled) {
      stateRef.current = "idle";
      block.position.set(0, BASE_Y, 0);
      block.rotation.set(0, 0, 0);
      pendingActivationEvent.current = null;
      return;
    }
    block.updateMatrixWorld();
    const localPoint = block.worldToLocal(point.clone());
    let fragments;
    try {
      fragments = block.fracture(new FractureOptions({
        fractureMethod: "voronoi",
        fragmentCount: FRAG_COUNT,
        voronoiOptions: { mode: "3D", impactPoint: localPoint, impactRadius: 0.55 },
        textureScale: new THREE.Vector2(0.35, 0.35),
        seed: (Math.random() * 2 ** 31) | 0,
      }));
    } catch (error) {
      stateRef.current = "idle";
      onFailureRef.current?.(error);
      return;
    }
    block.visible = false;
    block.position.set(0, BASE_Y, 0);
    block.rotation.set(0, 0, 0);
    stateRef.current = "broken";
    setBroken(true);
    onBrokenChange?.(true);
    onActivate?.(pendingActivationEvent.current);
    pendingActivationEvent.current = null;
    spawnFragments(fragments, point, 1, 5.6);
    shake.current = 0.55;
    dust.burst(point, 150, 2.1, camera.getWorldDirection(new THREE.Vector3()).negate());
    sfx?.playCrack?.();
  };

  const refractureChunk = (chunk, hitPoint) => {
    const physics = physicsRef.current;
    if (!physics || chunk.generation >= 2 || chunk.size < REFRACTURE_MIN_SIZE || physics.bodyCount > MAX_BODIES - REFRACTURE_COUNT) return;
    const mesh = chunk.mesh;
    mesh.updateMatrixWorld();
    const velocity = chunk.body.linvel();
    const localPoint = hitPoint ? mesh.worldToLocal(hitPoint.clone()) : undefined;
    let fragments;
    try {
      fragments = mesh.fracture(new FractureOptions({
        fractureMethod: "voronoi",
        fragmentCount: REFRACTURE_COUNT,
        voronoiOptions: { mode: "3D", impactPoint: localPoint, impactRadius: chunk.size * 0.7 },
        textureScale: new THREE.Vector2(0.5, 0.5),
        seed: (Math.random() * 2 ** 31) | 0,
      }));
    } catch {
      return;
    }
    removeChunk(chunk);
    spawnFragments(fragments, hitPoint ?? mesh.position.clone(), chunk.generation + 1, 0.8, velocity);
    if (hitPoint) dust.burst(hitPoint, 45, 1.1);
  };

  useEffect(() => {
    const element = gl.domElement;
    const raycaster = new THREE.Raycaster();
    const onPointerDown = (event) => {
      if (stateRef.current !== "broken" || disabled) return;
      const rectangle = element.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2(((event.clientX - rectangle.left) / rectangle.width) * 2 - 1, -((event.clientY - rectangle.top) / rectangle.height) * 2 + 1), camera);
      const hit = raycaster.intersectObjects(chunksRef.current.map((chunk) => chunk.mesh), false)[0];
      if (!hit) return;
      const chunk = chunksRef.current.find((item) => item.mesh === hit.object);
      if (chunk) refractureChunk(chunk, hit.point.clone());
    };
    element.addEventListener("pointerdown", onPointerDown);
    return () => element.removeEventListener("pointerdown", onPointerDown);
  }, [camera, disabled, gl]);

  useEffect(() => {
    if (!activateSignal || disabled || stateRef.current !== "idle") return;
    stateRef.current = "pressing";
    pressTime.current = 0;
    pendingActivationEvent.current = activationEvent;
    pendingPoint.current.set(0, BASE_Y, BLOCK_D / 2);
    pressOffset.current.set(0, 0, 0);
    invalidate();
  }, [activateSignal, activationEvent, disabled, invalidate]);

  useEffect(() => {
    if (!disabled || stateRef.current !== "pressing") return;
    stateRef.current = "idle";
    pressTime.current = 0;
    pendingActivationEvent.current = null;
    block.position.set(0, BASE_Y, 0);
    block.rotation.set(0, 0, 0);
    invalidate();
  }, [block, disabled, invalidate]);

  useEffect(() => {
    if (!resetSignal) return;
    clearFragments();
    block.visible = true;
    block.position.set(0, BASE_Y, 0);
    block.rotation.set(0, 0, 0);
    stateRef.current = "idle";
    setBroken(false);
    onBrokenChange?.(false);
    invalidate();
  }, [resetSignal, invalidate]);

  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    const value = new URLSearchParams(window.location.search).get("autofracture");
    if (!value) return undefined;
    const [x, y] = value.split(",").map(Number);
    if (Number.isNaN(x) || Number.isNaN(y)) return undefined;
    const timer = window.setTimeout(() => {
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      const hit = raycaster.intersectObject(block, false)[0];
      if (!hit || stateRef.current !== "idle") return;
      stateRef.current = "pressing";
      pressTime.current = 1;
      pendingPoint.current.copy(hit.point);
      invalidate();
    }, 600);
    return () => window.clearTimeout(timer);
  }, [block, camera, invalidate]);

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30);
    if (stateRef.current === "pressing") {
      pressTime.current += dt;
      const progress = Math.min(pressTime.current / 0.085, 1);
      const eased = 1 - (1 - progress) ** 3;
      block.position.y = BASE_Y - 0.08 * eased;
      block.rotation.x = -pressOffset.current.y * 0.05 * eased;
      block.rotation.y = pressOffset.current.x * 0.045 * eased;
      if (progress >= 1) fractureBlock(pendingPoint.current.clone());
    }
    const physics = physicsRef.current;
    if (physics && (stateRef.current === "pressing" || physics.hasAwakeBodies)) {
      physics.step(dt);
      physics.syncMeshes();
      if (impactQueue.current.length) {
        let loudest = 0;
        const refractures = [];
        for (const impact of impactQueue.current) {
          loudest = Math.max(loudest, impact.speed);
          if (impact.speed > REFRACTURE_MIN_SPEED) refractures.push(impact.chunk);
        }
        impactQueue.current.length = 0;
        for (const chunk of refractures) {
          const velocity = chunk.body.linvel();
          const point = chunk.mesh.position.clone();
          if (Math.hypot(velocity.x, velocity.y, velocity.z) > 0.01) point.addScaledVector(new THREE.Vector3(velocity.x, velocity.y, velocity.z).normalize(), -chunk.size * 0.8);
          refractureChunk(chunk, point);
        }
        const now = performance.now();
        if (loudest > 1.4 && now - lastThud.current > 140) {
          sfx?.playThud?.();
          lastThud.current = now;
        }
        if (loudest > 2.2) shake.current = Math.min(shake.current + 0.09, 0.22);
        for (const chunk of physics.evictToBudget(MAX_BODIES)) removeChunk(chunk);
      }
    }
    if (dust.activeCount) {
      dust.setPixelScale(state.size.height * state.viewport.dpr, 32);
      dust.update(dt);
    }
    if (import.meta.env.DEV) {
      window.__concreteDestroyQA = { chunks: chunksRef.current.length, state: stateRef.current, dustNearCamera: dust.countNear(camera.position, 4) };
    }
    if (shake.current > 0.002) {
      camera.position.set(CAM.x + (Math.random() - 0.5) * shake.current * 0.22, CAM.y + (Math.random() - 0.5) * shake.current * 0.16, CAM.z);
      shake.current *= Math.exp(-5 * dt);
    } else camera.position.copy(CAM);
    camera.lookAt(LOOK_AT);
    if (stateRef.current === "pressing" || dust.activeCount || physics?.hasAwakeBodies || shake.current > 0.002) invalidate();
  });

  return <>
    <hemisphereLight args={["#fffefa", "#d6d0c0", 0.7]} />
    <directionalLight position={[4.5, 7, 4.5]} intensity={1.9} color="#fff7ea" />
    <directionalLight position={[-5, 3, -2]} intensity={0.35} color="#dfe8ff" />
    <ContactShadows key={`${resetSignal}-${broken}`} position={[0, 0.002, 0]} opacity={0.42} scale={15} blur={2.4} far={5} resolution={256} frames={broken ? 24 : 1} color="#3a352c" />
    <primitive object={block} onPointerDown={(event) => {
      if (disabled || stateRef.current !== "idle") return;
      event.stopPropagation();
      stateRef.current = "pressing";
      pressTime.current = 0;
      pendingActivationEvent.current = event.nativeEvent ?? event;
      pendingPoint.current.copy(event.point);
      pressOffset.current.set(event.point.x - block.position.x, event.point.y - block.position.y, 0);
      invalidate();
    }} />
    <primitive object={dust.points} />
  </>;
}

class SceneErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    this.props.onFailure?.(error);
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ConcreteScene(props) {
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const mountedRef = useRef(false);
  const configuredRef = useRef(false);
  const configuringRef = useRef(false);
  const failedRef = useRef(false);
  const disposeTimerRef = useRef(0);
  const propsRef = useRef(props);
  propsRef.current = props;

  const renderScene = () => {
    if (!mountedRef.current || !configuredRef.current || configuringRef.current || failedRef.current) return;
    rootRef.current?.render(
      <SceneErrorBoundary onFailure={propsRef.current.onFailure}>
        <Stage {...propsRef.current} />
      </SceneErrorBoundary>,
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (disposeTimerRef.current) {
      window.clearTimeout(disposeTimerRef.current);
      disposeTimerRef.current = 0;
    }
    const reusedRoot = rootRef.current;
    const root = reusedRoot ?? createRoot(canvas);
    let mounted = true;
    mountedRef.current = true;
    configuredRef.current = false;
    configuringRef.current = false;
    if (!reusedRoot) failedRef.current = false;
    rootRef.current = root;
    const getSize = () => {
      const { width, height, top, left } = canvas.getBoundingClientRect();
      return width && height ? { width, height, top, left } : undefined;
    };
    const fail = (error) => {
      configuringRef.current = false;
      configuredRef.current = false;
      failedRef.current = true;
      if (rootRef.current === root && mountedRef.current) propsRef.current.onFailure?.(error);
    };
    const configure = (size) => {
      if (!mounted || configuringRef.current || failedRef.current) return;
      configuringRef.current = true;
      root.configure({
        dpr: [1, 2],
        events,
        frameloop: "demand",
        camera: { fov: 32, position: CAM.toArray(), near: 0.1, far: 60 },
        gl: { antialias: true, alpha: true, powerPreference: "high-performance" },
        size,
      }).then(() => {
        configuringRef.current = false;
        if (!mounted || failedRef.current) return;
        configuredRef.current = true;
        renderScene();
      }).catch(fail);
    };
    const resize = () => configure(getSize());
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(canvas);
    if (!failedRef.current) configure(getSize());
    return () => {
      mounted = false;
      mountedRef.current = false;
      configuredRef.current = false;
      configuringRef.current = false;
      observer?.disconnect();
      disposeTimerRef.current = window.setTimeout(() => {
        disposeTimerRef.current = 0;
        if (mountedRef.current || rootRef.current !== root) return;
        root.unmount();
        rootRef.current = null;
      }, 0);
    };
  }, []);

  useEffect(() => {
    renderScene();
  });

  return <canvas ref={canvasRef} className="concrete-destroy-scene" aria-hidden="true" tabIndex={-1} />;
}
