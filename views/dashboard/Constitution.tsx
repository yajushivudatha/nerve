import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Lock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { INITIAL_CONSTITUTION } from '../../constants';
import { useApp } from '../../context/AppContext';

export const Constitution: React.FC = () => {
  // Pull from global state
  const { constitution, updateConstitution } = useApp();
  
  // Local state for editing
  const [localConfig, setLocalConfig] = useState(constitution);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    updateConstitution(localConfig); // Push to global state & local storage
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-8 h-full overflow-y-auto animate-in fade-in">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold font-mono tracking-tight text-white neon-text mb-2">RISK CONSTITUTION</h2>
          <p className="text-nerve-muted">Define the hard rules Sentinel will enforce. These cannot be overridden without a cooldown.</p>
        </div>

        <div className="glass-panel p-8 rounded-lg border border-nerve-primary/30 shadow-[0_0_50px_rgba(59,130,246,0.05)]">
            <div className="space-y-8">
                {/* Sliders */}
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="font-mono text-sm text-white">MAX DAILY LOSS LIMIT</label>
                        <span className="font-mono text-nerve-danger font-bold">${localConfig.maxDailyLoss}</span>
                    </div>
                    <input 
                        type="range" 
                        min="500" max="20000" step="100"
                        value={localConfig.maxDailyLoss}
                        onChange={(e) => setLocalConfig({...localConfig, maxDailyLoss: parseInt(e.target.value)})}
                        className="w-full accent-nerve-danger h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-nerve-muted mt-2">Trading locks automatically when P/L hits this level.</p>
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <label className="font-mono text-sm text-white">COOLDOWN TIMER (MINUTES)</label>
                        <span className="font-mono text-nerve-primary font-bold">{localConfig.cooldownTimer}m</span>
                    </div>
                    <input 
                        type="range" 
                        min="5" max="60" step="5"
                        value={localConfig.cooldownTimer}
                        onChange={(e) => setLocalConfig({...localConfig, cooldownTimer: parseInt(e.target.value)})}
                        className="w-full accent-nerve-primary h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    />
                    <p className="text-xs text-nerve-muted mt-2">Mandatory break after a stopped-out trade.</p>
                </div>

                <div className="h-px bg-white/10 my-6"></div>

                {/* Toggles */}
                <div className="space-y-4">
                    {[
                        { key: 'blockRevenge', label: 'BLOCK REVENGE TRADING', desc: 'Prevents entry if 3 consecutive losses occur in 1 hour.' },
                        { key: 'blockLateNight', label: 'BLOCK LATE NIGHT TRADING', desc: 'Restricts execution between 12:00 AM - 4:00 AM.' },
                        { key: 'aiCoach', label: 'AI COACH INTERVENTION', desc: 'Allows Agent Swarm to pause trading if psychological tilt is detected.' }
                    ].map((item: any) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-white/5 rounded border border-white/5 hover:border-nerve-primary/30 transition-all">
                            <div>
                                <h4 className="font-bold text-sm text-white">{item.label}</h4>
                                <p className="text-xs text-nerve-muted">{item.desc}</p>
                            </div>
                            <button 
                                onClick={() => setLocalConfig({...localConfig, [item.key]: !localConfig[item.key as keyof typeof localConfig]})}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${localConfig[item.key as keyof typeof localConfig] ? 'bg-nerve-success' : 'bg-white/20'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${localConfig[item.key as keyof typeof localConfig] ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 flex gap-4">
                <Button 
                    variant="primary" 
                    className="flex-1 h-12" 
                    onClick={handleSave}
                    icon={isSaved ? <Lock size={18} /> : <Save size={18} />}
                >
                    {isSaved ? 'CONSTITUTION ACTIVE' : 'ACTIVATE CONSTITUTION'}
                </Button>
                <Button variant="secondary" onClick={() => setLocalConfig(INITIAL_CONSTITUTION)} icon={<RotateCcw size={18} />}>
                    RESET TO DEFAULTS
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};