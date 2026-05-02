from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session

from config import settings
from database import engine, Base, get_db
from models import PromptHistory
from schemas import PromptRequest, EstimateRequest
from energy_service import EnergyService
from llm_service import battle, optimize, count_tokens

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="GreenPrompt API",
              description="Energy-aware LLM analytics by Raphus Solutions",
              version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok", "demo_mode": settings.DEMO_MODE}

@app.post("/api/estimate")
@limiter.limit("60/minute")
async def estimate(request: Request, body: EstimateRequest):
    """Real-time gauge — pure math, no LLM call."""
    tokens = count_tokens(body.prompt)
    return EnergyService.calculate(body.model, tokens)

@app.post("/api/battle")
@limiter.limit("10/minute")
async def battle_endpoint(request: Request, body: PromptRequest, db: Session = Depends(get_db)):
    if not body.prompt.strip():
        raise HTTPException(400, "Prompt cannot be empty")
    result = await battle(body.prompt)
    # Persist
    db.add(PromptHistory(mode="battle", prompt=body.prompt))
    db.commit()
    return result

@app.post("/api/optimize")
@limiter.limit("10/minute")
async def optimize_endpoint(request: Request, body: PromptRequest, db: Session = Depends(get_db)):
    if not body.prompt.strip():
        raise HTTPException(400, "Prompt cannot be empty")
    result = await optimize(body.prompt)
    s = result["savings"]
    db.add(PromptHistory(
        mode="optimize",
        prompt=body.prompt,
        optimized_prompt=result["optimized_prompt"],
        tokens_original=result["original_tokens"],
        tokens_optimized=result["optimized_tokens"],
        wh_saved=s["wh_saved"],
        co2_saved_g=s["co2_saved_g"],
        percent_saved=s["percent_saved"],
    ))
    db.commit()
    return result

@app.get("/api/history")
@limiter.limit("30/minute")
async def history(request: Request, db: Session = Depends(get_db)):
    rows = db.query(PromptHistory).order_by(PromptHistory.id.desc()).limit(20).all()
    return [{
        "id": r.id, "mode": r.mode,
        "prompt": r.prompt[:140],
        "optimized_prompt": (r.optimized_prompt or "")[:140],
        "percent_saved": r.percent_saved,
        "wh_saved": r.wh_saved,
        "co2_saved_g": r.co2_saved_g,
        "created_at": r.created_at.isoformat(),
    } for r in rows]

@app.get("/api/leaderboard")
@limiter.limit("30/minute")
async def leaderboard(request: Request, db: Session = Depends(get_db)):
    rows = (db.query(PromptHistory)
              .filter(PromptHistory.mode == "optimize")
              .order_by(PromptHistory.percent_saved.desc())
              .limit(10).all())
    return [{
        "rank": i+1,
        "prompt": r.prompt[:100],
        "percent_saved": r.percent_saved,
        "wh_saved": r.wh_saved,
        "co2_saved_g": r.co2_saved_g,
    } for i, r in enumerate(rows)]