export type Provider = "openai" | "gemini" | "anthropic" | "groq";

export interface UserKeys {
  openai?: string;
  gemini?: string;
  anthropic?: string;
  groq?: string;
}

const STORAGE_KEY = "greenprompt_user_keys";

export function loadKeys(): UserKeys {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function saveKeys(keys: UserKeys) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function clearKeys() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export const PROVIDER_INFO: Record<Provider, { label: string; url: string; placeholder: string; }> = {
  openai:    { label: "OpenAI",    url: "https://platform.openai.com/api-keys",   placeholder: "sk-proj-..." },
  gemini:    { label: "Google Gemini", url: "https://aistudio.google.com/app/apikey", placeholder: "AIza..." },
  anthropic: { label: "Anthropic Claude", url: "https://console.anthropic.com/settings/keys", placeholder: "sk-ant-..." },
  groq:      { label: "Groq (free)", url: "https://console.groq.com/keys",         placeholder: "gsk_..." },
};