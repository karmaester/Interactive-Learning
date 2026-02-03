"use client";

import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-slate-400 rounded-full"
            animate={{ y: [0, -6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
