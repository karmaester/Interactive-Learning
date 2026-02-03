"use client";

import { cn } from "@/lib/utils";
import type { CEFRLevel } from "@/lib/types";
import { CEFR_DESCRIPTIONS } from "@/lib/types";

interface LevelBadgeProps {
  level: CEFRLevel;
  size?: "sm" | "md" | "lg";
}

const colorMap: Record<CEFRLevel, string> = {
  A1: "bg-emerald-100 text-emerald-700 border-emerald-200",
  A2: "bg-teal-100 text-teal-700 border-teal-200",
  B1: "bg-blue-100 text-blue-700 border-blue-200",
  B2: "bg-indigo-100 text-indigo-700 border-indigo-200",
  C1: "bg-purple-100 text-purple-700 border-purple-200",
  C2: "bg-amber-100 text-amber-700 border-amber-200",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        colorMap[level],
        sizeStyles[size]
      )}
    >
      <span>{level}</span>
      <span className="font-normal opacity-80">{CEFR_DESCRIPTIONS[level]}</span>
    </span>
  );
}
