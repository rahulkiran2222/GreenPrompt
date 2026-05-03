"use client";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { motion } from "framer-motion";
import type { ModelResult } from "@/lib/types";

const COLORS = ["#10b981", "#34d399", "#3b82f6", "#06b6d4"];

export default function EnergyChart({ results }: { results: ModelResult[] }) {
  const data = results
    .filter(r => !r.error)
    .map(r => ({
      name: r.model.replace("gemini-1.5-", "G-").replace("gpt-4o", "GPT-4o"),
      energy: r.energy_wh * 1000, // convert to mWh for readability
      co2: r.co2_g * 1000,        // mg
      tokens: r.tokens,
    }));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="glass p-6">
      <h3 className="text-xl font-bold mb-4">⚡ Energy Consumption (mWh)</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
          <YAxis stroke="#94a3b8" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "rgba(15,23,42,0.95)",
              border: "1px solid #10b981",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#10b981" }}
          />
          <Bar dataKey="energy" radius={[8, 8, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}