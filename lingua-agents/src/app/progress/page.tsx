"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen, MessageCircle, Target, Zap, Flame,
  Library, Brain, CheckCircle2, Trophy, Lock,
  Clock, ChevronDown, ChevronUp, Search, BarChart3,
} from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { useChatStore } from "@/stores/chat-store";
import { useVocabularyStore } from "@/stores/vocabulary-store";
import {
  useAchievementStore,
  ACHIEVEMENTS,
  type AchievementStats,
} from "@/stores/achievement-store";
import { LANGUAGE_CONFIG, CEFR_DESCRIPTIONS } from "@/lib/types";
import type { Language, CEFRLevel, SessionType } from "@/lib/types";
import { Avatar } from "@/components/characters/avatar";
import { LevelBadge } from "@/components/progress/level-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { SkillRadar } from "@/components/progress/skill-radar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const xpPerLevel: Record<CEFRLevel, number> = {
  A1: 200, A2: 500, B1: 1000, B2: 2000, C1: 4000, C2: 8000,
};

const CEFR_ORDER: CEFRLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const CATEGORY_LABELS: Record<string, string> = {
  learning: "Learning", vocabulary: "Vocabulary", streak: "Streaks",
  social: "Explorer", mastery: "Mastery",
};

const SESSION_LABELS: Record<SessionType, string> = {
  conversation: "Conversation", lesson: "Lesson", assessment: "Assessment",
  vocabulary: "Vocabulary", culture: "Culture", exercise: "Exercise",
};

const SESSION_COLORS: Record<SessionType, string> = {
  conversation: "text-blue-600 bg-blue-50", lesson: "text-emerald-600 bg-emerald-50",
  assessment: "text-purple-600 bg-purple-50", vocabulary: "text-teal-600 bg-teal-50",
  culture: "text-rose-600 bg-rose-50", exercise: "text-orange-600 bg-orange-50",
};

const SESSION_ICONS: Record<SessionType, typeof MessageCircle> = {
  conversation: MessageCircle, lesson: BookOpen, assessment: Target,
  vocabulary: Library, culture: Library, exercise: BookOpen,
};

function formatDate(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString();
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const TABS = [
  { id: "overview", label: "Overview", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { id: "achievements", label: "Achievements", icon: <Trophy className="w-3.5 h-3.5" /> },
  { id: "history", label: "History", icon: <Clock className="w-3.5 h-3.5" /> },
];

export default function ProgressPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const profiles = useUserStore((s) => s.profiles);
  const sessions = useChatStore((s) => s.sessions);
  const vocabEntries = useVocabularyStore((s) => s.entries);
  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);
  const unlocked = useAchievementStore((s) => s.unlocked);
  const getProgress = useAchievementStore((s) => s.getProgress);

  useEffect(() => {
    if (!activeLanguage) {
      router.push("/");
    }
  }, [activeLanguage, router]);

  if (!activeLanguage) return null;

  const profile = profiles[activeLanguage];
  if (!profile) return null;

  const config = LANGUAGE_CONFIG[activeLanguage];

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Avatar language={activeLanguage} expression="neutral" size="lg" />
          <div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-slate-900 tracking-tight">
              Your Progress
            </h1>
            <p className="text-[var(--text-secondary)]">{config.name} Learning Journey</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        </motion.div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <OverviewTab
            activeLanguage={activeLanguage}
            profile={profile}
            profiles={profiles}
            sessions={sessions}
          />
        )}
        {activeTab === "achievements" && (
          <AchievementsTab
            profiles={profiles}
            sessions={sessions}
            vocabEntries={vocabEntries}
            checkAndUnlock={checkAndUnlock}
            unlocked={unlocked}
            getProgress={getProgress}
          />
        )}
        {activeTab === "history" && (
          <HistoryTab sessions={sessions} />
        )}
      </div>
    </div>
  );
}

/* ─── Overview Tab ─── */

function OverviewTab({
  activeLanguage,
  profile,
  profiles,
  sessions,
}: {
  activeLanguage: Language;
  profile: NonNullable<ReturnType<typeof useUserStore.getState>["profiles"]["en"]>;
  profiles: ReturnType<typeof useUserStore.getState>["profiles"];
  sessions: ReturnType<typeof useChatStore.getState>["sessions"];
}) {
  const xpTarget = xpPerLevel[profile.cefrLevel];
  const sessionCount = Object.values(sessions).filter((s) => s.messages.length > 0).length;
  const totalMessages = Object.values(sessions).reduce(
    (sum, s) => sum + s.messages.filter((m) => m.role === "user").length, 0
  );

  const vocabStats = useVocabularyStore.getState().getStats(activeLanguage);
  const skillScores = profile.skillScores ?? {
    grammar: 0, vocabulary: 0, conversation: 0, reading: 0, culture: 0,
  };

  const allProfiles = (["en", "es", "de"] as Language[])
    .map((lang) => {
      const p = profiles[lang];
      if (!p) return null;
      const vStats = useVocabularyStore.getState().getStats(lang);
      return { lang, profile: p, vocabCount: vStats.total };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.profile.totalXP - a.profile.totalXP);

  return (
    <>
      {/* Level progress */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-8">
            <ProgressRing value={profile.totalXP} max={xpTarget} size={100} strokeWidth={8}>
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">{profile.cefrLevel}</div>
                <div className="text-[10px] text-slate-400">{CEFR_DESCRIPTIONS[profile.cefrLevel]}</div>
              </div>
            </ProgressRing>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 mb-2">Level Progress</h3>
              <div className="flex items-center gap-2 mb-2">
                <LevelBadge level={profile.cefrLevel} size="sm" />
                <span className="text-xs text-slate-400">{profile.totalXP} / {xpTarget} XP</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((profile.totalXP / xpTarget) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Zap, label: "Total XP", value: profile.totalXP, color: "text-amber-600 bg-amber-50" },
          { icon: Flame, label: "Streak", value: `${profile.streak} days`, color: "text-orange-600 bg-orange-50" },
          { icon: MessageCircle, label: "Messages", value: totalMessages, color: "text-blue-600 bg-blue-50" },
          { icon: BookOpen, label: "Sessions", value: sessionCount, color: "text-emerald-600 bg-emerald-50" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <div className={`w-8 h-8 rounded-[var(--radius-sm)] ${stat.color} flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="text-lg font-bold text-slate-800">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skill Radar */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Skill Breakdown</CardTitle></CardHeader>
        <CardContent className="flex justify-center">
          <SkillRadar scores={skillScores} size={240} />
        </CardContent>
      </Card>

      {/* Vocabulary Stats */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Vocabulary</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Library, label: "Total Words", value: vocabStats.total, color: "text-indigo-500" },
              { icon: CheckCircle2, label: "Mastered", value: vocabStats.mastered, color: "text-emerald-500" },
              { icon: Brain, label: "Learning", value: vocabStats.learning, color: "text-blue-500" },
              { icon: Target, label: "Due for Review", value: vocabStats.dueForReview, color: "text-amber-500" },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 bg-slate-50 rounded-[var(--radius-md)]">
                <div className="flex justify-center mb-1"><s.icon className={`w-4 h-4 ${s.color}`} /></div>
                <div className="text-lg font-bold text-slate-800">{s.value}</div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>
          {vocabStats.total > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Overall Mastery</span>
                <span>{Math.round((vocabStats.mastered / vocabStats.total) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(vocabStats.mastered / vocabStats.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Language Leaderboard */}
      {allProfiles.length > 1 && (
        <Card className="mb-6">
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
                  <div key={lang} className={`flex items-center gap-3 p-3 rounded-[var(--radius-md)] transition-colors ${isActive ? "bg-indigo-50 border border-indigo-100" : "bg-slate-50"}`}>
                    <span className="text-lg w-6 text-center">{medal}</span>
                    <Avatar language={lang} expression="neutral" size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">{langConfig.name}</span>
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
      )}
    </>
  );
}

/* ─── Achievements Tab ─── */

function AchievementsTab({
  profiles,
  sessions,
  vocabEntries,
  checkAndUnlock,
  unlocked,
  getProgress,
}: {
  profiles: ReturnType<typeof useUserStore.getState>["profiles"];
  sessions: ReturnType<typeof useChatStore.getState>["sessions"];
  vocabEntries: ReturnType<typeof useVocabularyStore.getState>["entries"];
  checkAndUnlock: ReturnType<typeof useAchievementStore.getState>["checkAndUnlock"];
  unlocked: ReturnType<typeof useAchievementStore.getState>["unlocked"];
  getProgress: ReturnType<typeof useAchievementStore.getState>["getProgress"];
}) {
  const stats: AchievementStats = useMemo(() => {
    const langs = ["en", "es", "de"] as Language[];
    return {
      totalMessages: Object.values(sessions).reduce(
        (s, sess) => s + sess.messages.filter((m) => m.role === "user").length, 0
      ),
      totalXP: langs.reduce((s, l) => s + (profiles[l]?.totalXP ?? 0), 0),
      totalVocab: langs.reduce((s, l) => s + vocabEntries[l].length, 0),
      masteredVocab: langs.reduce(
        (s, l) => s + vocabEntries[l].filter((e) => e.mastery >= 0.8).length, 0
      ),
      streak: langs.reduce((s, l) => Math.max(s, profiles[l]?.streak ?? 0), 0),
      languageCount: langs.filter((l) => profiles[l] !== null).length,
      totalSessions: Object.values(sessions).filter((s) => s.messages.length > 0).length,
      completedTopics: langs.reduce((s, l) => s + (profiles[l]?.completedTopics?.length ?? 0), 0),
    };
  }, [profiles, sessions, vocabEntries]);

  useEffect(() => {
    checkAndUnlock(stats);
  }, [stats, checkAndUnlock]);

  const unlockedIds = new Set(unlocked.map((u) => u.achievementId));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[var(--text-secondary)]">
          {unlocked.length} / {ACHIEVEMENTS.length} unlocked
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-100 rounded-full h-3 mb-6">
        <div
          className="bg-gradient-to-r from-amber-400 to-amber-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${(unlocked.length / ACHIEVEMENTS.length) * 100}%` }}
        />
      </div>

      {Object.keys(CATEGORY_LABELS).map((cat) => {
        const catAchievements = ACHIEVEMENTS.filter((a) => a.category === cat);
        if (catAchievements.length === 0) return null;
        return (
          <div key={cat} className="mb-6">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              {CATEGORY_LABELS[cat]}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catAchievements.map((achievement) => {
                const isUnlocked = unlockedIds.has(achievement.id);
                const progress = getProgress(achievement.id, stats);
                return (
                  <Card
                    key={achievement.id}
                    className={cn("transition-all", isUnlocked ? "border-amber-200 bg-amber-50/50" : "opacity-70")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={cn("w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-lg flex-shrink-0", isUnlocked ? "bg-amber-100" : "bg-slate-100")}>
                          {isUnlocked ? achievement.icon : <Lock className="w-4 h-4 text-slate-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn("text-sm font-semibold", isUnlocked ? "text-slate-800" : "text-slate-500")}>
                            {achievement.title}
                          </h4>
                          <p className="text-xs text-slate-400 mt-0.5">{achievement.description}</p>
                          {!isUnlocked && (
                            <div className="mt-2">
                              <div className="w-full bg-slate-100 rounded-full h-1.5">
                                <div className="bg-indigo-400 h-1.5 rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
                              </div>
                              <span className="text-[10px] text-slate-400">{Math.round(progress * 100)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ─── History Tab ─── */

function HistoryTab({
  sessions,
}: {
  sessions: ReturnType<typeof useChatStore.getState>["sessions"];
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<SessionType | "all">("all");
  const [search, setSearch] = useState("");

  const sortedSessions = useMemo(() => {
    return Object.values(sessions)
      .filter((s) => s.messages.length > 0)
      .filter((s) => filter === "all" || s.type === filter)
      .filter((s) => {
        if (!search) return true;
        const lower = search.toLowerCase();
        return s.messages.some((m) => m.content.toLowerCase().includes(lower));
      })
      .sort((a, b) => b.startedAt - a.startedAt);
  }, [sessions, filter, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof sortedSessions> = {};
    for (const session of sortedSessions) {
      const key = formatDate(session.startedAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(session);
    }
    return groups;
  }, [sortedSessions]);

  return (
    <>
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-[var(--radius-md)] bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "text-xs px-3 py-1.5 rounded-[var(--radius-full)] border transition-colors cursor-pointer",
            filter === "all" ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
          )}
        >
          All ({sortedSessions.length})
        </button>
        {(Object.keys(SESSION_LABELS) as SessionType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              "text-xs px-3 py-1.5 rounded-[var(--radius-full)] border transition-colors cursor-pointer",
              filter === type ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            )}
          >
            {SESSION_LABELS[type]}
          </button>
        ))}
      </div>

      {/* Sessions */}
      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Clock className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p>No sessions yet. Start a conversation to see your history here.</p>
        </div>
      )}

      {Object.entries(grouped).map(([dateLabel, dateSessions]) => (
        <div key={dateLabel} className="mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">{dateLabel}</h3>
          <div className="space-y-2">
            {dateSessions.map((session) => {
              const Icon = SESSION_ICONS[session.type] || MessageCircle;
              const color = SESSION_COLORS[session.type] || SESSION_COLORS.conversation;
              const isExpanded = expandedId === session.id;
              const userMsgCount = session.messages.filter((m) => m.role === "user").length;
              const firstUserMsg = session.messages.find((m) => m.role === "user");

              return (
                <Card key={session.id} className="overflow-hidden">
                  <button onClick={() => setExpandedId(isExpanded ? null : session.id)} className="w-full text-left cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0 ${color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">{SESSION_LABELS[session.type]}</span>
                            {session.topic && <span className="text-xs text-slate-400">&middot; {session.topic}</span>}
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            {firstUserMsg ? firstUserMsg.content.slice(0, 60) : "No messages"}
                            {(firstUserMsg?.content.length ?? 0) > 60 ? "..." : ""}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-slate-400">{userMsgCount} msgs &middot; {formatTime(session.startedAt)}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>
                    </CardContent>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 px-4 py-3 bg-slate-50/50 max-h-64 overflow-y-auto">
                      {session.messages.slice(0, 20).map((msg) => (
                        <div key={msg.id} className={cn("text-xs py-1.5", msg.role === "user" ? "text-indigo-700" : msg.role === "system" ? "text-slate-400 italic" : "text-slate-600")}>
                          <span className="font-medium">{msg.role === "user" ? "You" : msg.role === "system" ? "System" : "Tutor"}:</span>{" "}
                          {msg.content.slice(0, 200)}{msg.content.length > 200 ? "..." : ""}
                        </div>
                      ))}
                      {session.messages.length > 20 && (
                        <p className="text-[10px] text-slate-400 mt-1">+ {session.messages.length - 20} more messages</p>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
