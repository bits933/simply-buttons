export const LETTER_SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const LETTER_SCRAMBLE_MS = 460;
export const LETTER_SCRAMBLE_HOLD_MS = 90;
export const LETTER_SCRAMBLE_LABEL = "BUTTON";

export function easeScrambleProgress(progress) {
  const amount = Math.min(1, Math.max(0, Number(progress) || 0));
  return 1 - (1 - amount) * (1 - amount);
}

export function scrambleGlyph(index, tick) {
  const size = LETTER_SCRAMBLE_CHARS.length;
  const at = ((index * 31 + tick * 17) % size + size) % size;
  return LETTER_SCRAMBLE_CHARS[at];
}

export function buildLetterScrambleFrame(text, progress, tick = 0) {
  const amount = easeScrambleProgress(progress);
  if (amount >= 1) return text;
  const resolved = Math.floor(text.length * amount);
  return [...text]
    .map((character, index) => {
      if (character === " " || index < resolved) return character;
      return scrambleGlyph(index, tick);
    })
    .join("");
}

export function paintLetterScramble(cells, text, progress, tick) {
  const frame = buildLetterScrambleFrame(text, progress, tick);
  [...frame].forEach((character, index) => {
    if (cells[index]) cells[index].textContent = character;
  });
}

export function attachLetterScramble(button) {
  if (!button) return () => {};
  const cells = button.querySelectorAll(".btn-lscram-cell");
  const text = (button.getAttribute("data-text") || LETTER_SCRAMBLE_LABEL).trim();
  let frame = 0;
  let hover = false;
  let focus = false;

  function cancel() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function restore() {
    paintLetterScramble(cells, text, 1, 0);
  }

  function run() {
    cancel();
    const live = hover || focus;
    if (!live || button.disabled) {
      restore();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      restore();
      return;
    }
    const startedAt = performance.now();
    let tick = 0;
    let lastHold = -Infinity;
    function render(now) {
      if (!(hover || focus) || button.disabled) return;
      const progress = Math.min(1, (now - startedAt) / LETTER_SCRAMBLE_MS);
      if (now - lastHold >= LETTER_SCRAMBLE_HOLD_MS || progress === 1) {
        paintLetterScramble(cells, text, progress, tick);
        lastHold = now;
        tick += 1;
      }
      if (progress < 1) frame = requestAnimationFrame(render);
      else frame = 0;
    }
    frame = requestAnimationFrame(render);
  }

  function onEnter(event) {
    if (button.disabled) return;
    if (event.type === "pointerenter" && event.pointerType === "touch") return;
    if (event.type === "pointerenter") hover = true;
    if (event.type === "focus") focus = button.matches(":focus-visible");
    run();
  }

  function onLeave(event) {
    if (event.type === "pointerleave" && event.pointerType === "touch") return;
    if (event.type === "pointerleave") hover = false;
    if (event.type === "blur") focus = false;
    run();
  }

  button.addEventListener("pointerenter", onEnter);
  button.addEventListener("pointerleave", onLeave);
  button.addEventListener("focus", onEnter);
  button.addEventListener("blur", onLeave);

  return () => {
    cancel();
    hover = false;
    focus = false;
    button.removeEventListener("pointerenter", onEnter);
    button.removeEventListener("pointerleave", onLeave);
    button.removeEventListener("focus", onEnter);
    button.removeEventListener("blur", onLeave);
    restore();
  };
}
