"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamificationStore } from "@/stores/gamification-store";
import { ACHIEVEMENTS } from "@/stores/achievement-store";

function ConfettiPiece({ index }: { index: number }) {
  const colors = [
    "#4F46E5", "#818CF8", "#F59E0B", "#22C55E",
    "#EC4899", "#3B82F6", "#F97316", "#8B5CF6",
  ];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 0.5;
  const duration = 2 + Math.random() * 1.5;
  const rotation = Math.random() * 720 - 360;
  const size = 6 + Math.random() * 6;
  const shape = index % 3; // 0=square, 1=circle, 2=rectangle

  return (
    <motion.div
      initial={{
        top: "-5%",
        left: `${left}%`,
        rotate: 0,
        opacity: 1,
        scale: 0,
      }}
      animate={{
        top: "105%",
        rotate: rotation,
        opacity: [1, 1, 0],
        scale: [0, 1, 0.5],
      }}
      transition={{
        duration,
        delay,
        ease: "easeIn",
      }}
      className="absolute pointer-events-none"
      style={{
        width: shape === 2 ? size * 1.5 : size,
        height: shape === 2 ? size * 0.6 : size,
        backgroundColor: color,
        borderRadius: shape === 1 ? "50%" : "2px",
      }}
    />
  );
}

export function CelebrationOverlay() {
  const achievementQueue = useGamificationStore((s) => s.achievementQueue);
  const popAchievement = useGamificationStore((s) => s.popAchievement);
  const [visible, setVisible] = useState(false);

  const currentEvent = achievementQueue[0] ?? null;
  const achievement = currentEvent
    ? ACHIEVEMENTS.find((a) => a.id === currentEvent.achievementId)
    : null;

  useEffect(() => {
    if (currentEvent) {
      setVisible(true);
    }
  }, [currentEvent]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      popAchievement();
    }, 300);
  }, [popAchievement]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(handleDismiss, 5000);
    return () => clearTimeout(timer);
  }, [visible, handleDismiss]);

  if (!achievement || !currentEvent) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleDismiss}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <ConfettiPiece key={i} index={i} />
            ))}
          </div>

          {/* Card */}
          <motion.div
            initial={{ scale: 0.5, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.1,
            }}
            className="relative z-10 bg-white rounded-[var(--radius-lg)] shadow-2xl p-8 max-w-sm mx-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sparkle decoration */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -top-3 -right-3 text-2xl"
            >
              ✨
            </motion.div>
            <motion.div
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -left-2 text-xl"
            >
              ✨
            </motion.div>

            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">
              Achievement Unlocked!
            </p>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.3,
              }}
              className="text-5xl mb-4"
            >
              {achievement.icon}
            </motion.div>

            {/* Title */}
            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900 mb-1">
              {achievement.title}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {achievement.description}
            </p>

            {/* Continue button */}
            <button
              onClick={handleDismiss}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-[var(--radius-md)] text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
