
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { GOOGLE_API_KEY, defaultGenerationConfig, defaultSafetySettings } from './config';

/**
 * Calls the Gemini API to generate a text response
 */
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
    
    // Correct the safety settings with proper types
    const safetySettings = defaultSafetySettings.map(setting => ({
      category: setting.category as HarmCategory,
      threshold: setting.threshold as HarmBlockThreshold
    }));
    
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
      generationConfig: defaultGenerationConfig,
      safetySettings
    });
    
    const response = result.response;
    console.log('Gemini odpověď:', response);
    
    return response.text();
  } catch (error) {
    console.error('Chyba Gemini API:', error);
    throw error;
  }
};

/**
 * Streams responses from Gemini API
 */
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

/**
 * Gets structured responses from Gemini
 */
export const getStructuredResponseFromGemini = async <T>(prompt: string, schema: any): Promise<T> => {
  try {
    console.log("Získávám strukturovanou odpověď z Gemini API:", prompt);
    
    // Create a new instance of GoogleGenerativeAI
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    
    // Get the model for text generation
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Generate the structured content
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `${prompt} (odpověz v češtině)` }] }],
      generationConfig: {
        temperature: 0.2,
        responseSchema: schema
      }
    });

    const response = result.response;
    
    // Parse the JSON response
    if (response.text()) {
      return JSON.parse(response.text()) as T;
    }
    
    throw new Error("Nebyla vrácena žádná strukturovaná odpověď.");
  } catch (error) {
    console.error("Chyba při získávání strukturované odpovědi:", error);
    throw new Error("Nepodařilo se získat strukturovanou odpověď. Zkuste to prosím později.");
  }
};

