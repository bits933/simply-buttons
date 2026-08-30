import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("shared stroke targets each button center and returns to the outer corners", async () => {
  const {
    STROKE_MOVE_GROUP,
    getStrokeMoveGroupGeometry,
    getStrokeMoveGroupTargets,
  } = await import("./stroke-move-group.tokens.js");

  assert.deepEqual(STROKE_MOVE_GROUP.labels, ["Design", "Build", "Launch"]);
  assert.equal(STROKE_MOVE_GROUP.buttonWidth, 120);
  assert.equal(STROKE_MOVE_GROUP.width, 360);

  const { perimeter } = getStrokeMoveGroupGeometry();
  const idle = getStrokeMoveGroupTargets(perimeter, -1);
  const left = getStrokeMoveGroupTargets(perimeter, 0);
  const middle = getStrokeMoveGroupTargets(perimeter, 1);
  const right = getStrokeMoveGroupTargets(perimeter, 2);

  assert.ok(Math.abs(idle.first - 22.566370614359172) < 0.0001);
  assert.ok(Math.abs(left.first + 45.21681469282042) < 0.0001);
  assert.ok(Math.abs(middle.first - (left.first - 120)) < 0.0001);
  assert.ok(Math.abs(right.first - (middle.first - 120)) < 0.0001);

  const dashLength = Math.PI * 4 + 20;
  const topCenterPath = 181.5;
  for (const [target, expectedX] of [[left, -120], [middle, 0], [right, 120]]) {
    const topX = dashLength / 2 - target.first - topCenterPath;
    const bottomX = topCenterPath + perimeter / 2 - (dashLength / 2 - target.second);
    assert.ok(Math.abs(topX - expectedX) < 0.0001);
    assert.ok(Math.abs(bottomX - expectedX) < 0.0001);
  }
});

test("ships one accessible three-button group with aligned copyable examples", async () => {
  const { STROKE_MOVE_GROUP_META, STROKE_MOVE_GROUP_SNIPPETS } = await import("./stroke-move-group.snippets.js");
  const component = await readFile(new URL("./StrokeMoveGroup.jsx", import.meta.url), "utf8");
  const css = await readFile(new URL("./stroke-move-group.css", import.meta.url), "utf8");
  const slots = await readFile(new URL("../slots.js", import.meta.url), "utf8");

  assert.equal(STROKE_MOVE_GROUP_META.id, "stroke-move-2");
  assert.equal(STROKE_MOVE_GROUP_META.name, "Stroke Move 2.0");
  assert.match(component, /role="group"/);
  assert.match(component, /aria-label="Creative workflow"/);
  assert.match(component, /STROKE_MOVE_GROUP\.labels\.map/);
  assert.equal((component.match(/<rect/g) || []).length, 4);
  assert.match(component, /onMouseLeave=/);
  assert.match(component, /focus-visible/);
  assert.match(css, /grid-template-columns:\s*repeat\(3, 120px\)/);
  assert.match(css, /width:\s*360px/);
  assert.match(css, /width:\s*382px/);
  assert.match(css, /background-color 300ms ease/);
  assert.doesNotMatch(css, /border-left/);
  assert.match(css, /\[data-theme="light"\] \.btn-stroke-group-item/);
  assert.match(css, /background-color: #222326/);
  assert.match(css, /stroke: #050505/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /\.btn-stroke-group:not\(:hover\)\s+\.btn-stroke-group-item:focus-visible/);

  for (const snippet of Object.values(STROKE_MOVE_GROUP_SNIPPETS)) {
    assert.match(snippet, /Design/);
    assert.match(snippet, /Build/);
    assert.match(snippet, /Launch/);
    assert.match(snippet, /role=["']group["']/);
    assert.match(snippet, /382/);
    assert.match(snippet, /379/);
    assert.doesNotMatch(snippet, /border-left/);
    assert.match(snippet, /data-theme=\\?"light\\?"/);
    assert.match(snippet, /#222326/);
    assert.match(snippet, /prefers-reduced-motion/);
  }
  assert.match(STROKE_MOVE_GROUP_SNIPPETS.html, /\.stroke-move-group:not\(:hover\) button:focus-visible/);
  assert.match(STROKE_MOVE_GROUP_SNIPPETS.react, /\.stroke-move-group:not\(:hover\) button:focus-visible/);

  const oldSlot = slots.indexOf('id: "kriss-cta"');
  const newSlot = slots.indexOf('id: "stroke-move-2"');
  assert.ok(oldSlot >= 0 && newSlot > oldSlot);
  assert.equal(slots.indexOf("id:", oldSlot + 4), newSlot);
});
