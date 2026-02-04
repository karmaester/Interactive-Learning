"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language } from "@/lib/types";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "learning" | "vocabulary" | "streak" | "social" | "mastery";
  requirement: number;
  checkFn: string; // key into CHECK_FUNCTIONS
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: number;
  language?: Language;
}

// All possible achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Learning milestones
  { id: "first-message", title: "First Words", description: "Send your first message", icon: "💬", category: "learning", requirement: 1, checkFn: "totalMessages" },
  { id: "10-messages", title: "Chatty Learner", description: "Send 10 messages", icon: "🗣️", category: "learning", requirement: 10, checkFn: "totalMessages" },
  { id: "50-messages", title: "Conversation Pro", description: "Send 50 messages", icon: "🎤", category: "learning", requirement: 50, checkFn: "totalMessages" },
  { id: "100-messages", title: "Polyglot Speaker", description: "Send 100 messages", icon: "🌟", category: "learning", requirement: 100, checkFn: "totalMessages" },

  // XP milestones
  { id: "xp-100", title: "First Steps", description: "Earn 100 XP", icon: "⚡", category: "learning", requirement: 100, checkFn: "totalXP" },
  { id: "xp-500", title: "Rising Star", description: "Earn 500 XP", icon: "🌟", category: "learning", requirement: 500, checkFn: "totalXP" },
  { id: "xp-1000", title: "Dedicated Learner", description: "Earn 1,000 XP", icon: "🏆", category: "learning", requirement: 1000, checkFn: "totalXP" },
  { id: "xp-5000", title: "Language Master", description: "Earn 5,000 XP", icon: "👑", category: "mastery", requirement: 5000, checkFn: "totalXP" },

  // Vocabulary milestones
  { id: "vocab-5", title: "Word Collector", description: "Learn 5 vocabulary words", icon: "📝", category: "vocabulary", requirement: 5, checkFn: "totalVocab" },
  { id: "vocab-25", title: "Vocabulary Builder", description: "Learn 25 vocabulary words", icon: "📚", category: "vocabulary", requirement: 25, checkFn: "totalVocab" },
  { id: "vocab-50", title: "Lexicon Explorer", description: "Learn 50 vocabulary words", icon: "📖", category: "vocabulary", requirement: 50, checkFn: "totalVocab" },
  { id: "vocab-100", title: "Dictionary Master", description: "Learn 100 vocabulary words", icon: "🧠", category: "vocabulary", requirement: 100, checkFn: "totalVocab" },

  // Mastered vocabulary
  { id: "mastered-5", title: "Quick Study", description: "Master 5 vocabulary words", icon: "✅", category: "mastery", requirement: 5, checkFn: "masteredVocab" },
  { id: "mastered-25", title: "Knowledge Keeper", description: "Master 25 vocabulary words", icon: "🎓", category: "mastery", requirement: 25, checkFn: "masteredVocab" },

  // Streak milestones
  { id: "streak-3", title: "Getting Consistent", description: "Maintain a 3-day streak", icon: "🔥", category: "streak", requirement: 3, checkFn: "streak" },
  { id: "streak-7", title: "Week Warrior", description: "Maintain a 7-day streak", icon: "🔥", category: "streak", requirement: 7, checkFn: "streak" },
  { id: "streak-30", title: "Monthly Champion", description: "Maintain a 30-day streak", icon: "🏅", category: "streak", requirement: 30, checkFn: "streak" },

  // Multi-language
  { id: "bilingual", title: "Bilingual", description: "Start learning 2 languages", icon: "🌍", category: "social", requirement: 2, checkFn: "languageCount" },
  { id: "trilingual", title: "Trilingual", description: "Start learning all 3 languages", icon: "🌎", category: "social", requirement: 3, checkFn: "languageCount" },

  // Session milestones
  { id: "sessions-5", title: "Regular Visitor", description: "Complete 5 learning sessions", icon: "📅", category: "learning", requirement: 5, checkFn: "totalSessions" },
  { id: "sessions-25", title: "Committed Student", description: "Complete 25 learning sessions", icon: "🎯", category: "learning", requirement: 25, checkFn: "totalSessions" },

  // Topic milestones
  { id: "topics-3", title: "Topic Explorer", description: "Complete 3 lesson topics", icon: "📋", category: "mastery", requirement: 3, checkFn: "completedTopics" },
  { id: "topics-10", title: "Curriculum Champion", description: "Complete 10 lesson topics", icon: "🏫", category: "mastery", requirement: 10, checkFn: "completedTopics" },
];

interface AchievementState {
  unlocked: UnlockedAchievement[];

  // Actions
  checkAndUnlock: (stats: AchievementStats) => UnlockedAchievement[];
  isUnlocked: (achievementId: string) => boolean;
  getProgress: (achievementId: string, stats: AchievementStats) => number;
}

export interface AchievementStats {
  totalMessages: number;
  totalXP: number;
  totalVocab: number;
  masteredVocab: number;
  streak: number;
  languageCount: number;
  totalSessions: number;
  completedTopics: number;
}

function getStatValue(stats: AchievementStats, key: string): number {
  return (stats as unknown as Record<string, number>)[key] ?? 0;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      unlocked: [],

      checkAndUnlock: (stats) => {
        const currentUnlocked = get().unlocked;
        const unlockedIds = new Set(currentUnlocked.map((u) => u.achievementId));
        const newlyUnlocked: UnlockedAchievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
          if (unlockedIds.has(achievement.id)) continue;

          const value = getStatValue(stats, achievement.checkFn);
          if (value >= achievement.requirement) {
            const entry: UnlockedAchievement = {
              achievementId: achievement.id,
              unlockedAt: Date.now(),
            };
            newlyUnlocked.push(entry);
          }
        }

        if (newlyUnlocked.length > 0) {
          set({
            unlocked: [...currentUnlocked, ...newlyUnlocked],
          });
        }

        return newlyUnlocked;
      },

      isUnlocked: (achievementId) => {
        return get().unlocked.some((u) => u.achievementId === achievementId);
      },

      getProgress: (achievementId, stats) => {
        const achievement = ACHIEVEMENTS.find((a) => a.id === achievementId);
        if (!achievement) return 0;
        const value = getStatValue(stats, achievement.checkFn);
        return Math.min(1, value / achievement.requirement);
      },
    }),
    {
      name: "lingua-agents-achievements",
    }
  )
);
