import React, { useState, useEffect } from 'react';
import { LandingPage } from './views/LandingPage';
import { Dashboard } from './views/Dashboard';
import { ViewState } from './types';

export default function App() {
  const [view, setView] = useState<ViewState>('LANDING');

  // Simple authentication simulation
  const handleLogin = () => {
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setView('LANDING');
  };

  return (
    <>
      {view === 'LANDING' && <LandingPage onLogin={handleLogin} />}
      {view === 'DASHBOARD' && <Dashboard onLogout={handleLogout} />}
    </>
  );
}