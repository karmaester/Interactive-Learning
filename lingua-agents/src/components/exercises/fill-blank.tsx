"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FillBlankProps {
  sentence: string; // Contains ___ for the blank
  correctAnswer: string;
  explanation?: string;
  onAnswer: (correct: boolean) => void;
}

export function FillBlank({
  sentence,
  correctAnswer,
  explanation,
  onAnswer,
}: FillBlankProps) {
  const [input, setInput] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const parts = sentence.split(/___+/);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (answered || !input.trim()) return;

    const correct =
      input.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    setIsCorrect(correct);
    setAnswered(true);
    onAnswer(correct);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="text-base text-slate-800 leading-relaxed flex flex-wrap items-center gap-1">
          {parts.map((part, idx) => (
            <span key={idx}>
              {part}
              {idx < parts.length - 1 && (
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={answered}
                  placeholder="..."
                  className={cn(
                    "inline-block w-32 mx-1 px-3 py-1 border-b-2 text-center",
                    "bg-transparent outline-none text-base font-medium",
                    !answered && "border-indigo-400 text-indigo-700",
                    answered && isCorrect && "border-emerald-500 text-emerald-700",
                    answered && !isCorrect && "border-red-400 text-red-700"
                  )}
                />
              )}
            </span>
          ))}
        </div>

        {!answered && (
          <button
            type="submit"
            disabled={!input.trim()}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer",
              "bg-indigo-600 text-white hover:bg-indigo-700",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            Check
          </button>
        )}
      </form>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex items-start gap-2 rounded-xl p-3 text-sm",
            isCorrect ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"
          )}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
          )}
          <div>
            {isCorrect ? (
              <span className="font-medium">Correct!</span>
            ) : (
              <span>
                <span className="font-medium">Not quite.</span> The answer is:{" "}
                <span className="font-semibold text-emerald-700">
                  {correctAnswer}
                </span>
              </span>
            )}
            {explanation && (
              <p className="mt-1 text-slate-600">{explanation}</p>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
