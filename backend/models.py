from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from datetime import datetime
from database import Base

class PromptHistory(Base):
    __tablename__ = "prompt_history"
    id = Column(Integer, primary_key=True, index=True)
    mode = Column(String(20))  # "battle" | "optimize"
    prompt = Column(Text)
    optimized_prompt = Column(Text, nullable=True)
    tokens_original = Column(Integer, default=0)
    tokens_optimized = Column(Integer, default=0)
    wh_saved = Column(Float, default=0.0)
    co2_saved_g = Column(Float, default=0.0)
    percent_saved = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)