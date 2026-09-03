import React from "react";
import "./grigoletti-faq-button.css";

export function GrigolettiFaqButton({
  label = "How long does a project take?",
  onClick,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <button
      type="button"
      className="gfaq-toggle-btn"
      aria-expanded={open}
      aria-label="FAQ question: How long does a project take?"
      onClick={(e) => {
        setOpen((prev) => !prev);
        if (onClick) onClick(e);
      }}
      {...rest}
    >
      <div className="gfaq-header">
        <div className="gfaq-left">
          <span className="gfaq-idx">(01)</span>
          <span className="gfaq-question">How long does a project take?</span>
        </div>
        <span className="gfaq-icon" aria-hidden="true">+</span>
      </div>
      <div className="gfaq-answer">
        That depends on the scope. A one-pager is finished in 2-4 weeks, while larger websites take longer accordingly.
      </div>
    </button>
  );
}

export function GrigolettiFaqButtonPreview() {
  return (
    <div className="gfaq-root" data-grigoletti-faq>
      <GrigolettiFaqButton />
    </div>
  );
}

export default GrigolettiFaqButton;
