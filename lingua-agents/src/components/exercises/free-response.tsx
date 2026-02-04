"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface FreeResponseProps {
  question: string;
  hint?: string;
  minLength?: number;
  onSubmit: (response: string) => void;
  disabled?: boolean;
}

export function FreeResponse({
  question,
  hint,
  minLength = 5,
  onSubmit,
  disabled = false,
}: FreeResponseProps) {
  const [response, setResponse] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (response.trim().length < minLength || submitted || disabled) return;
    setSubmitted(true);
    onSubmit(response.trim());
  };

  return (
    <div className="space-y-3">
      <p className="text-base font-medium text-slate-800">{question}</p>

      {hint && (
        <div>
          {!showHint ? (
            <button
              onClick={() => setShowHint(true)}
              className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              Show hint
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100"
            >
              <Lightbulb className="w-3.5 h-3.5 inline mr-1" />
              {hint}
            </motion.div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            disabled={submitted || disabled}
            placeholder="Type your response..."
            rows={3}
            className={cn(
              "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3",
              "text-sm text-slate-800 placeholder:text-slate-400 resize-none",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
          <div className="flex items-center justify-between mt-2">
            <span
              className={cn(
                "text-xs",
                response.trim().length >= minLength
                  ? "text-slate-400"
                  : "text-amber-500"
              )}
            >
              {response.trim().length} / {minLength} min characters
            </span>
            <button
              type="submit"
              disabled={
                response.trim().length < minLength || submitted || disabled
              }
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer",
                "bg-indigo-600 text-white hover:bg-indigo-700 transition-colors",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              <Send className="w-4 h-4" />
              Submit
            </button>
          </div>
        </div>
      </form>

      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-slate-600 bg-blue-50 rounded-xl p-3 border border-blue-100"
        >
          Your response has been submitted for evaluation.
        </motion.div>
      )}
    </div>
  );
}
