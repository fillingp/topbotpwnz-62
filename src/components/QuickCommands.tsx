
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Laugh, Heart, Sparkles, Smile, Mic, Search, Image } from "lucide-react";

interface QuickCommandsProps {
  onCommandSelected: (command: string) => void;
  onImageAnalysisRequested: () => void;
  onSpeechToTextRequested?: () => void;
  onWebSearchRequested?: () => void;
}

const QuickCommands: React.FC<QuickCommandsProps> = ({ 
  onCommandSelected, 
  onImageAnalysisRequested,
  onSpeechToTextRequested,
  onWebSearchRequested
}) => {
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
        onClick={() => onCommandSelected("/forhim")}
      >
        <Smile className="w-4 h-4 mr-1" />
        /forhim
      </Button>
      
      <Button 
        variant="outline"
        size="sm"
        className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
        onClick={() => onImageAnalysisRequested()}
      >
        <Image className="w-4 h-4 mr-1" />
        Analýza obrázku
      </Button>
      
      {onSpeechToTextRequested && (
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
          onClick={() => onSpeechToTextRequested()}
        >
          <Mic className="w-4 h-4 mr-1" />
          Hlasový vstup
        </Button>
      )}
      
      {onWebSearchRequested && (
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white"
          onClick={() => onWebSearchRequested()}
        >
          <Search className="w-4 h-4 mr-1" />
          Vyhledat na webu
        </Button>
      )}
    </div>
  );
};

export default QuickCommands;
