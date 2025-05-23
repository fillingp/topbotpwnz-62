

import { Message } from '@/types/chat';
import { callGeminiAPI, callPerplexityAPI, callSerperAPI, performWebSearch } from '@/services/apiService';
import { analyzeImage, formatAnalysisResult, ImageAnalysisResult } from './imageAnalysisService';
import { synthesizeSpeech, playAudio } from './speechService';
import { toast } from 'sonner';

export const shouldUsePerplexity = (message: string): boolean => {
  const perplexityKeywords = [
    'analýza', 'výzkum', 'studie', 'statistiky', 'data', 'trendy',
    'aktuální', 'nejnovější', 'zprávy', 'současnost', 'vývoj',
    'porovnání', 'hloubková', 'detailní', 'komplexní', 'vyhledej',
    'najdi', 'informace', 'co je', 'kdo je', 'historie'
  ];
  
  return perplexityKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  ) || message.length > 100 || message.endsWith('?');
};

export const generateAIResponse = async (input: string, currentMessages: Message[]): Promise<string> => {
  try {
    let aiResponse: string;
    
    if (shouldUsePerplexity(input)) {
      try {
        console.log('Using web search for this query...');
        aiResponse = await performWebSearch(input);
      } catch (error) {
        console.log('Web search failed, falling back to Gemini...', error);
        aiResponse = await callGeminiAPI(input, currentMessages);
      }
    } else {
      aiResponse = await callGeminiAPI(input, currentMessages);
    }
    
    // Ensure the response contains emoticons
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

// Function to synthesize and play speech for a given text
export const speakText = async (text: string, voiceType: 'FEMALE' | 'MALE' = 'FEMALE'): Promise<boolean> => {
  try {
    // Check if we've already seen the Text-to-Speech API error
    const ttsDisabled = localStorage.getItem('tts_disabled') === 'true';
    
    if (ttsDisabled) {
      toast.info("Text-to-speech je dočasně nedostupný.");
      return false;
    }
    
    // Clean the text for TTS (remove markdown, etc.)
    const cleanText = text
      .replace(/#{1,6} /g, '') // Remove markdown headers
      .replace(/\*\*/g, '')    // Remove bold markers
      .replace(/\*/g, '')      // Remove italic markers
      .replace(/```[^`]*```/g, 'code block')  // Replace code blocks
      .replace(/`[^`]*`/g, '')  // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Replace markdown links with just the text
      .slice(0, 4000);  // Limit text length

    const ttsResult = await synthesizeSpeech(cleanText, voiceType);
    if (ttsResult.success) {
      await playAudio(ttsResult.audio);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Chyba při syntéze řeči:', error);
    
    // If we get a 403 error (API disabled), store that in localStorage to avoid repeated attempts
    if (error.message && error.message.includes('403')) {
      localStorage.setItem('tts_disabled', 'true');
      toast.error("Text-to-speech API není dostupné. Funkce hlasového výstupu je dočasně vypnuta.");
    }
    
    return false;
  }
};

