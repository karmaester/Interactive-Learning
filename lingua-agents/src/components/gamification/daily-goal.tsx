"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useGamificationStore } from "@/stores/gamification-store";

interface DailyGoalRingProps {
  size?: number;
}

const MESSAGE_GOAL = 10;
const REVIEW_GOAL = 5;

function ArcPath({
  radius,
  progress,
  strokeWidth,
  color,
  bgColor,
  size,
}: {
  radius: number;
  progress: number;
  strokeWidth: number;
  color: string;
  bgColor: string;
  size: number;
}) {
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const offset = circumference * (1 - clampedProgress);

  return (
    <>
      {/* Background ring */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={bgColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Progress ring */}
      {clampedProgress > 0 && (
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          transform={`rotate(-90 ${center} ${center})`}
        />
      )}
    </>
  );
}

export function DailyGoalRing({ size = 120 }: DailyGoalRingProps) {
  const getDailyStats = useGamificationStore((s) => s.getDailyStats);
  const stats = getDailyStats();

  const messageProgress = stats.messagesSent / MESSAGE_GOAL;
  const reviewProgress = stats.wordsReviewed / REVIEW_GOAL;
  const bothComplete = messageProgress >= 1 && reviewProgress >= 1;

  const outerRadius = size / 2 - 8;
  const innerRadius = size / 2 - 22;

  const percentage = useMemo(() => {
    return Math.round(((messageProgress + reviewProgress) / 2) * 100);
  }, [messageProgress, reviewProgress]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Outer ring: Messages */}
          <ArcPath
            radius={outerRadius}
            progress={messageProgress}
            strokeWidth={10}
            color="#4F46E5"
            bgColor="#E0E7FF"
            size={size}
          />
          {/* Inner ring: Reviews */}
          <ArcPath
            radius={innerRadius}
            progress={reviewProgress}
            strokeWidth={10}
            color="#22C55E"
            bgColor="#DCFCE7"
            size={size}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {bothComplete ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="text-2xl"
            >
              ✓
            </motion.div>
          ) : (
            <span className="text-lg font-bold text-slate-700">
              {Math.min(percentage, 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-1.5 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <span className="text-slate-500">
            Messages: {Math.min(stats.messagesSent, MESSAGE_GOAL)}/{MESSAGE_GOAL}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-slate-500">
            Reviews: {Math.min(stats.wordsReviewed, REVIEW_GOAL)}/{REVIEW_GOAL}
          </span>
        </div>
      </div>
    </div>
  );
}
