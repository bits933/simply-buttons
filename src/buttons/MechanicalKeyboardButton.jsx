import { useEffect, useRef, useState } from "react";
import base from "./mechanical-key/base.svg";
import clicked from "./mechanical-key/clicked.svg";
import { isMechanicalPressKey, playMechanicalClick } from "./mechanical-keyboard.js";
import "./mechanical-keyboard.css";

export function MechanicalKeyboardButton({
  label = "OK key",
  disabled = false,
  className = "",
  onClick,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);
  const pressedRef = useRef(false);

  function setHeld(nextPressed) {
    if (pressedRef.current === nextPressed) return;
    pressedRef.current = nextPressed;
    setPressed(nextPressed);
  }

  function endPress() {
    setHeld(false);
  }

  useEffect(() => {
    if (disabled) {
      endPress();
    }
  }, [disabled]);

  function handlePointerDown(event) {
    if (disabled || !event.isPrimary || event.button !== 0) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {}
    setHeld(true);
  }

  function handleKeyDown(event) {
    if (disabled || event.repeat || !isMechanicalPressKey(event.key)) return;
    setHeld(true);
  }

  function handleKeyUp(event) {
    if (isMechanicalPressKey(event.key)) endPress();
  }

  function handleClick(event) {
    if (disabled) return;
    playMechanicalClick();
    onClick?.(event);
  }

  const buttonClassName = [
    "btn-mechanical-keyboard-button",
    pressed ? "is-pressed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...rest}
      type="button"
      className={buttonClassName}
      disabled={disabled}
      aria-label={label}
      onPointerDown={handlePointerDown}
      onPointerUp={endPress}
      onPointerCancel={endPress}
      onLostPointerCapture={endPress}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onBlur={endPress}
      onClick={handleClick}
    >
      <img
        className="btn-mechanical-keyboard-layer btn-mechanical-keyboard-layer--base"
        src={base}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
      <img
        className="btn-mechanical-keyboard-layer btn-mechanical-keyboard-layer--keycap"
        src={clicked}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
    </button>
  );
}

export function MechanicalKeyboardPreview() {
  return (
    <div className="btn-mechanical-keyboard-preview">
      <MechanicalKeyboardButton />
    </div>
  );
}
