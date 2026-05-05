export interface ModelResult {
  model: string;
  response: string;
  tokens: number;
  latency_ms: number;
  energy_wh: number;
  co2_g: number;
  equivalents: Record<string, number>;
  error?: string | null;
}
export interface BattleResult {
  prompt: string;
  results: ModelResult[];
  most_sustainable: string;
  fastest: string;
}
export interface OptimizeResult {
  original_prompt: string;
  optimized_prompt: string;
  original_tokens: number;
  optimized_tokens: number;
  savings: {
    tokens_saved: number;
    percent_saved: number;
    wh_saved: number;
    co2_saved_g: number;
    equivalents_saved: Record<string, number>;
  };
}