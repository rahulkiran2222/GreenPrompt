import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 px-6 py-8 border-t border-white/10 text-center text-sm text-slate-400">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Leaf className="text-emerald-400" size={16} />
        <span>GreenPrompt by <strong className="text-emerald-400">Raphus Solutions</strong></span>
      </div>
      <div className="flex items-center justify-center gap-4 text-xs">
        <a href="/whitepaper" className="hover:text-emerald-400 transition">Sustainability Whitepaper</a>
        <span>•</span>
        <a href="https://github.com" className="hover:text-emerald-400 transition">GitHub</a>
        <span>•</span>
        <span>© {new Date().getFullYear()} Raphus Solutions</span>
      </div>
    </footer>
  );
}