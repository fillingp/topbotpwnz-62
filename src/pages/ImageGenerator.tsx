
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, RefreshCw, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ChatHeader from "@/components/ChatHeader";
import { generateImageWithGemini } from "@/services/apiService";

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Zadej prosím popis obrázku, který chceš vygenerovat");
      return;
    }

    try {
      setIsGenerating(true);
      toast.info("Generuji obrázek, může to chvíli trvat...");

      const imageData = await generateImageWithGemini(prompt);
      
      setGeneratedImage(imageData);
      setLastPrompt(prompt);
      toast.success("Obrázek byl úspěšně vygenerován! 🎨");
    } catch (error) {
      console.error("Chyba při generování obrázku:", error);
      toast.error(`Nepodařilo se vygenerovat obrázek: ${error.message || "Neznámá chyba"}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    // Create an anchor element
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `topwnz-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success("Obrázek stažen! 📥");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-2xl font-bold text-white">Gemini Generátor Obrázků 🎨</h1>
          <p className="text-slate-300">
            Popiš obrázek, který chceš vygenerovat, a nechej AI udělat svou magii. 
            Buď co nejpodrobnější pro lepší výsledky! 🧠✨
          </p>
          
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 block mb-1">
                    Popis obrázku
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Např.: Rozkvetlá louka při západu slunce s horami v pozadí, realistická fotografie"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-purple-500 min-h-24"
                    disabled={isGenerating}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Pro nejlepší výsledky buď co nejkonkrétnější. Uveď styl, barvy, náladu, perspektivu.
                  </p>
                </div>
                
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generuji...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Vygenerovat obrázek
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {generatedImage && (
            <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src={generatedImage} 
                    alt={lastPrompt}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 flex items-end justify-between p-4">
                    <div className="text-white text-sm max-w-[80%]">
                      <p className="font-bold">Prompt:</p>
                      <p className="line-clamp-2">{lastPrompt}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="icon" 
                        onClick={() => {
                          setPrompt(lastPrompt);
                          setGeneratedImage(null);
                        }}
                        title="Upravit a zkusit znovu"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        onClick={handleDownload}
                        className="bg-purple-600 hover:bg-purple-700"
                        title="Stáhnout obrázek"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-slate-400">
            <p>Tipy pro lepší výsledky:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Buď specifický v popisu scény, objektů a jejich umístění</li>
              <li>Uveď styl obrázku (fotorealistický, kresba, akvarelová malba, 3D rendering)</li>
              <li>Specifikuj světelné podmínky, denní dobu a náladu</li>
              <li>Pro postavy popiš výraz, pózu a oblečení</li>
              <li>Používej přídavná jména k upřesnění vzhledu a atmosféry</li>
            </ul>
          </div>
        </div>
      </div>
      
      <footer className="bg-slate-800/50 border-t border-slate-700/50 p-4 text-center text-slate-400 text-sm">
        <p>Powered by Gemini 2.0 Image Generation | TopBot.PwnZ © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default ImageGenerator;
