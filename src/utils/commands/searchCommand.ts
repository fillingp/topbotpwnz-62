
import { CommandResult } from './types';
import { performWebSearch } from '@/services/apiService';

export const searchCommand = async (query: string): Promise<CommandResult> => {
  if (!query) {
    return { 
      content: "Hele, nemůžu hledat nic. Zadej nějakej dotaz, ty génie! 🧐", 
      type: 'error' 
    };
  }
  
  try {
    const searchResults = await performWebSearch(query);
    
    return {
      content: searchResults,
      type: 'text'
    };
  } catch (error) {
    console.error('Error searching web:', error);
    return {
      content: `Nemůžu vyhledat '${query}'. Něco se posralo, nebo je tvůj dotaz úplně mimo. 💩`,
      type: 'error'
    };
  }
};
