
import { Message } from '@/types/chat';
import { callGeminiAPI, callPerplexityAPI, callSerperAPI } from '@/services/apiService';

export const shouldUsePerplexity = (message: string): boolean => {
  const perplexityKeywords = [
    'analýza', 'výzkum', 'studie', 'statistiky', 'data', 'trendy',
    'aktuální', 'nejnovější', 'zprávy', 'současnost', 'vývoj',
    'porovnání', 'hloubková', 'detailní', 'komplexní'
  ];
  
  return perplexityKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  ) || message.length > 100;
};

export const generateAIResponse = async (input: string, currentMessages: Message[]): Promise<string> => {
  try {
    let aiResponse: string;
    
    if (shouldUsePerplexity(input)) {
      try {
        aiResponse = await callPerplexityAPI(input);
      } catch (error) {
        console.log('Perplexity nedostupná, přepínám na Serper...');
        try {
          const serperData = await callSerperAPI(input);
          aiResponse = await callGeminiAPI(`Na základě těchto informací: ${serperData}\n\nOdpověz na dotaz: ${input}`, currentMessages);
        } catch (serperError) {
          console.log('Serper také nedostupný, používám jen Gemini...');
          aiResponse = await callGeminiAPI(input, currentMessages);
        }
      }
    } else {
      aiResponse = await callGeminiAPI(input, currentMessages);
    }
    
    return aiResponse;
  } catch (error) {
    console.error('Chyba při generování AI odpovědi:', error);
    throw error;
  }
};
