"use client";
import { motion } from "framer-motion";
import CountUp from "./CountUp";
import { EQUIVALENT_LABELS } from "@/lib/equivalents";

export default function EquivalentsGrid({
  equivalents,
  title = "🌍 Real-World Impact",
}: {
  equivalents: Record<string, number>;
  title?: string;
}) {
  return (
    <div className="glass p-6">
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(EQUIVALENT_LABELS).map(([key, meta], i) => {
          const value = equivalents[key] ?? 0;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.04, y: -3 }}
              className="glass p-4 text-center group cursor-default"
            >
              <div className="text-3xl mb-1 group-hover:animate-float">{meta.icon}</div>
              <div className="text-xs text-slate-400 mb-1">{meta.label}</div>
              <div className="text-base font-mono text-emerald-400">
                {value < 0.0001 ? value.toExponential(2) : <CountUp value={value} decimals={4} />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}