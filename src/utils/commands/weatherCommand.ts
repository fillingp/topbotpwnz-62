
import { CommandResult } from './types';

export const weatherCommand = async (location: string): Promise<CommandResult> => {
  if (!location) {
    return { 
      content: "Ty vole, a kde jako? Zadej místo, ne?! 🙄", 
      type: 'error' 
    };
  }
  
  return {
    content: await getWeather(location),
    type: 'weather',
    data: { location }
  };
};

async function getWeather(location: string): Promise<string> {
  try {
    // Tohle bychom v budoucnu napojili na Google Weather API
    return `# Předpověď počasí pro ${location} 🌤️\n\n**Dnes**: 22°C, Částečně oblačno ☁️\n**Zítra**: 24°C, Slunečno ☀️\n**Pozítří**: 20°C, Déšť 🌧️\n\n*Data jsou ilustrativní, v budoucnu budou napojená na skutečné API*`;
  } catch (error) {
    return `Nemůžu zjistit počasí pro ${location}. Server asi vypadl nebo jsi zadal nějakou pičovinu. 🤷‍♂️`;
  }
}
