import { GoogleGenAI } from "@google/genai";

const getEnv = (key: string, viteKey: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[viteKey] || import.meta.env[key];
  }
  return '';
};

// Ensure your API_KEY is set in your environment variables
const apiKey = getEnv('API_KEY', 'VITE_API_KEY');

if (!apiKey) {
  console.warn("NERVE OS: Google Gemini API Key is missing. Market data will be simulated.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || 'PLACEHOLDER' });