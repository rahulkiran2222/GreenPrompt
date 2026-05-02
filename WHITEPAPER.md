# GreenPrompt — Sustainability Whitepaper

## Abstract
GreenPrompt is a developer tool for analyzing, comparing, and optimizing the
energy and carbon footprint of LLM prompts in real time.

## 1. Motivation
Inference now dominates lifetime emissions of deployed LLMs. A 30% reduction in
prompt tokens — multiplied across millions of API calls — yields measurable
megawatt-hour and tonne-CO₂ savings.

## 2. Methodology
| Model | Wh / 1k tokens |
|---|---|
| GPT-4o | 0.005 |
| GPT-4o-mini | 0.0004 |
| Gemini 1.5 Pro | 0.004 |
| Gemini 1.5 Flash | 0.0003 |

Carbon: **0.475 g CO₂e per Wh** (IEA 2023 global avg).

Energy(Wh) = (tokens / 1000) × coefficient
CO₂(g) = Energy(Wh) × 0.475

## 3. Optimizer
A high-efficiency model (Gemini 1.5 Flash) rewrites verbose prompts with the
system instruction: *"Rewrite to be 30-50% shorter while preserving 100% of
intent. Remove politeness, redundant adjectives, and filler words."*

## 4. Real-World Equivalents
- 1 smartphone charge = 12 Wh
- 1 LED bulb hour = 9 Wh
- 1 laptop minute = 0.83 Wh
- 1 Google search = 0.3 Wh
- 1 EV km = 180 Wh
- 1 tree (year) absorbs ≈ 21 kg CO₂

## 5. References
1. Patterson et al. (2021), arXiv:2104.10350
2. Luccioni et al. (2023), JMLR — BLOOM carbon footprint
3. Strubell et al. (2019), ACL — Energy and Policy Considerations
4. IEA (2023), Electricity Grid Emissions Factors
5. Google (2024), Environmental Report

## 6. Limitations
Coefficients are estimates from public research. True energy depends on
hardware, batching, KV-cache reuse, and datacenter PUE. Use comparatively.

---
© Raphus Solutions • greenprompt.raphussolutions.com