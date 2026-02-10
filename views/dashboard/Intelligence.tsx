import React, { useState } from 'react';
import { Search, BrainCircuit, Share2, PlusCircle, ArrowUpRight, Loader2, BarChart2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ai } from '../../lib/genAI';

interface Metric {
  label: string;
  value: string;
  trend: 'UP' | 'DOWN' | 'FLAT';
}

interface Insight {
  id: string;
  agent: string;
  title: string;
  desc: string;
  impact: 'HIGH' | 'MED' | 'LOW';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  metrics: Metric[];
}

export const Intelligence: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isGathering, setIsGathering] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);

  const handleSearch = async () => {
    if (!query) return;
    setIsGathering(true);
    setInsights([]); // Clear previous results

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `
                Perform a Deep Research analysis on: "${query}".
                
                Act as a quantitative financial swarm. Emulate the data density of 'yfinance' (technicals) and 'allinvestview' (fundamentals).
                Use Google Search to retrieve REAL-TIME market data, technical indicators (RSI, MACD, SMA), and news.

                Generate exactly 3 distinct agent reports:
                1. "Macro Sentinel": Sector rotation, rates, and global macro structure.
                2. "Technical Hunter": Pure price action, volume analysis, RSI, Support/Resistance levels (yfinance emulation).
                3. "Fundamentalist": Valuation, Earnings, P/E ratios, and growth metrics (allinvestview emulation).

                Return a RAW JSON ARRAY with this structure:
                [
                    {
                        "id": "1",
                        "agent": "Technical Hunter",
                        "title": "Short Headline",
                        "desc": "Deep dive analysis...",
                        "impact": "HIGH",
                        "sentiment": "BULLISH",
                        "metrics": [
                            { "label": "RSI (14)", "value": "72.4", "trend": "UP" },
                            { "label": "Vol / Avg", "value": "1.5x", "trend": "UP" }
                        ]
                    }
                ]
            `,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });

        let jsonStr = response.text || "[]";
        if (jsonStr.includes("```")) {
            jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "");
        }
        jsonStr = jsonStr.trim();
        
        const parsedInsights = JSON.parse(jsonStr);
        setInsights(parsedInsights);

    } catch (error) {
        console.error("Swarm Intelligence Error:", error);
        setInsights([{
            id: 'err',
            agent: 'System',
            title: 'Data Feed Interrupted',
            desc: 'Unable to establish connection with market data nodes. Please verify API key configuration.',
            impact: 'HIGH',
            sentiment: 'NEUTRAL',
            metrics: []
        }]);
    } finally {
        setIsGathering(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
  };

  return (
    <div className="p-8 h-full flex flex-col space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white neon-text">RETAIL INTELLIGENCE LAYER</h2>
          <p className="text-sm text-nerve-muted">Emulating <span className="text-nerve-primary">yfinance</span> & <span className="text-nerve-accent">allinvestview</span> protocols via Gemini 3.</p>
        </div>
        <Button 
          variant="primary" 
          icon={isGathering ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />} 
          onClick={handleSearch}
          isLoading={isGathering}
        >
          {isGathering ? 'SCANNING MARKETS...' : 'RUN PREDICTION'}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nerve-muted w-5 h-5" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter ticker or macro query (e.g. 'NVDA technicals and fair value')" 
          className="w-full bg-black/40 border border-white/10 rounded-sm py-4 pl-12 pr-4 font-mono text-white focus:outline-none focus:border-nerve-primary focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all"
        />
      </div>

      {/* Content Area */}
      {insights.length === 0 && !isGathering ? (
        <div className="flex-1 flex flex-col items-center justify-center text-nerve-muted border border-dashed border-white/10 rounded-sm bg-white/5 m-4">
          <BrainCircuit size={48} className="mb-4 opacity-50" />
          <p className="font-mono text-sm">Swarm Offline. Awaiting target data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20">
          {(insights.length > 0 ? insights : isGathering ? Array(3).fill(null) : []).map((insight, i) => (
            <div key={insight ? insight.id : i} className={`glass-panel p-6 rounded-sm border-t-2 ${isGathering ? 'border-t-white/10' : 'border-t-nerve-primary'} flex flex-col group hover:bg-white/5 transition-all ${isGathering ? 'animate-pulse' : 'animate-in fade-in slide-in-from-bottom-4 duration-500'}`} style={{ animationDelay: `${i * 150}ms` }}>
              {insight ? (
                  <>
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
                    
                    {/* Metrics Grid */}
                    {insight.metrics && insight.metrics.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            {insight.metrics.map((m, idx) => (
                                <div key={idx} className="bg-black/40 border border-white/5 p-2 rounded flex justify-between items-center">
                                    <span className="text-[10px] text-nerve-muted font-mono">{m.label}</span>
                                    <span className={`text-xs font-bold font-mono ${
                                        m.trend === 'UP' ? 'text-nerve-success' : 
                                        m.trend === 'DOWN' ? 'text-nerve-danger' : 'text-white'
                                    }`}>{m.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                        <Button variant="secondary" className="text-xs px-2" icon={<ArrowUpRight size={14} />}>TRADE</Button>
                        <Button variant="ghost" className="text-xs px-2" icon={<BarChart2 size={14} />}>CHART</Button>
                    </div>
                  </>
              ) : (
                  // Skeleton Loading State
                  <div className="space-y-4">
                      <div className="flex justify-between">
                          <div className="h-4 w-24 bg-white/10 rounded"></div>
                          <div className="h-4 w-16 bg-white/10 rounded"></div>
                      </div>
                      <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                      <div className="space-y-2">
                          <div className="h-3 w-full bg-white/10 rounded"></div>
                          <div className="h-3 w-full bg-white/10 rounded"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                          <div className="h-8 bg-white/5 rounded"></div>
                          <div className="h-8 bg-white/5 rounded"></div>
                      </div>
                  </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};