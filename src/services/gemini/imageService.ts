
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GOOGLE_API_KEY } from './config';

/**
 * Analyzes an image using Gemini Vision
 */
export const analyzeImageWithGemini = async (imageBase64: string, prompt: string = "Detailně popiš, co je na tomto obrázku."): Promise<string> => {
  try {
    console.log("Analyzing image with Gemini Vision...");
    
    // Extract the base64 data without the prefix
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    
    // Use the current Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg"
      }
    };

    const promptPart = {
      text: `${prompt} Odpověz v češtině a detailně.`
    };

    const result = await model.generateContent({
      contents: [{ 
        role: "user", 
        parts: [promptPart, imagePart] 
      }],
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
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ]
    });
    
    return result.response.text();
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Nepodařilo se analyzovat obrázek. Došlo k chybě při komunikaci s Gemini Vision API.");
  }
};

/**
 * Generates an image using Gemini API - Note: Image generation is not available in the current API
 */
export const generateImageWithGemini = async (prompt: string): Promise<string> => {
  try {
    console.log("Generuji obrázek pomocí Gemini API:", prompt);
    
    // Note: Gemini API doesn't currently support image generation
    // This is a placeholder that would need to be updated when the feature becomes available
    throw new Error("Generování obrázků pomocí Gemini API není momentálně podporováno. Použijte jiný poskytovatel pro generování obrázků.");
    
  } catch (error) {
    console.error("Chyba při generování obrázku pomocí Gemini:", error);
    throw new Error("Nepodařilo se vygenerovat obrázek. Generování obrázků pomocí Gemini API není momentálně dostupné.");
  }
};
