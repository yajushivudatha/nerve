import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, AlertOctagon, Activity, ChevronDown, Search, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useApp } from '../../context/AppContext';
import { fetchRealTimeData, MarketData } from '../../services/marketData';

export const Sentinel: React.FC = () => {
  const { constitution, dailyPnL, addTrade } = useApp();

  const [ticker, setTicker] = useState('SPY');
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [quantity, setQuantity] = useState(100);
  const [riskMode, setRiskMode] = useState('Balanced');
  const [checkStatus, setCheckStatus] = useState<'IDLE' | 'CHECKING' | 'APPROVED' | 'BLOCKED'>('IDLE');
  const [blockReason, setBlockReason] = useState<string>('');
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);

  // Execution State
  const [executionModalOpen, setExecutionModalOpen] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<'CONFIRM' | 'PROCESSING' | 'COMPLETED'>('CONFIRM');

  // Load initial data
  useEffect(() => {
    handleFetchMarketData();
  }, []);

  const handleFetchMarketData = async () => {
    if (!ticker) return;
    setIsFetching(true);
    const data = await fetchRealTimeData(ticker);
    if (data) {
      setMarketData(data);
    }
    setIsFetching(false);
  };

  const runCheck = () => {
    if (!marketData) {
        handleFetchMarketData(); // Ensure we have data
    }
    
    setCheckStatus('CHECKING');
    
    setTimeout(() => {
      // 1. Check Global Loss Limit
      if (Math.abs(dailyPnL) > constitution.maxDailyLoss) {
        setCheckStatus('BLOCKED');
        setBlockReason(`Daily Loss Limit ($${constitution.maxDailyLoss}) Exceeded. Trading Locked.`);
        return;
      }

      // 2. Check Late Night
      const hour = new Date().getHours();
      if (constitution.blockLateNight && (hour >= 0 && hour < 4)) {
        setCheckStatus('BLOCKED');
        setBlockReason('Late Night Trading Protocol Active. Market Closed for User.');
        return;
      }

      // 3. Check Notional Value Risk
      // Instead of just quantity, we check total dollar exposure against mode
      const estimatedNotional = (marketData?.price || 0) * quantity;
      
      let maxNotional = 50000; // Default Balanced
      if (riskMode === 'Conservative') maxNotional = 20000;
      if (riskMode === 'Aggressive') maxNotional = 100000;

      if (estimatedNotional > maxNotional) {
        setCheckStatus('BLOCKED');
        setBlockReason(`Notional Value ($${estimatedNotional.toLocaleString()}) exceeds ${riskMode} limit ($${maxNotional.toLocaleString()}).`);
        return;
      }

      // If all checks pass
      setCheckStatus('APPROVED');
    }, 1500);
  };

  const handleExecuteClick = () => {
    setExecutionStatus('CONFIRM');
    setExecutionModalOpen(true);
  };

  const handleConfirmExecution = () => {
    setExecutionStatus('PROCESSING');
    setTimeout(() => {
      setExecutionStatus('COMPLETED');
      // Add trade to global history
      addTrade({
        id: Math.random().toString(36).substr(2, 9),
        ticker: ticker.toUpperCase(),
        quantity,
        type: 'BUY',
        status: 'EXECUTED',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pnl: 0 // New trade has 0 pnl initially
      });
    }, 2000);
  };

  const handleCloseExecution = () => {
    setExecutionModalOpen(false);
    if (executionStatus === 'COMPLETED') {
        setCheckStatus('IDLE');
        setQuantity(100);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2 mb-12">
        <h2 className="text-3xl font-bold font-mono tracking-tight text-white neon-text">PRE-TRADE SENTINEL</h2>
        <p className="text-nerve-muted">Live market data integration active. Validating against risk constitution.</p>
        <div className="text-xs text-nerve-primary font-mono mt-2">
            DAILY P/L: <span className={dailyPnL >= 0 ? 'text-nerve-success' : 'text-nerve-danger'}>${dailyPnL}</span> / 
            LOSS LIMIT: <span className="text-nerve-danger">-${constitution.maxDailyLoss}</span>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-lg border border-nerve-border shadow-2xl relative overflow-hidden">
        {/* Live Data Display */}
        <div className="absolute top-0 right-0 p-4 flex gap-4">
            <div className="text-right">
                <div className="text-[10px] text-nerve-muted uppercase tracking-widest">REAL-TIME PRICE</div>
                <div className="font-mono text-xl font-bold text-white flex items-center justify-end gap-2">
                    {isFetching ? (
                        <RefreshCw className="animate-spin w-4 h-4 text-nerve-primary" /> 
                    ) : (
                        `$${marketData?.price.toLocaleString() || '---'}`
                    )}
                </div>
            </div>
             <div className="text-right">
                <div className="text-[10px] text-nerve-muted uppercase tracking-widest">24H CHANGE</div>
                <div className={`font-mono text-xl font-bold ${
                    (marketData?.changePercent || 0) >= 0 ? 'text-nerve-success' : 'text-nerve-danger'
                }`}>
                    {marketData?.changePercent}%
                </div>
            </div>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
          
          <div className="w-full">
            <label className="block text-xs font-mono text-nerve-muted mb-1 uppercase tracking-wider">TICKER SYMBOL</label>
            <div className="relative flex gap-2">
               <input 
                 value={ticker}
                 onChange={(e) => setTicker(e.target.value.toUpperCase())}
                 onKeyDown={(e) => e.key === 'Enter' && handleFetchMarketData()}
                 className="w-full bg-black/40 border border-nerve-border text-nerve-text px-4 py-3 rounded-sm font-mono text-sm focus:outline-none focus:border-nerve-primary focus:shadow-[0_0_15px_rgba(59,130,246,0.15)] uppercase"
                 placeholder="e.g. NVDA"
               />
               <button 
                onClick={handleFetchMarketData}
                className="bg-white/5 hover:bg-white/10 border border-nerve-border px-3 rounded text-nerve-muted hover:text-white transition-colors"
               >
                 <Search size={16} />
               </button>
            </div>
          </div>

          <div className="w-full">
            <label className="block text-xs font-mono text-nerve-muted mb-1 uppercase tracking-wider">QUANTITY</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="1" 
                max="2000" 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full accent-nerve-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                disabled={checkStatus !== 'IDLE' && checkStatus !== 'APPROVED'}
              />
              <span className="font-mono text-xl w-20 text-right">{quantity}</span>
            </div>
          </div>
          <div className="w-full">
            <label className="block text-xs font-mono text-nerve-muted mb-1 uppercase tracking-wider">RISK MODE</label>
            <div className="relative">
              <select 
                value={riskMode}
                onChange={(e) => setRiskMode(e.target.value)}
                className="w-full bg-black/40 border border-nerve-border text-nerve-text px-4 py-3 rounded-sm font-mono text-sm focus:outline-none focus:border-nerve-primary appearance-none cursor-pointer"
                disabled={checkStatus !== 'IDLE' && checkStatus !== 'APPROVED'}
              >
                <option>Conservative</option>
                <option>Balanced</option>
                <option>Aggressive</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-nerve-muted pointer-events-none w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        {checkStatus === 'IDLE' && (
          <Button 
            variant="primary" 
            className="w-full h-16 text-lg tracking-widest" 
            onClick={runCheck}
            icon={<ShieldAlert />}
            disabled={!ticker || isFetching}
          >
            RUN PRE-TRADE CHECK
          </Button>
        )}

        {/* Loading State */}
        {checkStatus === 'CHECKING' && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-16 h-16 border-4 border-nerve-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="font-mono text-nerve-primary animate-pulse">ANALYZING NOTIONAL EXPOSURE...</p>
          </div>
        )}

        {/* Results */}
        {checkStatus === 'APPROVED' && (
          <div className="bg-nerve-success/5 border border-nerve-success/20 p-6 rounded animate-in zoom-in duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-nerve-success/20 flex items-center justify-center">
                <CheckCircle className="text-nerve-success w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-nerve-success font-mono">TRADE APPROVED</h3>
                <p className="text-nerve-muted text-sm">Aligns with constitution. Est. Notional: ${((marketData?.price || 0) * quantity).toLocaleString()}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="success" className="flex-1" onClick={handleExecuteClick}>EXECUTE TRADE</Button>
              <Button variant="secondary" onClick={() => setCheckStatus('IDLE')}>MODIFY</Button>
            </div>
          </div>
        )}

        {checkStatus === 'BLOCKED' && (
          <div className="bg-nerve-danger/5 border border-nerve-danger/20 p-6 rounded animate-in zoom-in duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-nerve-danger/5 animate-pulse pointer-events-none" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="w-12 h-12 rounded-full bg-nerve-danger/20 flex items-center justify-center">
                <AlertOctagon className="text-nerve-danger w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-nerve-danger font-mono">TRADE BLOCKED</h3>
                <p className="text-nerve-muted text-sm">{blockReason}</p>
              </div>
            </div>
            <div className="flex gap-4 relative z-10">
              <Button variant="secondary" onClick={() => setQuantity(Math.floor(quantity / 2))}>REDUCE QUANTITY</Button>
              <Button variant="danger" onClick={() => setOverrideModalOpen(true)}>OVERRIDE</Button>
              <Button variant="ghost" onClick={() => setCheckStatus('IDLE')}>CANCEL</Button>
            </div>
          </div>
        )}
      </div>

      <Modal isOpen={overrideModalOpen} onClose={() => setOverrideModalOpen(false)} title="MANUAL OVERRIDE REQUIRED">
        <div className="space-y-4">
          <p className="text-sm text-nerve-muted">Override actions are logged permanently in the Trade Autopsy Journal. Excessive overrides will lock the platform.</p>
          <Input label="REASON FOR OVERRIDE" placeholder="Explain your edge..." />
          <Button variant="danger" className="w-full" onClick={() => {
            setOverrideModalOpen(false);
            setCheckStatus('APPROVED');
          }}>
            CONFIRM OVERRIDE
          </Button>
        </div>
      </Modal>

      {/* Execution Modal */}
      <Modal isOpen={executionModalOpen} onClose={handleCloseExecution} title="EXECUTION GATEWAY">
        <div className="min-h-[200px] flex flex-col justify-center">
          
          {executionStatus === 'CONFIRM' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div className="border border-white/10 bg-white/5 p-4 rounded-sm space-y-2">
                <div className="flex justify-between items-center">
                    <span className="text-nerve-muted text-sm font-mono">TICKER</span>
                    <span className="text-white font-bold font-mono text-lg">{ticker}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-nerve-muted text-sm font-mono">LIVE PRICE</span>
                    <span className="text-white font-bold font-mono">${marketData?.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-nerve-muted text-sm font-mono">QUANTITY</span>
                    <span className="text-white font-bold font-mono">{quantity} SHARES</span>
                </div>
                <div className="border-t border-white/10 my-2 pt-2 flex justify-between items-center">
                    <span className="text-nerve-muted text-sm font-mono">EST. NOTIONAL</span>
                    <span className="text-white font-bold font-mono">~${((marketData?.price || 0) * quantity).toLocaleString('en-US', {minimumFractionDigits: 2})}</span>
                </div>
              </div>
              <Button variant="primary" className="w-full" onClick={handleConfirmExecution} icon={<Activity size={18} />}>
                CONFIRM EXECUTION
              </Button>
            </div>
          )}

          {executionStatus === 'PROCESSING' && (
            <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-nerve-primary/30 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-nerve-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center space-y-1">
                    <p className="font-mono text-white text-lg tracking-widest">ROUTING ORDER</p>
                    <p className="font-mono text-nerve-primary text-sm animate-pulse">CONNECTING TO EXCHANGE...</p>
                </div>
            </div>
          )}

          {executionStatus === 'COMPLETED' && (
            <div className="text-center space-y-6 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-nerve-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-nerve-success" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-mono text-white">ORDER FILLED</h3>
                    <p className="text-nerve-muted font-mono">Executed {quantity} shares of {ticker} @ ${marketData?.price}</p>
                </div>
                 <div className="bg-nerve-success/5 border border-nerve-success/10 p-3 rounded text-xs font-mono text-nerve-success">
                    ORDER ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </div>
                <Button variant="secondary" className="w-full" onClick={handleCloseExecution}>
                    RETURN TO SENTINEL
                </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};