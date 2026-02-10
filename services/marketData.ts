import { ai } from '../lib/genAI';
import { Type } from "@google/genai";

export interface MarketData {
  ticker: string;
  price: number;
  changePercent: number;
  volume: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  lastUpdated: string;
}

const getEnv = (key: string, viteKey: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // @ts-ignore
    return import.meta.env[viteKey] || import.meta.env[key];
  }
  return '';
};

export const fetchRealTimeData = async (ticker: string): Promise<MarketData | null> => {
  const apiKey = getEnv('API_KEY', 'VITE_API_KEY');

  if (!apiKey) {
    // Fallback mock data if no API key is present
    return {
      ticker: ticker.toUpperCase(),
      price: Math.floor(Math.random() * 500) + 100,
      changePercent: Number((Math.random() * 5 - 2).toFixed(2)),
      volume: '15.2M',
      sentiment: Math.random() > 0.5 ? 'BULLISH' : 'BEARISH',
      lastUpdated: new Date().toLocaleTimeString()
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find the current real-time stock price, today's percentage change, and trading volume for ${ticker}. Also analyze the immediate short-term sentiment based on recent news headlines.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            price: { type: Type.NUMBER, description: "Current price in USD" },
            changePercent: { type: Type.NUMBER, description: "Percentage change today (e.g. 1.5 or -2.3)" },
            volume: { type: Type.STRING, description: "Volume e.g. '45.2M'" },
            sentiment: { type: Type.STRING, enum: ['BULLISH', 'BEARISH', 'NEUTRAL'] }
          }
        }
      }
    });

    const data = JSON.parse(response.text);
    
    return {
      ticker: ticker.toUpperCase(),
      price: data.price || 0,
      changePercent: data.changePercent || 0,
      volume: data.volume || 'N/A',
      sentiment: data.sentiment || 'NEUTRAL',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

  } catch (error) {
    console.error("Market data fetch error:", error);
    return null;
  }
};