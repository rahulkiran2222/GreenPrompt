🌱 GreenPrompt
Energy-Aware Prompt Optimization and Carbon Estimation for Large Language Models
A research-driven system for measuring, optimizing, and benchmarking the energy and carbon footprint of LLM prompts in real time.
🌐 Live Demo: https://greenprompt.raphussolutions.com
🧠 Research Motivation
Recent advances in Large Language Models (LLMs) such as GPT-4o and Gemini 1.5 Pro have significantly increased computational demand, raising concerns about energy consumption and environmental impact.
While prior work in Green AI focuses on model training efficiency, prompt-level optimization remains underexplored.
GreenPrompt addresses this gap.
🎯 Core Contributions
Introduces a prompt-level energy estimation framework
Proposes an AI-driven prompt rewriting mechanism for energy reduction
Provides a real-time carbon feedback loop for users
Enables cross-model comparative benchmarking
Bridges user interaction + sustainability awareness in AI systems
⚙️ System Overview






7
GreenPrompt consists of three major layers:
1. Interaction Layer
User inputs prompts via a real-time interface
Live updates for latency, token usage, and carbon estimates
2. Optimization Engine
AI-based prompt rewriting
Token reduction strategies:
Semantic compression
Instruction pruning
Context minimization
3. Measurement Layer
Energy estimation based on:
Token count
Model-specific compute intensity
Latency proxies
Carbon estimation using region-aware emission factors
🧪 Methodology
Energy Estimation Model
Energy consumption is approximated as:
E=(T 
in
​	
 +T 
out
​	
 )×C 
model
​	
 ×α
Where:
T 
in
​	
 ,T 
out
​	
 : Input/output tokens
C 
model
​	
 : Model-specific compute coefficient
α: Hardware/efficiency scaling factor
Carbon Estimation
CO 
2
​	
 =E×CI
Where:
CI: Carbon intensity (gCO₂/kWh) based on region
Prompt Optimization Strategy
Uses LLM-assisted rewriting to:
Reduce verbosity
Preserve semantic intent
Improve token efficiency
⚔️ Features
Battle Mode — Compare 4 LLMs across energy, CO₂, and latency
Green Optimizer — Reduce prompt energy usage by ~30–50%
Live Carbon Gauge — Real-time estimation
History + Leaderboard — Track best optimizations
Real-world Equivalents — Translate CO₂ into intuitive metrics
Interactive UI — Built with modern web visualization tools
🛠️ Tech Stack
Backend
Python 3.11
FastAPI
SQLAlchemy
SlowAPI (rate limiting)
Frontend
Next.js 14
TypeScript
Tailwind CSS
Framer Motion
Three.js
LLM Providers
OpenAI (GPT-4o, GPT-4o-mini)
Google (Gemini 1.5 Pro, Flash)
Database
SQLite (configurable to Supabase/PostgreSQL)
📊 Experimental Evaluation
Model	Avg Tokens	Energy Reduction	Latency Change
GPT-4o	↓ 38%	↓ 34%	+4%
Gemini 1.5 Pro	↓ 42%	↓ 39%	+6%
Results based on internal benchmark dataset of 500 prompts across domains.
🔁 Reproducibility
To reproduce results:
git clone https://github.com/your-repo/greenprompt
cd greenprompt
Backend Setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
Frontend Setup
cd frontend
npm install
npm run dev
📁 Dataset & Benchmarking
Synthetic + real-world prompts:
Coding tasks
Academic writing
Conversational prompts
Evaluation metrics:
Token reduction %
Estimated energy reduction
Response quality preservation (manual scoring)
⚠️ Limitations
Energy estimates are proxy-based, not hardware-measured
Carbon intensity varies by deployment region
Optimization may slightly affect output richness
🔮 Future Work
Integration with hardware-level telemetry
Fine-tuned lightweight optimization models
Open benchmark for Green Prompting
API for enterprise sustainability dashboards
📚 Related Work
Green AI (Schwartz et al.)
Efficient NLP inference
Carbon-aware computing systems
🤝 Contributing
Pull requests and research collaborations are welcome.
📜 License
MIT License
👤 Author
Built by Raphus Solutions
Advancing sustainable AI systems.
