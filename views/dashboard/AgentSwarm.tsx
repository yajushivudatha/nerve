import React, { useState, useEffect } from 'react';
import { Users, Power, RefreshCw, Activity, Terminal } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MOCK_AGENTS } from '../../constants';
import { Agent } from '../../types';

export const AgentSwarm: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [isSwarmActive, setIsSwarmActive] = useState(true);
  const [logs, setLogs] = useState<string[]>([
    '> [SYSTEM] Swarm initialized...',
    '> [MACRO] Scanning Fed speak transcripts...',
    '> [VOLATILITY] Analyzing SPX 0DTE flow...',
  ]);

  useEffect(() => {
    if (!isSwarmActive) return;
    const interval = setInterval(() => {
      const actions = [
        '> [NEWS] Parsing Bloomberg terminal feed...',
        '> [SENTINEL] Cross-referencing risk limits...',
        '> [MACRO] Yield curve update: 2Y at 4.5%...',
        '> [VOLATILITY] VIX spike detected > 15...',
        '> [CRYPTO] BTC correlation with Nasdaq dropping...',
      ];
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      setLogs(prev => [randomAction, ...prev].slice(0, 10));
    }, 2000);
    return () => clearInterval(interval);
  }, [isSwarmActive]);

  const toggleSwarm = () => {
    setIsSwarmActive(!isSwarmActive);
    setAgents(prev => prev.map(a => ({ ...a, status: !isSwarmActive ? 'ACTIVE' : 'OFFLINE' })));
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white neon-text">AGENT SWARM MONITOR</h2>
          <p className="text-sm text-nerve-muted">Real-time observation of autonomous trading agents.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" icon={<RefreshCw size={16} />}>RESTART AGENTS</Button>
          <Button 
            variant={isSwarmActive ? 'danger' : 'success'} 
            icon={<Power size={16} />}
            onClick={toggleSwarm}
          >
            {isSwarmActive ? 'PAUSE SWARM' : 'ACTIVATE SWARM'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 min-h-0">
        {/* Agent Cards */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto pr-2">
          {agents.map((agent) => (
            <div key={agent.id} className="glass-panel p-6 rounded-sm flex items-center gap-6 border border-white/5 hover:border-nerve-primary/30 transition-all">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                agent.status === 'ACTIVE' ? 'border-nerve-success bg-nerve-success/10' : 
                agent.status === 'ANALYZING' ? 'border-nerve-primary bg-nerve-primary/10' : 
                'border-nerve-muted bg-white/5'
              }`}>
                <Activity className={`${
                  agent.status === 'ACTIVE' ? 'text-nerve-success animate-pulse' : 
                  agent.status === 'ANALYZING' ? 'text-nerve-primary animate-spin-slow' : 
                  'text-nerve-muted'
                }`} size={24} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <h3 className="font-bold text-white font-mono">{agent.name}</h3>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    agent.status === 'ACTIVE' ? 'text-nerve-success bg-nerve-success/10' : 
                    agent.status === 'ANALYZING' ? 'text-nerve-primary bg-nerve-primary/10' : 
                    'text-nerve-muted bg-white/10'
                  }`}>
                    {agent.status}
                  </span>
                </div>
                <div className="text-xs text-nerve-muted font-mono mb-2 uppercase tracking-wider">{agent.role}</div>
                <div className="bg-black/30 p-3 rounded text-sm font-mono text-nerve-text border border-white/5">
                  "{agent.lastInsight}"
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="text-xs h-8">DETAILS</Button>
                <Button variant="secondary" className="text-xs h-8">REFRESH</Button>
              </div>
            </div>
          ))}
        </div>

        {/* Live Logs */}
        <div className="glass-panel rounded-sm border border-nerve-border/50 flex flex-col overflow-hidden">
          <div className="p-3 bg-black/40 border-b border-white/5 flex items-center gap-2">
            <Terminal size={14} className="text-nerve-accent" />
            <span className="text-xs font-mono font-bold">LIVE_ACTIVITY_LOG</span>
          </div>
          <div className="flex-1 bg-[#050505] p-4 overflow-hidden font-mono text-xs space-y-2">
            {logs.map((log, i) => (
              <div key={i} className={`opacity-${100 - i * 10} text-nerve-primary/80`}>
                {log}
              </div>
            ))}
            <div className="animate-pulse text-nerve-primary">_</div>
          </div>
        </div>
      </div>
    </div>
  );
};