import { useRef, useState } from "react";
import { RectangleDashed } from "@phosphor-icons/react";
import { CodeModal } from "./CodeModal.jsx";
import { CopyButton } from "./CopyButton.jsx";
import { STACKS } from "./slots.js";

const TAB_KEYS = ["html", "react", "node"];

export function Slot({ index, slot }) {
  const number = String(index).padStart(2, "0");
  const filled = Boolean(slot.preview);
  const [open, setOpen] = useState(null);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(0);
  const componentCode = slot.snippets?.react ?? "";

  async function copyComponent() {
    if (!filled || !componentCode) return;
    try {
      await navigator.clipboard.writeText(componentCode);
    } catch {
      window.prompt("Copy React component", componentCode);
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <article
      className={filled ? "slot is-filled" : "slot"}
      id={slot.id}
      itemScope
      itemType="https://schema.org/SoftwareSourceCode"
    >
      <svg className="slot-stroke-frame" aria-hidden="true">
        <rect
          className="slot-stroke-line slot-stroke-line--tr"
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="7"
          ry="7"
          pathLength="100"
        />
        <rect
          className="slot-stroke-line slot-stroke-line--bl"
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="7"
          ry="7"
          pathLength="100"
        />
      </svg>
      <div className={filled ? "slot-preview is-filled" : "slot-preview"}>
        <span className="slot-index" aria-hidden="true">
          {number}
        </span>
        <div className="slot-preview-stage">
          {filled ? (
            <slot.preview />
          ) : (
            <div className="slot-well">
              <RectangleDashed size={22} weight="regular" />
              <span>Empty tray</span>
            </div>
          )}
        </div>
      </div>

      <header className="slot-meta">
        <div className="slot-meta-row">
          <h3 itemProp="name">{slot.name}</h3>
          {filled ? (
            <CopyButton copied={copied} onClick={copyComponent} />
          ) : null}
        </div>
        <p itemProp="description">{slot.blurb}</p>
        <p className="slot-states">
          <span>States</span> {filled && slot.states ? slot.states : "pending"}
        </p>
        {slot.keywords?.length ? (
          <>
            <meta itemProp="keywords" content={slot.keywords.join(", ")} />
            <p className="visually-hidden">
              Keywords: {slot.keywords.join(", ")}
            </p>
          </>
        ) : null}
      </header>

      <div className="code-panel">
        {filled ? (
          <div className="code-toolbar" role="group" aria-label={`${slot.name} stacks`}>
            {STACKS.map((stack, i) => (
              <button
                key={stack}
                type="button"
                className="code-open"
                onClick={() => setOpen(i)}
              >
                <span className="code-open-window" aria-hidden="true">
                  <span className="code-open-line code-open-line--out">
                    {stack}
                  </span>
                  <span className="code-open-line code-open-line--in">
                    {stack}
                  </span>
                </span>
                <span className="visually-hidden">{stack}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="code-reserved">Reserved — code on fill</p>
        )}
      </div>

      {open !== null && filled ? (
        <CodeModal
          title={`${slot.name} — ${STACKS[open]}`}
          code={slot.snippets?.[TAB_KEYS[open]] ?? `// ${slot.id}`}
          onClose={() => setOpen(null)}
        />
      ) : null}
    </article>
  );
}
