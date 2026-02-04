"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VocabEntry } from "@/stores/vocabulary-store";

interface VocabCardProps {
  entry: VocabEntry;
  onRemove?: (id: string) => void;
  compact?: boolean;
}

function masteryColor(mastery: number) {
  if (mastery >= 0.8) return "bg-emerald-500";
  if (mastery >= 0.5) return "bg-blue-500";
  if (mastery >= 0.2) return "bg-amber-500";
  return "bg-slate-300";
}

function masteryLabel(mastery: number) {
  if (mastery >= 0.8) return "Mastered";
  if (mastery >= 0.5) return "Familiar";
  if (mastery >= 0.2) return "Learning";
  return "New";
}

export function VocabCard({ entry, onRemove, compact = false }: VocabCardProps) {
  const dueForReview = entry.nextReviewAt <= Date.now() && entry.mastery < 1;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl border bg-white",
        dueForReview ? "border-amber-200" : "border-slate-100",
        compact ? "p-3" : "p-4"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("font-semibold text-slate-800", compact ? "text-sm" : "text-base")}>
              {entry.word}
            </span>
            {entry.partOfSpeech && (
              <span className="text-xs text-slate-400 italic">
                {entry.partOfSpeech}
              </span>
            )}
            {dueForReview && (
              <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium">
                Review
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{entry.translation}</p>
          {!compact && entry.example && (
            <p className="text-xs text-slate-400 italic mt-1">
              &ldquo;{entry.example}&rdquo;
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mastery indicator */}
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", masteryColor(entry.mastery))}
                  style={{ width: `${entry.mastery * 100}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 w-16 text-right">
                {masteryLabel(entry.mastery)}
              </span>
            </div>
          </div>

          {onRemove && (
            <button
              onClick={() => onRemove(entry.id)}
              className="text-slate-300 hover:text-red-400 transition-colors cursor-pointer p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
