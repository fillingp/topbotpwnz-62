
import { Message } from '@/types/chat';
import { callGeminiAPI, callPerplexityAPI, callSerperAPI, performWebSearch } from '@/services/apiService';
import { analyzeImage, formatAnalysisResult, ImageAnalysisResult } from './imageAnalysisService';
import { synthesizeSpeech, playAudio } from './speechService';

export const shouldUsePerplexity = (message: string): boolean => {
  const perplexityKeywords = [
    'analýza', 'výzkum', 'studie', 'statistiky', 'data', 'trendy',
    'aktuální', 'nejnovější', 'zprávy', 'současnost', 'vývoj',
    'porovnání', 'hloubková', 'detailní', 'komplexní', 'vyhledej',
    'najdi', 'informace', 'co je', 'kdo je', 'historie', 'jak',
    'proč', 'kdy', 'kde', 'kolik', 'jaký', 'jaká', 'jaké', 'kteří'
  ];
  
  return perplexityKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  ) || message.length > 100 || message.endsWith('?');
};

export const generateAIResponse = async (
  input: string, 
  currentMessages: Message[],
  updateStreamingResponse?: (partialResponse: string) => void
): Promise<string> => {
  try {
    let aiResponse: string = '';
    
    if (shouldUsePerplexity(input)) {
      try {
        aiResponse = await performWebSearch(input, updateStreamingResponse);
      } catch (error) {
        console.log('Web search failed, falling back to Gemini...', error);
        aiResponse = await callGeminiAPI(input, currentMessages, updateStreamingResponse);
      }
    } else {
      aiResponse = await callGeminiAPI(input, currentMessages, updateStreamingResponse);
    }
    
    // Ensure the response contains emoticons (if not streaming)
    if (!updateStreamingResponse) {
      aiResponse = ensureEmojis(aiResponse);
    }
    
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
    return false;
  }
};

// Detect code blocks and highlight them
export const processCodeBlocks = (text: string): {formattedText: string, hasCode: boolean} => {
  let hasCode = false;
  
  // Replace code blocks with highlighted versions
  const formattedText = text.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, language, code) => {
    hasCode = true;
    return `<div class="code-block ${language}">${language ? `<div class="code-language">${language}</div>` : ''}${code}</div>`;
  });
  
  // Also handle inline code
  const withInlineCode = formattedText.replace(/`([^`]+)`/g, (match, code) => {
    hasCode = true;
    return `<code>${code}</code>`;
  });
  
  return {
    formattedText: withInlineCode,
    hasCode
  };
};

// Generate code based on user description
export const generateCode = async (description: string): Promise<string> => {
  try {
    // Use Gemini API to generate code based on description
    const prompt = `Vytvoř kód podle tohoto popisu: ${description}. 
    Odpověď formátuj jako markdown s kódem v code blocích se správným jazykem. 
    Přidej komentáře pro vysvětlení složitějších částí kódu. 
    Odpověz pouze kódem a vysvětlením kódu v češtině, bez úvodu nebo závěru.`;
    
    const response = await callGeminiAPI(prompt, []);
    return response;
  } catch (error) {
    console.error('Chyba při generování kódu:', error);
    return "Bohužel došlo k chybě při generování kódu. Zkuste to prosím znovu.";
  }
};
