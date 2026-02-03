"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ExpressionState, Language } from "@/lib/types";
import { LANGUAGE_CONFIG } from "@/lib/types";

interface AvatarProps {
  language: Language;
  expression: ExpressionState;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-28 h-28",
};

const colorMap: Record<Language, { bg: string; accent: string; skin: string }> = {
  en: { bg: "bg-blue-100", accent: "text-blue-600", skin: "#F5D0A9" },
  es: { bg: "bg-orange-100", accent: "text-orange-600", skin: "#E8B887" },
  de: { bg: "bg-emerald-100", accent: "text-emerald-600", skin: "#F0C8A0" },
};

const expressionEmoji: Record<ExpressionState, string> = {
  neutral: "",
  speaking: "",
  thinking: "",
  celebrating: "",
  encouraging: "",
};

const mouthVariants: Record<ExpressionState, { d: string }> = {
  neutral: { d: "M 14 22 Q 18 25 22 22" },
  speaking: { d: "M 14 21 Q 18 27 22 21" },
  thinking: { d: "M 15 23 Q 18 23 21 23" },
  celebrating: { d: "M 12 21 Q 18 28 24 21" },
  encouraging: { d: "M 13 21 Q 18 26 23 21" },
};

const eyeVariants: Record<ExpressionState, { ry: number }> = {
  neutral: { ry: 2 },
  speaking: { ry: 2 },
  thinking: { ry: 1 },
  celebrating: { ry: 1.5 },
  encouraging: { ry: 2.2 },
};

export function Avatar({ language, expression, size = "md" }: AvatarProps) {
  const colors = colorMap[language];
  const config = LANGUAGE_CONFIG[language];
  const mouth = mouthVariants[expression];
  const eye = eyeVariants[expression];

  return (
    <div className={`${sizeMap[size]} relative`}>
      <motion.div
        className={`${colors.bg} rounded-full w-full h-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-white`}
        animate={
          expression === "speaking"
            ? { scale: [1, 1.02, 1] }
            : expression === "celebrating"
            ? { rotate: [0, -5, 5, 0] }
            : {}
        }
        transition={
          expression === "speaking"
            ? { repeat: Infinity, duration: 0.8 }
            : { duration: 0.5 }
        }
      >
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {/* Head */}
          <circle cx="18" cy="16" r="12" fill={colors.skin} />

          {/* Hair */}
          {language === "en" && (
            <path d="M 6 14 Q 6 4 18 4 Q 30 4 30 14 L 28 12 Q 28 6 18 6 Q 8 6 8 12 Z" fill="#8B6914" />
          )}
          {language === "es" && (
            <path d="M 6 15 Q 6 3 18 3 Q 30 3 30 15 L 28 13 Q 28 5 18 5 Q 8 5 8 13 Z" fill="#2C1810" />
          )}
          {language === "de" && (
            <path d="M 7 14 Q 7 4 18 4 Q 29 4 29 14 L 27 11 Q 27 6 18 6 Q 9 6 9 11 Z" fill="#C4A35A" />
          )}

          {/* Eyes */}
          <motion.ellipse
            cx="13"
            cy="15"
            rx="1.8"
            ry={eye.ry}
            fill="#333"
            animate={{ ry: eye.ry }}
            transition={{ duration: 0.2 }}
          />
          <motion.ellipse
            cx="23"
            cy="15"
            rx="1.8"
            ry={eye.ry}
            fill="#333"
            animate={{ ry: eye.ry }}
            transition={{ duration: 0.2 }}
          />

          {/* Eye shine */}
          <circle cx="13.8" cy="14.2" r="0.6" fill="white" />
          <circle cx="23.8" cy="14.2" r="0.6" fill="white" />

          {/* Mouth */}
          <motion.path
            d={mouth.d}
            fill="none"
            stroke="#333"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={false}
            animate={{ d: mouth.d }}
            transition={{ duration: 0.3 }}
          />

          {/* Blush */}
          <circle cx="10" cy="19" r="2" fill="#FFB5B5" opacity="0.4" />
          <circle cx="26" cy="19" r="2" fill="#FFB5B5" opacity="0.4" />
        </svg>
      </motion.div>

      {/* Expression indicator */}
      <AnimatePresence>
        {expression !== "neutral" && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 text-lg"
          >
            {expressionEmoji[expression]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AvatarWithName({
  language,
  expression,
  size = "md",
  showName = true,
}: AvatarProps & { showName?: boolean }) {
  const config = LANGUAGE_CONFIG[language];

  return (
    <div className="flex flex-col items-center gap-1">
      <Avatar language={language} expression={expression} size={size} />
      {showName && (
        <span className="text-xs font-medium text-slate-600">
          {config.tutorName}
        </span>
      )}
    </div>
  );
}
