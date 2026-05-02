"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { OptimizeResult } from "@/lib/types";
import DiffView from "./DiffView";
import EquivalentsGrid from "./EquivalentsGrid";
import CountUp from "./CountUp";

export default function Optimizer() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OptimizeResult | null>(null);

  const run = async () => {
    if (!prompt.trim()) return toast.error("Enter a prompt");
    setLoading(true); setData(null);
    try {
      const r = await api.optimize(prompt) as OptimizeResult;
      setData(r);
      toast.success(`Saved ${r.savings.percent_saved}% energy! 🌱`);
    } catch (e: any) {
      toast.error(e.message || "Optimization failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6">
        <h3 className="text-2xl font-bold mb-3">🌱 Green Optimizer</h3>
        <p className="text-sm text-slate-400 mb-4">
          Compress your prompt 30-50% while preserving 100% of intent.
        </p>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder="Paste a verbose prompt — politeness, redundancy, fluff..."
          className="w-full h-32 bg-slate-900/40 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-400 transition" />
        <button onClick={run} disabled={loading}
          className="mt-3 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-electric font-semibold hover:scale-105 transition disabled:opacity-50 disabled:scale-100 flex items-center gap-2">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Optimizing...</>
          ) : (
            <><Wand2 size={18} /> Optimize Prompt</>
          )}
        </button>
      </div>

      <AnimatePresence>
        {data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-6">
            <div className="glass p-6 bg-gradient-to-br from-emerald-500/10 to-electric/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingDown className="text-emerald-400" size={32} />
                <div>
                  <div className="text-xs text-slate-400">Energy savings</div>
                  <div className="text-3xl font-bold gradient-text">
                    <CountUp value={data.savings.percent_saved} decimals={2} />%
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <Stat label="Tokens saved" v={data.savings.tokens_saved} d={0} />
                <Stat label="Wh saved" v={data.savings.wh_saved} d={6} />
                <Stat label="CO₂ saved (g)" v={data.savings.co2_saved_g} d={6} />
                <Stat label="Original tokens" v={data.original_tokens} d={0} />
              </div>
            </div>
            <DiffView original={data.original_prompt} optimized={data.optimized_prompt} />
            <EquivalentsGrid equivalents={data.savings.equivalents_saved}
              title="🌳 What You Saved (per call)" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, v, d }: { label: string; v: number; d: number }) {
  return (
    <div className="glass p-3 text-center">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-mono text-emerald-400 text-base"><CountUp value={v} decimals={d} /></div>
    </div>
  );
}