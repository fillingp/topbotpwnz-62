
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, Code, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { generateCode } from "@/utils/messageHandler";

interface CodeGenerationModalProps {
  onClose: () => void;
  onCodeGenerated: (code: string) => void;
}

const CodeGenerationModal: React.FC<CodeGenerationModalProps> = ({ 
  onClose, 
  onCodeGenerated 
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const code = await generateCode(prompt);
      onCodeGenerated(code);
      onClose();
    } catch (error) {
      console.error('Chyba při generování kódu:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="bg-slate-800 p-4 rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Generovat kód</h3>
          <Button variant="ghost" size="icon" onClick={onClose}><X /></Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-slate-300 mb-2">
              Popiš, jaký kód chceš vytvořit, a já ho pro tebe vygeneruji.
            </p>
            <Textarea
              className="bg-slate-700/50 border-slate-600 text-white resize-none h-32"
              placeholder="Např: Vytvoř jednoduchý React komponent pro zobrazení počítadla s tlačítky pro přičítání a odčítání."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button 
            className="w-full"
            onClick={onClose}
            variant="outline"
            disabled={isGenerating}
          >
            Zrušit
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generuji...
              </>
            ) : (
              <>
                <Code className="w-4 h-4 mr-2" />
                Generovat kód
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerationModal;
