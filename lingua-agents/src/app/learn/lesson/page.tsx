"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ChatContainer } from "@/components/chat/chat-container";
import { TopicSelector } from "@/components/topic-selector";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { topicsByLevel } from "@/agents/prompts/curriculum";
import type { CEFRLevel } from "@/lib/types";
import { CheckCircle2, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { LevelBadge } from "@/components/progress/level-badge";

export default function LessonPage() {
  const router = useRouter();
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const getActiveProfile = useUserStore((s) => s.getActiveProfile);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);
  const createSession = useChatStore((s) => s.createSession);

  const profile = getActiveProfile();

  useEffect(() => {
    const activeSession = activeSessionId
      ? sessions[activeSessionId]
      : null;
    if (!activeSession || activeSession.type !== "lesson") {
      createSession("lesson");
    }
  }, [activeSessionId, sessions, createSession]);

  const addMessage = useChatStore((s) => s.addMessage);

  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;
  const level = profile?.cefrLevel || "A1";
  const topics = topicsByLevel[level as CEFRLevel] || [];
  const completedTopics = profile?.completedTopics || [];
  const remainingTopics = topics.filter((t) => !completedTopics.includes(t));

  const handleTopicSelect = useCallback(
    (topic: string) => {
      if (!activeSessionId) return;
      addMessage(activeSessionId, "user", `Start a lesson about: ${topic}`);
    },
    [activeSessionId, addMessage]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header with topic selection + assessment shortcut */}
      <div className="border-b border-slate-200 bg-[var(--surface-primary)] px-6 py-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-slate-800">
            Learn
          </h1>

          {/* Assessment shortcut */}
          <button
            onClick={() => router.push("/learn/assessment")}
            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-[var(--radius-sm)] bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer font-medium"
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            Take Assessment
          </button>
        </div>

        {config && profile && (
          <div className="flex items-center gap-2 mb-3">
            <p className="text-sm text-[var(--text-secondary)]">
              {config.name} lessons with {config.tutorName}
            </p>
            <LevelBadge level={profile.cefrLevel} size="sm" />
            <span className="text-xs text-slate-400">
              {completedTopics.length}/{topics.length} completed
            </span>
          </div>
        )}

        {/* Completed topic chips */}
        {completedTopics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {completedTopics.map((topic) => (
              <TopicChip key={topic} topic={topic} completed={true} />
            ))}
          </div>
        )}

        {/* Topic selector with custom option */}
        {activeLanguage && (
          <TopicSelector
            language={activeLanguage}
            suggestions={remainingTopics}
            onSelect={handleTopicSelect}
          />
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer sessionType="lesson" />
      </div>
    </div>
  );
}

function TopicChip({
  topic,
  completed,
}: {
  topic: string;
  completed: boolean;
}) {
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const addMessage = useChatStore((s) => s.addMessage);

  const handleClick = () => {
    if (!activeSessionId || completed) return;
    addMessage(
      activeSessionId,
      "system",
      `Selected topic: ${topic}`
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={completed}
      className={cn(
        "flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition-colors cursor-pointer",
        completed
          ? "bg-emerald-50 text-emerald-600 border-emerald-200 cursor-default"
          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
      )}
    >
      {completed && <CheckCircle2 className="w-3 h-3" />}
      {topic}
    </button>
  );
}
