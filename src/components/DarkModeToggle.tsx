"use client";

import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true);

  // On mount: read saved preference (defaults to dark)
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved !== null ? saved === "dark" : true;
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  function applyTheme(dark: boolean) {
    const html = document.documentElement;
    const body = document.body;

    if (dark) {
      html.classList.add("dark");
      body.classList.remove("bg-animated-light");
      body.classList.add("bg-animated");
    } else {
      html.classList.remove("dark");
      body.classList.remove("bg-animated");
      body.classList.add("bg-animated-light");
    }
  }

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
    applyTheme(next);
  };

  return (
    <button
      id="dark-mode-toggle"
      onClick={toggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        p-2.5
        bg-white/10 hover:bg-white/20
        border border-white/20 hover:border-yellow-400/40
        text-white/70 hover:text-yellow-300
        rounded-xl
        transition-all duration-300
        hover:scale-110
      "
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
