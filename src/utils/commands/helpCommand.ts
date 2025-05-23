
import { CommandResult } from './types';
import { availableCommands } from '../commandsList';

export const helpCommand = async (): Promise<CommandResult> => {
  return {
    content: `# Dostupné příkazy TopBot.PwnZ 📝\n\n${availableCommands.map(cmd => 
      `**${cmd.command}** - ${cmd.description}`).join('\n')}`,
    type: 'text'
  };
};
