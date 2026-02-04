"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, RotateCcw, Plus, Clock } from "lucide-react";
import { ChatContainer } from "@/components/chat/chat-container";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { useVocabularyStore, type VocabEntry } from "@/stores/vocabulary-store";
import { VocabCard } from "@/components/progress/vocab-card";
import { Button } from "@/components/ui/button";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "learn" | "review" | "collection";

export default function VocabularyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("learn");
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);
  const createSession = useChatStore((s) => s.createSession);

  const entries = useVocabularyStore((s) =>
    activeLanguage ? s.entries[activeLanguage] : []
  );
  const getWordsForReview = useVocabularyStore((s) => s.getWordsForReview);
  const getStats = useVocabularyStore((s) => s.getStats);
  const removeWord = useVocabularyStore((s) => s.removeWord);

  const stats = activeLanguage ? getStats(activeLanguage) : null;
  const reviewWords = activeLanguage ? getWordsForReview(activeLanguage) : [];

  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;

  // Ensure vocab session exists for chat tab
  useEffect(() => {
    const activeSession = activeSessionId
      ? sessions[activeSessionId]
      : null;
    if (
      activeTab === "learn" &&
      (!activeSession || activeSession.type !== "vocabulary")
    ) {
      createSession("vocabulary");
    }
  }, [activeTab, activeSessionId, sessions, createSession]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "learn", label: "Learn New Words", icon: <Plus className="w-4 h-4" /> },
    {
      id: "review",
      label: `Review${reviewWords.length > 0 ? ` (${reviewWords.length})` : ""}`,
      icon: <RotateCcw className="w-4 h-4" />,
    },
    {
      id: "collection",
      label: `My Words${stats ? ` (${stats.total})` : ""}`,
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-800">
          Vocabulary Builder
        </h1>
        {config && (
          <p className="text-sm text-slate-500">
            Build your {config.name} vocabulary with {config.tutorName}
          </p>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mt-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                activeTab === tab.id
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "learn" && (
        <div className="flex-1 overflow-hidden">
          <ChatContainer sessionType="vocabulary" />
        </div>
      )}

      {activeTab === "review" && (
        <div className="flex-1 overflow-y-auto p-6">
          {reviewWords.length > 0 ? (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 rounded-xl p-4 border border-amber-100">
                <Clock className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">
                  {reviewWords.length} word{reviewWords.length !== 1 ? "s" : ""}{" "}
                  due for review. Practice them to strengthen your memory!
                </p>
              </div>
              <ReviewCards words={reviewWords} language={activeLanguage!} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="text-4xl">✅</div>
              <h3 className="text-lg font-medium text-slate-700">
                All caught up!
              </h3>
              <p className="text-sm text-slate-400">
                No words due for review right now. Learn new words to fill your
                review queue.
              </p>
              <Button
                variant="secondary"
                onClick={() => setActiveTab("learn")}
              >
                Learn New Words
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === "collection" && (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Stats summary */}
            {stats && stats.total > 0 && (
              <div className="grid grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Total", value: stats.total, color: "text-slate-700" },
                  { label: "Mastered", value: stats.mastered, color: "text-emerald-600" },
                  { label: "Learning", value: stats.learning, color: "text-blue-600" },
                  { label: "Due", value: stats.dueForReview, color: "text-amber-600" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center p-3 bg-white rounded-xl border border-slate-100"
                  >
                    <div className={cn("text-xl font-bold", s.color)}>
                      {s.value}
                    </div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Word list */}
            {entries.length > 0 ? (
              <div className="space-y-2">
                {[...entries]
                  .sort((a, b) => b.createdAt - a.createdAt)
                  .map((entry) => (
                    <VocabCard
                      key={entry.id}
                      entry={entry}
                      onRemove={
                        activeLanguage
                          ? (id) => removeWord(activeLanguage, id)
                          : undefined
                      }
                    />
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
                <div className="text-4xl">📖</div>
                <h3 className="text-lg font-medium text-slate-700">
                  No words yet
                </h3>
                <p className="text-sm text-slate-400">
                  Start learning new words and they&apos;ll appear here.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setActiveTab("learn")}
                >
                  Learn New Words
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Simple flashcard-style review component
function ReviewCards({
  words,
  language,
}: {
  words: VocabEntry[];
  language: string;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const reviewWord = useVocabularyStore((s) => s.reviewWord);

  const current = words[currentIdx];
  const isComplete = currentIdx >= words.length;

  const handleAnswer = (correct: boolean) => {
    if (!current) return;
    reviewWord(language as "en" | "es" | "de", current.id, correct);
    setResults((prev) => ({ ...prev, [current.id]: correct }));
    setFlipped(false);
    setCurrentIdx((prev) => prev + 1);
  };

  if (isComplete) {
    const correctCount = Object.values(results).filter(Boolean).length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-200"
      >
        <h3 className="text-xl font-bold text-emerald-800 mb-2">
          Review Complete!
        </h3>
        <p className="text-slate-600">
          {correctCount} out of {words.length} correct
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-slate-400 text-center">
        {currentIdx + 1} / {words.length}
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl border border-slate-200 p-8 text-center min-h-[200px] flex flex-col items-center justify-center cursor-pointer shadow-sm"
        onClick={() => setFlipped(!flipped)}
      >
        {!flipped ? (
          <div>
            <p className="text-2xl font-bold text-slate-800">{current.word}</p>
            {current.partOfSpeech && (
              <p className="text-sm text-slate-400 mt-1 italic">
                {current.partOfSpeech}
              </p>
            )}
            <p className="text-xs text-slate-300 mt-4">Tap to reveal</p>
          </div>
        ) : (
          <div>
            <p className="text-xl font-medium text-indigo-700">
              {current.translation}
            </p>
            {current.example && (
              <p className="text-sm text-slate-500 mt-3 italic">
                &ldquo;{current.example}&rdquo;
              </p>
            )}
          </div>
        )}
      </motion.div>

      {flipped && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-3"
        >
          <Button variant="danger" onClick={() => handleAnswer(false)}>
            Didn&apos;t know
          </Button>
          <Button variant="success" onClick={() => handleAnswer(true)}>
            Got it!
          </Button>
        </motion.div>
      )}
    </div>
  );
}
