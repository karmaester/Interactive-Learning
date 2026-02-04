"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useThemeStore((s) => s.theme);
  const reducedMotion = useThemeStore((s) => s.reducedMotion);
  const getResolvedTheme = useThemeStore((s) => s.getResolvedTheme);

  useEffect(() => {
    const resolved = getResolvedTheme();
    const root = document.documentElement;
    root.classList.toggle("dark", resolved === "dark");
  }, [theme, getResolvedTheme]);

  // Listen for system theme changes when in "system" mode
  useEffect(() => {
    if (theme !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle("dark", e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [theme]);

  // Apply reduced motion override
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reducedMotion);
  }, [reducedMotion]);

  return <>{children}</>;
}
