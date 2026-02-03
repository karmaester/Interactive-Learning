"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { InputBar } from "./input-bar";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import type { ChatMessage, Language, SessionType } from "@/lib/types";

interface ChatContainerProps {
  sessionType: SessionType;
  apiEndpoint?: string;
}

export function ChatContainer({
  sessionType,
  apiEndpoint = "/api/chat",
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const getActiveProfile = useUserStore((s) => s.getActiveProfile);
  const addXP = useUserStore((s) => s.addXP);

  const activeSessionId = useChatStore((s) => s.activeSessionId);
  const sessions = useChatStore((s) => s.sessions);
  const createSession = useChatStore((s) => s.createSession);
  const addMessage = useChatStore((s) => s.addMessage);
  const updateLastAssistantMessage = useChatStore(
    (s) => s.updateLastAssistantMessage
  );

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

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeSessionId || !activeLanguage || !profile) return;

      addMessage(activeSessionId, "user", content);
      setIsStreaming(true);

      // Add empty assistant message to update with stream
      addMessage(activeSessionId, "assistant", "");

      try {
        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            targetLanguage: activeLanguage,
            cefrLevel: profile.cefrLevel,
            sessionType,
            history: messages.slice(-10),
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

        // Award XP for conversation
        addXP(activeLanguage, 5);
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
    ]
  );

  if (!activeLanguage) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Select a language to start
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="text-4xl">
              {sessionType === "conversation"
                ? "💬"
                : sessionType === "assessment"
                ? "📝"
                : "📚"}
            </div>
            <div>
              <h3 className="text-lg font-medium text-slate-700">
                {sessionType === "conversation"
                  ? "Start a conversation"
                  : sessionType === "assessment"
                  ? "Ready for your placement test?"
                  : "Let's learn together"}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                {sessionType === "conversation"
                  ? "Type anything to begin chatting with your tutor"
                  : sessionType === "assessment"
                  ? 'Type "start" to begin the placement test'
                  : "Your tutor is ready to help"}
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
        placeholder={
          sessionType === "assessment"
            ? "Type your answer..."
            : "Type your message..."
        }
      />
    </div>
  );
}
