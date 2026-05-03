"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { api } from "@/lib/api";

export default function History() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try { setItems(await api.history() as any[]); } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  return (
    <div className="glass p-6">
      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Clock size={22} className="text-emerald-400" /> Recent History
      </h3>
      {loading ? (
        <p className="text-sm text-slate-400">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-400">No prompts yet — run a battle or optimization!</p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {items.map((it, i) => (
            <motion.div key={it.id} initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
              className="glass p-3 text-sm flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full ${
                    it.mode === "battle" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"
                  }`}>{it.mode}</span>
                  <span className="text-[10px] text-slate-500">{new Date(it.created_at).toLocaleString()}</span>
                </div>
                <p className="truncate text-slate-300">{it.prompt}</p>
              </div>
              {it.percent_saved > 0 && (
                <div className="text-emerald-400 font-mono font-bold whitespace-nowrap">
                  -{it.percent_saved.toFixed(1)}%
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}