
import { toast } from 'sonner';
import { CommandResult } from './commands/types';
import {
  helpCommand,
  aboutCommand,
  jokeCommand,
  weatherCommand,
  mapCommand,
  searchCommand,
  messageCommands,
  clearCommand,
  speakCommand,
  imageCommand,
  recipeCommand
} from './commands';

export { availableCommands } from './commandsList';

export async function processCommand(command: string): Promise<CommandResult> {
  // Rozdělíme příkaz na název a argumenty
  const parts = command.split(' ');
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');

  console.log(`Zpracovávám příkaz: ${commandName} s argumenty: ${args}`);
  
  switch (commandName) {
    case '/help':
      return await helpCommand();
      
    case '/about':
      return await aboutCommand();
      
    case '/joke':
      return await jokeCommand();
      
    case '/weather':
      return await weatherCommand(args);
      
    case '/map':
      return await mapCommand(args);
      
    case '/search':
      return await searchCommand(args);
      
    case '/forhim':
      return await messageCommands.forHim();
      
    case '/forher':
      return await messageCommands.forHer();

    case '/clear':
      return await clearCommand();
      
    case '/speak':
      return await speakCommand(args);

    // Příkaz pro generování obrázků pomocí Gemini API
    case '/image':
      return await imageCommand(args);

    // Příkaz pro generování strukturovaných receptů
    case '/recept':
      return await recipeCommand(args);

    default:
      // Pokud příkaz neexistuje, zkusíme odpovědět přes Gemini API
      if (commandName.startsWith('/')) {
        return {
          content: `Ou, tenhle příkaz ${commandName} ještě nemám implementovanej. 😅 Jsem dobrej, ale ne až tak dobrej. Zkus /help pro seznam příkazů, co umím. 👍`,
          type: 'error'
        };
      }
      return { 
        content: command, 
        type: 'text' 
      };
  }
}
