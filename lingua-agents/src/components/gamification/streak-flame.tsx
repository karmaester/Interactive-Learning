"use client";

import { motion } from "framer-motion";

interface StreakFlameProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

function getFlameConfig(streak: number) {
  if (streak === 0)
    return { intensity: 0, color: "#94A3B8", glowColor: "transparent", label: "Start your streak" };
  if (streak <= 2)
    return { intensity: 1, color: "#FDBA74", glowColor: "#FED7AA", label: `${streak} day${streak > 1 ? "s" : ""}` };
  if (streak <= 6)
    return { intensity: 2, color: "#F97316", glowColor: "#FDBA74", label: `${streak} days` };
  if (streak <= 13)
    return { intensity: 3, color: "#EA580C", glowColor: "#F97316", label: `${streak} days` };
  return { intensity: 4, color: "#DC2626", glowColor: "#EF4444", label: `${streak} days` };
}

const sizeMap = {
  sm: { width: 16, height: 16, fontSize: "text-xs", px: "px-2", py: "py-0.5" },
  md: { width: 20, height: 20, fontSize: "text-sm", px: "px-3", py: "py-1.5" },
  lg: { width: 28, height: 28, fontSize: "text-base", px: "px-4", py: "py-2" },
};

function FlameSVG({
  width,
  height,
  color,
  glowColor,
  intensity,
}: {
  width: number;
  height: number;
  color: string;
  glowColor: string;
  intensity: number;
}) {
  if (intensity === 0) {
    return (
      <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="4" fill="#CBD5E1" />
      </svg>
    );
  }

  return (
    <motion.svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      animate={
        intensity >= 3
          ? { scale: [1, 1.08, 1], rotate: [0, -2, 2, 0] }
          : intensity >= 2
          ? { scale: [1, 1.04, 1] }
          : {}
      }
      transition={
        intensity >= 3
          ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
          : intensity >= 2
          ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
          : {}
      }
    >
      <defs>
        <radialGradient id={`flame-glow-${intensity}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glow */}
      {intensity >= 3 && (
        <circle cx="12" cy="12" r="11" fill={`url(#flame-glow-${intensity})`} />
      )}

      {/* Main flame */}
      <path
        d="M12 2C12 2 7 8 7 13C7 15.8 9.2 18 12 18C14.8 18 17 15.8 17 13C17 8 12 2 12 2Z"
        fill={color}
      />

      {/* Inner flame */}
      <path
        d="M12 7C12 7 9.5 11 9.5 13.5C9.5 14.9 10.6 16 12 16C13.4 16 14.5 14.9 14.5 13.5C14.5 11 12 7 12 7Z"
        fill={intensity >= 4 ? "#FDE047" : "#FED7AA"}
        opacity="0.9"
      />

      {/* Core */}
      {intensity >= 2 && (
        <path
          d="M12 10C12 10 10.8 12.5 10.8 14C10.8 14.7 11.3 15.2 12 15.2C12.7 15.2 13.2 14.7 13.2 14C13.2 12.5 12 10 12 10Z"
          fill={intensity >= 4 ? "#FFFFFF" : "#FEF3C7"}
          opacity="0.8"
        />
      )}

      {/* Sparks for high intensity */}
      {intensity >= 4 && (
        <>
          <motion.circle
            cx="8"
            cy="8"
            r="1"
            fill="#FDE047"
            animate={{ opacity: [0, 1, 0], y: [0, -4, -8] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.circle
            cx="16"
            cy="9"
            r="0.8"
            fill="#FBBF24"
            animate={{ opacity: [0, 1, 0], y: [0, -3, -6] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
          <motion.circle
            cx="12"
            cy="5"
            r="0.6"
            fill="#FDE047"
            animate={{ opacity: [0, 1, 0], y: [0, -5, -10] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
        </>
      )}
    </motion.svg>
  );
}

export function StreakFlame({ streak, size = "sm" }: StreakFlameProps) {
  const config = getFlameConfig(streak);
  const s = sizeMap[size];

  const bgColor =
    config.intensity === 0
      ? "bg-slate-50 border-slate-200 text-slate-400"
      : config.intensity <= 2
      ? "bg-orange-50 border-orange-200 text-orange-600"
      : "bg-orange-50 border-orange-200 text-red-600";

  return (
    <div
      className={`flex items-center gap-1 ${bgColor} ${s.px} ${s.py} rounded-full border font-medium ${s.fontSize}`}
    >
      <FlameSVG
        width={s.width}
        height={s.height}
        color={config.color}
        glowColor={config.glowColor}
        intensity={config.intensity}
      />
      <span>{config.label}</span>
    </div>
  );
}
