import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));
const assetDirectory = join(directory, "superlist-notify");

function sha256(path) {
  return createHash("sha256")
    .update(readFileSync(path))
    .digest("hex")
    .toUpperCase();
}

test("registers the source-backed Superlist notify specimen", () => {
  const slots = readFileSync(join(directory, "..", "slots.js"), "utf8");

  assert.match(slots, /id: "superlist-notify"/);
  assert.match(slots, /preview: SuperlistNotifyPreview/);
  assert.match(slots, /snippets: SUPERLIST_NOTIFY_SNIPPETS/);
});

test("ships the original Superlist button assets byte-exact", () => {
  const assets = {
    "button.glb": [
      144088,
      "24AB8EAC765702D55A98EBD584B0BE077EED53AD1DB862498B6596240E24B22D",
    ],
    "matcap-orange.png": [
      28559,
      "A01EAA099E2748DFDDB7965D204EE3EBF5193D9AD4B6184B492B727998637616",
    ],
    "matcap-black.png": [
      15930,
      "16483C9C12162FB8AC53C0895A4BF877E90534340145B5C5319410F797F4FE13",
    ],
    "click.mp3": [
      6502,
      "2097AAD4A3CDD1C3467D293854B6D2B302FFABE289C19FFCEED3D899F8C4990B",
    ],
    "aeonik-regular.woff2": [
      41000,
      "49B373559151BF9437C77A086472CCA9576C78352477B4213E85A0471BB8EC10",
    ],
  };

  for (const [name, [size, hash]] of Object.entries(assets)) {
    const path = join(assetDirectory, name);
    assert.ok(existsSync(path), `missing ${name}`);
    assert.equal(readFileSync(path).byteLength, size, `${name} size changed`);
    assert.equal(sha256(path), hash, `${name} must stay byte-exact`);
  }
});

test("replays the original 100ms press, elastic rebound, and one-second flip", async () => {
  const motionPath = join(directory, "superlist-notify-motion.js");
  assert.ok(existsSync(motionPath), "missing Superlist motion model");

  const {
    SUPERLIST_FLIP_MS,
    SUPERLIST_PRESS_MS,
    SUPERLIST_REBOUND_MS,
    getSuperlistButtonFrame,
  } = await import("./superlist-notify-motion.js");

  assert.equal(SUPERLIST_PRESS_MS, 100);
  assert.equal(SUPERLIST_REBOUND_MS, 1000);
  assert.equal(SUPERLIST_FLIP_MS, 1000);

  const start = getSuperlistButtonFrame(0, 0, Math.PI);
  const pressed = getSuperlistButtonFrame(100, 0, Math.PI);
  const overshoot = getSuperlistButtonFrame(200, 0, Math.PI);
  const flipped = getSuperlistButtonFrame(1000, 0, Math.PI);
  const settled = getSuperlistButtonFrame(1100, 0, Math.PI);
  const closed = getSuperlistButtonFrame(1000, Math.PI, 0);

  assert.deepEqual(start, { z: 0, rotationY: 0, done: false });
  assert.equal(pressed.z, -0.5);
  assert.ok(overshoot.z > 0, "elastic rebound should overshoot the rest plane");
  assert.equal(flipped.rotationY, Math.PI);
  assert.deepEqual(settled, { z: 0, rotationY: Math.PI, done: true });
  assert.equal(closed.rotationY, 0);
});

test("renders the source camera, named meshes, matcaps, pill geometry, and horizontal label exit", () => {
  const component = readFileSync(
    join(directory, "SuperlistNotifyButton.jsx"),
    "utf8",
  );
  const css = readFileSync(join(directory, "superlist-notify.css"), "utf8");

  assert.match(component, /getObjectByName\("button-remesh"\)/);
  assert.match(component, /getObjectByName\("border"\)/);
  assert.match(component, /new THREE\.MeshMatcapMaterial\(\{ matcap: orangeMatcap \}\)/);
  assert.match(component, /new THREE\.MeshMatcapMaterial\(\{ matcap: blackMatcap \}\)/);
  assert.match(component, /<primitive object=\{scene\} scale=\{3\.35\} \/>/);
  assert.match(
    component,
    /camera=\{\{ fov: 35, near: 5, far: 20, position: \[0, 0, 10\] \}\}/,
  );
  assert.match(component, /frameloop="demand"/);
  assert.match(component, /new Audio\(clickUrl\)/);
  assert.match(component, /aria-pressed=\{open\}/);

  assert.match(css, /width: 188px;/);
  assert.match(css, /height: 61px;/);
  assert.match(css, /\.btn-superlist-notify\.is-open\s*\{\s*width: 61px;/);
  assert.match(css, /width: 60px !important;/);
  assert.match(css, /linear-gradient\(270deg, #222322 3\.48%, #131311 100%\)/);
  assert.match(
    css,
    /\.btn-superlist-notify\.is-open \.btn-superlist-notify-label\s*\{[\s\S]*?opacity: 0;[\s\S]*?transform: translateX\(28px\);/,
  );
  assert.match(
    css,
    /\.btn-superlist-notify\.is-open \.btn-superlist-notify-character > span\s*\{[\s\S]*?transform: none;[\s\S]*?transition: none;/,
  );
});

test("copyable snippets use the same model, matcaps, sound, and toggle state", async () => {
  const snippetsPath = join(directory, "superlist-notify.snippets.js");
  assert.ok(existsSync(snippetsPath), "missing Superlist snippets");

  const { SUPERLIST_NOTIFY_META, SUPERLIST_NOTIFY_SNIPPETS } = await import(
    "./superlist-notify.snippets.js"
  );

  assert.equal(SUPERLIST_NOTIFY_META.id, "superlist-notify");
  assert.equal(SUPERLIST_NOTIFY_META.name, "Sidebar");
  assert.ok(SUPERLIST_NOTIFY_META.keywords.length >= 17);
  assert.ok(SUPERLIST_NOTIFY_META.keywords.includes("animated button"));
  assert.ok(SUPERLIST_NOTIFY_META.keywords.includes("interactive button"));

  for (const snippet of Object.values(SUPERLIST_NOTIFY_SNIPPETS)) {
    assert.match(snippet, /button\.glb/);
    assert.match(snippet, /matcap-orange\.png/);
    assert.match(snippet, /matcap-black\.png/);
    assert.match(snippet, /click\.mp3/);
    assert.match(snippet, /aria-pressed/);
    assert.match(snippet, /100(?:ms)?/);
    assert.match(snippet, /elastic/i);
    assert.match(snippet, /translateX\(28px\)/);
  }
});
