import React, { useState } from 'react';
import { Cpu, Play, Copy, Save, Trash2, Terminal } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const StrategyEngine: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setCode(`import nerve.strategy as ns
import pandas as pd

class VolatilityBreakout(ns.Strategy):
    def init(self):
        self.lookback = 20
        self.threshold = 2.0
    
    def on_bar(self, bar):
        # Calculate Bollinger Bands
        upper, middle, lower = ns.bbands(bar.close, self.lookback)
        
        # Entry Logic
        if bar.close > upper and bar.volume > bar.avg_volume * 1.5:
            self.buy(size=100, sl=bar.low)
            
        # Exit Logic
        if self.position and bar.close < middle:
            self.close()

# Backtest Configuration
ns.run(VolatilityBreakout, 'SPY', start='2023-01-01')`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white neon-text">STRATEGY ENGINE</h2>
          <p className="text-sm text-nerve-muted">Natural Language to Python Strategy Compiler</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<Save size={16} />}>SAVE</Button>
          <Button variant="danger" icon={<Trash2 size={16} />} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Input Side */}
        <div className="flex flex-col gap-4">
          <div className="glass-panel p-1 rounded-sm flex-1 flex flex-col">
            <textarea 
              className="flex-1 bg-transparent p-6 text-white font-mono text-sm resize-none focus:outline-none placeholder:text-white/20"
              placeholder="Describe your strategy in plain English... 
Example: Create a mean reversion strategy on SPY using RSI(14). Buy when RSI < 30 and price is above the 200 SMA. Sell when RSI > 70."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <Button 
            variant="primary" 
            className="w-full" 
            isLoading={isGenerating} 
            onClick={handleGenerate}
            icon={<Cpu size={18} />}
          >
            GENERATE STRATEGY CODE
          </Button>
        </div>

        {/* Code Output Side */}
        <div className="glass-panel rounded-sm border border-nerve-border/50 flex flex-col overflow-hidden relative group">
          <div className="bg-black/40 border-b border-white/5 p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-nerve-accent" />
              <span className="text-xs font-mono text-nerve-muted">strategy.py</span>
            </div>
            {code && (
              <button 
                className="text-nerve-muted hover:text-white transition-colors"
                onClick={() => navigator.clipboard.writeText(code)}
              >
                <Copy size={14} />
              </button>
            )}
          </div>
          
          <div className="flex-1 bg-[#0d0d0d] p-6 overflow-auto relative">
            {code ? (
              <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">{code}</pre>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-nerve-muted/20 font-mono text-sm">
                // WAITING FOR INPUT...
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/5 bg-black/20 flex gap-4">
            <Button variant="primary" className="flex-1" icon={<Play size={16} />} disabled={!code}>BACKTEST NOW</Button>
            <Button variant="secondary" className="flex-1" disabled={!code}>PAPER TRADE</Button>
          </div>
        </div>
      </div>
    </div>
  );
};