
import { CommandResult } from './types';
import { generateImageWithGemini } from '@/services/apiService';
import { toast } from 'sonner';

export const imageCommand = async (prompt: string): Promise<CommandResult> => {
  if (!prompt) {
    return { 
      content: "A co jako mám vygenerovat? Zadej popis obrázku, ty chytrolíne! 🖼️", 
      type: 'error' 
    };
  }
  
  try {
    // Začátek generování - informovat uživatele
    toast.info("Generuji obrázek, může to chvíli trvat...");
    
    const imageData = await generateImageWithGemini(prompt);
    
    return {
      content: `## Vygenerovaný obrázek 🖼️\n\n### Zadání: "${prompt}"\n\n![${prompt}](${imageData})`,
      type: 'image',
      data: { imageUrl: imageData, prompt }
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      content: `Nepodařilo se vygenerovat obrázek: ${error instanceof Error ? error.message : "Neznámá chyba"}. Zkus to znovu s jiným zadáním. 🤔`,
      type: 'error'
    };
  }
};
