export const SUPERLIST_PRESS_MS = 100;
export const SUPERLIST_REBOUND_MS = 1000;
export const SUPERLIST_FLIP_MS = 1000;

const clamp01 = (value) => Math.min(1, Math.max(0, value));

function expoInOut(value) {
  if (value === 0 || value === 1) return value;
  return value < 0.5
    ? 2 ** (20 * value - 10) / 2
    : (2 - 2 ** (-20 * value + 10)) / 2;
}

function elasticOut(value) {
  if (value === 0 || value === 1) return value;
  return 2 ** (-10 * value) * Math.sin((value - 0.05) * 10 * Math.PI) + 1;
}

export function getSuperlistButtonFrame(elapsed, fromRotation, toRotation) {
  const time = Math.max(0, elapsed);
  const done = time >= SUPERLIST_PRESS_MS + SUPERLIST_REBOUND_MS;
  let z = 0;

  if (time > 0 && time <= SUPERLIST_PRESS_MS) {
    const progress = time / SUPERLIST_PRESS_MS;
    z = -0.5 * (1 - (1 - progress) ** 2);
  } else if (time > SUPERLIST_PRESS_MS && !done) {
    const progress = (time - SUPERLIST_PRESS_MS) / SUPERLIST_REBOUND_MS;
    z = -0.5 * (1 - elasticOut(progress));
  }

  const flipProgress = clamp01(time / SUPERLIST_FLIP_MS);
  const rotationY =
    flipProgress === 1
      ? toRotation
      : fromRotation + (toRotation - fromRotation) * expoInOut(flipProgress);

  return { z: done ? 0 : z, rotationY, done };
}
