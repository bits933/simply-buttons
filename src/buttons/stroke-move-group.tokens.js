import { KRISS_CTA } from "./kriss-cta.tokens.js";

export const STROKE_MOVE_GROUP = {
  labels: ["Design", "Build", "Launch"],
  buttonWidth: 120,
  width: 360,
  height: 38,
  svg: { width: 382, height: 60, inset: 11 },
  rect: { x: 1.5, y: 1.5, width: 379, height: 57, rx: 8 },
};

export function getStrokeMoveGroupGeometry() {
  const { width, height, rx } = STROKE_MOVE_GROUP.rect;
  return { perimeter: 2 * (width + height - 4 * rx) + 2 * Math.PI * rx };
}

export function getStrokeMoveGroupTargets(perimeter, index) {
  const arc = Math.PI * KRISS_CTA.radius * 0.5;
  const idleFirst = arc + KRISS_CTA.tail;
  if (index < 0 || index >= STROKE_MOVE_GROUP.labels.length) {
    return { first: idleFirst, second: idleFirst - perimeter / 2, perimeter };
  }

  const dashLength = arc + KRISS_CTA.tail * 2;
  const buttonCenter = STROKE_MOVE_GROUP.buttonWidth * (index + 0.5);
  const groupCenter = STROKE_MOVE_GROUP.width / 2;
  const topCenterPath = STROKE_MOVE_GROUP.svg.inset + groupCenter
    - (STROKE_MOVE_GROUP.rect.x + STROKE_MOVE_GROUP.rect.rx);
  const delta = buttonCenter - groupCenter;
  const first = dashLength / 2 - (topCenterPath + delta);
  const second = dashLength / 2 - (topCenterPath + perimeter / 2 - delta);
  return { first, second, perimeter };
}
