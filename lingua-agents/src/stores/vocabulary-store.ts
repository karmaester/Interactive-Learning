"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/lib/types";
import { generateId } from "@/lib/utils";

export interface VocabEntry {
  id: string;
  word: string;
  translation: string;
  partOfSpeech?: string;
  example?: string;
  mastery: number; // 0.0 to 1.0
  nextReviewAt: number; // timestamp
  reviewCount: number;
  lastReviewedAt: number | null;
  createdAt: number;
}

// Spaced repetition intervals in milliseconds
// Based on a simplified SM-2 algorithm
const INTERVALS = [
  1 * 60 * 60 * 1000,       // 1 hour
  6 * 60 * 60 * 1000,       // 6 hours
  24 * 60 * 60 * 1000,      // 1 day
  3 * 24 * 60 * 60 * 1000,  // 3 days
  7 * 24 * 60 * 60 * 1000,  // 1 week
  14 * 24 * 60 * 60 * 1000, // 2 weeks
  30 * 24 * 60 * 60 * 1000, // 1 month
];

function getNextInterval(reviewCount: number, correct: boolean): number {
  if (!correct) {
    // Reset to first interval on failure
    return INTERVALS[0];
  }
  const idx = Math.min(reviewCount, INTERVALS.length - 1);
  return INTERVALS[idx];
}

interface VocabularyState {
  entries: Record<Language, VocabEntry[]>;

  // Actions
  addWord: (
    lang: Language,
    word: string,
    translation: string,
    partOfSpeech?: string,
    example?: string
  ) => void;
  addWords: (
    lang: Language,
    words: Array<{
      word: string;
      translation: string;
      partOfSpeech?: string;
      example?: string;
    }>
  ) => void;
  reviewWord: (lang: Language, wordId: string, correct: boolean) => void;
  getWordsForReview: (lang: Language, limit?: number) => VocabEntry[];
  getKnownWords: (lang: Language) => string[];
  getRecentWords: (lang: Language, limit?: number) => VocabEntry[];
  getStats: (lang: Language) => {
    total: number;
    mastered: number;
    learning: number;
    dueForReview: number;
  };
  removeWord: (lang: Language, wordId: string) => void;
}

export const useVocabularyStore = create<VocabularyState>()(
  persist(
    (set, get) => ({
      entries: { en: [], es: [], de: [] },

      addWord: (lang, word, translation, partOfSpeech, example) => {
        set((state) => {
          const existing = state.entries[lang].find(
            (e) => e.word.toLowerCase() === word.toLowerCase()
          );
          if (existing) return state; // Don't add duplicates

          const entry: VocabEntry = {
            id: generateId(),
            word,
            translation,
            partOfSpeech,
            example,
            mastery: 0,
            nextReviewAt: Date.now() + INTERVALS[0],
            reviewCount: 0,
            lastReviewedAt: null,
            createdAt: Date.now(),
          };

          return {
            entries: {
              ...state.entries,
              [lang]: [...state.entries[lang], entry],
            },
          };
        });
      },

      addWords: (lang, words) => {
        set((state) => {
          const existingWords = new Set(
            state.entries[lang].map((e) => e.word.toLowerCase())
          );

          const newEntries = words
            .filter((w) => !existingWords.has(w.word.toLowerCase()))
            .map((w) => ({
              id: generateId(),
              word: w.word,
              translation: w.translation,
              partOfSpeech: w.partOfSpeech,
              example: w.example,
              mastery: 0,
              nextReviewAt: Date.now() + INTERVALS[0],
              reviewCount: 0,
              lastReviewedAt: null,
              createdAt: Date.now(),
            }));

          if (newEntries.length === 0) return state;

          return {
            entries: {
              ...state.entries,
              [lang]: [...state.entries[lang], ...newEntries],
            },
          };
        });
      },

      reviewWord: (lang, wordId, correct) => {
        set((state) => {
          const entries = state.entries[lang].map((entry) => {
            if (entry.id !== wordId) return entry;

            const newReviewCount = correct
              ? entry.reviewCount + 1
              : Math.max(0, entry.reviewCount - 1);

            const interval = getNextInterval(newReviewCount, correct);

            const masteryDelta = correct ? 0.15 : -0.2;
            const newMastery = Math.max(
              0,
              Math.min(1, entry.mastery + masteryDelta)
            );

            return {
              ...entry,
              mastery: newMastery,
              reviewCount: newReviewCount,
              nextReviewAt: Date.now() + interval,
              lastReviewedAt: Date.now(),
            };
          });

          return {
            entries: { ...state.entries, [lang]: entries },
          };
        });
      },

      getWordsForReview: (lang, limit = 10) => {
        const now = Date.now();
        return get()
          .entries[lang].filter((e) => e.nextReviewAt <= now && e.mastery < 1)
          .sort((a, b) => a.nextReviewAt - b.nextReviewAt)
          .slice(0, limit);
      },

      getKnownWords: (lang) => {
        return get().entries[lang].map((e) => e.word);
      },

      getRecentWords: (lang, limit = 20) => {
        return [...get().entries[lang]]
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, limit);
      },

      getStats: (lang) => {
        const entries = get().entries[lang];
        const now = Date.now();
        return {
          total: entries.length,
          mastered: entries.filter((e) => e.mastery >= 0.8).length,
          learning: entries.filter((e) => e.mastery > 0 && e.mastery < 0.8)
            .length,
          dueForReview: entries.filter(
            (e) => e.nextReviewAt <= now && e.mastery < 1
          ).length,
        };
      },

      removeWord: (lang, wordId) => {
        set((state) => ({
          entries: {
            ...state.entries,
            [lang]: state.entries[lang].filter((e) => e.id !== wordId),
          },
        }));
      },
    }),
    {
      name: "lingua-agents-vocabulary",
    }
  )
);
