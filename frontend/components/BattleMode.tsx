"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Leaf, AlertCircle, Download, Info } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import type { BattleResult, ModelResult } from "@/lib/types";
import { exportBattleToPDF } from "@/lib/pdf";
import EnergyChart from "./EnergyChart";
import CountUp from "./CountUp";

export default function BattleMode() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BattleResult | null>(null);

  const run = async () => {
    if (!prompt.trim()) return toast.error("Enter a prompt first");
    setLoading(true);
    setData(null);
    try {
      const r = (await api.battle(prompt)) as BattleResult;
      setData(r);
      toast.success(`Most sustainable: ${r.most_sustainable || "N/A"}`);
    } catch (e: any) {
      toast.error(e.message || "Battle failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass p-6">
        <h3 className="text-2xl font-bold mb-3">⚔️ Battle Mode</h3>
        <p className="text-sm text-secondary mb-4">
          One prompt → 4 models in parallel. See who wins on energy & speed.
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter any prompt — e.g. 'Explain quantum entanglement in simple terms.'"
          className="w-full h-28 bg-slate-900/40 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-400 transition"
        />
        <button
          onClick={run}
          disabled={loading}
          className="mt-3 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-electric font-semibold hover:scale-105 transition disabled:opacity-50 disabled:scale-100 flex items-center gap-2 text-white"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Battling...
            </>
          ) : (
            <>
              <Sparkles size={18} /> Run Battle
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {data && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Action bar — download + info */}
            <div className="glass p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2 text-xs text-secondary max-w-2xl">
                <Info size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Numbers look tiny? They're <strong>per single prompt</strong>.
                  Multiply by your monthly call volume to see real impact — e.g.
                  1M prompts/month × 0.0003 Wh = <strong>300 Wh saved</strong>.
                </span>
              </div>
              <button
                onClick={() => exportBattleToPDF(data)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-electric font-semibold text-sm hover:scale-105 transition flex items-center gap-2 text-white whitespace-nowrap"
              >
                <Download size={16} /> Download PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.results.map((r, i) => (
                <ResultCard
                  key={r.model}
                  r={r}
                  idx={i}
                  isGreen={r.model === data.most_sustainable}
                  isFast={r.model === data.fastest}
                />
              ))}
            </div>

            <EnergyChart results={data.results} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({
  r,
  idx,
  isGreen,
  isFast,
}: {
  r: ModelResult;
  idx: number;
  isGreen: boolean;
  isFast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className={`glass p-5 relative ${
        isGreen ? "ring-2 ring-emerald-400 animate-pulse-glow" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-sm">{r.model}</h4>
        <div className="flex gap-1">
          {isGreen && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Leaf size={10} />
              Greenest
            </span>
          )}
          {isFast && (
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Zap size={10} />
              Fastest
            </span>
          )}
        </div>
      </div>
      {r.error ? (
        <div className="text-xs text-red-400 flex items-start gap-1">
          <AlertCircle size={12} className="flex-shrink-0 mt-0.5" />
          <span className="break-words">{r.error}</span>
        </div>
      ) : (
        <>
          <p className="text-xs text-secondary line-clamp-4 mb-3 min-h-[64px]">
            {r.response}
          </p>
          <div className="space-y-1 text-xs border-t border-white/10 pt-2">
            <Row label="Tokens" v={r.tokens} d={0} />
            <Row label="Latency" v={r.latency_ms} d={0} suffix="ms" />
            <Row label="Energy" v={r.energy_wh} d={6} suffix="Wh" />
            <Row label="CO₂" v={r.co2_g} d={6} suffix="g" />
          </div>
        </>
      )}
    </motion.div>
  );
}

function Row({
  label,
  v,
  d,
  suffix = "",
}: {
  label: string;
  v: number;
  d: number;
  suffix?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-secondary">{label}</span>
      <span className="font-mono text-emerald-400">
        <CountUp value={v} decimals={d} />
        {suffix && ` ${suffix}`}
      </span>
    </div>
  );
}
