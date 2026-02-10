import React, { useState } from 'react';
import { Search, BrainCircuit, Share2, PlusCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface Insight {
  id: string;
  agent: string;
  title: string;
  desc: string;
  impact: 'HIGH' | 'MED' | 'LOW';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
}

const MOCK_INSIGHTS: Insight[] = [
  { id: '1', agent: 'Macro Sentinel', title: 'Yield Curve Inversion Deepening', desc: 'The 2s10s spread has widened to -45bps, signaling increased recession probability in Q4. Recommend defensive sector rotation.', impact: 'HIGH', sentiment: 'BEARISH' },
  { id: '2', agent: 'Volatility Hunter', title: 'Gamma Squeeze Potential in NVDA', desc: 'High concentration of call OI at $130 strike expiring Friday. Dealer hedging may accelerate upside momentum.', impact: 'MED', sentiment: 'BULLISH' },
  { id: '3', agent: 'News Catalyst', title: 'CPI Data Variance', desc: 'Consensus expectation is 3.1%, but real-time alternative data suggests 3.3%. Risk of hawkish Fed repricing.', impact: 'HIGH', sentiment: 'BEARISH' },
];

export const Intelligence: React.FC = () => {
  const [isGathering, setIsGathering] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  const handleGather = () => {
    setIsGathering(true);
    setTimeout(() => {
      setInsights(MOCK_INSIGHTS);
      setIsGathering(false);
    }, 2000);
  };

  return (
    <div className="p-8 h-full flex flex-col space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white neon-text">RETAIL INTELLIGENCE LAYER</h2>
          <p className="text-sm text-nerve-muted">Multi-agent swarm scanning for alpha.</p>
        </div>
        <Button 
          variant="primary" 
          icon={<BrainCircuit size={18} />} 
          onClick={handleGather}
          isLoading={isGathering}
        >
          {isGathering ? 'SWARM BUSY...' : 'GATHER INTELLIGENCE'}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nerve-muted w-5 h-5" />
        <input 
          type="text" 
          placeholder="Query the swarm (e.g., 'What is the sentiment on Semi-conductors?')" 
          className="w-full bg-black/40 border border-white/10 rounded-sm py-4 pl-12 pr-4 font-mono text-white focus:outline-none focus:border-nerve-primary focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all"
        />
      </div>

      {/* Content Area */}
      {insights.length === 0 && !isGathering ? (
        <div className="flex-1 flex flex-col items-center justify-center text-nerve-muted border border-dashed border-white/10 rounded-sm bg-white/5 m-4">
          <BrainCircuit size={48} className="mb-4 opacity-50" />
          <p className="font-mono text-sm">Awaiting command. Initialize swarm to scan markets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20">
          {insights.map((insight) => (
            <div key={insight.id} className="glass-panel p-6 rounded-sm border-t-2 border-t-nerve-primary flex flex-col group hover:bg-white/5 transition-all">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase tracking-widest font-bold text-nerve-primary bg-nerve-primary/10 px-2 py-1 rounded">
                  {insight.agent}
                </span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                  insight.sentiment === 'BULLISH' ? 'text-nerve-success bg-nerve-success/10' : 
                  insight.sentiment === 'BEARISH' ? 'text-nerve-danger bg-nerve-danger/10' : 
                  'text-white bg-white/10'
                }`}>
                  {insight.sentiment}
                </span>
              </div>
              
              <h3 className="font-bold text-lg leading-tight mb-2 text-white group-hover:text-nerve-primary transition-colors">{insight.title}</h3>
              <p className="text-sm text-nerve-muted mb-6 flex-1 leading-relaxed">{insight.desc}</p>
              
              <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                 <Button variant="secondary" className="text-xs px-2" icon={<ArrowUpRight size={14} />}>TRADE</Button>
                 <Button variant="ghost" className="text-xs px-2" icon={<PlusCircle size={14} />}>SENTINEL RULE</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};