"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamificationStore } from "@/stores/gamification-store";
import { useUserStore } from "@/stores/user-store";
import { Avatar } from "@/components/characters/avatar";
import { CEFR_DESCRIPTIONS } from "@/lib/types";
import type { CEFRLevel } from "@/lib/types";

const levelColors: Record<CEFRLevel, { bg: string; text: string; ring: string }> = {
  A1: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "#10B981" },
  A2: { bg: "bg-teal-50", text: "text-teal-700", ring: "#14B8A6" },
  B1: { bg: "bg-blue-50", text: "text-blue-700", ring: "#3B82F6" },
  B2: { bg: "bg-indigo-50", text: "text-indigo-700", ring: "#6366F1" },
  C1: { bg: "bg-purple-50", text: "text-purple-700", ring: "#8B5CF6" },
  C2: { bg: "bg-amber-50", text: "text-amber-700", ring: "#F59E0B" },
};

const congratulations: Record<string, Record<CEFRLevel, string>> = {
  en: {
    A1: "Welcome to your journey!", A2: "Keep it up!", B1: "You're making progress!",
    B2: "Impressive work!", C1: "Almost there!", C2: "Mastery achieved!",
  },
  es: {
    A1: "Bienvenido!", A2: "Sigue asi!", B1: "Vas muy bien!",
    B2: "Impresionante!", C1: "Casi lo logras!", C2: "Maestria total!",
  },
  de: {
    A1: "Willkommen!", A2: "Weiter so!", B1: "Du machst Fortschritte!",
    B2: "Beeindruckend!", C1: "Fast geschafft!", C2: "Meisterschaft erreicht!",
  },
};

function ParticleBurst() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * 360;
        const distance = 80 + Math.random() * 60;
        const x = Math.cos((angle * Math.PI) / 180) * distance;
        const y = Math.sin((angle * Math.PI) / 180) * distance;
        const colors = ["#4F46E5", "#F59E0B", "#22C55E", "#EC4899", "#8B5CF6"];
        const color = colors[i % colors.length];
        const size = 4 + Math.random() * 4;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              backgroundColor: color,
              left: "50%",
              top: "50%",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x, y, opacity: 0, scale: 0 }}
            transition={{ duration: 1 + Math.random() * 0.5, delay: 0.2, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export function LevelUpCeremony() {
  const levelUpEvent = useGamificationStore((s) => s.levelUpEvent);
  const clearLevelUp = useGamificationStore((s) => s.clearLevelUp);
  const activeLanguage = useUserStore((s) => s.activeLanguage);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (levelUpEvent) {
      setVisible(true);
    }
  }, [levelUpEvent]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    setTimeout(clearLevelUp, 300);
  }, [clearLevelUp]);

  if (!levelUpEvent || !activeLanguage) return null;

  const { oldLevel, newLevel } = levelUpEvent;
  const newColors = levelColors[newLevel];
  const lang = activeLanguage;
  const congrats = congratulations[lang]?.[newLevel] ?? "Level up!";

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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

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
            className="relative z-10 bg-white rounded-[var(--radius-lg)] shadow-2xl p-8 max-w-sm mx-4 text-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <ParticleBurst />

            {/* Avatar */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.3,
              }}
              className="flex justify-center mb-4"
            >
              <Avatar
                language={activeLanguage}
                expression="celebrating"
                size="lg"
              />
            </motion.div>

            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">
              Level Up!
            </p>

            {/* Level transition */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 0.4, scale: 0.85 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 font-semibold text-sm"
              >
                {oldLevel}
              </motion.div>

              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="text-slate-400"
              >
                →
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.3, 1] }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className={`px-4 py-2 rounded-full ${newColors.bg} ${newColors.text} font-bold text-lg border-2`}
                style={{ borderColor: newColors.ring }}
              >
                {newLevel}
              </motion.div>
            </div>

            <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-slate-900 mb-1">
              {CEFR_DESCRIPTIONS[newLevel]}
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-base text-slate-600 italic mb-6"
            >
              &ldquo;{congrats}&rdquo;
            </motion.p>

            <button
              onClick={handleDismiss}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-[var(--radius-md)] text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Continue Learning
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
