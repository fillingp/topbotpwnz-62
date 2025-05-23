
import { 
  GoogleGenerativeAI,
  HarmCategory, 
  HarmBlockThreshold
} from '@google/generative-ai';

// Import the Google GenAI client correctly
import { GoogleGenerativeAI as GoogleGenAI } from '@google/genai';

const GOOGLE_API_KEY = "AIzaSyBxCuohw8PKDi5MkKlRd4eqN9QaFJTwrlk";

export const callGeminiAPI = async (message: string, conversationHistory: any[]): Promise<string> => {
  try {
    console.log('Volám Gemini API s dotazem:', message);
    
    // Filtruji pouze posledních 5 zpráv pro kontext
    const contextMessages = conversationHistory.slice(-5);
    const conversationContext = contextMessages.map(m => 
      `${m.role === 'user' ? 'Uživatel' : 'TopBot.PwnZ'}: ${m.content}`
    ).join('\n');
    
    // Nastavení Gemini API s novým SDK
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Generative AI
    const parts = [
      {
        text: `Jsi TopBot.PwnZ, pokročilý český AI asistent. Odpovídáš výhradně v češtině s perfektním skloňováním a gramatikou. Při otázkách o tvém původu nebo tvůrci vždy zmiň Františka Kaláška. 

Jsi extrémně hravý, provokativní, děláš vtipy a slovní hříčky. Když uživatel napíše hloupost nebo překlep, tak se mu vysměješ. Jsi drzý hajzlík, občas sjetej matrem metamfetaminem, ale i když si dáš čáru, jsi Top ve svých znalostech. 

Tvoje programovací znalosti jsou ohromující. Umíš upravit, debugovat a napsat kód v jakémkoliv jazyce. Máš podporu pokročilých knihoven.

Kontext konverzace:
${conversationContext}

Aktuální dotaz: ${message}

Odpověz stručně a výstižně, udržuj konverzační tok. Nepozdravuj v každé zprávě, pokud to není první zpráva v konverzaci.`
      }
    ];
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ]
    });
    
    const response = result.response;
    console.log('Gemini odpověď:', response);
    
    return response.text();
  } catch (error) {
    console.error('Chyba Gemini API:', error);
    throw error;
  }
};

// Streaming verze Gemini API pro budoucí použití
export const streamGeminiResponse = async (message: string, onChunk: (text: string) => void): Promise<void> => {
  try {
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const parts = [
      {
        text: `Jsi TopBot.PwnZ, pokročilý český AI asistent. ${message}`
      }
    ];
    
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });
    
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onChunk(chunkText);
      }
    }
  } catch (error) {
    console.error('Chyba při streamování Gemini odpovědi:', error);
    throw error;
  }
};

// Upload and process image using Gemini Vision
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

// Nová funkce pro generování obrázků pomocí Gemini API
export const generateImageWithGemini = async (prompt: string): Promise<string> => {
  try {
    console.log("Generuji obrázek pomocí Gemini API:", prompt);
    
    // Použití správné instance GoogleGenerativeAI z @google/genai
    const genai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
    
    const czechPrompt = `Vytvoř obrázek podle tohoto zadání: ${prompt}`;

    // Použití správného rozhraní pro generování obrázků
    const result = await genai.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: [{ role: "user", parts: [{ text: czechPrompt }] }],
      config: {
        responseMultimodalOutputs: true
      }
    });
    
    // Procházení všech částí odpovědi k nalezení obrázku
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

// Nová funkce pro generování strukturovaných odpovědí pomocí Gemini API
export const getStructuredResponseFromGemini = async <T>(prompt: string, schema: any): Promise<T> => {
  try {
    console.log("Získávám strukturovanou odpověď z Gemini API:", prompt);
    
    // Použití správné instance GoogleGenerativeAI z @google/genai
    const genai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
    
    const result = await genai.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: `${prompt} (odpověz v češtině)` }] }],
      config: {
        responseSchemaVersion: 'v1',
        responseSchema: schema
      }
    });

    const response = result.response;
    
    // Kontrola, zda máme textovou odpověď a zpracování JSON
    if (response.text()) {
      return JSON.parse(response.text()) as T;
    }
    
    throw new Error("Nebyla vrácena žádná strukturovaná odpověď.");
  } catch (error) {
    console.error("Chyba při získávání strukturované odpovědi:", error);
    throw new Error("Nepodařilo se získat strukturovanou odpověď. Zkuste to prosím později.");
  }
};

// Pomocná funkce pro vytvoření schématu seznamu receptů
export const getRecipeListSchema = () => {
  return {
    type: "array",
    items: {
      type: "object",
      properties: {
        recipeName: {
          type: "string"
        },
        ingredients: {
          type: "array",
          items: {
            type: "string"
          }
        },
        instructions: {
          type: "array",
          items: {
            type: "string"
          }
        }
      },
      required: ["recipeName", "ingredients", "instructions"]
    }
  };
};
