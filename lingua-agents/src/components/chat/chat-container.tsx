"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { InputBar } from "./input-bar";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { useVocabularyStore } from "@/stores/vocabulary-store";
import { useAchievementStore, ACHIEVEMENTS } from "@/stores/achievement-store";
import { useGamificationStore } from "@/stores/gamification-store";
import { XPFloat } from "@/components/gamification/xp-float";
import { EmptyChat } from "@/components/illustrations/empty-chat";
import type { SessionType } from "@/lib/types";
import type { AchievementStats } from "@/stores/achievement-store";

interface ChatContainerProps {
  sessionType: SessionType;
  apiEndpoint?: string;
}

const emptyStateConfig: Record<string, { icon: string; title: string; subtitle: string; accentColor: string }> = {
  conversation: {
    icon: "💬",
    title: "Start a conversation",
    subtitle: "Type anything to begin chatting with your tutor",
    accentColor: "#3B82F6",
  },
  assessment: {
    icon: "📝",
    title: "Ready for your placement test?",
    subtitle: 'Type "start" to begin the placement test',
    accentColor: "#8B5CF6",
  },
  lesson: {
    icon: "📚",
    title: "Start a structured lesson",
    subtitle: 'Say "start a lesson" or ask to learn about a specific topic',
    accentColor: "#10B981",
  },
  vocabulary: {
    icon: "📖",
    title: "Build your vocabulary",
    subtitle: 'Ask for "new words about food" or "review my vocabulary"',
    accentColor: "#14B8A6",
  },
  culture: {
    icon: "🌍",
    title: "Explore the culture",
    subtitle: "Ask about traditions, idioms, etiquette, or cultural differences",
    accentColor: "#F43F5E",
  },
  exercise: {
    icon: "✏️",
    title: "Practice exercises",
    subtitle: "Ask for grammar exercises, fill-in-the-blank, or drills",
    accentColor: "#F97316",
  },
};

const placeholderConfig: Record<string, string> = {
  conversation: "Type your message...",
  assessment: "Type your answer...",
  lesson: "Respond to continue the lesson...",
  vocabulary: "Type a topic or answer...",
  culture: "Ask a cultural question...",
  exercise: "Type your answer...",
};

export function ChatContainer({
  sessionType,
  apiEndpoint = "/api/chat",
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const getActiveProfile = useUserStore((s) => s.getActiveProfile);
  const addXP = useUserStore((s) => s.addXP);
  const updateSkill = useUserStore((s) => s.updateSkill);

  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);
  const createSession = useChatStore((s) => s.createSession);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateLastAssistantMessage = useChatStore(
    (s) => s.updateLastAssistantMessage
  );

  const getKnownWords = useVocabularyStore((s) => s.getKnownWords);

  const checkAndUnlock = useAchievementStore((s) => s.checkAndUnlock);

  const pushXPGain = useGamificationStore((s) => s.pushXPGain);
  const pushAchievement = useGamificationStore((s) => s.pushAchievement);
  const recordMessage = useGamificationStore((s) => s.recordMessage);

  const activeSession = activeSessionId ? sessions[activeSessionId] : null;
  const messages = activeSession?.messages || [];
  const profile = getActiveProfile();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Ensure session exists
  useEffect(() => {
    if (!activeSessionId && activeLanguage) {
      createSession(sessionType);
    }
  }, [activeSessionId, activeLanguage, sessionType, createSession]);

  // Map sessionType to skill for XP tracking
  const skillMap: Record<string, "grammar" | "vocabulary" | "conversation" | "reading" | "culture"> = {
    conversation: "conversation",
    lesson: "grammar",
    vocabulary: "vocabulary",
    culture: "culture",
    exercise: "grammar",
    assessment: "reading",
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeSessionId || !activeLanguage || !profile) return;

      addMessage(activeSessionId, "user", content);
      setIsStreaming(true);

      // Add empty assistant message to update with stream
      addMessage(activeSessionId, "assistant", "");

      try {
        const knownWords = getKnownWords(activeLanguage);

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            targetLanguage: activeLanguage,
            cefrLevel: profile.cefrLevel,
            sessionType,
            history: messages.slice(-10),
            knownWords: knownWords.slice(-30),
            completedTopics: profile.completedTopics,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  accumulated += parsed.text;
                  updateLastAssistantMessage(activeSessionId, accumulated);
                }
                if (parsed.error) {
                  accumulated += `\n\n*Error: ${parsed.error}*`;
                  updateLastAssistantMessage(activeSessionId, accumulated);
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }

        // Award XP and skill progress
        addXP(activeLanguage, 5);
        pushXPGain(5);
        recordMessage();
        const skill = skillMap[sessionType];
        if (skill) {
          updateSkill(activeLanguage, skill, 2);
        }

        // Check for new achievements
        const profiles = useUserStore.getState().profiles;
        const allSessions = useChatStore.getState().sessions;
        const allVocab = useVocabularyStore.getState().entries;
        const langs = ["en", "es", "de"] as const;
        const languageCount = langs.filter((l) => profiles[l] !== null).length;
        const totalXP = langs.reduce((s, l) => s + (profiles[l]?.totalXP ?? 0), 0);
        const streak = langs.reduce((s, l) => Math.max(s, profiles[l]?.streak ?? 0), 0);
        const completedTopics = langs.reduce((s, l) => s + (profiles[l]?.completedTopics?.length ?? 0), 0);
        const totalMessages = Object.values(allSessions).reduce(
          (s, sess) => s + sess.messages.filter((m) => m.role === "user").length, 0
        );
        const totalSessions = Object.values(allSessions).filter((s) => s.messages.length > 0).length;
        const langVocab = Object.values(allVocab).flat();
        const totalVocab = langVocab.length;
        const masteredVocab = langVocab.filter((v) => v.mastery >= 0.8).length;

        const stats: AchievementStats = {
          totalMessages, totalXP, totalVocab, masteredVocab,
          streak, languageCount, totalSessions, completedTopics,
        };
        const newlyUnlocked = checkAndUnlock(stats);
        for (const unlock of newlyUnlocked) {
          const ach = ACHIEVEMENTS.find((a) => a.id === unlock.achievementId);
          if (ach) {
            pushAchievement({
              achievementId: ach.id,
              title: ach.title,
              description: ach.description,
              icon: ach.icon,
            });
          }
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Connection failed";
        updateLastAssistantMessage(
          activeSessionId,
          `Sorry, I couldn't connect to the AI service. Please check your OpenRouter API key configuration.\n\n*Error: ${errorMsg}*`
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [
      activeSessionId,
      activeLanguage,
      profile,
      sessionType,
      messages,
      apiEndpoint,
      addMessage,
      updateLastAssistantMessage,
      addXP,
      updateSkill,
      getKnownWords,
      skillMap,
      pushXPGain,
      recordMessage,
      checkAndUnlock,
      pushAchievement,
    ]
  );

  if (!activeLanguage) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Select a language to start
      </div>
    );
  }

  const emptyState = emptyStateConfig[sessionType] || emptyStateConfig.conversation;
  const placeholder = placeholderConfig[sessionType] || "Type your message...";

  return (
    <div className="relative flex flex-col h-full">
      {/* XP Float notification */}
      <XPFloat />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6" aria-live="polite" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <EmptyChat accentColor={emptyState.accentColor} />
            <div>
              <h3 className="text-lg font-medium font-[family-name:var(--font-heading)] text-slate-700 dark:text-slate-300">
                {emptyState.title}
              </h3>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                {emptyState.subtitle}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            language={activeLanguage}
            isStreaming={
              isStreaming &&
              idx === messages.length - 1 &&
              msg.role === "assistant"
            }
          />
        ))}

        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
          <TypingIndicator />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputBar
        onSend={sendMessage}
        disabled={isStreaming}
        placeholder={placeholder}
        language={activeLanguage}
      />
    </div>
  );
}
