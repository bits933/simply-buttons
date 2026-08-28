const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const mapRange = (val, inMin, inMax, outMin, outMax, clampResult = false) => {
  const result = ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
  return clampResult
    ? outMin < outMax
      ? clamp(result, outMin, outMax)
      : clamp(result, outMax, outMin)
    : result;
};

export const formatPoint = (p) =>
  typeof p === "string" ? p : Array.isArray(p) ? `${p[0]} ${p[1]}` : `${p.x} ${p.y}`;

export const cubicBezier = (p1, p2, p3) =>
  `C ${formatPoint(p1)}, ${formatPoint(p2)}, ${formatPoint(p3)}`;

export function computeRoundedRectPath(x, y, w, h, rx, ry) {
  const rX = isNaN(rx) ? 0 : clamp(rx, 0, 0.5 * w);
  const rY = isNaN(ry) ? clamp(rX, 0, 0.5 * h) : clamp(ry, 0, 0.5 * h);
  if (isNaN(x + y + w + h)) return "";
  const corners = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h],
  ];
  if (rX + rY <= 0) {
    return `${corners.reduce((acc, pt, i) => `${acc}${i === 0 ? "M " : " L "}${formatPoint(pt)}`, "")} Z`;
  }
  const arcPoints = [
    [x, y + rY],
    [x + rX, y],
    [x + w - rX, y],
    [x + w, y + rY],
    [x + w, y + h - rY],
    [x + w - rX, y + h],
    [x + rX, y + h],
    [x, y + h - rY],
  ];
  return `${corners.reduce((acc, pt, i) => `${acc}${i === 0 ? "M " : " L "}${formatPoint(arcPoints[i * 2])} A ${rX} ${rY} 0 0 1 ${formatPoint(arcPoints[i * 2 + 1])} `, "")} Z`;
}

const HALF_PI = 0.5 * Math.PI;

export function computeBridges(rects, detachDistance = 30) {
  const paths = [];
  for (let i = 0; i < rects.length - 1; i++) {
    const leftIdx = rects[i].x + rects[i].width * 0.5 < rects[i + 1].x + rects[i + 1].width * 0.5 ? i : i + 1;
    const rightIdx = leftIdx === i ? i + 1 : i;
    const a = { ...rects[leftIdx] };
    a.radius = a.height * 0.5;
    a.center = [a.x + a.width - a.radius, a.y + a.radius];

    const b = { ...rects[rightIdx] };
    b.radius = b.height * 0.5;
    b.center = [b.x + b.radius, b.y + b.radius];

    const dist = Math.hypot(b.center[0] - a.center[0], b.center[1] - a.center[1]);
    const radiusSum = a.radius + b.radius;

    if (
      a.width <= 0 ||
      a.height <= 0 ||
      b.width <= 0 ||
      b.height <= 0 ||
      dist > detachDistance + radiusSum ||
      dist <= Math.abs(a.radius - b.radius)
    ) {
      continue;
    }

    const factor = mapRange(dist, 0, detachDistance + radiusSum * 0.2, 0.3, 0.3);
    a.u = dist < radiusSum ? Math.acos((a.radius ** 2 + dist ** 2 - b.radius ** 2) / (2 * a.radius * dist)) : 0;
    b.u = dist < radiusSum ? Math.acos((b.radius ** 2 + dist ** 2 - a.radius ** 2) / (2 * b.radius * dist)) : 0;

    a.angle = Math.atan2(b.center[1] - a.center[1], b.center[0] - a.center[0]);
    b.angle = Math.acos((a.radius - b.radius) / dist);

    a.angleA = a.angle + a.u + (b.angle - a.u) * factor;
    a.angleB = a.angle - a.u - (b.angle - a.u) * factor;
    b.angleA = a.angle + Math.PI - b.u - (Math.PI - b.u - b.angle) * factor;
    b.angleB = a.angle - Math.PI + b.u + (Math.PI - b.u - b.angle) * factor;

    a.attachA = [a.center[0] + a.radius * Math.cos(a.angleA) + 2.5, a.center[1] + a.radius * Math.sin(a.angleA)];
    a.attachB = [a.center[0] + a.radius * Math.cos(a.angleB) + 2.5, a.center[1] + a.radius * Math.sin(a.angleB)];
    b.attachA = [b.center[0] + b.radius * Math.cos(b.angleA) - 2.6, b.center[1] + b.radius * Math.sin(b.angleA)];
    b.attachB = [b.center[0] + b.radius * Math.cos(b.angleB) - 2.6, b.center[1] + b.radius * Math.sin(b.angleB)];

    const handleStrength =
      Math.min(factor, Math.hypot(b.attachA[0] - a.attachA[0], b.attachA[1] - a.attachA[1]) / radiusSum) *
      Math.min(1, (dist * 2) / radiusSum);
    a.radiusB = a.radius * handleStrength;
    b.radiusB = b.radius * handleStrength;

    a.handleA = [
      a.attachA[0] + a.radiusB * Math.cos(a.angleA - HALF_PI),
      a.attachA[1] + a.radiusB * Math.sin(a.angleA - HALF_PI),
    ];
    b.handleA = [
      b.attachA[0] + b.radiusB * Math.cos(b.angleA + HALF_PI),
      b.attachA[1] + b.radiusB * Math.sin(b.angleA + HALF_PI),
    ];
    b.handleB = [
      b.attachB[0] + b.radiusB * Math.cos(b.angleB - HALF_PI),
      b.attachB[1] + b.radiusB * Math.sin(b.angleB - HALF_PI),
    ];
    a.handleB = [
      a.attachB[0] + a.radiusB * Math.cos(a.angleB + HALF_PI),
      a.attachB[1] + a.radiusB * Math.sin(a.angleB + HALF_PI),
    ];

    paths.push(
      `M ${formatPoint(a.attachA)} ${cubicBezier(a.handleA, b.handleA, b.attachA)} L ${formatPoint(
        b.attachB
      )} ${cubicBezier(b.handleB, a.handleB, a.attachB)} Z`
    );
  }
  return paths.join(" ");
}
