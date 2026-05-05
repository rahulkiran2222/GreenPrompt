from fastapi import FastAPI, HTTPException, Depends, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel, Field
import json

from config import settings
from database import engine, Base, get_db
from models import PromptHistory
from schemas import EstimateRequest
from energy_service import EnergyService
from llm_service import battle, optimize, count_tokens

Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="GreenPrompt API",
              description="Energy-aware multi-provider LLM analytics",
              version="2.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- Schemas -----
class BattleRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=8000)
    models: Optional[List[str]] = None  # let frontend pick

class OptimizeReq(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=8000)

# ----- Helper: parse user keys from header -----
def parse_user_keys(x_user_keys: Optional[str]) -> dict:
    """Frontend sends X-User-Keys header as a JSON string with provider→key map."""
    if not x_user_keys:
        return {}
    try:
        data = json.loads(x_user_keys)
        return {k: v for k, v in data.items() if isinstance(v, str) and v.strip()}
    except Exception:
        return {}

# ----- Endpoints -----
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "demo_mode": settings.DEMO_MODE,
        "providers_configured": {
            "openai": bool(settings.OPENAI_API_KEY),
            "gemini": bool(settings.GEMINI_API_KEY),
            "anthropic": bool(settings.ANTHROPIC_API_KEY),
            "groq": bool(settings.GROQ_API_KEY),
        },
    }

@app.get("/api/models")
async def list_models():
    """Return all supported models grouped by provider."""
    by_provider = {"openai": [], "gemini": [], "anthropic": [], "groq": []}
    for model, provider in settings.MODEL_PROVIDERS.items():
        by_provider[provider].append({
            "id": model,
            "energy_per_1k": settings.ENERGY_COEFFICIENTS.get(model, 0),
        })
    return by_provider

@app.post("/api/estimate")
@limiter.limit("60/minute")
async def estimate(request: Request, body: EstimateRequest):
    tokens = count_tokens(body.prompt)
    return EnergyService.calculate(body.model, tokens)

@app.post("/api/battle")
@limiter.limit("10/minute")
async def battle_endpoint(
    request: Request,
    body: BattleRequest,
    x_user_keys: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if not body.prompt.strip():
        raise HTTPException(400, "Prompt cannot be empty")
    user_keys = parse_user_keys(x_user_keys)
    result = await battle(body.prompt, models=body.models, user_keys=user_keys)
    db.add(PromptHistory(mode="battle", prompt=body.prompt))
    db.commit()
    return result

@app.post("/api/optimize")
@limiter.limit("10/minute")
async def optimize_endpoint(
    request: Request,
    body: OptimizeReq,
    x_user_keys: Optional[str] = Header(None),
    db: Session = Depends(get_db),
):
    if not body.prompt.strip():
        raise HTTPException(400, "Prompt cannot be empty")
    user_keys = parse_user_keys(x_user_keys)
    result = await optimize(body.prompt, user_keys=user_keys)
    s = result["savings"]
    db.add(PromptHistory(
        mode="optimize", prompt=body.prompt,
        optimized_prompt=result["optimized_prompt"],
        tokens_original=result["original_tokens"],
        tokens_optimized=result["optimized_tokens"],
        wh_saved=s["wh_saved"], co2_saved_g=s["co2_saved_g"],
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
        "wh_saved": r.wh_saved, "co2_saved_g": r.co2_saved_g,
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
        "rank": i+1, "prompt": r.prompt[:100],
        "percent_saved": r.percent_saved,
        "wh_saved": r.wh_saved, "co2_saved_g": r.co2_saved_g,
    } for i, r in enumerate(rows)]