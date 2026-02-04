"use client";

import { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Dumbbell, Globe, Theater } from "lucide-react";
import { ChatContainer } from "@/components/chat/chat-container";
import { TopicSelector } from "@/components/topic-selector";
import { ScenarioSelector, type Scenario } from "@/components/scenario-selector";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { LANGUAGE_CONFIG } from "@/lib/types";
import { culturalTopics } from "@/agents/prompts/culture";
import { cn } from "@/lib/utils";
import type { Language, SessionType } from "@/lib/types";

type PracticeMode = "conversation" | "exercise" | "culture" | "scenarios";

const MODES: { id: PracticeMode; label: string; icon: typeof MessageCircle; sessionType: SessionType }[] = [
  { id: "conversation", label: "Conversation", icon: MessageCircle, sessionType: "conversation" },
  { id: "exercise", label: "Exercises", icon: Dumbbell, sessionType: "exercise" },
  { id: "culture", label: "Culture", icon: Globe, sessionType: "culture" },
  { id: "scenarios", label: "Scenarios", icon: Theater, sessionType: "conversation" },
];

const CONVERSATION_TOPICS: Record<string, string[]> = {
  en: ["Daily routine", "Ordering at a restaurant", "Asking for directions", "Job interview", "Travel stories", "Hobbies and interests", "Weekend plans", "Shopping"],
  es: ["La rutina diaria", "Pedir en un restaurante", "Pedir direcciones", "Entrevista de trabajo", "Historias de viaje", "Pasatiempos", "Planes del fin de semana", "De compras"],
  de: ["Tagesablauf", "Im Restaurant bestellen", "Nach dem Weg fragen", "Vorstellungsgespräch", "Reisegeschichten", "Hobbys und Interessen", "Wochenendpläne", "Einkaufen"],
};

const EXERCISE_TYPES = [
  "Fill in the blank exercise",
  "Multiple choice grammar quiz",
  "Error correction exercise",
  "Sentence transformation drill",
  "Vocabulary matching exercise",
];

export default function PracticePage() {
  const [mode, setMode] = useState<PracticeMode>("conversation");
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const getActiveProfile = useUserStore((s) => s.getActiveProfile);
  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);
  const createSession = useChatStore((s) => s.createSession);
  const addMessage = useChatStore((s) => s.addMessage);

  const profile = getActiveProfile();
  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;
  const currentMode = MODES.find((m) => m.id === mode)!;

  // Ensure there's an active session matching the current mode's session type
  useEffect(() => {
    const activeSession = activeSessionId ? sessions[activeSessionId] : null;
    if (!activeSession || activeSession.type !== currentMode.sessionType) {
      createSession(currentMode.sessionType);
    }
  }, [activeSessionId, sessions, createSession, currentMode.sessionType]);

  const handleTopicSelect = useCallback(
    (topic: string) => {
      if (!activeSessionId) return;
      const prefix = mode === "conversation" ? "Let's talk about" : mode === "culture" ? "Tell me about" : "Requested";
      addMessage(activeSessionId, "user", `${prefix}: ${topic}`);
    },
    [activeSessionId, addMessage, mode]
  );

  const handleExerciseChip = useCallback(
    (label: string) => {
      if (!activeSessionId) return;
      addMessage(activeSessionId, "system", `Requested: ${label}`);
    },
    [activeSessionId, addMessage]
  );

  const handleScenarioSelect = useCallback(
    (scenario: Scenario) => {
      if (!activeSessionId) return;
      addMessage(activeSessionId, "user", scenario.prompt);
      setMode("conversation");
    },
    [activeSessionId, addMessage]
  );

  const handleModeChange = (newMode: PracticeMode) => {
    setMode(newMode);
    // Create a new session for the mode's session type
    if (newMode !== "scenarios") {
      const newSessionType = MODES.find((m) => m.id === newMode)!.sessionType;
      createSession(newSessionType);
    }
  };

  // Get context-specific topics/chips
  const getTopicsForMode = () => {
    if (!activeLanguage) return [];
    if (mode === "conversation") return CONVERSATION_TOPICS[activeLanguage] || CONVERSATION_TOPICS.en;
    if (mode === "culture") return culturalTopics[activeLanguage as Language]?.slice(0, 6) || [];
    return [];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with mode pills */}
      <div className="border-b border-slate-200 bg-[var(--surface-primary)] px-6 py-4">
        <h1 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-slate-800 mb-3">
          Practice
        </h1>

        {/* Mode selector pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-3 py-2 rounded-[var(--radius-sm)] font-medium transition-all duration-150 cursor-pointer",
                  isActive
                    ? "bg-indigo-600 text-white shadow-[var(--shadow-sm)]"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Context description */}
        {config && profile && (
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            {mode === "conversation" && `Chat freely with ${config.tutorName} in ${config.name}`}
            {mode === "exercise" && `Practice ${config.name} grammar at ${profile.cefrLevel} level`}
            {mode === "culture" && `Explore ${config.name} culture with ${config.tutorName}`}
            {mode === "scenarios" && `Role-play real-world scenarios in ${config.name}`}
          </p>
        )}

        {/* Context-specific selectors */}
        {mode === "scenarios" && activeLanguage && (
          <ScenarioSelector
            language={activeLanguage}
            onSelect={handleScenarioSelect}
            className="mb-2"
          />
        )}

        {(mode === "conversation" || mode === "culture") && activeLanguage && (
          <TopicSelector
            language={activeLanguage}
            suggestions={getTopicsForMode()}
            onSelect={handleTopicSelect}
          />
        )}

        {mode === "exercise" && (
          <div className="flex flex-wrap gap-2">
            {EXERCISE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleExerciseChip(type)}
                className="text-xs px-3 py-1.5 rounded-[var(--radius-full)] bg-slate-50 text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors cursor-pointer"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-hidden">
        {mode === "scenarios" ? (
          <div className="flex items-center justify-center h-full text-center p-8">
            <div>
              <Theater className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-slate-600 mb-2">
                Choose a Scenario
              </h3>
              <p className="text-sm text-[var(--text-tertiary)] max-w-sm mx-auto">
                Select a role-play scenario above to start a guided conversation practice. Once selected, you&apos;ll switch to conversation mode.
              </p>
            </div>
          </div>
        ) : (
          <ChatContainer sessionType={currentMode.sessionType} />
        )}
      </div>
    </div>
  );
}
