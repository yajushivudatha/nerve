import React from 'react';
import { Agent, Trade } from './types';

export const MOCK_TRADES: Trade[] = [
  { id: 't1', ticker: 'NVDA', quantity: 50, type: 'BUY', status: 'EXECUTED', timestamp: '10:42 AM', pnl: 1200 },
  { id: 't2', ticker: 'TSLA', quantity: 5000, type: 'SELL', status: 'BLOCKED', timestamp: '11:15 AM', reason: 'Risk constitution violation: Oversized position' },
  { id: 't3', ticker: 'AAPL', quantity: 100, type: 'BUY', status: 'EXECUTED', timestamp: '09:35 AM', pnl: -150 },
];

export const MOCK_AGENTS: Agent[] = [
  { id: 'a1', name: 'Macro Sentinel', role: 'Market Conditions', status: 'ACTIVE', lastInsight: 'Yield curve inversion deepening. Recommend defensive allocation.', confidence: 85 },
  { id: 'a2', name: 'Volatility Hunter', role: 'Option Opportunities', status: 'ANALYZING', lastInsight: 'Scanning SPX 0DTE implied volatility skew...', confidence: 62 },
  { id: 'a3', name: 'News Catalyst', role: 'Sentiment Analysis', status: 'IDLE', lastInsight: 'Awaiting earnings reports for Big Tech sector.', confidence: 0 },
];

export const INITIAL_CONSTITUTION = {
  maxDailyLoss: 5000,
  maxLeverage: 3,
  cooldownTimer: 15,
  blockRevenge: true,
  blockLateNight: true,
  aiCoach: true,
};