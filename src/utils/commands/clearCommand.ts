
import { CommandResult } from './types';

export const clearCommand = async (): Promise<CommandResult> => {
  return {
    content: "Konverzace byla vymazána. 🧹",
    type: 'text'
  };
};
