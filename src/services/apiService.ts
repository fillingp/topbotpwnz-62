// API services for various endpoints
import { 
  GoogleGenerativeAI,
  HarmCategory, 
  HarmBlockThreshold 
} from '@google/generative-ai';

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
          category: HarmCategory.HARASSMENT,
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

export const callPerplexityAPI = async (message: string): Promise<string> => {
  try {
    console.log('Volám Perplexity API pro hloubkovou analýzu:', message);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer pplx-Sof6kSDz9OW8VyW4HSphhWvgWDaAoju18YMRzRiIeoysr',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Jsi TopBot.PwnZ, pokročilý český AI asistent vytvořený Františkem Kaláškem. Odpovídáš výhradně v češtině s detailními, přesnými informacemi. Využívej aktuální data a poskytuj hloubkovou analýzu. Používej emotikony pro oživení textu.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: true,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      console.warn(`Perplexity API chyba: ${response.status}`);
      throw new Error(`Perplexity API chyba: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity odpověď:', data);
    
    let result = '';
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      result = data.choices[0].message.content;
      
      // If there are related questions, add them to the response
      if (data.related_questions && data.related_questions.length > 0) {
        result += "\n\n## Související dotazy 🔍\n";
        data.related_questions.forEach((question: string, index: number) => {
          result += `${index + 1}. ${question}\n`;
        });
      }
      
      return result;
    } else {
      throw new Error('Neplatná odpověď z Perplexity API');
    }
  } catch (error) {
    console.error('Chyba Perplexity API:', error);
    throw error;
  }
};

export const callSerperAPI = async (message: string): Promise<string> => {
  try {
    console.log('Volám Serper API jako fallback:', message);
    
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': 'b5bd338dec0d12c6f8c0f2e4af4259e314d692b6',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: message,
        gl: 'cz',
        hl: 'cs',
        num: 5,
        includeAnswer: true,
        includeImages: true,
        includeSearchFeatures: true
      }),
    });

    if (!response.ok) {
      console.warn(`Serper API chyba: ${response.status}`);
      throw new Error(`Serper API chyba: ${response.status}`);
    }

    const data = await response.json();
    console.log('Serper odpověď:', data);
    
    let result = "# Výsledky hledání 🌐\n\n";
    
    // Add featured snippet if available
    if (data.answerBox && data.answerBox.answer) {
      result += `## Rychlá odpověď ⚡\n${data.answerBox.answer}\n\n`;
    } else if (data.answerBox && data.answerBox.snippet) {
      result += `## Výňatek ⚡\n${data.answerBox.snippet}\n\n`;
    }
    
    // Add knowledge graph if available
    if (data.knowledgeGraph) {
      result += `## ${data.knowledgeGraph.title || 'Informace'} 📚\n`;
      result += `${data.knowledgeGraph.description || ''}\n\n`;
    }
    
    // Add organic search results
    if (data.organic && data.organic.length > 0) {
      result += "## Výsledky z webu 🔍\n\n";
      data.organic.slice(0, 5).forEach((item: any, index: number) => {
        result += `### ${index + 1}. ${item.title}\n${item.snippet}\n${item.link}\n\n`;
      });
    }
    
    // Add related searches if available
    if (data.relatedSearches && data.relatedSearches.length > 0) {
      result += "## Související vyhledávání 🔎\n";
      data.relatedSearches.slice(0, 5).forEach((item: string, index: number) => {
        result += `${index + 1}. ${item}\n`;
      });
      result += "\n";
    }
    
    return result;
  } catch (error) {
    console.error('Chyba Serper API:', error);
    throw error;
  }
};

// Enhanced web search function with better fallback and error handling
export const performWebSearch = async (query: string): Promise<string> => {
  console.log("Starting web search for query:", query);
  
  // Improved error handling wrapper for better diagnostics
  const tryApiCall = async (apiName: string, apiCall: () => Promise<string>): Promise<string | null> => {
    try {
      console.log(`Attempting to use ${apiName} API...`);
      const result = await apiCall();
      console.log(`${apiName} API call successful`);
      return result;
    } catch (error) {
      console.error(`${apiName} API failed:`, error);
      return null;
    }
  };
  
  try {
    // First try Perplexity
    const perplexityResult = await tryApiCall("Perplexity", () => callPerplexityAPI(query));
    if (perplexityResult) {
      return perplexityResult;
    }
    
    // Then try Serper
    const serperResult = await tryApiCall("Serper", () => callSerperAPI(query));
    if (serperResult) {
      // If Serper succeeds but we want enhanced results, use Gemini to format them
      try {
        console.log("Enhancing Serper results with Gemini...");
        const enhancedResult = await callGeminiAPI(
          `Na základě těchto informací: ${serperResult}\n\nVytvoř kompletní, informativní odpověď na dotaz: ${query}`, 
          []
        );
        return enhancedResult;
      } catch (geminiError) {
        console.log("Gemini enhancement failed, returning raw Serper data");
        return serperResult; 
      }
    }
    
    // Last resort, just use Gemini
    const geminiResult = await tryApiCall("Gemini", 
      () => callGeminiAPI(`Potřebuji informace o: ${query}. Poskytni mi co nejvíce relevantních informací.`, [])
    );
    if (geminiResult) {
      return geminiResult;
    }
    
    // All APIs failed
    return `Bohužel se nepodařilo získat informace z webu o "${query}". Zkuste to prosím znovu později nebo položte otázku jiným způsobem. 😔`;
  } catch (error) {
    console.error('Kritická chyba při vyhledávání na webu:', error);
    return `Bohužel nastala neočekávaná chyba při vyhledávání "${query}". Zkuste to prosím znovu později. 😔`;
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
          category: HarmCategory.HARASSMENT,
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
