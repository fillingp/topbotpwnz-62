
import { CommandResult } from './types';

export const mapCommand = async (location: string): Promise<CommandResult> => {
  if (!location) {
    return { 
      content: "A co jako mám zobrazit? Mapu tvýho mozku? Ten je asi hodně prázdnej... 🧠", 
      type: 'error' 
    };
  }
  
  return {
    content: `Tady je mapa pro: ${location} 🗺️`,
    type: 'map',
    data: { location }
  };
};
