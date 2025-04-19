"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="rounded-full p-2 bg-yellow-400/20 text-yellow-500 transition-all">
        <SunIcon className="h-6 w-6" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`rounded-full p-2 transition-all duration-300 ${
        theme === "dark"
          ? "bg-indigo-900/20 text-indigo-100 hover:bg-indigo-800/30"
          : "bg-yellow-400/20 text-yellow-600 hover:bg-yellow-400/40"
      }`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <MoonIcon className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
      ) : (
        <SunIcon className="h-6 w-6 transition-transform duration-300 hover:rotate-12" />
      )}
    </button>
  );
}
