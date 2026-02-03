"use client";

import { useEffect } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { LANGUAGE_CONFIG } from "@/lib/types";

export default function ConversationPage() {
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);
  const createSession = useChatStore((s) => s.createSession);

  // Ensure we have a conversation session
  useEffect(() => {
    const activeSession = activeSessionId
      ? sessions[activeSessionId]
      : null;
    if (!activeSession || activeSession.type !== "conversation") {
      createSession("conversation");
    }
  }, [activeSessionId, sessions, createSession]);

  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-800">
          Conversation Practice
        </h1>
        {config && (
          <p className="text-sm text-slate-500">
            Chat freely with {config.tutorName} in {config.name}
          </p>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer sessionType="conversation" />
      </div>
    </div>
  );
}
