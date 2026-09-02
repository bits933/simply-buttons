import { X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { CopyButton } from "./CopyButton.jsx";
import { selectElementText, writeClipboard } from "./copyBundle.js";

export function CodeModal({ title, code, onClose }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const codeRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(0);

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
      window.clearTimeout(copyTimer.current);
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, [onClose]);

  async function copy() {
    selectElementText(codeRef.current);
    const ok = await writeClipboard(code);
    if (!ok) window.prompt("Copy code", code);
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="code-modal-scrim" onClick={onClose}>
      <div
        ref={dialogRef}
        className="code-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="code-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="code-modal-bar">
          <h2 id="code-modal-title">{title}</h2>
          <div className="code-modal-actions">
            <CopyButton copied={copied} onClick={copy} label="Copy" />
            <button
              ref={closeRef}
              type="button"
              className="code-modal-close"
              onClick={onClose}
              aria-label="Close code"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        </header>
        <pre className="code-modal-body" tabIndex={0} aria-label="Code snippet">
          <code ref={codeRef}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
