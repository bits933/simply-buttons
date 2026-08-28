const quarterArc = (radius) => 2 * Math.PI * radius * 0.25;

export const KRISS_CTA = {
  label: "Learn More",
  box: { width: 120, height: 38, contentWidth: 90, padding: "10px 15px", radius: 3 },
  svg: { width: 142, height: 60, inset: 11 },
  rect: { x: 1.5, y: 1.5, width: 139, height: 57, rx: 8 },
  width: 142,
  radius: 8,
  tail: 10,
  gap: 10,
  fps: 70,
  ease: 0.1,
  paint: { rest: "rgba(255,255,255,.2)", hover: "rgba(255,255,255,1)", transition: "300ms ease" },
  typography: { family: "Krissai", weight: 400, size: 12, lineHeight: 18, letterSpacing: 0, color: "rgb(15,15,15)" },
};

export function getKrissBorderGeometry() {
  const perimeter = 377.9414;
  const dashLength = quarterArc(KRISS_CTA.radius) + KRISS_CTA.tail * 2;
  const idle = getKrissBorderTargets(perimeter, false);
  const thickDash = `${dashLength}, ${perimeter - dashLength}`;
  const faintOneLength = -idle.second + idle.first - KRISS_CTA.gap * 2 - dashLength;
  const faintOneOffset = idle.first - dashLength - KRISS_CTA.gap;
  const faintTwoLength = perimeter + idle.second - idle.first - KRISS_CTA.gap * 2 - dashLength;
  const faintTwoOffset = idle.second - dashLength - KRISS_CTA.gap + perimeter * 2;

  return {
    perimeter,
    dashLength,
    dashes: {
      thickFirst: { dash: thickDash, offset: idle.first },
      thickSecond: { dash: thickDash, offset: idle.second },
      faintOne: { dash: `${faintOneLength}, ${perimeter - faintOneLength}`, offset: faintOneOffset },
      faintTwo: { dash: `${faintTwoLength}, ${perimeter - faintTwoLength}`, offset: faintTwoOffset },
    },
  };
}

export function getKrissBorderTargets(perimeter, isHover) {
  const { width, radius, tail } = KRISS_CTA;
  const arc = quarterArc(radius);
  const base = arc + tail;
  if (!isHover) return { first: base, second: base - perimeter * 0.5, perimeter };
  const far = -(width - 3 - radius * 2) - arc + base;
  const opposite = -perimeter * 0.5 - (width - 3 - radius * 2) - arc + base;
  return {
    first: (base + far) * 0.5,
    second: (opposite + (base - perimeter * 0.5)) * 0.5,
    perimeter,
  };
}

export function stepKrissBorderFrame(previous, targets) {
  const first = previous.first + (targets.first - previous.first) * KRISS_CTA.ease;
  const second = previous.second + (targets.second - previous.second) * KRISS_CTA.ease;
  const { dashLength, perimeter } = getKrissBorderGeometry();
  const currentPerimeter = targets.perimeter ?? previous.perimeter ?? perimeter;
  const gap = KRISS_CTA.gap;
  const faintOneLength = -second + first - gap * 2 - dashLength;
  const faintOneOffset = first - dashLength - gap;
  const faintTwoLength = currentPerimeter + second - first - gap * 2 - dashLength;
  const faintTwoOffset = second - dashLength - gap + currentPerimeter * 2;
  const thickDash = `${dashLength}, ${currentPerimeter - dashLength}`;

  return {
    first,
    second,
    perimeter: currentPerimeter,
    thickDash,
    faintOneDash: `${faintOneLength}, ${currentPerimeter - faintOneLength}`,
    faintOneOffset,
    faintTwoDash: `${faintTwoLength}, ${currentPerimeter - faintTwoLength}`,
    faintTwoOffset,
  };
}
