
import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HelpCircle } from "lucide-react";

const ChatHeader: React.FC = () => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600">
            <AvatarImage src="/lovable-uploads/8b034600-b266-48d5-8cd1-0acf7f134350.png" alt="TopBot.PwnZ" />
            <AvatarFallback className="text-white font-bold">TB</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-white">TopBot.PwnZ</h1>
            <p className="text-sm text-slate-300">Váš pokročilý a drzý český AI asistent 🤪</p>
          </div>
        </div>
        <Link to="/about">
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
            <HelpCircle className="w-4 h-4 mr-1" />
            O aplikaci
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ChatHeader;
