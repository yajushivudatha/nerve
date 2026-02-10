import { ai } from '../lib/genAI';

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
      contents: `Find the current real-time stock price, today's percentage change, and trading volume for ${ticker}. Also analyze the immediate short-term sentiment based on recent news headlines.
      
      Output Format:
      Return a valid JSON object with the following keys. Do not use Markdown formatting.
      {
        "price": number,
        "changePercent": number,
        "volume": string,
        "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL"
      }`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    // Strip markdown code blocks if present (e.g. ```json ... ```)
    let cleanText = response.text || '';
    cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(cleanText);
    
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