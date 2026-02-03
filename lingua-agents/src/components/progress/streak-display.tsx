"use client";

import { Flame } from "lucide-react";

interface StreakDisplayProps {
  streak: number;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full border border-orange-200 font-medium text-sm">
      <Flame className="w-4 h-4" />
      <span>{streak} day{streak !== 1 ? "s" : ""}</span>
    </div>
  );
}
