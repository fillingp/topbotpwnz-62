
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Loader2, Eye, Lightbulb, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ChatHeader from "@/components/ChatHeader";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { GOOGLE_API_KEY } from '@/services/gemini/config';

const VerseVis: React.FC = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<"text" | "image">("text");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Handle file upload for image analysis
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

  // Process text with Gemini
  const processText = async () => {
    if (!input.trim()) {
      toast.error("Prosím zadejte nějaký text k analýze");
      return;
    }

    try {
      setIsProcessing(true);
      toast.info("Zpracovávám váš vstup pomocí Gemini API...");
      
      const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const result = await model.generateContent(`
        Analyzuj následující text a vytvoř jeho vizuální reprezentaci. 
        Popiš, jak by měl být text vizualizován, jaké barvy, tvary a prvky by měly být použity.
        Text: ${input}
      `);
      
      setResult(result.response.text());
      setIsProcessing(false);
      toast.success("Analýza dokončena!");

    } catch (error) {
      console.error("Chyba při zpracování textu:", error);
      toast.error(`Došlo k chybě: ${error instanceof Error ? error.message : "Neznámá chyba"}`);
      setIsProcessing(false);
    }
  };

  // Process image with Gemini Vision
  const processImage = async () => {
    if (!uploadedImage) {
      toast.error("Prosím nahrajte obrázek k analýze");
      return;
    }

    if (!input.trim()) {
      toast.error("Prosím zadejte pokyn pro analýzu obrázku");
      return;
    }

    try {
      setIsProcessing(true);
      toast.info("Analyzuji obrázek pomocí Gemini Vision...");
      
      // Extract the base64 data from the image string
      const base64Data = uploadedImage.split('base64,')[1];
      
      const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        }
      };

      const promptPart = { text: input };
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [promptPart, imagePart] }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
          }
        ]
      });
      
      setResult(result.response.text());
      setIsProcessing(false);
      toast.success("Analýza obrázku dokončena!");

    } catch (error) {
      console.error("Chyba při analýze obrázku:", error);
      toast.error(`Došlo k chybě při analýze: ${error instanceof Error ? error.message : "Neznámá chyba"}`);
      setIsProcessing(false);
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
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Text k vizualizaci</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Textarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Vložte báseň, text nebo popis k vizualizaci..."
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-purple-500 min-h-32"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <Button
                      onClick={processText}
                      disabled={isProcessing || !input.trim()}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Zpracovávám...
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Vizualizovat text
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="image">
              <Card className="bg-slate-800/50 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Analýza obrázku</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-slate-300">Nahrát obrázek</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload}
                          className="bg-slate-700/50 text-slate-300 px-3 py-2 rounded-md border border-slate-600"
                          disabled={isProcessing}
                        />
                      </label>
                      
                      {uploadedImage && (
                        <div className="relative overflow-hidden rounded-md border border-slate-600 h-48">
                          <img 
                            src={uploadedImage} 
                            alt="Nahraný obrázek" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <Textarea
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Zadejte pokyn pro analýzu obrázku (např. 'Popiš tento obrázek poeticky' nebo 'Najdi emoce v tomto obrázku')"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-purple-500 min-h-24"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    <Button
                      onClick={processImage}
                      disabled={isProcessing || !input.trim() || !uploadedImage}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzuji obrázek...
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Analyzovat obrázek
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {result && (
            <Card className="bg-slate-800/50 border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Lightbulb className="mr-2 h-5 w-5" />
                  Výsledek analýzy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-slate-300">{result}</div>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="text-sm text-slate-400">
            <p>Tipy pro lepší výsledky:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Používejte bohatý, popisný jazyk</li>
              <li>Pro básně nebo lyrické texty používejte metafory a přirovnání</li>
              <li>Uvádějte konkrétní barvy, materiály nebo tvary, které si představujete</li>
              <li>Při analýze obrázků zadávejte konkrétní otázky nebo témata</li>
            </ul>
          </div>
        </div>
      </div>
      
      <footer className="bg-slate-800/50 border-t border-slate-700/50 p-4 text-center text-slate-400 text-sm">
        <p>VerseVis | Powered by Gemini 1.5 Pro | TopBot.PwnZ © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default VerseVis;
