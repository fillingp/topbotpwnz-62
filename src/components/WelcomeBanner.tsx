
import React from 'react';
import { Bot } from "lucide-react";
import QuoteRotator from './QuoteRotator';

const WelcomeBanner: React.FC = () => {
  return (
    <div className="text-center py-6">
      <QuoteRotator />
      <Bot className="w-12 h-12 mx-auto text-slate-400 mb-2" />
      <h2 className="text-lg font-bold text-white mb-1">Čau kámo! 👋</h2>
      <p className="text-slate-300 max-w-md mx-auto text-xs">
        Jsem TopBot.PwnZ, tvůj brutálně najetej AI asistent.
        Řekni mi něco, na co se zeptáš, nebo použij speciální příkazy jako <code>/help</code>, <code>/joke</code> nebo <code>/about</code>!
      </p>
    </div>
  );
};

export default WelcomeBanner;
