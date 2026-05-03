# 🌱 GreenPrompt

> Energy-aware analytics for LLM prompts. Compare GPT-4o vs Gemini, optimize
> prompts to slash 30-50% energy, and watch carbon cost in real time.

**Live demo:** [greenprompt.raphussolutions.com](https://greenprompt.raphussolutions.com)

![Stack](https://img.shields.io/badge/stack-Next.js%2014%20%7C%20FastAPI%20%7C%20Three.js-emerald)

## ✨ Features
- ⚔️ **Battle Mode** — 4 LLMs in parallel, side-by-side energy/CO₂/latency
- 🌱 **Green Optimizer** — AI-rewritten prompts, 30-50% lighter
- ⚡ **Live Carbon Gauge** — debounced real-time estimates as you type
- 📜 **History + Leaderboard** — SQLite persistence, top optimizations
- 🌍 **Real-world equivalents** — smartphone charges, EV meters, trees, etc.
- 🎨 **Three.js particle background**, glassmorphism, framer-motion animations
- 🌗 Dark + Light theme toggle

## 🛠️ Tech Stack
- **Backend:** Python 3.11 · FastAPI · SQLAlchemy · slowapi (rate limiting)
- **Frontend:** Next.js 14 · TypeScript · Tailwind · Framer Motion · Recharts · Three.js
- **LLMs:** OpenAI GPT-4o/mini · Google Gemini 1.5 Pro/Flash
- **DB:** SQLite (swap to Supabase by changing `DATABASE_URL`)

## 🚀 Local Setup

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                              # add your API keys
uvicorn main:app --reload