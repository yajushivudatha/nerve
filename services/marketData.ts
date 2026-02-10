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
      sentiment: Math.random() > 0.5 ? 'BULL