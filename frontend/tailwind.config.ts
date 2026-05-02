import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#020617",
        emerald: { 400: "#34d399", 500: "#10b981", 600: "#059669" },
        electric: "#3b82f6",
      },
      animation: {
        "gradient-x": "gradient-x 8s ease infinite",
        "pulse-glow": "pulse-glow 2.5s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        "gradient-x": {
          "0%,100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "pulse-glow": {
          "0%,100%": { boxShadow: "0 0 20px rgba(16,185,129,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(16,185,129,0.8)" },
        },
        "float": {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;