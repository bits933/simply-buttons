let sharedClick;

export const MECHANICAL_CLICK_SRC = "/sfx/mechanical-keyboard-click.mp3";

export function isMechanicalPressKey(key) {
  return key === " " || key === "Enter";
}

export function playMechanicalClick(src = MECHANICAL_CLICK_SRC) {
  try {
    if (!src) return;
    if (!sharedClick || sharedClick.dataset.src !== src) {
      sharedClick = new Audio(src);
      sharedClick.dataset.src = src;
    }
    const player = sharedClick.cloneNode();
    player.currentTime = 0;
    player.play().catch(() => {});
  } catch {}
}
