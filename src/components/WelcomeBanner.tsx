
import React from 'react';
import { Bot } from "lucide-react";

const WelcomeBanner: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Bot className="w-16 h-16 mx-auto text-slate-400 mb-4" />
      <h2 className="text-2xl font-bold text-white mb-2">Čau kámo! 👋</h2>
      <p className="text-slate-300 max-w-md mx-auto">
        Jsem TopBot.PwnZ, tvůj brutálně najetej AI asistent.
        Řekni mi něco, na co se zeptáš, nebo použij speciální příkazy jako <code>/help</code>, <code>/joke</code> nebo <code>/about</code>!
      </p>
    </div>
  );
};

export default WelcomeBanner;
