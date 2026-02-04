"use client";

import { motion } from "framer-motion";

interface EmptyVocabProps {
  className?: string;
  accentColor?: string;
}

export function EmptyVocab({
  className = "",
  accentColor = "#14B8A6",
}: EmptyVocabProps) {
  return (
    <div className={className}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Open book */}
        <motion.g
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left page */}
          <path
            d="M20 36C20 33 22 30 26 30L58 30L58 88C58 88 44 84 26 86C22 86.5 20 84 20 82V36Z"
            fill={accentColor}
            opacity="0.08"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />
          {/* Right page */}
          <path
            d="M100 36C100 33 98 30 94 30L62 30L62 88C62 88 76 84 94 86C98 86.5 100 84 100 82V36Z"
            fill={accentColor}
            opacity="0.08"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />
          {/* Spine */}
          <path
            d="M58 30L60 28L62 30L62 88L60 90L58 88Z"
            fill={accentColor}
            opacity="0.15"
          />

          {/* Lines on left page */}
          <line x1="28" y1="42" x2="52" y2="42" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
          <line x1="28" y1="50" x2="48" y2="50" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.1" />
          <line x1="28" y1="58" x2="50" y2="58" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
          <line x1="28" y1="66" x2="44" y2="66" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.1" />

          {/* Lines on right page */}
          <line x1="68" y1="42" x2="92" y2="42" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
          <line x1="68" y1="50" x2="88" y2="50" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.1" />
          <line x1="68" y1="58" x2="90" y2="58" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
          <line x1="68" y1="66" x2="84" y2="66" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.1" />
        </motion.g>

        {/* Sparkles */}
        <motion.g
          animate={{ opacity: [0, 0.5, 0], y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path
            d="M44 22L46 26L50 24L46 28L44 32L42 28L38 24L42 26Z"
            fill={accentColor}
            opacity="0.3"
          />
        </motion.g>
        <motion.g
          animate={{ opacity: [0, 0.4, 0], y: [0, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
        >
          <path
            d="M80 18L81.5 21L85 19.5L81.5 22L80 25L78.5 22L75 19.5L78.5 21Z"
            fill={accentColor}
            opacity="0.25"
          />
        </motion.g>
        <motion.g
          animate={{ opacity: [0, 0.35, 0], y: [0, -2, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
        >
          <circle cx="102" cy="42" r="2" fill={accentColor} opacity="0.2" />
        </motion.g>
      </svg>
    </div>
  );
}
