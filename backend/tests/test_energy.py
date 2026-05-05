import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from energy_service import EnergyService

def test_gpt4o_energy():
    r = EnergyService.calculate("gpt-4o", 1000)
    assert r["energy_wh"] == 0.005
    assert round(r["co2_g"], 6) == round(0.005 * 0.475, 6)

def test_flash_is_cheapest():
    pro = EnergyService.calculate("gemini-1.5-pro", 1000)["energy_wh"]
    flash = EnergyService.calculate("gemini-1.5-flash", 1000)["energy_wh"]
    assert flash < pro

def test_savings():
    s = EnergyService.compare_savings(1.0, 0.5)
    assert s["wh_saved"] == 0.5
    assert s["percent_saved"] == 50.0

def test_zero_safety():
    s = EnergyService.compare_savings(0, 0)
    assert s["percent_saved"] == 0