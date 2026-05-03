"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { api } from "@/lib/api";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { (async () => {
    try { setItems(await api.leaderboard() as any[]); } catch {}
  })(); }, []);

  return (
    <div className="glass p-6">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Trophy size={22} className="text-yellow-400" /> Top Optimizations
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">Run an optimization to make the leaderboard!</p>
      ) : (
        <div className="space-y-2">
          {items.map((it, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              className="glass p-3 flex items-center gap-3 text-sm">
              <span className="text-2xl w-8">{MEDALS[i] || `#${it.rank}`}</span>
              <span className="flex-1 truncate text-slate-300">{it.prompt}</span>
              <span className="text-emerald-400 font-mono font-bold">
                -{it.percent_saved.toFixed(1)}%
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}