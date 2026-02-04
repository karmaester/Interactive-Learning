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

const colorMap: Record<Language, { bg: string; accent: string; skin: string; hair: string; accessory: string }> = {
  en: { bg: "bg-blue-100", accent: "text-blue-600", skin: "#F5D0A9", hair: "#8B4513", accessory: "#4A90D9" },
  es: { bg: "bg-orange-100", accent: "text-orange-600", skin: "#E8B887", hair: "#2C1810", accessory: "#E85D3A" },
  de: { bg: "bg-emerald-100", accent: "text-emerald-600", skin: "#F0C8A0", hair: "#C4A35A", accessory: "#2D8B57" },
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
  const mouth = mouthVariants[expression];
  const eye = eyeVariants[expression];

  const tutorNames = { en: "Emma", es: "Carlos", de: "Lena" };

  return (
    <div className={`${sizeMap[size]} relative`} role="img" aria-label={`${tutorNames[language]} tutor avatar, ${expression}`}>
      <motion.div
        className={`${colors.bg} rounded-full w-full h-full flex items-center justify-center overflow-hidden shadow-lg border-2 border-white dark:border-slate-700`}
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

          {/* Per-language hair and accessories */}
          {language === "en" && (
            <>
              {/* Emma: brown shoulder-length hair with side part */}
              <path d="M 6 14 Q 6 4 18 4 Q 30 4 30 14 L 28 12 Q 28 6 18 6 Q 8 6 8 12 Z" fill={colors.hair} />
              <path d="M 6 14 Q 5 18 6 22" stroke={colors.hair} strokeWidth="2" fill="none" />
              <path d="M 30 14 Q 31 18 30 22" stroke={colors.hair} strokeWidth="2" fill="none" />
              {/* Small earring */}
              <circle cx="6.5" cy="18" r="0.8" fill={colors.accessory} />
            </>
          )}
          {language === "es" && (
            <>
              {/* Carlos: dark wavy hair, slightly longer */}
              <path d="M 6 15 Q 6 3 18 3 Q 30 3 30 15 L 28 13 Q 28 5 18 5 Q 8 5 8 13 Z" fill={colors.hair} />
              <path d="M 7 13 Q 9 10 10 13" stroke={colors.hair} strokeWidth="1.5" fill={colors.hair} />
              <path d="M 26 13 Q 28 10 29 13" stroke={colors.hair} strokeWidth="1.5" fill={colors.hair} />
              {/* Small mustache hint */}
              <path d="M 15 20.5 Q 18 19.5 21 20.5" stroke={colors.hair} strokeWidth="0.6" fill="none" opacity="0.5" />
            </>
          )}
          {language === "de" && (
            <>
              {/* Lena: blonde bob cut with bangs */}
              <path d="M 7 14 Q 7 4 18 4 Q 29 4 29 14 L 27 11 Q 27 6 18 6 Q 9 6 9 11 Z" fill={colors.hair} />
              {/* Bangs */}
              <path d="M 9 11 L 12 9 L 15 11 L 18 9 L 21 11 L 24 9 L 27 11" fill={colors.hair} stroke={colors.hair} strokeWidth="0.5" />
              {/* Bob sides */}
              <path d="M 7 14 Q 6 19 7 22 Q 8 23 10 22" fill={colors.hair} />
              <path d="M 29 14 Q 30 19 29 22 Q 28 23 26 22" fill={colors.hair} />
              {/* Small hair clip */}
              <rect x="24" y="9" width="2.5" height="1.2" rx="0.6" fill={colors.accessory} />
            </>
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

          {/* Eyebrows - per language style */}
          {language === "en" && (
            <>
              <path d="M 10.5 12 Q 13 11 15.5 12" stroke="#8B6914" strokeWidth="0.7" fill="none" />
              <path d="M 20.5 12 Q 23 11 25.5 12" stroke="#8B6914" strokeWidth="0.7" fill="none" />
            </>
          )}
          {language === "es" && (
            <>
              <path d="M 10 12 Q 13 10.5 15.5 12" stroke="#1A0F0A" strokeWidth="0.9" fill="none" />
              <path d="M 20.5 12 Q 23 10.5 26 12" stroke="#1A0F0A" strokeWidth="0.9" fill="none" />
            </>
          )}
          {language === "de" && (
            <>
              <path d="M 10.5 12.5 Q 13 11.5 15.5 12.5" stroke="#9B8340" strokeWidth="0.6" fill="none" />
              <path d="M 20.5 12.5 Q 23 11.5 25.5 12.5" stroke="#9B8340" strokeWidth="0.6" fill="none" />
            </>
          )}

          {/* Eye shine */}
          <circle cx="13.8" cy="14.2" r="0.6" fill="white" />
          <circle cx="23.8" cy="14.2" r="0.6" fill="white" />

          {/* Nose hint */}
          <path d="M 17.5 17 Q 18 18.5 18.5 17" stroke="#D4A574" strokeWidth="0.5" fill="none" opacity="0.6" />

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

          {/* Collar/clothing hint at the bottom */}
          {language === "en" && (
            <path d="M 10 27 Q 18 29 26 27" stroke={colors.accessory} strokeWidth="1.5" fill="none" opacity="0.8" />
          )}
          {language === "es" && (
            <path d="M 11 27 L 18 30 L 25 27" stroke={colors.accessory} strokeWidth="1.2" fill="none" opacity="0.8" />
          )}
          {language === "de" && (
            <path d="M 12 27 Q 18 28 24 27" stroke={colors.accessory} strokeWidth="1.5" fill="none" opacity="0.8" />
          )}
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
            {expression === "speaking" && "💬"}
            {expression === "thinking" && "🤔"}
            {expression === "celebrating" && "🎉"}
            {expression === "encouraging" && "👍"}
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
