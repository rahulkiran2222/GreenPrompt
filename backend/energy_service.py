from typing import Dict
from config import settings

class EnergyService:
    """Pure-math service for energy + carbon calculations."""

    @staticmethod
    def calculate(model: str, total_tokens: int) -> Dict:
        coeff = settings.ENERGY_COEFFICIENTS.get(model, 0.005)
        wh = (total_tokens / 1000.0) * coeff
        co2_g = wh * settings.CARBON_INTENSITY_G_PER_WH
        return {
            "model": model,
            "tokens": total_tokens,
            "energy_wh": round(wh, 6),
            "co2_g": round(co2_g, 6),
            "equivalents": EnergyService.equivalents(wh),
        }

    @staticmethod
    def equivalents(wh: float) -> Dict:
        """Real-world grounding metrics — the 'wow' factor."""
        return {
            "smartphone_charges": round(wh / 12.0, 6),
            "led_bulb_hours": round(wh / 9.0, 6),
            "laptop_minutes": round(wh / 0.83, 4),       # ~50W laptop
            "google_searches": round(wh / 0.3, 3),       # ~0.3 Wh/search
            "ev_meters_driven": round(wh / 0.18, 3),     # ~180 Wh/km Tesla
            "trees_needed_yearly": round((wh * 0.475) / 21000, 9),  # 21kg CO2/tree/yr
        }

    @staticmethod
    def compare_savings(original_wh: float, optimized_wh: float) -> Dict:
        saved = max(original_wh - optimized_wh, 0)
        pct = (saved / original_wh * 100) if original_wh > 0 else 0
        return {
            "wh_saved": round(saved, 6),
            "co2_saved_g": round(saved * settings.CARBON_INTENSITY_G_PER_WH, 6),
            "percent_saved": round(pct, 2),
            "equivalents_saved": EnergyService.equivalents(saved),
        }