"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/types";

interface TopicSelectorProps {
  language: Language;
  suggestions: string[];
  onSelect: (topic: string) => void;
  className?: string;
}

const CUSTOM_TOPIC_HINTS: Record<Language, string[]> = {
  en: ["Travel planning", "Job interview", "Cooking recipes", "News discussion", "Movie review"],
  es: ["Viajes", "Entrevista de trabajo", "Recetas de cocina", "Noticias", "Reseña de película"],
  de: ["Reiseplanung", "Vorstellungsgespräch", "Kochrezepte", "Nachrichten", "Filmkritik"],
};

export function TopicSelector({
  language,
  suggestions,
  onSelect,
  className,
}: TopicSelectorProps) {
  const [customTopic, setCustomTopic] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const hints = CUSTOM_TOPIC_HINTS[language] || CUSTOM_TOPIC_HINTS.en;

  const handleCustomSubmit = () => {
    if (customTopic.trim()) {
      onSelect(customTopic.trim());
      setCustomTopic("");
      setShowCustom(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-2">
        {suggestions.slice(0, 8).map((topic) => (
          <button
            key={topic}
            onClick={() => onSelect(topic)}
            className="text-xs px-3 py-1.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
          >
            {topic}
          </button>
        ))}

        {/* Custom topic toggle */}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={cn(
            "flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
            showCustom
              ? "bg-indigo-50 text-indigo-600 border-indigo-200"
              : "bg-slate-50 text-slate-500 border-dashed border-slate-300 hover:bg-indigo-50 hover:text-indigo-600"
          )}
        >
          <Sparkles className="w-3 h-3" />
          Custom topic
        </button>
      </div>

      {/* Custom topic input */}
      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomSubmit()}
                  placeholder={`e.g. "${hints[Math.floor(Math.random() * hints.length)]}"`}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={handleCustomSubmit}
                disabled={!customTopic.trim()}
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Go
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
