
import React from 'react';
import { Bot } from "lucide-react";
import QuoteRotator from './QuoteRotator';
import { useIsMobile } from '@/hooks/use-mobile';

const WelcomeBanner: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center py-6 px-4">
      <QuoteRotator />
      <Bot className={`${isMobile ? 'w-12 h-12' : 'w-14 h-14'} mx-auto text-slate-400 mb-3`} />
      <h2 className="text-xl font-bold text-white mb-2">Čau kámo! 👋</h2>
      <p className={`text-slate-300 max-w-md mx-auto ${isMobile ? 'text-xs px-2' : 'text-sm'}`}>
        Jsem TopBot.PwnZ, tvůj brutálně najetej AI asistent.
        Řekni mi něco, na co se zeptáš, nebo použij speciální příkazy jako <code>/help</code>, <code>/joke</code> nebo <code>/about</code>!
      </p>
    </div>
  );
};

export default WelcomeBanner;
