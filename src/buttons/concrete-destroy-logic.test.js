import assert from "node:assert/strict";
import test from "node:test";
import {
  isKeyboardActivation,
  shouldMountConcreteScene,
  toActivationEvent,
  VIEWPORT_ROOT_MARGIN,
} from "./concrete-destroy-logic.js";

test("the scene mounts only when nearby and supported", () => {
  assert.equal(VIEWPORT_ROOT_MARGIN, "200px");
  assert.equal(shouldMountConcreteScene({ near: true, reducedMotion: false, webgl2: true, failed: false }), true);
  assert.equal(shouldMountConcreteScene({ near: false, reducedMotion: false, webgl2: true, failed: false }), false);
  assert.equal(shouldMountConcreteScene({ near: true, reducedMotion: true, webgl2: true, failed: false }), false);
  assert.equal(shouldMountConcreteScene({ near: true, reducedMotion: false, webgl2: false, failed: false }), false);
  assert.equal(shouldMountConcreteScene({ near: true, reducedMotion: false, webgl2: true, failed: true }), false);
});

test("only keyboard-generated clicks request a centered fracture", () => {
  assert.equal(isKeyboardActivation({ detail: 0 }), true);
  assert.equal(isKeyboardActivation({ detail: 1 }), false);
  assert.equal(isKeyboardActivation(), false);
});

test("activation callbacks receive the initiating native event", () => {
  const nativeEvent = { type: "pointerdown" };
  assert.equal(toActivationEvent({ nativeEvent }), nativeEvent);
  assert.equal(toActivationEvent(nativeEvent), nativeEvent);
});
