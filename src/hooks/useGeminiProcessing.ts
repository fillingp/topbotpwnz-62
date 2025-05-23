
import { useState } from 'react';
import { toast } from "sonner";
import { 
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold
} from '@google/generative-ai';
import { GOOGLE_API_KEY } from '@/services/gemini/config';

export const useGeminiProcessing = () => {
  const [result, setResult] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const processText = async (input: string) => {
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

  const processImage = async (input: string, uploadedImage: string) => {
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

  return {
    result,
    isProcessing,
    processText,
    processImage
  };
};
