const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error((await r.json()).detail || "Request failed");
  return r.json();
}
async function get<T>(path: string): Promise<T> {
  const r = await fetch(`${API}${path}`);
  if (!r.ok) throw new Error("Request failed");
  return r.json();
}

export const api = {
  battle: (prompt: string) => post("/api/battle", { prompt }),
  optimize: (prompt: string) => post("/api/optimize", { prompt }),
  estimate: (prompt: string, model = "gpt-4o") => post("/api/estimate", { prompt, model }),
  history: () => get("/api/history"),
  leaderboard: () => get("/api/leaderboard"),
};