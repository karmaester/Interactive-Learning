"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  reducedMotion: boolean;

  setTheme: (theme: Theme) => void;
  setReducedMotion: (value: boolean) => void;
  getResolvedTheme: () => "light" | "dark";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      reducedMotion: false,

      setTheme: (theme) => set({ theme }),
      setReducedMotion: (value) => set({ reducedMotion: value }),

      getResolvedTheme: () => {
        const { theme } = get();
        if (theme === "system") {
          if (typeof window !== "undefined") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light";
          }
          return "light";
        }
        return theme;
      },
    }),
    {
      name: "lingua-agents-theme",
    }
  )
);
