import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./greenprompt.db")
    ALLOWED_ORIGINS: list = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:3000"
    ).split(",")
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "false").lower() == "true"

    # Energy coefficients (Wh per 1k tokens)
    ENERGY_COEFFICIENTS = {
        "gpt-4o": 0.005,
        "gpt-4o-mini": 0.0004,
        "gemini-1.5-pro": 0.004,
        "gemini-1.5-flash": 0.0003,
    }
    CARBON_INTENSITY_G_PER_WH = 0.475  # gCO2e per Wh

settings = Settings()