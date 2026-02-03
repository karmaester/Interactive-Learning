"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageBubble } from "@/components/chat/message-bubble";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { InputBar } from "@/components/chat/input-bar";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/chat-store";
import { useUserStore } from "@/stores/user-store";
import { LANGUAGE_CONFIG } from "@/lib/types";
import type { ChatMessage, CEFRLevel } from "@/lib/types";
import { Avatar } from "@/components/characters/avatar";
import { LevelBadge } from "@/components/progress/level-badge";
import { generateId } from "@/lib/utils";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function AssessmentPage() {
  const router = useRouter();
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const getActiveProfile = useUserStore((s) => s.getActiveProfile);
  const updateLevel = useUserStore((s) => s.updateLevel);
  const addXP = useUserStore((s) => s.addXP);
  const setOnboarded = useUserStore((s) => s.setOnboarded);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [detectedLevel, setDetectedLevel] = useState<CEFRLevel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profile = getActiveProfile();
  const config = activeLanguage ? LANGUAGE_CONFIG[activeLanguage] : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start the placement test automatically
  useEffect(() => {
    if (activeLanguage && messages.length === 0 && !isStreaming) {
      sendMessage("Start the placement test. I want to find out my level.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLanguage]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeLanguage || isStreaming) return;

      const userMsg: ChatMessage = {
        id: generateId(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      // Don't show the auto-trigger message in the UI
      const isAutoStart = content.startsWith("Start the placement test");
      const updatedMessages = isAutoStart
        ? [...messages]
        : [...messages, userMsg];

      setMessages(updatedMessages);
      setIsStreaming(true);

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        agentType: "assessment",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      try {
        const response = await fetch("/api/assess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            targetLanguage: activeLanguage,
            history: updatedMessages.slice(-16),
          }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

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
                  setMessages((prev) => {
                    const newMsgs = [...prev];
                    newMsgs[newMsgs.length - 1] = {
                      ...newMsgs[newMsgs.length - 1],
                      content: accumulated,
                    };
                    return newMsgs;
                  });
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }

        // Check if placement result is in the response
        const resultMatch = accumulated.match(
          /\[PLACEMENT RESULT\]\s*\{[\s\S]*?"level"\s*:\s*"(A1|A2|B1|B2|C1|C2)"[\s\S]*?\}\s*\[\/PLACEMENT RESULT\]/
        );

        if (resultMatch) {
          const level = resultMatch[1] as CEFRLevel;
          setDetectedLevel(level);
          setAssessmentComplete(true);
          if (activeLanguage) {
            updateLevel(activeLanguage, level);
            addXP(activeLanguage, 50);
          }
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Connection failed";
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = {
            ...newMsgs[newMsgs.length - 1],
            content: `Sorry, I couldn't connect to the AI service. Please check your OpenRouter API key.\n\n*Error: ${errorMsg}*`,
          };
          return newMsgs;
        });
      } finally {
        setIsStreaming(false);
      }
    },
    [activeLanguage, messages, isStreaming, updateLevel, addXP]
  );

  const handleContinue = () => {
    setOnboarded(true);
    router.push("/learn");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-slate-800">
          Placement Test
        </h1>
        {config && (
          <p className="text-sm text-slate-500">
            {config.tutorName} will assess your {config.name} level
          </p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.map((msg, idx) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            language={activeLanguage || undefined}
            isStreaming={
              isStreaming &&
              idx === messages.length - 1 &&
              msg.role === "assistant"
            }
          />
        ))}

        {isStreaming &&
          messages[messages.length - 1]?.role !== "assistant" && (
            <TypingIndicator />
          )}

        {/* Assessment complete panel */}
        {assessmentComplete && detectedLevel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 my-8 p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            <h2 className="text-xl font-bold text-slate-900">
              Assessment Complete!
            </h2>
            {activeLanguage && (
              <Avatar language={activeLanguage} expression="celebrating" size="lg" />
            )}
            <div className="text-center">
              <p className="text-slate-600 mb-3">Your level is</p>
              <LevelBadge level={detectedLevel} size="lg" />
            </div>
            <p className="text-sm text-slate-500 text-center max-w-md">
              Your learning experience will be tailored to this level. You can
              always retake the assessment later.
            </p>
            <Button size="lg" onClick={handleContinue}>
              Start Learning
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!assessmentComplete && (
        <InputBar
          onSend={sendMessage}
          disabled={isStreaming}
          placeholder="Type your answer..."
        />
      )}
    </div>
  );
}
