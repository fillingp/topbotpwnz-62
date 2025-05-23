
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
            <AvatarImage src="/lovable-uploads/919269ed-b648-431b-8bf2-99352022aff3.png" alt="Topwnz" />
            <AvatarFallback className="text-white font-bold">TW</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-white">Topwnz</h1>
            <p className="text-sm text-slate-300">Váš pokročilý český AI asistent 🧠</p>
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
