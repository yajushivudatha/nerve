import React, { useState } from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-16 border-b border-white/5 bg-nerve-bg/95 backdrop-blur flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-nerve-success/10 border border-nerve-success/20">
          <div className="w-1.5 h-1.5 bg-nerve-success rounded-full animate-pulse" />
          <span className="text-xs font-mono text-nerve-success uppercase tracking-wider">Market Open</span>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-8 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nerve-muted w-4 h-4" />
        <input 
          type="text" 
          placeholder="Search ticker, strategy, or agent command..." 
          className="w-full bg-black/20 border border-white/10 rounded-sm py-2 pl-10 pr-4 text-sm font-mono text-white focus:outline-none focus:border-nerve-primary focus:bg-black/40 transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            className="p-2 text-nerve-muted hover:text-white transition-colors relative"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-nerve-danger rounded-full" />
          </button>
          
          {notificationsOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 glass-panel border border-nerve-border rounded-sm shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-3 border-b border-white/5 flex justify-between items-center">
                <span className="text-xs font-bold font-mono">NOTIFICATIONS</span>
                <span className="text-xs text-nerve-primary cursor-pointer hover:underline">CLEAR ALL</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-white/5 border-b border-white/5 cursor-pointer">
                  <div className="text-xs text-nerve-danger font-bold mb-1">TRADE BLOCKED</div>
                  <p className="text-xs text-nerve-muted">TSLA Buy order blocked by Sentinel. Risk limit exceeded.</p>
                </div>
                <div className="p-3 hover:bg-white/5 cursor-pointer">
                  <div className="text-xs text-nerve-accent font-bold mb-1">AGENT ALERT</div>
                  <p className="text-xs text-nerve-muted">Volatility Hunter detected unusual volume in NVDA calls.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-white">TRADER_01</div>
            <div className="text-[10px] text-nerve-muted font-mono">LVL 4 ACCESS</div>
          </div>
          <button className="w-8 h-8 rounded bg-white/5 border border-white/10 flex items-center justify-center hover:border-nerve-primary transition-all">
            <User size={16} />
          </button>
          <button 
            onClick={onLogout}
            className="p-2 text-nerve-muted hover:text-nerve-danger transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};