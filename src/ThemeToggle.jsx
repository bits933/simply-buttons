import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

function readTheme() {
  const stored = localStorage.getItem("theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
    >
      {theme === "dark" ? (
        <Sun size={16} weight="bold" />
      ) : (
        <Moon size={16} weight="bold" />
      )}
    </button>
  );
}
