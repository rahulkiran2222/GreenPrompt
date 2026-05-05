"use client";
import { motion } from "framer-motion";

export default function DiffView({
  original,
  optimized,
}: {
  original: string;
  optimized: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="glass p-5 border-l-4 border-red-500/60">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-red-400">Original</span>
          <span className="text-xs text-slate-400">{original.length} chars</span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{original}</p>
      </motion.div>

      <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        className="glass p-5 border-l-4 border-emerald-500/60 animate-pulse-glow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-emerald-400">✨ Optimized</span>
          <span className="text-xs text-slate-400">{optimized.length} chars</span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{optimized}</p>
      </motion.div>
    </div>
  );
}