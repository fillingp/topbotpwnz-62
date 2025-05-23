
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Laugh, Heart, Sparkles } from "lucide-react";

interface QuickCommandsProps {
  onCommandSelected: (command: string) => void;
  onImageAnalysisRequested: () => void;
}

const QuickCommands: React.FC<QuickCommandsProps> = ({ onCommandSelected, onImageAnalysisRequested }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2 px-4">
      <Button 
        variant="outline" 
        size="sm"
        className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
        onClick={() => onCommandSelected("/help")}
      >
        <Sparkles className="w-4 h-4 mr-1" />
        /help
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
        onClick={() => onCommandSelected("/joke")}
      >
        <Laugh className="w-4 h-4 mr-1" />
        /joke
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
        onClick={() => onCommandSelected("/forher")}
      >
        <Heart className="w-4 h-4 mr-1" />
        /forher
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
        onClick={() => onImageAnalysisRequested()}
      >
        <Camera className="w-4 h-4 mr-1" />
        Analýza obrázku
      </Button>
    </div>
  );
};

export default QuickCommands;
