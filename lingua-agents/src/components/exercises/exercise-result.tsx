"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseResultProps {
  correct: number;
  total: number;
  xpEarned: number;
  feedback?: string;
}

export function ExerciseResultPanel({
  correct,
  total,
  xpEarned,
  feedback,
}: ExerciseResultProps) {
  const percentage = Math.round((correct / total) * 100);
  const isGood = percentage >= 70;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-2xl p-6 border text-center",
        isGood
          ? "bg-emerald-50 border-emerald-200"
          : "bg-amber-50 border-amber-200"
      )}
    >
      <div className="flex justify-center mb-3">
        {isGood ? (
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        ) : (
          <XCircle className="w-10 h-10 text-amber-500" />
        )}
      </div>

      <h3
        className={cn(
          "text-lg font-bold mb-1",
          isGood ? "text-emerald-800" : "text-amber-800"
        )}
      >
        {percentage >= 90
          ? "Excellent!"
          : percentage >= 70
          ? "Good job!"
          : percentage >= 50
          ? "Keep practicing!"
          : "Don't give up!"}
      </h3>

      <p className="text-sm text-slate-600 mb-4">
        {correct} out of {total} correct ({percentage}%)
      </p>

      <div className="flex items-center justify-center gap-1.5 text-amber-700 font-medium">
        <Zap className="w-5 h-5 fill-amber-400" />
        <span>+{xpEarned} XP</span>
      </div>

      {feedback && (
        <p className="mt-3 text-sm text-slate-500">{feedback}</p>
      )}
    </motion.div>
  );
}
