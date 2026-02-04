"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MatchingPair {
  left: string;
  right: string;
}

interface MatchingProps {
  pairs: MatchingPair[];
  instruction?: string;
  onComplete: (score: number, total: number) => void;
}

export function Matching({ pairs, instruction, onComplete }: MatchingProps) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, number>>({});
  const [correctMatches, setCorrectMatches] = useState<Set<number>>(new Set());
  const [wrongMatch, setWrongMatch] = useState<number | null>(null);

  // Shuffle right side
  const [shuffledRight] = useState(() =>
    [...pairs.map((_, i) => i)].sort(() => Math.random() - 0.5)
  );

  const allMatched = Object.keys(matches).length === pairs.length;

  const handleLeftClick = (idx: number) => {
    if (correctMatches.has(idx)) return;
    setSelectedLeft(idx);
    setWrongMatch(null);
  };

  const handleRightClick = (shuffledIdx: number) => {
    if (selectedLeft === null) return;

    const rightOriginalIdx = shuffledRight[shuffledIdx];

    if (correctMatches.has(rightOriginalIdx)) return;

    if (selectedLeft === rightOriginalIdx) {
      // Correct match
      const newMatches = { ...matches, [selectedLeft]: rightOriginalIdx };
      const newCorrect = new Set(correctMatches);
      newCorrect.add(selectedLeft);
      setMatches(newMatches);
      setCorrectMatches(newCorrect);
      setSelectedLeft(null);
      setWrongMatch(null);

      if (Object.keys(newMatches).length === pairs.length) {
        onComplete(newCorrect.size, pairs.length);
      }
    } else {
      // Wrong match
      setWrongMatch(shuffledIdx);
      setTimeout(() => {
        setWrongMatch(null);
        setSelectedLeft(null);
      }, 800);
    }
  };

  const handleReset = () => {
    setSelectedLeft(null);
    setMatches({});
    setCorrectMatches(new Set());
    setWrongMatch(null);
  };

  return (
    <div className="space-y-4">
      {instruction && (
        <p className="text-base font-medium text-slate-800">{instruction}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Left column */}
        <div className="space-y-2">
          {pairs.map((pair, idx) => (
            <motion.button
              key={`left-${idx}`}
              onClick={() => handleLeftClick(idx)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors cursor-pointer",
                correctMatches.has(idx) &&
                  "border-emerald-400 bg-emerald-50 text-emerald-700",
                !correctMatches.has(idx) &&
                  selectedLeft === idx &&
                  "border-indigo-500 bg-indigo-50 text-indigo-700",
                !correctMatches.has(idx) &&
                  selectedLeft !== idx &&
                  "border-slate-200 hover:border-slate-300"
              )}
            >
              <div className="flex items-center justify-between">
                {pair.left}
                {correctMatches.has(idx) && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {/* Right column (shuffled) */}
        <div className="space-y-2">
          {shuffledRight.map((originalIdx, shuffledIdx) => {
            const isMatched = correctMatches.has(originalIdx);
            const isWrong = wrongMatch === shuffledIdx;

            return (
              <motion.button
                key={`right-${shuffledIdx}`}
                onClick={() => handleRightClick(shuffledIdx)}
                whileTap={{ scale: 0.97 }}
                animate={isWrong ? { x: [0, -4, 4, -4, 4, 0] } : {}}
                transition={{ duration: 0.4 }}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors cursor-pointer",
                  isMatched && "border-emerald-400 bg-emerald-50 text-emerald-700",
                  isWrong && "border-red-400 bg-red-50 text-red-700",
                  !isMatched &&
                    !isWrong &&
                    "border-slate-200 hover:border-slate-300",
                  selectedLeft === null && !isMatched && "opacity-60"
                )}
              >
                <div className="flex items-center justify-between">
                  {pairs[originalIdx].right}
                  {isMatched && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {correctMatches.size} / {pairs.length} matched
        </span>
        {!allMatched && correctMatches.size > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>

      {allMatched && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="font-medium text-emerald-800">All pairs matched!</p>
        </motion.div>
      )}
    </div>
  );
}
