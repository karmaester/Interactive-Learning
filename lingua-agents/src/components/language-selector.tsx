"use client";

import { motion } from "framer-motion";
import type { Language } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  selected: Language | null;
  onSelect: (lang: Language) => void;
  size?: "sm" | "lg";
}

const flags: Record<Language, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  de: "🇩🇪",
};

const languages: Language[] = ["en", "es", "de"];

export function LanguageSelector({
  selected,
  onSelect,
  size = "lg",
}: LanguageSelectorProps) {
  return (
    <div
      className={cn(
        "flex gap-4",
        size === "lg" ? "flex-row" : "flex-row gap-2"
      )}
    >
      {languages.map((lang) => {
        const config = LANGUAGE_CONFIG[lang];
        const isSelected = selected === lang;

        return (
          <motion.button
            key={lang}
            onClick={() => onSelect(lang)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 transition-colors cursor-pointer",
              size === "lg" ? "p-6 min-w-[140px]" : "p-3 min-w-[90px]",
              isSelected
                ? "border-indigo-500 bg-indigo-50 shadow-md"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <span className={size === "lg" ? "text-4xl" : "text-2xl"}>
              {flags[lang]}
            </span>
            <div className="text-center">
              <div
                className={cn(
                  "font-semibold",
                  size === "lg" ? "text-base" : "text-sm",
                  isSelected ? "text-indigo-700" : "text-slate-700"
                )}
              >
                {config.name}
              </div>
              <div
                className={cn(
                  "text-slate-400",
                  size === "lg" ? "text-sm" : "text-xs"
                )}
              >
                {config.nativeName}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
