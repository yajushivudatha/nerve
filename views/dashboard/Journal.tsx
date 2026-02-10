import React, { useState } from 'react';
import { BookOpen, FileText, Tag, Trash2, Download, BrainCircuit } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useApp } from '../../context/AppContext';
import { Trade } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const TradeJournal: React.FC = () => {
  const { trades } = useApp();
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [isGeneratingAutopsy, setIsGeneratingAutopsy] = useState(false);
  const [journalModalOpen, setJournalModalOpen] = useState(false);

  const handleGenerateAutopsy = () => {
    setIsGeneratingAutopsy(true);
    setTimeout(() => {
      setIsGeneratingAutopsy(false);
    }, 2500);
  };

  const handleExportPDF = () => {
    // Functional Report Generation using Blob
    const headers = "DATE | TICKER | TYPE | QTY | STATUS | PNL | EMOTION";
    const rows = trades.map(t => 
      `${t.timestamp} | ${t.ticker} | ${t.type} | ${t.quantity} | ${t.status} | ${t.pnl || 0} | ${t.emotion || '-'}`
    ).join('\n');
    
    const content = `NERVE OS - TRADE JOURNAL REPORT\nGenerated: ${new Date().toLocaleString()}\n\n${headers}\n${'-'.repeat(50)}\n${rows}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NERVE_JOURNAL_EXPORT_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-white neon-text">RAG TRADE JOURNAL</h2>
          <p className="text-sm text-nerve-muted">AI-powered reflections and trade autopsies.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="secondary" onClick={handleExportPDF} icon={<Download size={16} />}>EXPORT REPORT</Button>
          <Button variant="primary" icon={<FileText size={16} />} onClick={() => setJournalModalOpen(true)}>NEW ENTRY</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Trade List */}
        <div className="glass-panel border border-nerve-border/50 rounded-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 bg-black/20 font-mono text-xs font-bold text-nerve-muted">
            RECENT TRADES
          </div>
          <div className="overflow-y-auto flex-1">
            {trades.map((trade) => (
              <div 
                key={trade.id}
                onClick={() => setSelectedTrade(trade)}
                className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                  selectedTrade?.id === trade.id ? 'bg-white/10 border-l-2 border-l-nerve-primary' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-white">{trade.ticker}</span>
                  <span className="text-xs text-nerve-muted">{trade.timestamp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${trade.type === 'BUY' ? 'text-nerve-success' : 'text-nerve-danger'}`}>
                    {trade.type} {trade.quantity}
                  </span>
                  {trade.pnl !== undefined && (
                    <span className={`text-xs font-mono ${trade.pnl > 0 ? 'text-nerve-success' : 'text-nerve-danger'}`}>
                      {trade.pnl > 0 ? '+' : ''}{trade.pnl}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2 glass-panel border border-nerve-border/50 rounded-sm p-6 flex flex-col relative">
          {selectedTrade ? (
            <>
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/5">
                <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{selectedTrade.ticker} <span className="text-lg text-nerve-muted font-normal">Autopsy</span></h3>
                    <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs border ${
                            selectedTrade.status === 'BLOCKED' ? 'border-nerve-danger text-nerve-danger' : 'border-nerve-success text-nerve-success'
                        }`}>
                            {selectedTrade.status}
                        </span>
                        <span className="px-2 py-1 rounded text-xs border border-white/10 text-nerve-muted bg-white/5">
                            {selectedTrade.type}
                        </span>
                    </div>
                </div>
                <Button variant="danger" icon={<Trash2 size={16} />}>DELETE</Button>
              </div>

              <div className="space-y-6 flex-1 overflow-y-auto">
                {/* AI Analysis Section */}
                <div className="bg-black/20 p-6 rounded border border-white/5">
                    <h4 className="font-mono text-nerve-primary text-sm mb-4 flex items-center gap-2">
                        <BrainCircuit size={16} /> AI POST-TRADE ANALYSIS
                    </h4>
                    {isGeneratingAutopsy ? (
                        <div className="space-y-3 animate-pulse">
                            <div className="h-2 bg-white/10 rounded w-full"></div>
                            <div className="h-2 bg-white/10 rounded w-5/6"></div>
                            <div className="h-2 bg-white/10 rounded w-4/6"></div>
                        </div>
                    ) : (
                        <p className="text-sm text-nerve-muted leading-relaxed">
                            {selectedTrade.status === 'BLOCKED' 
                                ? "Sentinel blocked this trade due to oversized risk allocation relative to daily drawdown limits. The attempted size was 3.4x standard deviation of your average position size."
                                : "Trade executed within parameters. Entry timing coincided with a key support retest. However, profit taking was premature based on the 15m RSI divergence."
                            }
                        </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-white/5">
                        <Button 
                            variant="secondary" 
                            className="w-full" 
                            onClick={handleGenerateAutopsy}
                            isLoading={isGeneratingAutopsy}
                        >
                            {isGeneratingAutopsy ? 'ANALYZING...' : 'RE-RUN AUTOPSY'}
                        </Button>
                    </div>
                </div>

                {/* Emotional Tagging */}
                <div>
                    <label className="text-xs font-mono text-nerve-muted mb-3 block">EMOTIONAL STATE</label>
                    <div className="flex gap-2">
                        {['FEAR', 'GREED', 'REVENGE', 'DISCIPLINE'].map(emotion => (
                            <button key={emotion} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-mono transition-colors focus:border-nerve-primary">
                                {emotion}
                            </button>
                        ))}
                    </div>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-nerve-muted opacity-50">
                <BookOpen size={48} className="mb-4" />
                <p>Select a trade to view details</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={journalModalOpen} onClose={() => setJournalModalOpen(false)} title="NEW JOURNAL ENTRY">
        <div className="space-y-4">
            <Input label="TITLE" placeholder="Mid-day reflection..." />
            <div>
                <label className="block text-xs font-mono text-nerve-muted mb-1 uppercase tracking-wider">CONTENT</label>
                <textarea className="w-full bg-black/40 border border-nerve-border text-nerve-text px-4 py-3 rounded-sm focus:outline-none focus:border-nerve-primary h-32 text-sm font-mono"></textarea>
            </div>
            <Button variant="primary" className="w-full">SAVE ENTRY</Button>
        </div>
      </Modal>
    </div>
  );
};