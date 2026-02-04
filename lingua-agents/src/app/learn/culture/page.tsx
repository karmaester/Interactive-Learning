"use client";

import { useEffect } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { culturalTopics } from "@/agents/prompts/culture";
import type { Language } from "@/lib/types";

export default function CulturePage() {
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);
  const createSession = useChatStore((s) => s.createSession);

  useEffect(() => {
    const activeSession = activeSessionId
      ? sessions[activeSessionId]
      : null;
    if (!activeSession || activeSession.type !== "culture") {
      createSession("culture");
    }
  }, [activeSessionId, sessions, createSession]);

  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;
  const topics = activeLanguage
    ? culturalTopics[activeLanguage as Language] || []
    : [];

  return (
    <div className="h-full flex flex-col">
      {/* Header with topic chips */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-800">
          Cultural Insights
        </h1>
        {config && (
          <p className="text-sm text-slate-500">
            Explore {config.name} culture with {config.tutorName} — idioms,
            traditions, and social norms
          </p>
        )}

        {/* Topic suggestions */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {topics.slice(0, 5).map((topic) => (
              <TopicChip key={topic} topic={topic} />
            ))}
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer sessionType="culture" />
      </div>
    </div>
  );
}

function TopicChip({ topic }: { topic: string }) {
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const addMessage = useChatStore((s) => s.addMessage);

  const handleClick = () => {
    if (!activeSessionId) return;
    // This doesn't send to the API — just a UI hint. The user
    // will see it as a suggested topic to type about.
    // We add a system message as a visual hint
    addMessage(
      activeSessionId,
      "system",
      `Suggested topic: ${topic}`
    );
  };

  return (
    <button
      onClick={handleClick}
      className="text-xs px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
    >
      {topic}
    </button>
  );
}
