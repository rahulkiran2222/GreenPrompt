# 🌱 GreenPrompt
### Energy-Aware Prompt Optimization for Large Language Models

> Optimize prompts. Reduce energy. Visualize carbon impact in real time.

🌐 **Live Demo:** https://greenprompt.raphussolutions.com  
⚡ Built for sustainability in AI systems  

---

## 🧠 Overview

GreenPrompt is a real-time analytics and optimization platform that helps developers and researchers:

- Measure **energy consumption of LLM prompts**
- Estimate **carbon footprint (CO₂)**
- Optimize prompts for **efficiency and sustainability**
- Compare multiple models side-by-side

---

## ✨ Features

### ⚔️ Battle Mode
Compare multiple LLMs simultaneously:
- Energy usage ⚡  
- Carbon emissions 🌍  
- Latency ⏱️  

---

### 🌱 Green Optimizer
- AI-powered prompt rewriting  
- Reduces token usage by **30–50%**  
- Maintains semantic meaning  

---

### ⚡ Live Carbon Gauge
- Real-time feedback while typing  
- Instant energy + CO₂ estimation  

---

### 📜 History & Leaderboard
- Track prompt improvements  
- Store results using SQLite  
- Identify top optimizations  

---

### 🌍 Real-World Equivalents
Translate emissions into:
- Smartphone charges 📱  
- EV distance 🚗  
- Trees planted 🌳  

---

### 🎨 Modern UI
- Three.js animated background  
- Glassmorphism design  
- Framer Motion animations  
- Dark / Light mode  

---

## 🧪 How It Works

### Energy Estimation
- Based on:
  - Input/output tokens  
  - Model compute intensity  
  - Latency approximation  

### Carbon Calculation
- Uses energy → CO₂ conversion  
- Region-aware carbon intensity  

### Optimization Engine
- AI rewrites prompts to:
  - Reduce verbosity  
  - Improve efficiency  
  - Maintain intent  

---

## 🛠️ Tech Stack

### Backend
- Python 3.11  
- FastAPI  
- SQLAlchemy  
- SlowAPI (rate limiting)  

### Frontend
- Next.js 14  
- TypeScript  
- Tailwind CSS  
- Framer Motion  
- Recharts  
- Three.js  

### LLM Providers
- OpenAI (GPT-4o, GPT-4o-mini)  
- Google Gemini (1.5 Pro, Flash)  

### Database
- SQLite (configurable to Supabase/PostgreSQL)  

---

## 🚀 Local Setup

### 1. Clone the repo
```bash
git clone https://github.com/your-repo/greenprompt
cd greenprompt
````

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate     # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Sample Results

| Model          | Token Reduction | Energy Saved | Latency Impact |
| -------------- | --------------- | ------------ | -------------- |
| GPT-4o         | ~38%            | ~34%         | +4%            |
| Gemini 1.5 Pro | ~42%            | ~39%         | +6%            |

---

## ⚠️ Limitations

* Energy values are **estimated (not hardware measured)**
* Carbon varies by deployment region
* Optimization may slightly alter output style

---

## 🔮 Future Work

* Hardware-level energy tracking
* Open benchmarking dataset
* API for sustainability analytics
* Enterprise dashboard integration

---

## 📚 Inspiration

* Green AI research
* Efficient inference systems
* Sustainable computing

---

## 🤝 Contributing

Pull requests and collaborations are welcome.

---

## 📜 License

MIT License

---

## 👤 Author

**Raphus Solutions**
Building sustainable AI systems for the future.

```

