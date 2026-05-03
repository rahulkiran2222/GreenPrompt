"use client";
import { motion } from "framer-motion";
import { Zap, Leaf, BarChart3, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative px-6 pt-8 pb-4 text-center max-w-5xl mx-auto">
      {/* Tiny status pill */}
            <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-2 glass px-3 py-1 mb-3 text-xs text-secondary"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Sustainability Analytics for the LLM Era
      </motion.div>

      {/* Compact heading */}
      <motion.h1
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-2xl md:text-3xl font-bold leading-tight mb-2"
      >
        Every prompt has a <span className="gradient-text">carbon cost.</span>{" "}
        Make yours <span className="gradient-text">greener.</span>
      </motion.h1>

      {/* One-liner subtitle */}
      <motion.p
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="text-sm text-slate-400 max-w-2xl mx-auto mb-4"
      >
        Compare GPT-4o, Gemini, Claude & Llama side-by-side. Optimize prompts to slash energy by 30–50%.
      </motion.p>

      {/* Tiny feature chips (replaces big cards) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center justify-center gap-2 text-xs"
      >
        {[
          { icon: Sparkles, label: "Battle Mode" },
          { icon: Leaf, label: "Green Optimizer" },
          { icon: Zap, label: "Live Gauge" },
          { icon: BarChart3, label: "Leaderboard" },
        ].map((f, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -2, scale: 1.05 }}
            className="glass px-3 py-1.5 flex items-center gap-1.5 text-slate-300"
          >
            <f.icon size={12} className="text-emerald-400" />
            <span>{f.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}