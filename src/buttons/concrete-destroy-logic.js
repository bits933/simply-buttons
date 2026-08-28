export const VIEWPORT_ROOT_MARGIN = "200px";

export function isKeyboardActivation(event) {
  return event?.detail === 0;
}

export function shouldMountConcreteScene({ near, reducedMotion, webgl2, failed }) {
  return Boolean(near && !reducedMotion && webgl2 && !failed);
}

export function toActivationEvent(event) {
  return event?.nativeEvent ?? event;
}
