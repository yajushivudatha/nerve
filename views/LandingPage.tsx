import React, { useState } from 'react';
import { ArrowRight, Lock, Play, Activity, AlertCircle, UserPlus, LogIn, Send, CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { supabase } from '../lib/supabaseClient';

interface LandingPageProps {
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD'>('LOGIN');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Demo Form State
  const [demoForm, setDemoForm] = useState({ name: '', email: '', org: '', role: '' });
  const [demoStatus, setDemoStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (authMode === 'FORGOT_PASSWORD') {
        if (!email) throw new Error("Please enter your email address.");
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin,
        });
        
        if (error) throw error;
        setSuccessMsg("Password reset link has been sent to your email.");
      } 
      else if (authMode === 'REGISTER') {
        if (!email || !password) throw new Error("Email and password required.");
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (error) throw error;

        if (data.user && !data.session) {
           setSuccessMsg("Agent ID registered. Please check your email to confirm activation.");
        } else if (data.session) {
           onLogin();
        }
      } 
      else {
        // LOGIN FLOW
        if (!email || !password) throw new Error("Email and password required.");

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
           if (error.message.includes("Invalid login credentials")) {
              setError("ID not recognized or password incorrect. Please register if you are new.");
           } else {
              throw error;
           }
           return; 
        }
        
        onLogin();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemoStatus('SUBMITTING');
    // Simulate API call
    setTimeout(() => {
      setDemoStatus('SUCCESS');
      setDemoForm({ name: '', email: '', org: '', role: '' });
    }, 1500);
  };

  const openAuth = (mode: 'LOGIN' | 'REGISTER') => {
    setAuthMode(mode);
    setIsLoginOpen(true);
    setError(null);
    setSuccessMsg(null);
    // Reset fields
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-nerve-bg text-white selection:bg-nerve-primary/30">
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-nerve-primary/10 rounded-full blur-[120px] animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-nerve-accent/10 rounded-full blur-[100px] animate-pulse-slow delay-1000 mix-blend-screen" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5 glass-panel">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-nerve-primary rounded flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.6)]">
            <Activity className="text-black w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-widest font-mono">NERVE</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => openAuth('LOGIN')}>LOGIN</Button>
          <Button variant="secondary" onClick={() => setIsDemoOpen(true)}>REQUEST DEMO</Button>
          <Button variant="primary" onClick={() => openAuth('LOGIN')} icon={<ArrowRight size={16} />}>
            ENTER DASHBOARD
          </Button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
            
            {/* Version Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-nerve-primary/30 text-nerve-primary text-[10px] font-mono tracking-[0.2em] mb-12 shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-1000">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nerve-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-nerve-primary"></span>
                </span>
                SYSTEM ONLINE_v2.4
            </div>

            {/* Title Section */}
            <div className="relative mb-8 group animate-in zoom-in duration-700">
                {/* Glow/Blur Layer */}
                <h1 className="text-[120px] md:text-[240px] font-black tracking-tighter leading-[0.8] select-none text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 via-blue-500 to-purple-600 blur-3xl opacity-30 absolute inset-0 animate-pulse-slow">
                    NERVE
                </h1>
                
                {/* Main Holographic Text */}
                <h1 className="relative text-[120px] md:text-[240px] font-black tracking-tighter leading-[0.8] select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-blue-500 drop-shadow-[0_0_25px_rgba(59,130,246,0.5)] filter">
                    NERVE
                </h1>

                {/* Scanline/Texture Overlay on text */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_2px,#000_3px)] bg-[size:100%_4px] opacity-10 pointer-events-none mix-blend-overlay"></div>
            </div>

            {/* Subtitle */}
            <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                <p className="relative inline-block bg-nerve-bg px-6 text-sm md:text-xl font-mono font-light tracking-[0.5em] text-blue-200/60 uppercase">
                    The Agentic Brokerage OS
                </p>
            </div>

            {/* Tagline */}
             <p className="text-nerve-muted mt-10 text-lg max-w-xl mx-auto leading-relaxed font-light tracking-wide animate-in fade-in duration-1000 delay-500">
                Your broker executes. <span className="text-white font-medium drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Nerve thinks.</span>
            </p>

            {/* Buttons */}
             <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
                <Button 
                    variant="primary" 
                    className="h-14 px-12 text-lg shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] transition-shadow duration-500 border-nerve-primary/50"
                    onClick={() => openAuth('LOGIN')}
                >
                    LAUNCH NERVE
                </Button>
                <Button 
                    variant="secondary" 
                    className="h-14 px-8 text-lg hover:bg-white/5"
                    icon={<Play size={18} />}
                    onClick={() => setIsDemoOpen(true)}
                >
                    WATCH SENTINEL
                </Button>
             </div>
        </div>
      </main>

      {/* Footer / Features Teaser */}
      <div className="relative z-10 border-t border-white/5 bg-black/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: "PRE-TRADE SENTINEL", desc: "Blocks trades that violate your risk constitution." },
            { title: "STRATEGY ENGINE", desc: "Text-to-Python strategy generation." },
            { title: "AGENT SWARM", desc: "Multi-agent market intelligence scanning." },
            { title: "RAG JOURNAL", desc: "AI-powered trade autopsy and reflections." }
          ].map((feature, i) => (
            <div key={i} className="group p-4 rounded border border-transparent hover:border-nerve-border hover:bg-white/5 transition-all duration-300">
              <h3 className="font-mono font-bold text-nerve-primary mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-nerve-primary rounded-full group-hover:shadow-[0_0_10px_#3b82f6] transition-shadow"></div>
                {feature.title}
              </h3>
              <p className="text-sm text-nerve-muted group-hover:text-white transition-colors">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Modal */}
      <Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} title="REQUEST SENTINEL ACCESS">
          {demoStatus === 'SUCCESS' ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in py-8">
                  <div className="w-16 h-16 bg-nerve-success/20 rounded-full flex items-center justify-center">
                      <Send className="w-8 h-8 text-nerve-success" />
                  </div>
                  <h3 className="text-xl font-bold font-mono text-white">REQUEST RECEIVED</h3>
                  <p className="text-nerve-muted text-sm max-w-xs mx-auto">An onboarding specialist will contact you shortly to schedule your Sentinel demo.</p>
                  <Button variant="secondary" onClick={() => { setIsDemoOpen(false); setDemoStatus('IDLE'); }}>CLOSE</Button>
              </div>
          ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-6">
                  <div className="p-4 bg-white/5 border border-white/10 rounded text-xs text-nerve-muted mb-4">
                      <p className="font-bold text-white mb-1 flex items-center gap-2"><CheckCircle2 size={12} className="text-nerve-success"/> INSTITUTIONAL GRADE RAILS</p>
                      Limited slots available for Q3 2025. Please provide your firm details.
                  </div>
                  <div className="space-y-4">
                      <Input 
                          placeholder="Full Name" 
                          value={demoForm.name}
                          onChange={e => setDemoForm({...demoForm, name: e.target.value})}
                          required
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-black/50"
                      />
                      <Input 
                          type="email" 
                          placeholder="Work Email" 
                          value={demoForm.email}
                          onChange={e => setDemoForm({...demoForm, email: e.target.value})}
                          required
                           className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-black/50"
                      />
                       <div className="grid grid-cols-2 gap-4">
                          <Input 
                              placeholder="Organization" 
                              value={demoForm.org}
                              onChange={e => setDemoForm({...demoForm, org: e.target.value})}
                               className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-black/50"
                          />
                          <Input 
                              placeholder="Role (e.g. Trader)" 
                              value={demoForm.role}
                              onChange={e => setDemoForm({...demoForm, role: e.target.value})}
                               className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-black/50"
                          />
                      </div>
                  </div>
                  <Button 
                      variant="primary" 
                      className="w-full" 
                      type="submit" 
                      isLoading={demoStatus === 'SUBMITTING'}
                      icon={<Send size={16} />}
                  >
                      SUBMIT REQUEST
                  </Button>
              </form>
          )}
      </Modal>

      {/* Auth Modal */}
      <Modal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        title={
            authMode === 'REGISTER' ? "INITIALIZE NEW AGENT" : 
            authMode === 'FORGOT_PASSWORD' ? "RESET CREDENTIALS" : 
            "AUTHENTICATE AGENT"
        }
      >
        <form onSubmit={handleAuthSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-nerve-danger/10 border border-nerve-danger/30 rounded text-nerve-danger text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2"><AlertCircle size={14} /> {error}</div>
                {authMode === 'LOGIN' && (
                    <button type="button" onClick={() => setAuthMode('REGISTER')} className="text-left underline hover:text-white">
                        Create an account?
                    </button>
                )}
            </div>
          )}
           {successMsg && (
            <div className="p-3 bg-nerve-success/10 border border-nerve-success/30 rounded text-nerve-success text-xs flex items-center gap-2">
                <Activity size={14} /> {successMsg}
            </div>
          )}
          
          <div className="p-4 bg-white/5 border border-white/10 rounded text-xs text-nerve-muted mb-4">
            <p className="font-bold text-white mb-1">SECURE GATEWAY</p>
            {authMode === 'REGISTER' && "Create a new secure identity to access the brokerage layer."}
            {authMode === 'LOGIN' && "Please enter your credentials to decrypt your workspace."}
            {authMode === 'FORGOT_PASSWORD' && "Enter your registered email to receive a password reset link."}
          </div>
          
          <Input 
            label="Agent ID / Email" 
            placeholder="agent@nerve.os" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          {authMode !== 'FORGOT_PASSWORD' && (
             <Input 
                label="Passkey" 
                type="password" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
             />
          )}
          
          <Button 
            type="submit" 
            className="w-full" 
            icon={
                authMode === 'REGISTER' ? <UserPlus size={16} /> : 
                authMode === 'FORGOT_PASSWORD' ? <KeyRound size={16} /> : 
                <LogIn size={16} />
            } 
            isLoading={isLoading}
          >
            {authMode === 'REGISTER' ? "REGISTER AGENT ID" : 
             authMode === 'FORGOT_PASSWORD' ? "SEND RESET LINK" : 
             "ENTER NERVE"}
          </Button>

          <div className="flex flex-col items-center gap-2 text-center">
            {authMode === 'LOGIN' && (
                <>
                    <button 
                        type="button" 
                        onClick={() => { setAuthMode('FORGOT_PASSWORD'); setError(null); setSuccessMsg(null); }}
                        className="text-xs text-nerve-muted hover:text-white transition-colors"
                    >
                        Forgot Password?
                    </button>
                    <button 
                        type="button" 
                        onClick={() => { setAuthMode('REGISTER'); setError(null); setSuccessMsg(null); }}
                        className="text-xs text-nerve-muted hover:text-nerve-primary underline underline-offset-4 transition-colors"
                    >
                        Need an account? Register Agent ID
                    </button>
                </>
            )}

            {(authMode === 'REGISTER' || authMode === 'FORGOT_PASSWORD') && (
                 <button 
                    type="button" 
                    onClick={() => { setAuthMode('LOGIN'); setError(null); setSuccessMsg(null); }}
                    className="text-xs text-nerve-muted hover:text-nerve-primary underline underline-offset-4 transition-colors"
                >
                    Back to Login
                </button>
            )}
          </div>
        </form>
      </Modal>

    </div>
  );
};