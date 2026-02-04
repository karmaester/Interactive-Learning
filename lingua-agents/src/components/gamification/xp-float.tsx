"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGamificationStore } from "@/stores/gamification-store";

export function XPFloat() {
  const xpGainQueue = useGamificationStore((s) => s.xpGainQueue);
  const popXPGain = useGamificationStore((s) => s.popXPGain);
  const [displayEvent, setDisplayEvent] = useState<{
    id: string;
    amount: number;
  } | null>(null);

  useEffect(() => {
    if (xpGainQueue.length === 0 || displayEvent) return;

    const event = xpGainQueue[0];
    setDisplayEvent({ id: event.id, amount: event.amount });
    popXPGain();

    const timer = setTimeout(() => {
      setDisplayEvent(null);
    }, 1200);

    return () => clearTimeout(timer);
  }, [xpGainQueue, displayEvent, popXPGain]);

  return (
    <AnimatePresence>
      {displayEvent && (
        <motion.div
          key={displayEvent.id}
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: 1, y: -40, scale: 1 }}
          exit={{ opacity: 0, y: -70, scale: 0.6 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute bottom-16 right-6 pointer-events-none z-20"
        >
          <div className="flex items-center gap-1.5 bg-amber-400 text-white px-3 py-1.5 rounded-full shadow-lg font-bold text-sm">
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="flex-shrink-0"
            >
              <path
                d="M8 1L10.2 5.5L15 6.2L11.5 9.6L12.4 14.4L8 12.1L3.6 14.4L4.5 9.6L1 6.2L5.8 5.5L8 1Z"
                fill="white"
              />
            </svg>
            +{displayEvent.amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
