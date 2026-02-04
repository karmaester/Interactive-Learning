"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, BookOpen, MessageCircle, Target, Zap, Flame,
  Library, Brain, CheckCircle2, Download, Upload, FileText, Trophy,
} from "lucide-react";
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
import {
  exportProfile,
  importProfile,
  downloadTextReport,
} from "@/lib/data-export";

const xpPerLevel: Record<CEFRLevel, number> = {
  A1: 200,
  A2: 500,
  B1: 1000,
  B2: 2000,
  C1: 4000,
  C2: 8000,
};

const CEFR_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function ProgressPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");

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
    .map((lang) => {
      const p = profiles[lang];
      if (!p) return null;
      const vStats = useVocabularyStore.getState().getStats(lang);
      return {
        lang,
        profile: p,
        vocabCount: vStats.total,
        levelIndex: CEFR_ORDER.indexOf(p.cefrLevel),
      };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.profile.totalXP - a.profile.totalXP);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const success = await importProfile(file);
    setImportStatus(success ? "success" : "error");
  };

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
                      {Math.round(
                        (vocabStats.mastered / vocabStats.total) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(vocabStats.mastered / vocabStats.total) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Language Leaderboard */}
        {allProfiles.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <CardTitle className="text-base">Language Leaderboard</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allProfiles.map(({ lang, profile: p, vocabCount }, idx) => {
                    const langConfig = LANGUAGE_CONFIG[lang];
                    const isActive = lang === activeLanguage;
                    const medal = idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉";
                    return (
                      <div
                        key={lang}
                        className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                          isActive
                            ? "bg-indigo-50 border border-indigo-100"
                            : "bg-slate-50"
                        }`}
                      >
                        <span className="text-lg w-6 text-center">{medal}</span>
                        <Avatar language={lang} expression="neutral" size="sm" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">
                              {langConfig.name}
                            </span>
                            <LevelBadge level={p.cefrLevel} size="sm" />
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                            <span>{p.totalXP} XP</span>
                            <span>{vocabCount} words</span>
                            <span>{p.streak} day streak</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Export / Import */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Data & Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={downloadTextReport}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors text-sm cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
                <button
                  onClick={exportProfile}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-colors text-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Backup Data</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors text-sm cursor-pointer"
                >
                  <Upload className="w-4 h-4" />
                  <span>Restore Backup</span>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              {importStatus === "error" && (
                <p className="text-xs text-red-500 mt-2">
                  Import failed. Please check the file format.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
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
