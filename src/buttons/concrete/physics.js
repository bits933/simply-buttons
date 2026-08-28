import RAPIER from "@dimforge/rapier3d-compat";

const FIXED_DT = 1 / 60;

export function disposePhysicsState(state) {
  state.events?.free();
  state.world?.free();
  state.events = null;
  state.world = null;
  state.chunks.clear();
}

export async function initializePhysicsSafely(physics) {
  try {
    await physics.init();
    return physics;
  } catch (error) {
    physics.dispose();
    throw error;
  }
}

export function disposeSceneFragments({
  chunks,
  impactQueue,
  disposedFragments,
  removeMesh,
  removeBody,
}) {
  for (const chunk of chunks) {
    removeMesh(chunk.mesh);
    chunk.mesh.geometry.dispose();
    removeBody(chunk);
  }
  chunks.length = 0;
  impactQueue.length = 0;
  disposedFragments.clear();
}

export class ConcretePhysics {
  constructor() {
    this.world = null;
    this.events = null;
    this.accumulator = 0;
    this.chunks = new Map();
    this.floorCollider = null;
    this.onImpact = null;
  }

  async init() {
    await RAPIER.init();
    this.world = new RAPIER.World({ x: 0, y: -9.81, z: 0 });
    this.events = new RAPIER.EventQueue(true);
    const floorBody = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(0, -0.5, 0),
    );
    this.floorCollider = this.world.createCollider(
      RAPIER.ColliderDesc.cuboid(30, 0.5, 30).setFriction(0.95).setRestitution(0.02),
      floorBody,
    );
  }

  setImpactHandler(callback) {
    this.onImpact = callback;
  }

  get bodyCount() {
    return this.chunks.size;
  }

  get hasAwakeBodies() {
    return [...this.chunks.values()].some((chunk) => !chunk.body.isSleeping());
  }

  addChunk(mesh, generation, impulseDir, impulsePower) {
    if (!this.world) throw new Error("ConcretePhysics must be initialized before adding chunks.");
    mesh.geometry.computeBoundingSphere();
    const size = mesh.geometry.boundingSphere?.radius ?? 0.2;
    const body = this.world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(mesh.position.x, mesh.position.y, mesh.position.z)
        .setRotation(mesh.quaternion)
        .setLinearDamping(0.04)
        .setAngularDamping(0.25)
        .setCcdEnabled(size < 0.25),
    );
    const position = mesh.geometry.attributes.position;
    const collider = this.world.createCollider(
      RAPIER.ColliderDesc.convexHull(new Float32Array(position.array))
        .setDensity(2.2)
        .setFriction(0.9)
        .setRestitution(0.08)
        .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS),
      body,
    );
    const chunk = { body, mesh, generation, size, bornAt: performance.now() };
    this.chunks.set(collider.handle, chunk);
    mesh.userData.chunkHandle = collider.handle;
    const mass = body.mass();
    body.applyImpulse({
      x: impulseDir.x * impulsePower * mass,
      y: impulseDir.y * impulsePower * mass,
      z: impulseDir.z * impulsePower * mass,
    }, true);
    body.applyTorqueImpulse({
      x: (Math.random() - 0.5) * 0.55 * mass,
      y: (Math.random() - 0.5) * 0.55 * mass,
      z: (Math.random() - 0.5) * 0.55 * mass,
    }, true);
    return chunk;
  }

  removeChunk(chunk) {
    for (const [handle, saved] of this.chunks) {
      if (saved === chunk) {
        this.chunks.delete(handle);
        break;
      }
    }
    this.world?.removeRigidBody(chunk.body);
  }

  evictToBudget(maxBodies) {
    if (this.chunks.size <= maxBodies) return [];
    const evicted = [];
    const sleeping = [...this.chunks.values()]
      .filter((chunk) => chunk.body.isSleeping())
      .sort((a, b) => a.size - b.size);
    for (const chunk of sleeping) {
      if (this.chunks.size <= maxBodies) break;
      evicted.push(chunk);
      this.removeChunk(chunk);
    }
    return evicted;
  }

  step(dt) {
    if (!this.world || !this.events) return;
    this.accumulator = Math.min(this.accumulator + dt, FIXED_DT * 4);
    while (this.accumulator >= FIXED_DT) {
      this.world.step(this.events);
      this.accumulator -= FIXED_DT;
    }
    this.events.drainCollisionEvents((first, second, started) => {
      if (!started || !this.onImpact || !this.floorCollider) return;
      const floorHit = first === this.floorCollider.handle || second === this.floorCollider.handle;
      if (!floorHit) return;
      const chunk = this.chunks.get(first === this.floorCollider.handle ? second : first);
      if (!chunk) return;
      const velocity = chunk.body.linvel();
      this.onImpact(chunk, Math.hypot(velocity.x, velocity.y, velocity.z));
    });
  }

  syncMeshes() {
    for (const chunk of this.chunks.values()) {
      const translation = chunk.body.translation();
      const rotation = chunk.body.rotation();
      chunk.mesh.position.set(translation.x, translation.y, translation.z);
      chunk.mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
    }
  }

  dispose() {
    disposePhysicsState(this);
    this.floorCollider = null;
    this.onImpact = null;
    this.accumulator = 0;
  }
}
