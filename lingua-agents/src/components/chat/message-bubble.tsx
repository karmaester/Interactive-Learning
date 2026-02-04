"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "@/lib/use-speech";
import type { ChatMessage, Language } from "@/lib/types";
import { Avatar } from "@/components/characters/avatar";

interface MessageBubbleProps {
  message: ChatMessage;
  language?: Language;
  isStreaming?: boolean;
}

function formatContent(content: string) {
  // Parse correction markers: [CORRECTION: "wrong" → "right" | Explanation: reason]
  const parts: React.ReactNode[] = [];
  const correctionRegex =
    /\[CORRECTION:\s*"([^"]+)"\s*→\s*"([^"]+)"\s*\|\s*Explanation:\s*([^\]]+)\]/g;
  let lastIndex = 0;
  let match;
  let key = 0;

  const text = content;
  while ((match = correctionRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={key++} className="inline-block mx-1">
        <span className="line-through text-red-400 text-sm">{match[1]}</span>
        {" "}
        <span className="text-emerald-600 font-medium">{match[2]}</span>
        <span className="block text-xs text-slate-500 italic mt-0.5">
          {match[3]}
        </span>
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : content;
}

function formatTimestamp(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors cursor-pointer",
        copied
          ? "bg-emerald-100 text-emerald-600"
          : "bg-slate-200/60 text-slate-400 hover:text-slate-600 hover:bg-slate-200"
      )}
      title={copied ? "Copied!" : "Copy message"}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

function SpeakButton({ content, language }: { content: string; language: Language }) {
  const { isSpeaking, isSupported, speak, stop } = useSpeechSynthesis({
    language,
  });

  if (!isSupported) return null;

  return (
    <button
      onClick={() => (isSpeaking ? stop() : speak(content))}
      className={cn(
        "inline-flex items-center justify-center w-6 h-6 rounded-full transition-colors cursor-pointer",
        isSpeaking
          ? "bg-indigo-100 text-indigo-600"
          : "bg-slate-200/60 text-slate-400 hover:text-slate-600 hover:bg-slate-200"
      )}
      title={isSpeaking ? "Stop" : "Listen"}
    >
      {isSpeaking ? (
        <VolumeX className="w-3.5 h-3.5" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

export function MessageBubble({
  message,
  language,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center my-3"
      >
        <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-sm px-4 py-2 rounded-full max-w-md text-center">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex gap-3 my-4", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {!isUser && language && (
        <div className="flex-shrink-0 mt-1">
          <Avatar
            language={language}
            expression={isStreaming ? "speaking" : "neutral"}
            size="sm"
          />
        </div>
      )}

      <div className="flex flex-col gap-1 group/bubble max-w-[75%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
            isUser
              ? "bg-indigo-600 text-white rounded-tr-sm"
              : "bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm"
          )}
        >
          <div className="whitespace-pre-wrap break-words">
            {formatContent(message.content)}
          </div>
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-1.5 h-4 bg-current ml-0.5 align-middle"
            />
          )}
        </div>

        {/* Action buttons and timestamp */}
        <div
          className={cn(
            "flex items-center gap-1.5 opacity-0 group-hover/bubble:opacity-100 transition-opacity",
            isUser ? "justify-end" : "justify-start"
          )}
        >
          {!isUser && !isStreaming && language && message.content && (
            <>
              <SpeakButton content={message.content} language={language} />
              <CopyButton content={message.content} />
            </>
          )}
          {message.timestamp && (
            <span className="text-[10px] text-slate-400 px-1">
              {formatTimestamp(message.timestamp)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
