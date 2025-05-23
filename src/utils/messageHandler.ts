
import { Message } from '@/types/chat';
import { callGeminiAPI, callPerplexityAPI, callSerperAPI } from '@/services/apiService';
import { analyzeImage, formatAnalysisResult, ImageAnalysisResult } from './imageAnalysisService';

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
    
    // Zajistíme, že odpověď obsahuje emotikony
    aiResponse = ensureEmojis(aiResponse);
    
    return aiResponse;
  } catch (error) {
    console.error('Chyba při generování AI odpovědi:', error);
    throw error;
  }
};

export const ensureEmojis = (text: string): string => {
  // Tato funkce zajistí, že text obsahuje emotikony
  // Pokud neobsahuje, přidá jich několik na vhodná místa
  
  // Kontrola, zda text obsahuje emotikony
  const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/u;
  if (emojiRegex.test(text)) {
    return text; // Text již obsahuje emotikony
  }

  // Rozdělíme text na věty
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  // Emotikony, které můžeme přidat
  const emojis = ['😀', '👍', '🚀', '💡', '✨', '🔥', '💪', '🎯', '👉', '🤔', '😎', '👌', '🙌', '💯', '⚡️', '🌟'];
  
  // Přidáme emotikony k některým větám
  let result = '';
  sentences.forEach((sentence, index) => {
    if (index % 3 === 0 && index > 0) { // Přidáme emotikon ke každé třetí větě
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      result += `${sentence} ${randomEmoji} `;
    } else {
      result += `${sentence} `;
    }
  });
  
  // Přidáme emotikon na konec, pokud tam ještě není
  if (!emojiRegex.test(result.slice(-10))) {
    const finalEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    result += finalEmoji;
  }
  
  return result.trim();
};

export const processImageAnalysis = async (imageData: string): Promise<string> => {
  try {
    const result: ImageAnalysisResult = await analyzeImage(imageData);
    return formatAnalysisResult(result);
  } catch (error) {
    console.error('Chyba při zpracování analýzy obrázku:', error);
    return "Bohužel došlo k chybě při analýze obrázku. 😞 Zkuste to prosím znovu později.";
  }
};
