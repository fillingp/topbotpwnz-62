
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lightbulb, Image as ImageIcon } from "lucide-react";
import ChatHeader from "@/components/ChatHeader";
import TextVisualizationTab from "@/components/VerseVis/TextVisualizationTab";
import ImageAnalysisTab from "@/components/VerseVis/ImageAnalysisTab";
import ResultDisplay from "@/components/VerseVis/ResultDisplay";
import TipsSection from "@/components/VerseVis/TipsSection";
import { useGeminiProcessing } from "@/hooks/useGeminiProcessing";

const VerseVis: React.FC = () => {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"text" | "image">("text");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const { result, isProcessing, processText, processImage } = useGeminiProcessing();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessText = () => {
    processText(input);
  };

  const handleProcessImage = () => {
    if (uploadedImage) {
      processImage(input, uploadedImage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">VerseVis: Vizualizace poezie a textu</h1>
            <p className="text-slate-300">
              Transformujte své texty do vizuální reprezentace pomocí umělé inteligence Gemini.
              Nahrajte obrázek nebo zadejte text a nechte AI vytvořit novou perspektivu.
            </p>
          </div>
          
          <Tabs 
            defaultValue="text" 
            value={mode}
            onValueChange={(value) => setMode(value as "text" | "image")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="text">
                <Lightbulb className="mr-2 h-4 w-4" />
                Text k vizualizaci
              </TabsTrigger>
              <TabsTrigger value="image">
                <ImageIcon className="mr-2 h-4 w-4" />
                Analýza obrázku
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <TextVisualizationTab
                input={input}
                onInputChange={handleInputChange}
                onProcess={handleProcessText}
                isProcessing={isProcessing}
              />
            </TabsContent>
            
            <TabsContent value="image">
              <ImageAnalysisTab
                input={input}
                uploadedImage={uploadedImage}
                onInputChange={handleInputChange}
                onImageUpload={handleImageUpload}
                onProcess={handleProcessImage}
                isProcessing={isProcessing}
              />
            </TabsContent>
          </Tabs>
          
          <ResultDisplay result={result} />
          <TipsSection />
        </div>
      </div>
      
      <footer className="bg-slate-800/50 border-t border-slate-700/50 p-4 text-center text-slate-400 text-sm">
        <p>VerseVis | Powered by Gemini 1.5 Pro | TopBot.PwnZ © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default VerseVis;
