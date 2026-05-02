import asyncio, time
from typing import Dict
import tiktoken
from openai import AsyncOpenAI
import google.generativeai as genai
from config import settings
from energy_service import EnergyService

# Initialize SDKs
openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

ENCODER = tiktoken.encoding_for_model("gpt-4o")

def count_tokens(text: str) -> int:
    if not text:
        return 0
    try:
        return len(ENCODER.encode(text))
    except Exception:
        return max(1, len(text) // 4)

# ---------- DEMO FALLBACK ----------
def _demo_response(model: str, prompt: str) -> str:
    return (f"[DEMO MODE — {model}] Echo of your prompt ({len(prompt)} chars). "
            f"In production this would be a real LLM completion.")

# ---------- OpenAI ----------
async def call_openai(model: str, prompt: str) -> Dict:
    start = time.time()
    try:
        if settings.DEMO_MODE or not openai_client:
            await asyncio.sleep(0.4)
            text = _demo_response(model, prompt)
        else:
            r = await openai_client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=512,
            )
            text = r.choices[0].message.content or ""
        latency = (time.time() - start) * 1000
        tokens = count_tokens(prompt) + count_tokens(text)
        energy = EnergyService.calculate(model, tokens)
        return {"model": model, "response": text, "tokens": tokens,
                "latency_ms": round(latency, 1), **energy, "error": None}
    except Exception as e:
        return {"model": model, "response": "", "tokens": 0, "latency_ms": 0,
                "energy_wh": 0, "co2_g": 0, "equivalents": {}, "error": str(e)}

# ---------- Gemini ----------
async def call_gemini(model: str, prompt: str) -> Dict:
    start = time.time()
    try:
        if settings.DEMO_MODE or not settings.GEMINI_API_KEY:
            await asyncio.sleep(0.3)
            text = _demo_response(model, prompt)
        else:
            m = genai.GenerativeModel(model)
            r = await m.generate_content_async(prompt)
            text = r.text or ""
        latency = (time.time() - start) * 1000
        tokens = count_tokens(prompt) + count_tokens(text)
        energy = EnergyService.calculate(model, tokens)
        return {"model": model, "response": text, "tokens": tokens,
                "latency_ms": round(latency, 1), **energy, "error": None}
    except Exception as e:
        return {"model": model, "response": "", "tokens": 0, "latency_ms": 0,
                "energy_wh": 0, "co2_g": 0, "equivalents": {}, "error": str(e)}

# ---------- Battle ----------
async def battle(prompt: str):
    results = await asyncio.gather(
        call_openai("gpt-4o", prompt),
        call_openai("gpt-4o-mini", prompt),
        call_gemini("gemini-1.5-pro", prompt),
        call_gemini("gemini-1.5-flash", prompt),
    )
    valid = [r for r in results if not r["error"] and r["energy_wh"] > 0]
    most_sustainable = min(valid, key=lambda r: r["energy_wh"])["model"] if valid else ""
    fastest = min(valid, key=lambda r: r["latency_ms"])["model"] if valid else ""
    return {"prompt": prompt, "results": results,
            "most_sustainable": most_sustainable, "fastest": fastest}

# ---------- Optimizer ----------
OPTIMIZER_SYSTEM = (
    "You are a Prompt Compression Engine. Rewrite the user's prompt to be 30-50% "
    "shorter while preserving 100% of the intent and technical requirements. "
    "Remove politeness, redundant adjectives, and filler words. "
    "Return ONLY the rewritten prompt — no preamble, no explanation."
)

async def optimize(prompt: str) -> Dict:
    original_tokens = count_tokens(prompt)
    if settings.DEMO_MODE or not settings.GEMINI_API_KEY:
        # Heuristic compression for demo
        words = prompt.split()
        filler = {"please","kindly","could","would","like","very","really","just","that","the","a","an"}
        optimized = " ".join(w for w in words if w.lower() not in filler) or prompt
    else:
        try:
            m = genai.GenerativeModel("gemini-1.5-flash",
                                      system_instruction=OPTIMIZER_SYSTEM)
            r = await m.generate_content_async(prompt)
            optimized = (r.text or "").strip()
            if not optimized:
                optimized = prompt
        except Exception:
            optimized = prompt

    optimized_tokens = count_tokens(optimized)
    if optimized_tokens >= original_tokens and original_tokens > 0:
        # Fallback safety
        pass

    saved_tokens = max(original_tokens - optimized_tokens, 0)
    pct = round((saved_tokens / original_tokens) * 100, 2) if original_tokens else 0.0

    # Use gpt-4o coefficient as the "what you would have spent" baseline
    orig_energy = EnergyService.calculate("gpt-4o", original_tokens)
    opt_energy = EnergyService.calculate("gpt-4o", optimized_tokens)
    savings = EnergyService.compare_savings(orig_energy["energy_wh"], opt_energy["energy_wh"])

    return {
        "original_prompt": prompt,
        "optimized_prompt": optimized,
        "original_tokens": original_tokens,
        "optimized_tokens": optimized_tokens,
        "savings": {
            "tokens_saved": saved_tokens,
            "percent_saved": pct,
            **savings,
        },
    }