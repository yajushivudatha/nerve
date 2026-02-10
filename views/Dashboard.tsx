import React, { useState } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Overview } from './dashboard/Overview';
import { Sentinel } from './dashboard/Sentinel';
import { StrategyEngine } from './dashboard/Strategy';
import { Intelligence } from './dashboard/Intelligence';
import { AgentSwarm } from './dashboard/AgentSwarm';
import { TradeJournal } from './dashboard/Journal';
import { PortfolioRisk } from './dashboard/Risk';
import { Constitution } from './dashboard/Constitution';
import { DashboardModule } from '../types';

interface DashboardProps {
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentModule, setCurrentModule] = useState<DashboardModule>('OVERVIEW');

  const renderModule = () => {
    switch (currentModule) {
      case 'OVERVIEW': return <Overview onNavigate={setCurrentModule} />;
      case 'SENTINEL': return <Sentinel />;
      case 'STRATEGY': return <StrategyEngine />;
      case 'INTELLIGENCE': return <Intelligence />;
      case 'AGENTS': return <AgentSwarm />;
      case 'JOURNAL': return <TradeJournal />;
      case 'RISK': return <PortfolioRisk />;
      case 'SETTINGS': return <Constitution />;
      default: return (
        <div className="flex items-center justify-center h-full text-nerve-muted font-mono animate-pulse">
          MODULE UNDER CONSTRUCTION // AGENTS WORKING
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-nerve-bg text-white overflow-hidden">
      <Sidebar currentModule={currentModule} onNavigate={setCurrentModule} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header onLogout={onLogout} />
        
        <main className="flex-1 overflow-y-auto scrollbar-hide bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-nerve-card via-nerve-bg to-nerve-bg">
          {renderModule()}
        </main>
      </div>
    </div>
  );
};