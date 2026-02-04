"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/lib/use-speech";
import type { Language } from "@/lib/types";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  language?: Language | null;
}

export function InputBar({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
  language = null,
}: InputBarProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, isSupported: micSupported, toggleListening } =
    useSpeechRecognition({
      language,
      onResult: (transcript) => {
        setInput((prev) => (prev ? prev + " " + transcript : transcript));
      },
    });

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-2 p-4 border-t border-slate-200 bg-white"
    >
      {/* Mic button */}
      {micSupported && (
        <button
          type="button"
          onClick={toggleListening}
          disabled={disabled}
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-150 cursor-pointer",
            isListening
              ? "bg-red-500 text-white animate-pulse"
              : "bg-slate-100 text-slate-500 hover:bg-slate-200",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          title={isListening ? "Stop listening" : "Voice input"}
        >
          <AnimatePresence mode="wait">
            {isListening ? (
              <motion.div
                key="mic-off"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <MicOff className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div
                key="mic"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <Mic className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}

      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3",
            "text-[15px] text-slate-800 placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-150",
            isListening && "border-red-300 ring-1 ring-red-200"
          )}
        />
      </div>
      <button
        type="submit"
        disabled={disabled || !input.trim()}
        className={cn(
          "flex items-center justify-center w-11 h-11 rounded-xl",
          "bg-indigo-600 text-white transition-all duration-150",
          "hover:bg-indigo-700 active:scale-95",
          "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100",
          "cursor-pointer"
        )}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
}
