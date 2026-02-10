import { GoogleGenAI } from "@google/genai";

// Ensure your API_KEY is set in your environment variables
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("NERVE OS: Google Gemini API Key is missing. Market data will be simulated.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || 'PLACEHOLDER' });