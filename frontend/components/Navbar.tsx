"use client";
import { Leaf } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import SettingsPanel from "./SettingsPanel";

export default function Navbar() {
  return (
    <motion.nav initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass mx-4 mt-4 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Leaf className="text-emerald-400 animate-pulse-glow rounded-full p-1" size={32} />
        <span className="text-xl font-bold gradient-text">GreenPrompt</span>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <a href="/whitepaper" className="text-sm hover:text-emerald-400 transition hidden sm:inline">Whitepaper</a>
        <SettingsPanel />
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}
