export type ViewState = 'LANDING' | 'DASHBOARD';

export type DashboardModule = 
  | 'OVERVIEW'
  | 'SENTINEL'
  | 'STRATEGY'
  | 'INTELLIGENCE'
  | 'AGENTS'
  | 'JOURNAL'
  | 'RISK'
  | 'SETTINGS';

export interface Trade {
  id: string;
  ticker: string;
  quantity: number;
  type: 'BUY' | 'SELL';
  status: 'EXECUTED' | 'BLOCKED' | 'PENDING';
  timestamp: string;
  reason?: string;
  pnl?: number;
  emotion?: 'FEAR' | 'GREED' | 'REVENGE' | 'DISCIPLINE' | null;
  lessons?: string[];
  autopsy?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'ACTIVE' | 'IDLE' | 'ANALYZING' | 'OFFLINE';
  lastInsight: string;
  confidence: number;
}

export interface UserConstitution {
  maxDailyLoss: number;
  maxLeverage: number;
  cooldownTimer: number; // minutes
  blockRevenge: boolean;
  blockLateNight: boolean;
  aiCoach: boolean;
}

export interface RiskMetric {
  label: string;
  value: string;
  status: 'SAFE' | 'WARNING' | 'DANGER';
  desc: string;
}
