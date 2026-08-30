import assert from "node:assert/strict";
import test from "node:test";
import { DustBurst } from "./dust.js";
import {
  disposePhysicsState,
  disposeSceneFragments,
  initializePhysicsSafely,
} from "./physics.js";
import { createTextureDisposer } from "./textures.js";

test("physics disposal frees initialized resources once and is safe before initialization", () => {
  let eventsFreed = 0;
  let worldFreed = 0;
  const state = {
    events: { free: () => eventsFreed++ },
    world: { free: () => worldFreed++ },
    chunks: new Map([[1, {}]]),
  };

  disposePhysicsState(state);
  disposePhysicsState(state);

  assert.equal(eventsFreed, 1);
  assert.equal(worldFreed, 1);
  assert.equal(state.events, null);
  assert.equal(state.world, null);
  assert.equal(state.chunks.size, 0);
});

test("scene cleanup removes fragments, clears queues and releases duplicate guards", () => {
  const removedMeshes = [];
  const removedBodies = [];
  let geometriesDisposed = 0;
  const chunks = [1, 2].map((id) => ({
    body: { id },
    mesh: { id, geometry: { dispose: () => geometriesDisposed++ } },
  }));
  const impactQueue = [{ chunk: chunks[0], speed: 4 }];
  const disposedFragments = new Set([chunks[0].mesh]);

  disposeSceneFragments({
    chunks,
    impactQueue,
    disposedFragments,
    removeMesh: (mesh) => removedMeshes.push(mesh.id),
    removeBody: (chunk) => removedBodies.push(chunk.body.id),
  });

  assert.deepEqual(removedMeshes, [1, 2]);
  assert.deepEqual(removedBodies, [1, 2]);
  assert.equal(geometriesDisposed, 2);
  assert.equal(chunks.length, 0);
  assert.equal(impactQueue.length, 0);
  assert.equal(disposedFragments.size, 0);
});

test("rejected initialization disposes partial physics before reporting failure", async () => {
  const order = [];
  const error = new Error("partial init failed");
  const physics = {
    init: async () => { throw error; },
    dispose: () => order.push("dispose"),
  };

  await assert.rejects(
    initializePhysicsSafely(physics).catch((caught) => {
      order.push("failure");
      throw caught;
    }),
    error,
  );

  assert.deepEqual(order, ["dispose", "failure"]);
});

test("the five shared textures are disposed exactly once", () => {
  const counts = [0, 0, 0, 0, 0];
  const dispose = createTextureDisposer(
    counts.map((_, index) => ({ dispose: () => counts[index]++ })),
  );

  dispose();
  dispose();

  assert.deepEqual(counts, [1, 1, 1, 1, 1]);
});

test("inactive dust skips buffer uploads", () => {
  const dust = new DustBurst(2);
  const positionVersion = dust.points.geometry.attributes.position.version;
  const lifeVersion = dust.lifeAttribute.version;

  assert.equal(dust.update(1 / 60), false);
  assert.equal(dust.points.geometry.attributes.position.version, positionVersion);
  assert.equal(dust.lifeAttribute.version, lifeVersion);
  dust.dispose();
});
