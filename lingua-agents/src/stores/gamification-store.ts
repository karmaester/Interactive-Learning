"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CEFRLevel } from "@/lib/types";

export interface XPGainEvent {
  id: string;
  amount: number;
  timestamp: number;
}

export interface AchievementEvent {
  id: string;
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  timestamp: number;
}

export interface LevelUpEvent {
  id: string;
  oldLevel: CEFRLevel;
  newLevel: CEFRLevel;
  timestamp: number;
}

interface DailyStats {
  date: string; // YYYY-MM-DD
  messagesSent: number;
  wordsReviewed: number;
}

interface GamificationState {
  // Event queues (transient - not persisted)
  xpGainQueue: XPGainEvent[];
  achievementQueue: AchievementEvent[];
  levelUpEvent: LevelUpEvent | null;

  // Daily stats (persisted)
  dailyStats: DailyStats;

  // Actions
  pushXPGain: (amount: number) => void;
  popXPGain: () => void;
  pushAchievement: (event: Omit<AchievementEvent, "id" | "timestamp">) => void;
  popAchievement: () => void;
  triggerLevelUp: (oldLevel: CEFRLevel, newLevel: CEFRLevel) => void;
  clearLevelUp: () => void;
  recordMessage: () => void;
  recordWordReview: () => void;
  getDailyStats: () => DailyStats;
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

function freshDailyStats(): DailyStats {
  return { date: getTodayString(), messagesSent: 0, wordsReviewed: 0 };
}

let eventCounter = 0;

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xpGainQueue: [],
      achievementQueue: [],
      levelUpEvent: null,
      dailyStats: freshDailyStats(),

      pushXPGain: (amount) => {
        const event: XPGainEvent = {
          id: `xp-${Date.now()}-${++eventCounter}`,
          amount,
          timestamp: Date.now(),
        };
        set((state) => ({
          xpGainQueue: [...state.xpGainQueue, event],
        }));
      },

      popXPGain: () => {
        set((state) => ({
          xpGainQueue: state.xpGainQueue.slice(1),
        }));
      },

      pushAchievement: (event) => {
        const full: AchievementEvent = {
          ...event,
          id: `ach-${Date.now()}-${++eventCounter}`,
          timestamp: Date.now(),
        };
        set((state) => ({
          achievementQueue: [...state.achievementQueue, full],
        }));
      },

      popAchievement: () => {
        set((state) => ({
          achievementQueue: state.achievementQueue.slice(1),
        }));
      },

      triggerLevelUp: (oldLevel, newLevel) => {
        set({
          levelUpEvent: {
            id: `lvl-${Date.now()}`,
            oldLevel,
            newLevel,
            timestamp: Date.now(),
          },
        });
      },

      clearLevelUp: () => {
        set({ levelUpEvent: null });
      },

      recordMessage: () => {
        const today = getTodayString();
        set((state) => {
          const stats = state.dailyStats.date === today
            ? state.dailyStats
            : freshDailyStats();
          return {
            dailyStats: { ...stats, messagesSent: stats.messagesSent + 1 },
          };
        });
      },

      recordWordReview: () => {
        const today = getTodayString();
        set((state) => {
          const stats = state.dailyStats.date === today
            ? state.dailyStats
            : freshDailyStats();
          return {
            dailyStats: { ...stats, wordsReviewed: stats.wordsReviewed + 1 },
          };
        });
      },

      getDailyStats: () => {
        const state = get();
        const today = getTodayString();
        if (state.dailyStats.date !== today) {
          return freshDailyStats();
        }
        return state.dailyStats;
      },
    }),
    {
      name: "lingua-agents-gamification",
      partialize: (state) => ({
        dailyStats: state.dailyStats,
      }),
    }
  )
);
