
import React from 'react';
import { Button } from "@/components/ui/button";
import { Laugh, Heart, Sparkles, Smile, Mic, Search, Image, Github } from "lucide-react";

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
    <div className="flex flex-wrap gap-2 mb-2 px-2 md:px-4 justify-center safe-bottom">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 md:gap-2 w-full">
        <Button 
          variant="outline" 
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center text-xs sm:text-sm"
          onClick={() => onCommandSelected("/help")}
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Nápověda
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center text-xs sm:text-sm"
          onClick={() => onCommandSelected("/joke")}
        >
          <Laugh className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Vtip
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center text-xs sm:text-sm"
          onClick={() => onCommandSelected("/forher")}
        >
          <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Pro ni
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center text-xs sm:text-sm"
          onClick={() => onCommandSelected("/forhim")}
        >
          <Smile className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Pro něj
        </Button>
        
        <Button 
          variant="outline"
          size="sm"
          className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center text-xs sm:text-sm"
          onClick={() => onImageAnalysisRequested()}
        >
          <Image className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          Analýza obr.
        </Button>
        
        {onWebSearchRequested && (
          <Button 
            variant="outline"
            size="sm"
            className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center text-xs sm:text-sm"
            onClick={onWebSearchRequested}
          >
            <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Vyhledat
          </Button>
        )}
        
        {onSpeechToTextRequested && (
          <Button 
            variant="outline"
            size="sm"
            className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 text-white flex items-center justify-center text-xs sm:text-sm"
            onClick={onSpeechToTextRequested}
          >
            <Mic className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            Hlas
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuickCommands;
