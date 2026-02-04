"use client";

import { motion } from "framer-motion";

interface EmptyAchievementsProps {
  className?: string;
  accentColor?: string;
}

export function EmptyAchievements({
  className = "",
  accentColor = "#F59E0B",
}: EmptyAchievementsProps) {
  return (
    <div className={className}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Trophy */}
        <motion.g
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Cup body */}
          <path
            d="M40 30H80V50C80 64 72 74 60 74C48 74 40 64 40 50V30Z"
            fill={accentColor}
            opacity="0.1"
            stroke={accentColor}
            strokeWidth="2"
            strokeOpacity="0.3"
          />
          {/* Left handle */}
          <path
            d="M40 38C40 38 30 38 28 46C26 54 34 56 40 52"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.2"
            fill="none"
          />
          {/* Right handle */}
          <path
            d="M80 38C80 38 90 38 92 46C94 54 86 56 80 52"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.2"
            fill="none"
          />
          {/* Stem */}
          <rect
            x="55"
            y="74"
            width="10"
            height="10"
            fill={accentColor}
            opacity="0.1"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.2"
          />
          {/* Base */}
          <rect
            x="44"
            y="84"
            width="32"
            height="6"
            rx="3"
            fill={accentColor}
            opacity="0.12"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.2"
          />

          {/* Star inside trophy */}
          <motion.path
            d="M60 38L63 48L73 48L65 54L68 64L60 58L52 64L55 54L47 48L57 48Z"
            fill={accentColor}
            opacity="0.15"
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.g>

        {/* Sparkle top left */}
        <motion.g
          animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <path
            d="M28 22L30 26L34 24L30 28L28 32L26 28L22 24L26 26Z"
            fill={accentColor}
            opacity="0.3"
          />
        </motion.g>

        {/* Sparkle top right */}
        <motion.g
          animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          <path
            d="M94 20L95.5 23L99 21.5L95.5 24L94 27L92.5 24L89 21.5L92.5 23Z"
            fill={accentColor}
            opacity="0.25"
          />
        </motion.g>

        {/* Small star bottom */}
        <motion.g
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 1 }}
        >
          <circle cx="36" cy="96" r="2" fill={accentColor} opacity="0.2" />
          <circle cx="88" cy="94" r="1.5" fill={accentColor} opacity="0.15" />
        </motion.g>
      </svg>
    </div>
  );
}
