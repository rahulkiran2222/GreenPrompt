import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Server-side fallback keys (your own — for demo users)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")

    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./greenprompt.db")
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:3000"
    ).split(",")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "false").lower() == "true"

    # Energy coefficients (Wh per 1k tokens) — research-aligned
    ENERGY_COEFFICIENTS = {
        # OpenAI
        "gpt-4o": 0.005,
        "gpt-4o-mini": 0.0004,
        # Google Gemini (current)
        "gemini-2.5-pro": 0.004,
        "gemini-2.5-flash": 0.0003,
        "gemini-2.5-flash-lite": 0.00015,
        "gemini-2.0-flash": 0.00025,
        # Anthropic Claude
        "claude-sonnet-4-5": 0.0045,
        "claude-haiku-4-5": 0.0005,
        "claude-3-5-sonnet-20241022": 0.0045,
        "claude-3-5-haiku-20241022": 0.0005,
        # Groq (LPU — extremely efficient)
        "llama-3.3-70b-versatile": 0.0008,
        "llama-3.1-8b-instant": 0.0001,
    }
    CARBON_INTENSITY_G_PER_WH = 0.475  # gCO2e per Wh (IEA 2023 global avg)

    # Map model → required provider key name (sent from frontend)
    MODEL_PROVIDERS = {
        "gpt-4o": "openai",
        "gpt-4o-mini": "openai",
        "gemini-2.5-pro": "gemini",
        "gemini-2.5-flash": "gemini",
        "gemini-2.5-flash-lite": "gemini",
        "gemini-2.0-flash": "gemini",
        "claude-sonnet-4-5": "anthropic",
        "claude-haiku-4-5": "anthropic",
        "claude-3-5-sonnet-20241022": "anthropic",
        "claude-3-5-haiku-20241022": "anthropic",
        "llama-3.3-70b-versatile": "groq",
        "llama-3.1-8b-instant": "groq",
    }

settings = Settings()
