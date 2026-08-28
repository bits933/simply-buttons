export const FLAME_STREAK_LABEL = "Great Streak!";

export const FLAME_STREAK_OPTIONS = {
  color: [1, 0.52, 0.16],
  intensity: 0.95,
  height: 40,
  spread: 10,
  radius: 26,
  speed: 0.42,
  scale: 0.68,
  turbulence: 0.55,
  turbulenceScale: 0.55,
  turbulenceReach: 18,
  sparks: 1.35,
  sparkSize: 0.42,
  sparkDensity: 1.1,
  sparkSpeed: 1.05,
  rim: 2.2,
  melt: 3.2,
  distortion: 6,
  smoke: 0.9,
  ember: 1.7,
  scorch: 0,
};

export function flameReach(options = FLAME_STREAK_OPTIONS) {
  return Math.round(Math.max(options.height ?? 170, 24) * 1.5) + 40;
}

export function flameGlow(options = FLAME_STREAK_OPTIONS) {
  return Math.round(Math.max(options.spread ?? 8, 8) * 3) + 16;
}
