"use client";

import { motion } from "framer-motion";

interface EmptyHistoryProps {
  className?: string;
  accentColor?: string;
}

export function EmptyHistory({
  className = "",
  accentColor = "#6366F1",
}: EmptyHistoryProps) {
  return (
    <div className={className}>
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Calendar */}
        <motion.g
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <rect
            x="22"
            y="30"
            width="56"
            height="60"
            rx="8"
            fill={accentColor}
            opacity="0.07"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.25"
          />
          {/* Calendar header */}
          <rect
            x="22"
            y="30"
            width="56"
            height="16"
            rx="8"
            fill={accentColor}
            opacity="0.12"
          />
          {/* Calendar dots (day cells) */}
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4].map((col) => (
              <circle
                key={`${row}-${col}`}
                cx={32 + col * 10}
                cy={56 + row * 10}
                r="2.5"
                fill={accentColor}
                opacity={row === 0 && col < 3 ? 0.2 : 0.08}
              />
            ))
          )}
          {/* Calendar pins */}
          <line x1="34" y1="26" x2="34" y2="34" stroke={accentColor} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
          <line x1="66" y1="26" x2="66" y2="34" stroke={accentColor} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
        </motion.g>

        {/* Clock */}
        <motion.g
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <circle
            cx="86"
            cy="52"
            r="20"
            fill={accentColor}
            opacity="0.07"
            stroke={accentColor}
            strokeWidth="1.5"
            strokeOpacity="0.2"
          />
          {/* Clock hands */}
          <motion.line
            x1="86"
            y1="52"
            x2="86"
            y2="40"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.3"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "86px 52px" }}
          />
          <line
            x1="86"
            y1="52"
            x2="96"
            y2="52"
            stroke={accentColor}
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.2"
          />
          <circle cx="86" cy="52" r="2" fill={accentColor} opacity="0.3" />

          {/* Clock markers */}
          {[0, 90, 180, 270].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <circle
                key={angle}
                cx={86 + Math.sin(rad) * 16}
                cy={52 - Math.cos(rad) * 16}
                r="1.5"
                fill={accentColor}
                opacity="0.15"
              />
            );
          })}
        </motion.g>
      </svg>
    </div>
  );
}
