"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Eye, EyeOff, Trash2, ExternalLink, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { loadKeys, saveKeys, clearKeys, PROVIDER_INFO, type Provider, type UserKeys } from "@/lib/keys";

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [keys, setKeys] = useState<UserKeys>({});
  const [show, setShow] = useState<Record<Provider, boolean>>({
    openai: false,
    gemini: false,
    anthropic: false,
    groq: false,
  });

  useEffect(() => {
    setKeys(loadKeys());
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const update = (p: Provider, v: string) => setKeys({ ...keys, [p]: v });

  const save = () => {
    const cleaned: UserKeys = {};
    (Object.keys(keys) as Provider[]).forEach((k) => {
      if (keys[k]?.trim()) cleaned[k] = keys[k]!.trim();
    });
    saveKeys(cleaned);
    toast.success("Keys saved locally 🔒");
    setOpen(false);
  };

  const reset = () => {
    clearKeys();
    setKeys({});
    toast.success("Keys cleared");
  };

  const filledCount = Object.values(keys).filter((v) => v?.trim()).length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative p-2 rounded-lg glass hover:bg-emerald-500/20 transition flex items-center gap-2 text-sm"
      >
        <Settings size={18} />
        <span className="hidden sm:inline">API Keys</span>
        {filledCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full text-[10px] flex items-center justify-center font-bold text-white">
            {filledCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-modal w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10 flex-shrink-0">
                <h2 className="text-xl font-bold gradient-text">🔑 Your API Keys</h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="p-2 hover:bg-red-500/20 rounded-lg transition flex items-center justify-center"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-y-auto p-5 space-y-4 flex-1">
                <div className="glass p-3 bg-emerald-500/10 border-emerald-500/30 text-sm flex gap-2">
                  <Shield className="text-emerald-400 flex-shrink-0" size={18} />
                  <div>
                    <strong className="text-emerald-400">Privacy-first:</strong> Your keys
                    are stored in your browser only and sent directly to your provider.
                    They are never saved on our servers.
                  </div>
                </div>
                {(Object.keys(PROVIDER_INFO) as Provider[]).map((provider) => {
                  const info = PROVIDER_INFO[provider];
                  return (
                    <div key={provider} className="glass p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-semibold">{info.label}</label>
                        <a
                          href={info.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          Get key <ExternalLink size={12} />
                        </a>
                      </div>
                      <div className="relative">
                        <input
                          type={show[provider] ? "text" : "password"}
                          value={keys[provider] || ""}
                          onChange={(e) => update(provider, e.target.value)}
                          placeholder={info.placeholder}
                          className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2 pr-10 outline-none focus:border-emerald-400 text-sm font-mono"
                        />
                        <button
                          onClick={() => setShow({ ...show, [provider]: !show[provider] })}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                          type="button"
                        >
                          {show[provider] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  );
                })}

                <p className="text-xs text-secondary text-center pt-2">
                  💡 No key? Try Gemini free at{" "}
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    className="text-emerald-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AI Studio
                  </a>{" "}
                  or Groq free at{" "}
                  <a
                    href="https://console.groq.com/keys"
                    className="text-emerald-400 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Groq Console
                  </a>
                  .
                </p>
              </div>

              <div className="flex gap-3 p-5 border-t border-white/10 flex-shrink-0">
                <button
                  onClick={save}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-electric font-semibold hover:scale-[1.02] transition text-white"
                >
                  Save Keys
                </button>
                <button
                  onClick={reset}
                  className="px-4 py-2.5 rounded-xl glass hover:bg-red-500/20 transition flex items-center gap-2 text-red-400"
                >
                  <Trash2 size={16} /> Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}