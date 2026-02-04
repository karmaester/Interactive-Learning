"use client";

import { useEffect } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { LANGUAGE_CONFIG } from "@/lib/types";

export default function ExercisePage() {
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
    if (!activeSession || activeSession.type !== "exercise") {
      createSession("exercise");
    }
  }, [activeSessionId, sessions, createSession]);

  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;

  const exerciseTypes = [
    "Fill in the blank exercise",
    "Multiple choice grammar quiz",
    "Error correction exercise",
    "Sentence transformation drill",
    "Vocabulary matching exercise",
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-800">
          Grammar & Exercises
        </h1>
        {config && profile && (
          <p className="text-sm text-slate-500">
            Practice {config.name} grammar at {profile.cefrLevel} level
          </p>
        )}

        {/* Quick exercise buttons */}
        <div className="flex flex-wrap gap-2 mt-3">
          {exerciseTypes.map((type) => (
            <QuickExerciseChip key={type} label={type} />
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer sessionType="exercise" />
      </div>
    </div>
  );
}

function QuickExerciseChip({ label }: { label: string }) {
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const addMessage = useChatStore((s) => s.addMessage);

  const handleClick = () => {
    if (!activeSessionId) return;
    addMessage(activeSessionId, "system", `Requested: ${label}`);
  };

  return (
    <button
      onClick={handleClick}
      className="text-xs px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
    >
      {label}
    </button>
  );
}
