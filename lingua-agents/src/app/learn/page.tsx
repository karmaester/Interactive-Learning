"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  BookOpen,
  ArrowRight,
  Target,
  Library,
  BarChart3,
} from "lucide-react";
import { useUserStore } from "@/stores/user-store";
import { useChatStore } from "@/stores/chat-store";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { Avatar } from "@/components/characters/avatar";
import { LevelBadge } from "@/components/progress/level-badge";
import { DailyGoalRing } from "@/components/gamification/daily-goal";
import { StreakFlame } from "@/components/gamification/streak-flame";
import { Card, CardContent } from "@/components/ui/card";
import type { SessionType } from "@/lib/types";

export default function LearnDashboard() {
  const router = useRouter();
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const getActiveProfile = useUserStore((s) => s.getActiveProfile);
  const createSession = useChatStore((s) => s.createSession);
  const profile = getActiveProfile();

  if (!activeLanguage || !profile) return null;

  const config = LANGUAGE_CONFIG[activeLanguage];

  const activities = [
    {
      type: "conversation" as SessionType,
      icon: MessageCircle,
      title: "Practice",
      description: `Conversations, exercises, culture, and role-play scenarios with ${config.tutorName}.`,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      href: "/learn/practice",
    },
    {
      type: "lesson" as SessionType,
      icon: BookOpen,
      title: "Learn",
      description: `Structured lessons with grammar, vocabulary, and exercises at your ${profile.cefrLevel} level.`,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      href: "/learn/lesson",
    },
    {
      type: "vocabulary" as SessionType,
      icon: Library,
      title: "Vocabulary",
      description: `Learn new words with spaced repetition, build your personal dictionary, and review flashcards.`,
      color: "text-teal-600 bg-teal-50 border-teal-100",
      href: "/learn/vocabulary",
    },
    {
      type: "conversation" as SessionType,
      icon: BarChart3,
      title: "Progress",
      description: "Track your stats, achievements, and session history across all languages.",
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      href: "/progress",
    },
  ];

  const handleActivity = (activity: (typeof activities)[0]) => {
    createSession(activity.type);
    router.push(activity.href);
  };

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        {/* Welcome header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Avatar language={activeLanguage} expression="encouraging" size="lg" />
          <div>
            <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome back!
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Continue learning {config.name} with {config.tutorName}
            </p>
          </div>
        </motion.div>

        {/* Stats & Daily Goal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-[1fr_auto] gap-4 mb-8"
        >
          {/* Level & XP Card */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950 rounded-[var(--radius-md)] flex items-center justify-center">
                    <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-500 mb-1">
                      Your Level
                    </div>
                    <LevelBadge level={profile.cefrLevel} size="lg" />
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {profile.totalXP}
                    </div>
                    <div className="text-sm text-slate-400 dark:text-slate-500">Total XP</div>
                  </div>
                  <StreakFlame streak={profile.streak} size="md" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Goal Ring */}
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center">
              <div className="text-xs font-semibold text-slate-500 mb-1">Today</div>
              <DailyGoalRing size={100} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity cards */}
        <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-slate-800 dark:text-slate-200 mb-4">
          What would you like to do?
        </h2>
        <div className="space-y-3">
          {activities.map((activity, idx) => (
            <motion.div
              key={activity.type}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <button
                onClick={() => handleActivity(activity)}
                className="w-full text-left cursor-pointer"
              >
                <Card className="hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0 ${activity.color}`}
                      >
                        <activity.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold font-[family-name:var(--font-heading)] text-slate-800 dark:text-slate-200 mb-0.5">
                          {activity.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
