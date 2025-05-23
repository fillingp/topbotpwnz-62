
import React from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Laugh, Heart, Sparkles, Smile, Mic, Search, Image, RefreshCw, GitHub, Brain, Calculator, Star } from "lucide-react";

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
    <div className="flex flex-wrap gap-2 mb-2 px-4 justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 w-full">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center"
          onClick={() => onCommandSelected("/help")}
        >
          <Sparkles className="w-4 h-4 mr-1" />
          Nápověda
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center"
          onClick={() => onCommandSelected("/joke")}
        >
          <Laugh className="w-4 h-4 mr-1" />
          Vtip
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center"
          onClick={() => onCommandSelected("/forher")}
        >
          <Heart className="w-4 h-4 mr-1" />
          Pro ni
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center"
          onClick={() => onCommandSelected("/forhim")}
        >
          <Smile className="w-4 h-4 mr-1" />
          Pro něj
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center"
          onClick={() => onImageAnalysisRequested()}
        >
          <Image className="w-4 h-4 mr-1" />
          Analýza obr.
        </Button>
        
        {onWebSearchRequested && (
          <Button 
            variant="outline"
            size="sm"
            className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center"
            onClick={onWebSearchRequested}
          >
            <Search className="w-4 h-4 mr-1" />
            Vyhledat
          </Button>
        )}
        
        {onSpeechToTextRequested && (
          <Button 
            variant="outline"
            size="sm"
            className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center"
            onClick={onSpeechToTextRequested}
          >
            <Mic className="w-4 h-4 mr-1" />
            Hlas
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuickCommands;
