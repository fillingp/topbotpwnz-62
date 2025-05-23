
import { callGeminiAPI } from './gemini';
import { callPerplexityAPI } from './perplexityService';
import { callSerperAPI } from './serperService';

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
