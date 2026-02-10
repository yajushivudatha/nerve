import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import { UserConstitution, Trade } from '../types';
import { INITIAL_CONSTITUTION, MOCK_TRADES } from '../constants';

interface AppContextType {
  session: Session | null;
  constitution: UserConstitution;
  updateConstitution: (newConfig: UserConstitution) => void;
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  dailyPnL: number;
  currentRiskScore: number; // 0-100
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  
  // Load constitution from local storage or default
  const [constitution, setConstitution] = useState<UserConstitution>(() => {
    const saved = localStorage.getItem('nerve_constitution');
    return saved ? JSON.parse(saved) : INITIAL_CONSTITUTION;
  });

  const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES);
  
  // Derived state
  const dailyPnL = trades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  
  // Simple risk score calculation based on daily PnL vs Max Loss
  const currentRiskScore = Math.min(100, Math.max(0, 
    (Math.abs(dailyPnL) / constitution.maxDailyLoss) * 100
  ));

  useEffect(() => {
    // Auth Listener
    // We catch errors here to prevent crashes if Supabase keys are invalid/missing
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    }).catch(err => {
      console.warn("Nerve OS: Auth session check failed (likely missing keys)", err);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateConstitution = (newConfig: UserConstitution) => {
    setConstitution(newConfig);
    localStorage.setItem('nerve_constitution', JSON.stringify(newConfig));
  };

  const addTrade = (trade: Trade) => {
    setTrades(prev => [trade, ...prev]);
  };

  return (
    <AppContext.Provider value={{ 
      session, 
      constitution, 
      updateConstitution, 
      trades, 
      addTrade,
      dailyPnL,
      currentRiskScore
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};