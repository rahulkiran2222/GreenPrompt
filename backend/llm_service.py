import asyncio, time
from typing import Dict, Optional
import tiktoken
from openai import AsyncOpenAI
import google.generativeai as genai
from anthropic import AsyncAnthropic
from groq import AsyncGroq
from config import settings
from energy_service import EnergyService

# tiktoken: try gpt-4o, fall back gracefully
try:
    ENCODER = tiktoken.encoding_for_model("gpt-4o")
except KeyError:
    try:
        ENCODER = tiktoken.get_encoding("o200k_base")
    except Exception:
        ENCODER = tiktoken.get_encoding("cl100k_base")

def count_tokens(text: str) -> int:
    if not text:
        return 0
    try:
        return len(ENCODER.encode(text))
    except Exception:
        return max(1, len(text) // 4)

# ---------- DEMO ----------
def _demo_response(model: str, prompt: str) -> str:
    return (f"[DEMO MODE — {model}] This is a simulated response to: '{prompt[:60]}...'. "
            f"Add your own API key in Settings to get real LLM responses.")

# ---------- Resolve which key to use ----------
def _resolve_key(provider: str, user_keys: Optional[Dict[str, str]]) -> Optional[str]:
    """Use user-supplied key first; fall back to server's own key."""
    if user_keys and user_keys.get(provider):
        return user_keys[provider]
    server_keys = {
        "openai": settings.OPENAI_API_KEY,
        "gemini": settings.GEMINI_API_KEY,
        "anthropic": settings.ANTHROPIC_API_KEY,
        "groq": settings.GROQ_API_KEY,
    }
    return server_keys.get(provider) or None

def _empty_result(model: str, error: str) -> Dict:
    return {"model": model, "response": "", "tokens": 0, "latency_ms": 0,
            "energy_wh": 0, "co2_g": 0, "equivalents": {}, "error": error}

# ---------- OpenAI ----------
async def call_openai(model: str, prompt: str, user_keys=None) -> Dict:
    start = time.time()
    key = _resolve_key("openai", user_keys)
    try:
        if settings.DEMO_MODE or not key:
            await asyncio.sleep(0.4)
            text = _demo_response(model, prompt)
        else:
            client = AsyncOpenAI(api_key=key)
            r = await client.chat.completions.create(
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
        return _empty_result(model, str(e))

# ---------- Gemini ----------
async def call_gemini(model: str, prompt: str, user_keys=None) -> Dict:
    start = time.time()
    key = _resolve_key("gemini", user_keys)
    try:
        if settings.DEMO_MODE or not key:
            await asyncio.sleep(0.3)
            text = _demo_response(model, prompt)
        else:
            genai.configure(api_key=key)
            m = genai.GenerativeModel(model)
            r = await m.generate_content_async(prompt)
            text = r.text or ""
        latency = (time.time() - start) * 1000
        tokens = count_tokens(prompt) + count_tokens(text)
        energy = EnergyService.calculate(model, tokens)
        return {"model": model, "response": text, "tokens": tokens,
                "latency_ms": round(latency, 1), **energy, "error": None}
    except Exception as e:
        return _empty_result(model, str(e))

# ---------- Anthropic ----------
async def call_anthropic(model: str, prompt: str, user_keys=None) -> Dict:
    start = time.time()
    key = _resolve_key("anthropic", user_keys)
    try:
        if settings.DEMO_MODE or not key:
            await asyncio.sleep(0.5)
            text = _demo_response(model, prompt)
        else:
            client = AsyncAnthropic(api_key=key)
            r = await client.messages.create(
                model=model,
                max_tokens=512,
                messages=[{"role": "user", "content": prompt}],
            )
            text = r.content[0].text if r.content else ""
        latency = (time.time() - start) * 1000
        tokens = count_tokens(prompt) + count_tokens(text)
        energy = EnergyService.calculate(model, tokens)
        return {"model": model, "response": text, "tokens": tokens,
                "latency_ms": round(latency, 1), **energy, "error": None}
    except Exception as e:
        return _empty_result(model, str(e))

# ---------- Groq ----------
async def call_groq(model: str, prompt: str, user_keys=None) -> Dict:
    start = time.time()
    key = _resolve_key("groq", user_keys)
    try:
        if settings.DEMO_MODE or not key:
            await asyncio.sleep(0.2)
            text = _demo_response(model, prompt)
        else:
            client = AsyncGroq(api_key=key)
            r = await client.chat.completions.create(
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
        return _empty_result(model, str(e))

# ---------- Dispatcher ----------
PROVIDER_FUNCS = {
    "openai": call_openai,
    "gemini": call_gemini,
    "anthropic": call_anthropic,
    "groq": call_groq,
}

async def call_model(model: str, prompt: str, user_keys=None) -> Dict:
    provider = settings.MODEL_PROVIDERS.get(model)
    if not provider:
        return _empty_result(model, f"Unknown model: {model}")
    fn = PROVIDER_FUNCS[provider]
    return await fn(model, prompt, user_keys)

# ---------- Battle (now configurable) ----------
DEFAULT_BATTLE_MODELS = [
    "gpt-4o-mini",
    "gemini-2.5-flash",
    "claude-haiku-4-5",
    "llama-3.1-8b-instant",
]

async def battle(prompt: str, models=None, user_keys=None):
    models = models or DEFAULT_BATTLE_MODELS
    results = await asyncio.gather(
        *[call_model(m, prompt, user_keys) for m in models]
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

async def optimize(prompt: str, user_keys=None) -> Dict:
    original_tokens = count_tokens(prompt)
    key = _resolve_key("gemini", user_keys)

    if settings.DEMO_MODE or not key:
        # Heuristic compression
        words = prompt.split()
        filler = {"please","kindly","could","would","like","very","really","just",
                  "that","the","a","an","so","quite","actually","basically"}
        optimized = " ".join(w for w in words if w.lower() not in filler) or prompt
    else:
        try:
            genai.configure(api_key=key)
            m = genai.GenerativeModel("gemini-2.5-flash",
                                      system_instruction=OPTIMIZER_SYSTEM)
            r = await m.generate_content_async(prompt)
            optimized = (r.text or "").strip() or prompt
        except Exception:
            optimized = prompt

    optimized_tokens = count_tokens(optimized)
    saved_tokens = max(original_tokens - optimized_tokens, 0)
    pct = round((saved_tokens / original_tokens) * 100, 2) if original_tokens else 0.0

    orig_energy = EnergyService.calculate("gpt-4o", original_tokens)
    opt_energy = EnergyService.calculate("gpt-4o", optimized_tokens)
    savings = EnergyService.compare_savings(orig_energy["energy_wh"], opt_energy["energy_wh"])

    return {
        "original_prompt": prompt,
        "optimized_prompt": optimized,
        "original_tokens": original_tokens,
        "optimized_tokens": optimized_tokens,
        "savings": {"tokens_saved": saved_tokens, "percent_saved": pct, **savings},
    }