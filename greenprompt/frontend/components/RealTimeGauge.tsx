"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import CountUp from "./CountUp";
import { EQUIVALENT_LABELS } from "@/lib/equivalents";

export default function RealTimeGauge() {
  const [text, setText] = useState("");
  const [data, setData] = useState<any>(null);
  const [model, setModel] = useState("gpt-4o");

  useEffect(() => {
    if (!text.trim()) { setData(null); return; }
    const t = setTimeout(async () => {
      try { setData(await api.estimate(text, model)); } catch {}
    }, 350);
    return () => clearTimeout(t);
  }, [text, model]);

  return (
    <div className="glass p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">⚡ Live Carbon Gauge</h3>
                <select value={model} onChange={e => setModel(e.target.value)}
          className="glass px-3 py-1.5 text-sm bg-slate-800/80">
          <optgroup label="OpenAI">
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o-mini</option>
          </optgroup>
          <optgroup label="Google">
            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</option>
          </optgroup>
          <optgroup label="Anthropic">
            <option value="claude-sonnet-4-5">Claude Sonnet 4.5</option>
            <option value="claude-haiku-4-5">Claude Haiku 4.5</option>
          </optgroup>
          <optgroup label="Groq">
            <option value="llama-3.3-70b-versatile">Llama 3.3 70B</option>
            <option value="llama-3.1-8b-instant">Llama 3.1 8B</option>
          </optgroup>
        </select>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="Start typing to see real-time energy estimates..."
        className="w-full h-32 bg-slate-900/40 border border-white/10 rounded-xl p-3 outline-none focus:border-emerald-400 transition" />
      {data && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Tokens" value={data.tokens} decimals={0} />
          <Stat label="Energy (Wh)" value={data.energy_wh} decimals={6} />
          <Stat label="CO₂ (g)" value={data.co2_g} decimals={6} />
          <Stat label="Laptop min" value={data.equivalents.laptop_minutes} decimals={3} />
        </motion.div>
      )}
    </div>
  );
}

function Stat({ label, value, decimals }: { label: string; value: number; decimals: number }) {
  return (
    <div className="glass p-3 text-center">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-lg font-mono text-emerald-400">
        <CountUp value={value} decimals={decimals} />
      </div>
    </div>
  );
}