import { ai } from '../lib/genAI';

export interface MarketData {
  ticker: string;
  price: number;
  changePercent: number;
  volume: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  lastUpdated: string;
}

export const fetchRealTimeData = async (ticker: string): Promise<MarketData | null> => {
  if (!process.env.API_KEY) {
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
      model: 'gemini-3-flash-preview',
      contents: `Find the current real-time stock price, today's percentage change, and trading volume for ${ticker}. Also analyze the immediate short-term sentiment based on recent news headlines.

      Return the response as a raw JSON object (no markdown, no code blocks) with the following structure:
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

    let jsonStr = response.text || "{}";
    
    // Clean up potential markdown code blocks
    if (jsonStr.includes("```")) {
      jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "");
    }
    
    // Attempt to find the JSON object if there is extra text
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        jsonStr = jsonMatch[0];
    }
    
    jsonStr = jsonStr.trim();

    const data = JSON.parse(jsonStr);
    
    return {
      ticker: ticker.toUpperCase(),
      price: typeof data.price === 'number' ? data.price : 0,
      changePercent: typeof data.changePercent === 'number' ? data.changePercent : 0,
      volume: data.volume || 'N/A',
      sentiment: ['BULLISH', 'BEARISH', 'NEUTRAL'].includes(data.sentiment) ? data.sentiment : 'NEUTRAL',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

  } catch (error) {
    console.error("Market data fetch error:", error);
    return null;
  }
};