import { useEffect } from "react";

const BASE_TITLE = "Simply Buttons — interactive CSS, React, and Node button specimens";
const BASE_DESCRIPTION =
  "A specimen lab of live button styles, loaders, and states. Search by name, type, or motion. Copy HTML, React, or Node for every tray.";

export function Seo({ slots, query }) {
  useEffect(() => {
    const q = query.trim();
    document.title = q ? `${q} — Simply Buttons` : BASE_TITLE;
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        q
          ? `Search results for “${q}” across ${slots.length} interactive button specimens.`
          : BASE_DESCRIPTION,
      );
    }
  }, [query, slots.length]);

  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Simply Buttons",
    description: BASE_DESCRIPTION,
    isAccessibleForFree: true,
    about: "Interactive UI buttons, loaders, and microinteractions",
    keywords: [
      "css buttons",
      "react buttons",
      "button animation",
      "cta",
      "loaders",
      "microinteraction",
    ],
    hasPart: slots.map((slot) => ({
      "@type": "SoftwareSourceCode",
      name: slot.name,
      description: slot.blurb,
      programmingLanguage: ["HTML", "CSS", "JavaScript", "React"],
      keywords: Array.isArray(slot.keywords) ? slot.keywords : [],
      url: `#${slot.id}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
