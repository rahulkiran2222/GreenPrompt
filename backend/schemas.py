from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class PromptRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=8000)

class EstimateRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=8000)
    model: str = "gpt-4o"

class ModelResponse(BaseModel):
    model: str
    response: str
    tokens: int
    latency_ms: float
    energy_wh: float
    co2_g: float
    equivalents: Dict[str, float]
    error: Optional[str] = None

class BattleResponse(BaseModel):
    prompt: str
    results: List[ModelResponse]
    most_sustainable: str
    fastest: str

class OptimizeResponse(BaseModel):
    original_prompt: str
    optimized_prompt: str
    original_tokens: int
    optimized_tokens: int
    savings: Dict[str, Any]

class HistoryItem(BaseModel):
    id: int
    mode: str
    prompt: str
    optimized_prompt: Optional[str]
    percent_saved: float
    wh_saved: float
    co2_saved_g: float
    created_at: str