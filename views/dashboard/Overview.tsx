import React, { useEffect, useState } from 'react';
import { TrendingUp, ShieldCheck, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { MOCK_TRADES } from '../../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { DashboardModule } from '../../types';
import { fetchRealTimeData, MarketData } from '../../services/marketData';

interface OverviewProps {
  onNavigate: (module: DashboardModule) => void;
}

const data = [
  { name: '9:30', value: 4000 },
  { name: '10:00', value: 4200 },
  { name: '10:30', value: 4100 },
  { name: '11:00', value: 4500 },
  { name: '11:30', value: 4300 },
  { name: '12:00', value: 4800 },
  { name: '12:30', value: 5100 },
];

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  const [marketIndices, setMarketIndices] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIndices = async () => {
      // Parallel fetch for speed
      const tickers = ['SPY', 'QQQ', 'BTC-USD'];
      const results = await Promise.all(tickers.map(t => fetchRealTimeData(t)));
      setMarketIndices(results.filter(r => r !== null) as MarketData[]);
      setLoading(false);
    };
    loadIndices();
  }, []);

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-mono tracking-tight">PORTFOLIO OVERVIEW</h2>
        <div className="flex gap-4">
          <Button 
            variant="secondary" 
            icon={<ShieldCheck size={16} />}
            onClick={() => onNavigate('SENTINEL')}
          >
            RUN SENTINEL CHECK
          </Button>
          <Button 
            variant="primary"
            onClick={() => onNavigate('RISK')}
          >
            VIEW FULL PORTFOLIO
          </Button>
        </div>
      </div>

      {/* Live Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-sm hover:border-nerve-primary/50 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded bg-white/5 text-nerve-success">
                <TrendingUp size={20} />
              </div>
              <span className="text-xs font-mono text-nerve-success">+2.4%</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white mb-1">$124,592.00</div>
            <div className="text-xs text-nerve-muted font-mono tracking-wider">NET LIQ</div>
        </div>
        
        {loading ? (
             <div className="md:col-span-3 flex items-center justify-center glass-panel rounded-sm">
                <div className="flex items-center gap-2 text-nerve-muted font-mono">
                    <RefreshCw className="animate-spin" size={16} /> CONNECTING TO MARKET DATA FEED...
                </div>
             </div>
        ) : (
            marketIndices.map((idx, i) => (
                <div key={i} className="glass-panel p-6 rounded-sm hover:border-nerve-primary/50 transition-all border-l-2 border-l-nerve-primary/50">
                    <div className="flex justify-between items-start mb-4">
                    <div className="p-2 rounded bg-white/5 text-nerve-primary">
                        <Activity size={20} />
                    </div>
                    <span className={`text-xs font-mono ${idx.changePercent >= 0 ? 'text-nerve-success' : 'text-nerve-danger'}`}>
                        {idx.changePercent > 0 ? '+' : ''}{idx.changePercent}%
                    </span>
                    </div>
                    <div className="text-2xl font-bold font-mono text-white mb-1">${idx.price.toLocaleString()}</div>
                    <div className="text-xs text-nerve-muted font-mono tracking-wider">{idx.ticker}</div>
                </div>
            ))
        )}
      </div>

      {/* Main Chart */}
      <div className="glass-panel p-6 rounded-sm border border-nerve-border/50 h-[400px]">
        <h3 className="text-sm font-mono text-nerve-muted mb-6">INTRADAY EQUITY CURVE</h3>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="name" stroke="#666" tick={{fill: '#666', fontSize: 12, fontFamily: 'monospace'}} />
            <YAxis stroke="#666" tick={{fill: '#666', fontSize: 12, fontFamily: 'monospace'}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#131316', border: '1px solid #333', borderRadius: '4px' }}
              itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
            />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="glass-panel rounded-sm border border-nerve-border/50 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-sm font-mono text-nerve-muted">RECENT SENTINEL ACTIVITY</h3>
          <Button variant="ghost" className="text-xs" onClick={() => onNavigate('JOURNAL')}>VIEW FULL LOG</Button>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-nerve-muted font-mono text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Ticker</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Action</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {MOCK_TRADES.map((trade) => (
              <tr key={trade.id} className="hover:bg-white/5 transition-colors font-mono">
                <td className="px-6 py-4">{trade.timestamp}</td>
                <td className="px-6 py-4 font-bold text-white">{trade.ticker}</td>
                <td className={`px-6 py-4 ${trade.type === 'BUY' ? 'text-nerve-success' : 'text-nerve-danger'}`}>
                  {trade.type}
                </td>
                <td className="px-6 py-4">{trade.quantity} SHRS</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    trade.status === 'BLOCKED' ? 'bg-nerve-danger/20 text-nerve-danger border border-nerve-danger/30' : 
                    trade.status === 'EXECUTED' ? 'bg-nerve-success/20 text-nerve-success border border-nerve-success/30' : 
                    'bg-white/10 text-white'
                  }`}>
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};