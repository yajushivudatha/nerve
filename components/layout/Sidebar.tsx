import React from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Cpu, 
  BrainCircuit, 
  Users, 
  BookOpen, 
  PieChart, 
  Settings 
} from 'lucide-react';
import { DashboardModule } from '../../types';

interface SidebarProps {
  currentModule: DashboardModule;
  onNavigate: (module: DashboardModule) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentModule, onNavigate }) => {
  const navItems: { id: DashboardModule; icon: React.ElementType; label: string }[] = [
    { id: 'OVERVIEW', icon: LayoutDashboard, label: 'Overview' },
    { id: 'SENTINEL', icon: ShieldAlert, label: 'Sentinel' },
    { id: 'STRATEGY', icon: Cpu, label: 'Strategy Engine' },
    { id: 'INTELLIGENCE', icon: BrainCircuit, label: 'Intelligence' },
    { id: 'AGENTS', icon: Users, label: 'Agent Swarm' },
    { id: 'JOURNAL', icon: BookOpen, label: 'Trade Journal' },
    { id: 'RISK', icon: PieChart, label: 'Portfolio Risk' },
    { id: 'SETTINGS', icon: Settings, label: 'Constitution' },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-nerve-bg/95 backdrop-blur flex flex-col h-full">
      <div className="p-6 border-b border-white/5">
        <div className="text-2xl font-bold font-mono tracking-widest text-white neon-text">NERVE</div>
        <div className="text-[10px] text-nerve-muted uppercase tracking-widest mt-1">Brokerage OS v2.1</div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center gap-3 px-6 py-3 text-sm font-mono tracking-wide transition-all
                ${isActive 
                  ? 'bg-nerve-primary/10 text-nerve-primary border-r-2 border-nerve-primary' 
                  : 'text-nerve-muted hover:text-white hover:bg-white/5'
                }
              `}
            >
              <item.icon size={18} className={isActive ? 'animate-pulse' : ''} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <div className="bg-nerve-card border border-nerve-border p-4 rounded-sm">
          <div className="text-xs text-nerve-muted uppercase mb-2">System Status</div>
          <div className="flex items-center gap-2 text-xs font-mono text-nerve-success">
            <div className="w-2 h-2 bg-nerve-success rounded-full animate-pulse" />
            ALL SYSTEMS ONLINE
          </div>
        </div>
      </div>
    </aside>
  );
};