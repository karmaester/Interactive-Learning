"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { useChatStore } from "@/stores/chat-store";
import { useVocabularyStore } from "@/stores/vocabulary-store";
import {
  useAchievementStore,
  ACHIEVEMENTS,
  type AchievementStats,
} from "@/stores/achievement-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  learning: "Learning",
  vocabulary: "Vocabulary",
  streak: "Streaks",
  social: "Explorer",
  mastery: "Mastery",
};

export default function AchievementsPage() {
  const profiles = useUserStore((s) => s.profiles);
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const sessions = useChatStore((s) => s.sessions);
  const vocabEntries = useVocabularyStore((s) => s.entries);
  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);
  const unlocked = useAchievementStore((s) => s.unlocked);
  const getProgress = useAchievementStore((s) => s.getProgress);

  const stats: AchievementStats = useMemo(() => {
    const langs = (["en", "es", "de"] as Language[]);
    const languageCount = langs.filter((l) => profiles[l] !== null).length;
    const totalXP = langs.reduce((s, l) => s + (profiles[l]?.totalXP ?? 0), 0);
    const streak = langs.reduce((s, l) => Math.max(s, profiles[l]?.streak ?? 0), 0);
    const completedTopics = langs.reduce(
      (s, l) => s + (profiles[l]?.completedTopics?.length ?? 0),
      0
    );

    const totalMessages = Object.values(sessions).reduce(
      (s, sess) => s + sess.messages.filter((m) => m.role === "user").length,
      0
    );
    const totalSessions = Object.values(sessions).filter(
      (s) => s.messages.length > 0
    ).length;

    const totalVocab = langs.reduce((s, l) => s + vocabEntries[l].length, 0);
    const masteredVocab = langs.reduce(
      (s, l) => s + vocabEntries[l].filter((e) => e.mastery >= 0.8).length,
      0
    );

    return {
      totalMessages,
      totalXP,
      totalVocab,
      masteredVocab,
      streak,
      languageCount,
      totalSessions,
      completedTopics,
    };
  }, [profiles, sessions, vocabEntries]);

  // Check for new achievements on mount and when stats change
  useEffect(() => {
    checkAndUnlock(stats);
  }, [stats, checkAndUnlock]);

  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

  const categories = Object.keys(CATEGORY_LABELS);

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <Trophy className="w-6 h-6 text-amber-500" />
          <h1 className="text-2xl font-bold text-slate-900">Achievements</h1>
        </motion.div>
        <p className="text-slate-500 mb-6">
          {unlocked.length} / {ACHIEVEMENTS.length} unlocked
        </p>

        {/* Summary bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%`,
              }}
            />
          </div>
        </motion.div>

        {/* By category */}
        {categories.map((cat, catIdx) => {
          const catAchievements = ACHIEVEMENTS.filter(
            (a) => a.category === cat
          );
          if (catAchievements.length === 0) return null;

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + catIdx * 0.05 }}
              className="mb-6"
            >
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {CATEGORY_LABELS[cat]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {catAchievements.map((achievement) => {
                  const isUnlocked = unlockedIds.has(achievement.id);
                  const progress = getProgress(achievement.id, stats);

                  return (
                    <Card
                      key={achievement.id}
                      className={cn(
                        "transition-all",
                        isUnlocked
                          ? "border-amber-200 bg-amber-50/50"
                          : "opacity-70"
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0",
                              isUnlocked
                                ? "bg-amber-100"
                                : "bg-slate-100"
                            )}
                          >
                            {isUnlocked ? (
                              achievement.icon
                            ) : (
                              <Lock className="w-4 h-4 text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className={cn(
                                "text-sm font-semibold",
                                isUnlocked
                                  ? "text-slate-800"
                                  : "text-slate-500"
                              )}
                            >
                              {achievement.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {achievement.description}
                            </p>
                            {!isUnlocked && (
                              <div className="mt-2">
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                  <div
                                    className="bg-indigo-400 h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${progress * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {Math.round(progress * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
