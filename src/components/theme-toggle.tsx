"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration guard: useTheme() returns undefined on the server pass (no
  // localStorage). Render a layout-preserving disabled placeholder with the
  // same 44x44 footprint to prevent CLS and a hydration mismatch warning
  // (RESEARCH §Pitfall 5).
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return <button type="button" disabled aria-label="Toggle theme" className="h-11 w-11" />;
  }

  const next = resolvedTheme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      aria-label={`Switch to ${next} theme`}
      onClick={() => setTheme(next)}
      className="h-11 w-11 inline-flex items-center justify-center text-text-primary"
    >
      {resolvedTheme === "dark" ? "☀" : "☾"}
    </button>
  );
}
