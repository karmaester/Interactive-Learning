"use client";

import { useEffect, useCallback } from "react";
import { ChatContainer } from "@/components/chat/chat-container";
import { TopicSelector } from "@/components/topic-selector";
import { ScenarioSelector, type Scenario } from "@/components/scenario-selector";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { LANGUAGE_CONFIG } from "@/lib/types";

const CONVERSATION_TOPICS: Record<string, string[]> = {
  en: [
    "Daily routine",
    "Ordering at a restaurant",
    "Asking for directions",
    "Job interview",
    "Travel stories",
    "Hobbies and interests",
    "Weekend plans",
    "Shopping",
  ],
  es: [
    "La rutina diaria",
    "Pedir en un restaurante",
    "Pedir direcciones",
    "Entrevista de trabajo",
    "Historias de viaje",
    "Pasatiempos",
    "Planes del fin de semana",
    "De compras",
  ],
  de: [
    "Tagesablauf",
    "Im Restaurant bestellen",
    "Nach dem Weg fragen",
    "Vorstellungsgespräch",
    "Reisegeschichten",
    "Hobbys und Interessen",
    "Wochenendpläne",
    "Einkaufen",
  ],
};

export default function ConversationPage() {
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);
  const createSession = useChatStore((s) => s.createSession);
  const addMessage = useChatStore((s) => s.addMessage);

  useEffect(() => {
    const activeSession = activeSessionId
      ? sessions[activeSessionId]
      : null;
    if (!activeSession || activeSession.type !== "conversation") {
      createSession("conversation");
    }
  }, [activeSessionId, sessions, createSession]);

  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;
  const topics = activeLanguage
    ? CONVERSATION_TOPICS[activeLanguage] || CONVERSATION_TOPICS.en
    : [];

  const handleTopicSelect = useCallback(
    (topic: string) => {
      if (!activeSessionId) return;
      addMessage(activeSessionId, "user", `Let's talk about: ${topic}`);
    },
    [activeSessionId, addMessage]
  );

  const handleScenarioSelect = useCallback(
    (scenario: Scenario) => {
      if (!activeSessionId) return;
      addMessage(activeSessionId, "user", scenario.prompt);
    },
    [activeSessionId, addMessage]
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-800">
          Conversation Practice
        </h1>
        {config && (
          <p className="text-sm text-slate-500 mb-3">
            Chat freely with {config.tutorName} in {config.name}
          </p>
        )}
        {activeLanguage && (
          <div className="space-y-2">
            <TopicSelector
              language={activeLanguage}
              suggestions={topics}
              onSelect={handleTopicSelect}
            />
            <ScenarioSelector
              language={activeLanguage}
              onSelect={handleScenarioSelect}
            />
          </div>
        )}
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer sessionType="conversation" />
      </div>
    </div>
  );
}
