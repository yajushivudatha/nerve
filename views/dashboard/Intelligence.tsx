import React, { useState } from 'react';
import { Search, BrainCircuit, Share2, PlusCircle, ArrowUpRight, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ai } from '../../lib/genAI';

interface Insight {
  id: string;
  agent: string;
  title: string;
  desc: string;
  impact: 'HIGH' | 'MED' | 'LOW';
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  source?: string;
  url?: string;
  timestamp?: string;
}

export const Intelligence: React.FC = () => {
  const [isGathering, setIsGathering] = useState(false);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [query, setQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const handleGather = async () => {
    setIsGathering(true);
    setInsights([]); 
    
    try {
      const searchQuery = query.trim() || "current major financial market events, top moving stocks, and macroeconomic risks";
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Act as a senior financial analyst using institutional data feeds.
        
        Task: Perform a deep-dive search on: "${searchQuery}".
        
        Requirements:
        1. Find 3-6 distinct, real-time news stories or market signals.
        2. Use reputable sources like Yahoo Finance, Bloomberg, Reuters, CNBC, or AllInvestView.
        3. For each story, determine the sentiment and impact.
        4. Assign a specialized "Agent Name" that fits the topic (e.g., "Forex Sentinel", "Equity Hawk", "Crypto Watcher").
        5. CRITICAL: Provide the REAL source name and the ACTUAL URL to the article found via Google Search.
        
        Output Format:
        Return a valid JSON object with the following structure. Do not use Markdown formatting or code blocks.
        {
          "insights": [
            {
              "agentName": "string",
              "title": "string",
              "description": "string",
              "impact": "HIGH" | "MED" | "LOW",
              "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL",
              "sourceName": "string",
              "sourceUrl": "string"
            }
          ]
        }`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      // Strip markdown code blocks if present (e.g. ```json ... ```)
      let cleanText = response.text || '';
      cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();

      const data = JSON.parse(cleanText);
      
      if (data.insights) {
        const newInsights = data.insights.map((item: any, index: number) => ({
          id: `gen-${Date.now()}-${index}`,
          agent: item.agentName,
          title: item.title,
          desc: item.description,
          impact: item.impact,
          sentiment: item.sentiment,
          source: item.sourceName,
          url: item.sourceUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setInsights(newInsights);
        setLastUpdated(new Date().toLocaleTimeString());
      }

    } catch (error) {
      console.error("Intelligence gathering failed:", error);
      // Fallback or error toast could go here
    } finally {
      setIsGathering(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white neon-text">RETAIL INTELLIGENCE LAYER</h2>
          <p className="text-sm text-nerve-muted"></p>
          {lastUpdated && <p className="text-xs text-nerve-primary mt-1 font-mono">LAST SCAN: {lastUpdated}</p>}
        </div>
        <Button 
          variant="primary" 
          icon={isGathering ? <RefreshCw className="animate-spin" size={18} /> : <BrainCircuit size={18} />} 
          onClick={handleGather}
          disabled={isGathering}
        >
          {isGathering ? 'SCANNING MARKETS...' : 'GATHER INTELLIGENCE'}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nerve-muted w-5 h-5 group-focus-within:text-nerve-primary transition-colors" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGather()}
          placeholder="Query the swarm (e.g. 'Latest Nvidia news from Yahoo Finance' or 'Crypto sentiment')" 
          className="w-full bg-black/40 border border-white/10 rounded-sm py-4 pl-12 pr-4 font-mono text-white focus:outline-none focus:border-nerve-primary focus:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all placeholder:text-nerve-muted/50"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <span className="text-[10px] text-nerve-muted border border-white/10 px-2 py-1 rounded bg-white/5">SEARCH ENABLED</span>
            <span className="text-[10px] text-nerve-muted border border-white/10 px-2 py-1 rounded bg-white/5">LIVE</span>
        </div>
      </div>

      {/* Content Area */}
      {insights.length === 0 && !isGathering ? (
        <div className="flex-1 flex flex-col items-center justify-center text-nerve-muted border border-dashed border-white/10 rounded-sm bg-white/5 m-4">
          <BrainCircuit size={48} className="mb-4 opacity-50" />
          <p className="font-mono text-sm">Awaiting command. Initialize swarm to scan institutional feeds.</p>
          <div className="flex gap-2 mt-4">
             <span className="text-xs bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10 hover:text-white transition-colors" onClick={() => { setQuery("Top AI stocks news"); handleGather(); }}>"Top AI stocks"</span>
             <span className="text-xs bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10 hover:text-white transition-colors" onClick={() => { setQuery("Bitcoin vs Ethereum sentiment"); handleGather(); }}>"BTC vs ETH"</span>
             <span className="text-xs bg-white/5 px-2 py-1 rounded cursor-pointer hover:bg-white/10 hover:text-white transition-colors" onClick={() => { setQuery("Fed rate hike probability"); handleGather(); }}>"Fed Rates"</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-20 scrollbar-hide">
          {isGathering ? (
             // Loading Skeletons
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-panel p-6 rounded-sm border border-white/5 h-64 animate-pulse flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <div className="h-4 w-24 bg-white/10 rounded"></div>
                            <div className="h-4 w-16 bg-white/10 rounded"></div>
                        </div>
                        <div className="h-6 w-3/4 bg-white/10 rounded"></div>
                        <div className="h-4 w-full bg-white/10 rounded"></div>
                        <div className="h-4 w-full bg-white/10 rounded"></div>
                    </div>
                    <div className="h-8 w-full bg-white/10 rounded"></div>
                </div>
             ))
          ) : (
            insights.map((insight) => (
                <div key={insight.id} className="glass-panel p-6 rounded-sm border-t-2 border-t-nerve-primary flex flex-col group hover:bg-white/5 transition-all relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-nerve-primary bg-nerve-primary/10 px-2 py-1 rounded border border-nerve-primary/20">
                    {insight.agent}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded border ${
                    insight.sentiment === 'BULLISH' ? 'text-nerve-success bg-nerve-success/10 border-nerve-success/20' : 
                    insight.sentiment === 'BEARISH' ? 'text-nerve-danger bg-nerve-danger/10 border-nerve-danger/20' : 
                    'text-nerve-muted bg-white/10 border-white/10'
                    }`}>
                    {insight.sentiment}
                    </span>
                </div>
                
                <h3 className="font-bold text-lg leading-tight mb-2 text-white group-hover:text-nerve-primary transition-colors line-clamp-2" title={insight.title}>{insight.title}</h3>
                <p className="text-sm text-nerve-muted mb-6 flex-1 leading-relaxed line-clamp-3">{insight.desc}</p>
                
                {insight.source && (
                    <div className="text-[10px] text-nerve-muted font-mono mb-4 flex items-center gap-1">
                        <Share2 size={10} />
                        SOURCE: {insight.source.toUpperCase()}
                    </div>
                )}

                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-3 relative z-10">
                    {insight.url && (
                        <a 
                            href={insight.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-nerve-border text-xs text-white py-2 rounded transition-colors"
                        >
                            READ <ExternalLink size={12} />
                        </a>
                    )}
                    <Button variant="ghost" className="text-xs px-2" icon={<PlusCircle size={14} />}>WATCH</Button>
                </div>
                
                {/* Background Glow based on sentiment */}
                <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 pointer-events-none ${
                    insight.sentiment === 'BULLISH' ? 'bg-nerve-success' : 
                    insight.sentiment === 'BEARISH' ? 'bg-nerve-danger' : 
                    'bg-white'
                }`} />
                </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};