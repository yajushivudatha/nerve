import React, { useState } from 'react';
import { PieChart, TrendingDown, AlertTriangle, Zap, ArrowRight, ArrowRightCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Cell } from 'recharts';
import { Modal } from '../../components/ui/Modal';

const RISK_DATA = [
  { name: 'Tech', value: 65, color: '#3b82f6' },
  { name: 'Energy', value: 15, color: '#8b5cf6' },
  { name: 'Crypto', value: 10, color: '#ef4444' },
  { name: 'Cash', value: 10, color: '#10b981' },
];

export const PortfolioRisk: React.FC = () => {
  const [modalType, setModalType] = useState<'NONE' | 'REBALANCE' | 'STRESS'>('NONE');
  const [simulationResult, setSimulationResult] = useState<number | null>(null);

  const runRebalance = () => {
    // Functional mock of calculation
    setModalType('REBALANCE');
  };

  const runStressTest = () => {
    setModalType('STRESS');
    setSimulationResult(null);
  };

  const executeSimulation = () => {
    // Simulating a 20% drop calculation
    setSimulationResult(-24840.50);
  };

  return (
    <div className="p-8 h-full overflow-y-auto animate-in fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white neon-text">PORTFOLIO RISK</h2>
          <p className="text-sm text-nerve-muted">Institutional-grade risk analytics and stress testing.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" icon={<Zap size={16} />} onClick={runRebalance}>REBALANCE SUGGESTIONS</Button>
          <Button variant="danger" icon={<AlertTriangle size={16} />} onClick={runStressTest}>STRESS TEST PORTFOLIO</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="glass-panel p-6 rounded-sm border-t-2 border-nerve-success">
            <h3 className="text-xs font-mono text-nerve-muted mb-1">SHARPE RATIO</h3>
            <div className="text-2xl font-bold text-white">1.82</div>
            <div className="text-xs text-nerve-success mt-2">HEALTHY</div>
         </div>
         <div className="glass-panel p-6 rounded-sm border-t-2 border-nerve-primary">
            <h3 className="text-xs font-mono text-nerve-muted mb-1">BETA (SPY)</h3>
            <div className="text-2xl font-bold text-white">1.45</div>
            <div className="text-xs text-nerve-primary mt-2">AGGRESSIVE</div>
         </div>
         <div className="glass-panel p-6 rounded-sm border-t-2 border-nerve-danger">
            <h3 className="text-xs font-mono text-nerve-muted mb-1">VAR (95%)</h3>
            <div className="text-2xl font-bold text-white">-$4,200</div>
            <div className="text-xs text-nerve-danger mt-2">DANGER ZONE</div>
         </div>
         <div className="glass-panel p-6 rounded-sm border-t-2 border-nerve-accent">
            <h3 className="text-xs font-mono text-nerve-muted mb-1">MAX DRAWDOWN</h3>
            <div className="text-2xl font-bold text-white">-12.4%</div>
            <div className="text-xs text-nerve-muted mt-2">YTD</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96">
        <div className="glass-panel p-6 rounded-sm border border-nerve-border/50">
            <h3 className="font-mono text-sm text-white mb-6">SECTOR EXPOSURE</h3>
            <ResponsiveContainer width="100%" height="80%">
                <BarChart data={RISK_DATA}>
                    <XAxis dataKey="name" stroke="#666" fontSize={12} fontFamily="monospace" />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#131316', border: '1px solid #333' }} />
                    <Bar dataKey="value" fill="#3b82f6">
                        {RISK_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>

        <div className="glass-panel p-6 rounded-sm border border-nerve-border/50 flex flex-col justify-between">
            <div>
                <h3 className="font-mono text-sm text-white mb-2">SCENARIO SIMULATION</h3>
                <p className="text-xs text-nerve-muted mb-6">Estimated P/L impact based on hypothetical market moves.</p>
                
                <div className="space-y-4">
                    {[
                        { name: 'S&P 500 -10% Crash', impact: '-$14,500', color: 'text-nerve-danger' },
                        { name: 'Fed Rate Hike +50bps', impact: '-$8,200', color: 'text-nerve-danger' },
                        { name: 'Tech Sector +5% Rally', impact: '+$6,100', color: 'text-nerve-success' }
                    ].map((scenario, i) => (
                        <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded border border-white/5">
                            <span className="text-sm text-nerve-text">{scenario.name}</span>
                            <span className={`font-mono font-bold ${scenario.color}`}>{scenario.impact}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Button variant="primary" className="w-full mt-6" onClick={runStressTest}>RUN CUSTOM SIMULATION</Button>
        </div>
      </div>

      {/* Rebalance Modal */}
      <Modal isOpen={modalType === 'REBALANCE'} onClose={() => setModalType('NONE')} title="PORTFOLIO REBALANCING">
         <div className="space-y-6">
            <p className="text-sm text-nerve-muted">AI Suggestion: Reduce Tech exposure to mitigate concentration risk.</p>
            <div className="space-y-3">
               <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                  <span className="text-white font-mono">SELL NVDA</span>
                  <div className="flex items-center gap-2 text-nerve-danger font-mono">
                     <span>-50 Shares</span>
                  </div>
               </div>
               <div className="flex justify-between items-center p-3 bg-white/5 rounded">
                  <span className="text-white font-mono">BUY TLT</span>
                  <div className="flex items-center gap-2 text-nerve-success font-mono">
                     <span>+200 Shares</span>
                  </div>
               </div>
            </div>
            <Button variant="primary" className="w-full">EXECUTE BATCH REBALANCE</Button>
         </div>
      </Modal>

      {/* Stress Test Modal */}
      <Modal isOpen={modalType === 'STRESS'} onClose={() => setModalType('NONE')} title="BLACK SWAN SIMULATOR">
         <div className="space-y-6">
            <div className="bg-black/40 p-4 rounded border border-white/10">
               <label className="text-xs font-mono text-nerve-muted mb-2 block">SIMULATION PARAMETERS</label>
               <select className="w-full bg-white/5 border border-white/10 p-2 rounded text-white font-mono mb-2">
                  <option>Global Pandemic 2.0</option>
                  <option>Tech Bubble Burst (-40%)</option>
                  <option>Hyperinflation Spiral</option>
               </select>
               <Button variant="danger" className="w-full" onClick={executeSimulation}>RUN SIMULATION</Button>
            </div>

            {simulationResult && (
               <div className="p-4 bg-nerve-danger/10 border border-nerve-danger/30 rounded text-center animate-in zoom-in">
                  <div className="text-xs text-nerve-danger font-bold mb-1">PROJECTED PORTFOLIO IMPACT</div>
                  <div className="text-3xl font-mono text-white">${simulationResult.toLocaleString()}</div>
                  <div className="text-sm text-nerve-muted mt-1">-19.2% Drawdown</div>
               </div>
            )}
         </div>
      </Modal>
    </div>
  );
};