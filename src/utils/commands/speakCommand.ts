
import { CommandResult } from './types';
import { speakText } from '../messageHandler';

export const speakCommand = async (text: string): Promise<CommandResult> => {
  if (!text) {
    return { 
      content: "A co jako mám říct? Zadej nějaký text! 🔊", 
      type: 'error' 
    };
  }
  
  // Try to speak the provided text
  try {
    const spoken = await speakText(text, 'FEMALE');
    
    return {
      content: spoken 
        ? `Přečetl jsem: "${text}" 🔊` 
        : "Hlasový výstup je momentálně nedostupný. Text je zobrazen níže: " + text,
      type: 'text'
    };
  } catch (error) {
    console.error('Error with speak command:', error);
    return {
      content: "Hlasový výstup je momentálně nedostupný. Text je: " + text,
      type: 'text'
    };
  }
};
