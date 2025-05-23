
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
    
    // Use the Gemini Pro Vision model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-vision" });
    
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
 * Generates an image using Gemini API
 */
export const generateImageWithGemini = async (prompt: string): Promise<string> => {
  try {
    console.log("Generuji obrázek pomocí Gemini API:", prompt);
    
    // Create a new instance of GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    
    const czechPrompt = `Vytvoř obrázek podle tohoto zadání: ${prompt}`;

    // Use the image generation model
    const imageModel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-preview-image-generation" 
    });
    
    // Generate the image content
    const result = await imageModel.generateContent({
      contents: [{ role: "user", parts: [{ text: czechPrompt }] }]
    });
    
    // Get the response and extract the image data
    const response = result.response;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${imageData}`;
      }
    }

    throw new Error("V odpovědi nebyl nalezen žádný obrázek.");
    
  } catch (error) {
    console.error("Chyba při generování obrázku pomocí Gemini:", error);
    throw new Error("Nepodařilo se vygenerovat obrázek. Zkuste to prosím později.");
  }
};
