import { X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { CopyButton } from "./CopyButton.jsx";

export function PreviewModal({ title, copied, onCopy, onClose, children }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const nodes = dialogRef.current.querySelectorAll(
        'button, [href], textarea, pre, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [onClose]);

  return (
    <div className="code-modal-scrim" onClick={onClose}>
      <div
        ref={dialogRef}
        className="preview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preview-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="preview-modal-bar">
          <button
            ref={closeRef}
            type="button"
            className="preview-modal-close"
            onClick={onClose}
            aria-label="Close (Escape)"
          >
            <X size={16} weight="bold" />
            <kbd>Esc</kbd>
          </button>
          <h2 id="preview-modal-title" className="visually-hidden">
            {title}
          </h2>
          <CopyButton copied={copied} onClick={onCopy} />
        </header>
        <div className="preview-modal-stage">{children}</div>
      </div>
    </div>
  );
}
