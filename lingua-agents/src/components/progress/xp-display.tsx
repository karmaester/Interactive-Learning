"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface XPDisplayProps {
  xp: number;
}

export function XPDisplay({ xp }: XPDisplayProps) {
  return (
    <motion.div
      className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-200 font-medium text-sm"
      key={xp}
      animate={{
        scale: [1, 1.12, 1],
        boxShadow: [
          "0 0 0 0 rgba(251, 191, 36, 0)",
          "0 0 8px 2px rgba(251, 191, 36, 0.4)",
          "0 0 0 0 rgba(251, 191, 36, 0)",
        ],
      }}
      transition={{ duration: 0.5 }}
    >
      <Zap className="w-4 h-4 fill-amber-400" />
      <span>{xp} XP</span>
    </motion.div>
  );
}
