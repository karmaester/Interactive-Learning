"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, MessageCircle, Target, Zap, Flame, Library, Brain, CheckCircle2 } from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { useChatStore } from "@/stores/chat-store";
import { useVocabularyStore } from "@/stores/vocabulary-store";
import { LANGUAGE_CONFIG, CEFR_DESCRIPTIONS } from "@/lib/types";
import type { Language, CEFRLevel } from "@/lib/types";
import { Avatar } from "@/components/characters/avatar";
import { LevelBadge } from "@/components/progress/level-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SkillRadar } from "@/components/progress/skill-radar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const xpPerLevel: Record<CEFRLevel, number> = {
  A1: 200,
  A2: 500,
  B1: 1000,
  B2: 2000,
  C1: 4000,
  C2: 8000,
};

export default function ProgressPage() {
  const router = useRouter();
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const profiles = useUserStore((s) => s.profiles);
  const sessions = useChatStore((s) => s.sessions);

  useEffect(() => {
    if (!activeLanguage) {
      router.push("/");
    }
  }, [activeLanguage, router]);

  if (!activeLanguage) return null;

  const profile = profiles[activeLanguage];
  if (!profile) return null;

  const config = LANGUAGE_CONFIG[activeLanguage];
  const xpTarget = xpPerLevel[profile.cefrLevel];
  const sessionCount = Object.values(sessions).filter(
    (s) => s.messages.length > 0
  ).length;
  const totalMessages = Object.values(sessions).reduce(
    (sum, s) => sum + s.messages.filter((m) => m.role === "user").length,
    0
  );

  const vocabStats = useVocabularyStore.getState().getStats(activeLanguage);
  const skillScores = profile.skillScores ?? {
    grammar: 0,
    vocabulary: 0,
    conversation: 0,
    reading: 0,
    culture: 0,
  };

  const allProfiles = (["en", "es", "de"] as Language[])
    .map((lang) => ({ lang, profile: profiles[lang] }))
    .filter((p) => p.profile !== null);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/learn")}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Avatar language={activeLanguage} expression="neutral" size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Your Progress
            </h1>
            <p className="text-slate-500">{config.name} Learning Journey</p>
          </div>
        </motion.div>

        {/* Level progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-8">
                <ProgressRing
                  value={profile.totalXP}
                  max={xpTarget}
                  size={100}
                  strokeWidth={8}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">
                      {profile.cefrLevel}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {CEFR_DESCRIPTIONS[profile.cefrLevel]}
                    </div>
                  </div>
                </ProgressRing>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-2">
                    Level Progress
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <LevelBadge level={profile.cefrLevel} size="sm" />
                    <span className="text-xs text-slate-400">
                      {profile.totalXP} / {xpTarget} XP
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (profile.totalXP / xpTarget) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
        >
          {[
            {
              icon: Zap,
              label: "Total XP",
              value: profile.totalXP,
              color: "text-amber-600 bg-amber-50",
            },
            {
              icon: Flame,
              label: "Streak",
              value: `${profile.streak} days`,
              color: "text-orange-600 bg-orange-50",
            },
            {
              icon: MessageCircle,
              label: "Messages",
              value: totalMessages,
              color: "text-blue-600 bg-blue-50",
            },
            {
              icon: BookOpen,
              label: "Sessions",
              value: sessionCount,
              color: "text-emerald-600 bg-emerald-50",
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 text-center">
                <div
                  className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center mx-auto mb-2`}
                >
                  <stat.icon className="w-4 h-4" />
                </div>
                <div className="text-lg font-bold text-slate-800">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Skill Radar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Skill Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SkillRadar scores={skillScores} size={240} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Vocabulary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="flex justify-center mb-1">
                    <Library className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {vocabStats.total}
                  </div>
                  <div className="text-xs text-slate-400">Total Words</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="flex justify-center mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {vocabStats.mastered}
                  </div>
                  <div className="text-xs text-slate-400">Mastered</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="flex justify-center mb-1">
                    <Brain className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {vocabStats.learning}
                  </div>
                  <div className="text-xs text-slate-400">Learning</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className="flex justify-center mb-1">
                    <Target className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {vocabStats.dueForReview}
                  </div>
                  <div className="text-xs text-slate-400">Due for Review</div>
                </div>
              </div>
              {vocabStats.total > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Overall Mastery</span>
                    <span>
                      {vocabStats.total > 0
                        ? Math.round(
                            (vocabStats.mastered / vocabStats.total) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          vocabStats.total > 0
                            ? (vocabStats.mastered / vocabStats.total) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* All languages */}
        {allProfiles.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">All Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allProfiles.map(({ lang, profile: p }) => {
                    if (!p) return null;
                    const langConfig = LANGUAGE_CONFIG[lang];
                    return (
                      <div
                        key={lang}
                        className="flex items-center gap-3 p-3 rounded-xl bg-slate-50"
                      >
                        <Avatar language={lang} expression="neutral" size="sm" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-700">
                            {langConfig.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {p.totalXP} XP
                          </div>
                        </div>
                        <LevelBadge level={p.cefrLevel} size="sm" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button onClick={() => router.push("/learn/conversation")}>
            Continue Practicing
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
