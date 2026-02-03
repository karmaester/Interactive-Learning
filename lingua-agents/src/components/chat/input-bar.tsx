"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InputBar({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}: InputBarProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            "w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3",
            "text-[15px] text-slate-800 placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-150"
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
