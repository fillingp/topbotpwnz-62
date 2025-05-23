
import React from 'react';
import { Bot } from "lucide-react";
import QuoteRotator from './QuoteRotator';

const WelcomeBanner: React.FC = () => {
  return (
    <div className="text-center py-8">
      <QuoteRotator />
      <Bot className="w-14 h-14 mx-auto text-slate-400 mb-3" />
      <h2 className="text-xl font-bold text-white mb-2">Čau kámo! 👋</h2>
      <p className="text-slate-300 max-w-md mx-auto text-sm">
        Jsem TopBot.PwnZ, tvůj brutálně najetej AI asistent.
        Řekni mi něco, na co se zeptáš, nebo použij speciální příkazy jako <code>/help</code>, <code>/joke</code> nebo <code>/about</code>!
      </p>
    </div>
  );
};

export default WelcomeBanner;
