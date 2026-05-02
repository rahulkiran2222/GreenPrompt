"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BattleMode from "@/components/BattleMode";
import Optimizer from "@/components/Optimizer";
import RealTimeGauge from "@/components/RealTimeGauge";
import History from "@/components/History";
import Leaderboard from "@/components/Leaderboard";

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), { ssr: false });

const TABS = [
  { id: "battle", label: "⚔️ Battle" },
  { id: "optimize", label: "🌱 Optimizer" },
  { id: "gauge", label: "⚡ Live Gauge" },
  { id: "history", label: "📜 History" },
] as const;

export default function Home() {
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("battle");

  return (
    <>
      <ThreeBackground />
      <Navbar />
      <Hero />
      <main className="max-w-6xl mx-auto px-4 pb-12 space-y-6">
        <div className="glass p-2 flex flex-wrap gap-2 sticky top-20 z-40">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 min-w-[120px] px-4 py-2 rounded-xl text-sm font-medium transition ${
                tab === t.id
                  ? "bg-gradient-to-r from-emerald-500 to-electric text-white"
                  : "hover:bg-white/5 text-slate-300"
              }`}>
              {t.label}
            </button>
          ))}
        </div>
        <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {tab === "battle" && <BattleMode />}
          {tab === "optimize" && <Optimizer />}
          {tab === "gauge" && <RealTimeGauge />}
          {tab === "history" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <History />
              <Leaderboard />
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}