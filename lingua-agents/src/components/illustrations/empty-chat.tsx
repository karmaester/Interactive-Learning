"use client";

import { motion } from "framer-motion";

interface EmptyChatProps {
  className?: string;
  accentColor?: string;
}

export function EmptyChat({
  className = "",
  accentColor = "#4F46E5",
}: EmptyChatProps) {
  return (
    <div className={className}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Large speech bubble */}
        <motion.rect
          x="18"
          y="20"
          width="64"
          height="44"
          rx="12"
          fill={accentColor}
          opacity="0.1"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.5 }}
        />
        <rect
          x="18"
          y="20"
          width="64"
          height="44"
          rx="12"
          stroke={accentColor}
          strokeWidth="2"
          opacity="0.3"
        />
        {/* Bubble tail */}
        <path
          d="M36 64L30 76L44 64"
          stroke={accentColor}
          strokeWidth="2"
          opacity="0.3"
          fill={accentColor}
          fillOpacity="0.1"
        />

        {/* Dots in bubble */}
        <motion.circle
          cx="38"
          cy="42"
          r="4"
          fill={accentColor}
          opacity="0.3"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
        />
        <motion.circle
          cx="50"
          cy="42"
          r="4"
          fill={accentColor}
          opacity="0.3"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="62"
          cy="42"
          r="4"
          fill={accentColor}
          opacity="0.3"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
        />

        {/* Small reply bubble */}
        <motion.rect
          x="48"
          y="58"
          width="52"
          height="32"
          rx="10"
          fill={accentColor}
          opacity="0.06"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.06 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <rect
          x="48"
          y="58"
          width="52"
          height="32"
          rx="10"
          stroke={accentColor}
          strokeWidth="1.5"
          opacity="0.15"
        />
        {/* Reply tail */}
        <path
          d="M82 90L88 98L76 90"
          stroke={accentColor}
          strokeWidth="1.5"
          opacity="0.15"
          fill={accentColor}
          fillOpacity="0.06"
        />

        {/* Lines in reply bubble */}
        <line
          x1="56"
          y1="70"
          x2="88"
          y2="70"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.12"
        />
        <line
          x1="56"
          y1="78"
          x2="78"
          y2="78"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.08"
        />

        {/* Sparkle */}
        <motion.g
          animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <path
            d="M96 28L98 32L102 30L98 34L96 38L94 34L90 30L94 32Z"
            fill={accentColor}
            opacity="0.3"
          />
        </motion.g>
      </svg>
    </div>
  );
}
