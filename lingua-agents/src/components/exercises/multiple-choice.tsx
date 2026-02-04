"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultipleChoiceProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  onAnswer: (correct: boolean) => void;
}

export function MultipleChoice({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const correct =
      option.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    onAnswer(correct);
  };

  return (
    <div className="space-y-4">
      <p className="text-base font-medium text-slate-800">{question}</p>
      <div className="grid gap-2">
        {options.map((option, idx) => {
          const isCorrect =
            option.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
          const isSelected = selected === option;

          return (
            <motion.button
              key={idx}
              whileTap={!answered ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl border-2 transition-colors cursor-pointer",
                "text-sm font-medium",
                !answered &&
                  "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50",
                answered && isCorrect && "border-emerald-500 bg-emerald-50 text-emerald-800",
                answered && isSelected && !isCorrect && "border-red-400 bg-red-50 text-red-800",
                answered && !isSelected && !isCorrect && "border-slate-100 opacity-50"
              )}
            >
              <div className="flex items-center justify-between">
                <span>
                  <span className="text-slate-400 mr-2">
                    {String.fromCharCode(97 + idx)})
                  </span>
                  {option}
                </span>
                {answered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                )}
                {answered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
      {answered && explanation && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100"
        >
          <span className="font-medium">Explanation:</span> {explanation}
        </motion.div>
      )}
    </div>
  );
}
