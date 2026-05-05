"use client";
import { motion } from "framer-motion";
import { Zap, Leaf, BarChart3 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative px-6 pt-20 pb-16 text-center max-w-5xl mx-auto">
            <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-2 glass px-3 py-1 mb-3 text-xs text-secondary"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        Sustainability Analytics for the LLM Era
      </motion.div>
      <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="text-5xl md:text-7xl font-bold leading-tight mb-6">
        Every prompt has a <span className="gradient-text">carbon cost.</span>
        <br />Make yours <span className="gradient-text">greener.</span>
      </motion.h1>
      <motion.p initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10">
        Compare GPT-4o, Gemini, and more side-by-side. Optimize prompts to slash energy
        consumption by up to 50% — without losing intent.
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {[
          { icon: Zap, label: "Battle Mode", desc: "4 LLMs. One prompt. Real numbers." },
          { icon: Leaf, label: "Green Optimizer", desc: "AI-rewritten, 30-50% lighter." },
          { icon: BarChart3, label: "Live Gauge", desc: "Watch carbon cost as you type." },
        ].map((f, i) => (
          <motion.div key={i} whileHover={{ y: -5 }} className="glass p-5 text-left">
            <f.icon className="text-emerald-400 mb-2" size={28} />
            <h3 className="font-semibold mb-1">{f.label}</h3>
            <p className="text-sm text-slate-400">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
