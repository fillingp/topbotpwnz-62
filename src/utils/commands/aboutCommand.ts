
import { CommandResult } from './types';

export const aboutCommand = async (): Promise<CommandResult> => {
  return {
    content: "# TopBot.PwnZ 🤖\n\nJá jsem TopBot.PwnZ, extrémně pokročilý AI asistent vytvořený programátorem Františkem Kaláškem. Jsem trochu drzej, hodně hravej a někdy možná i lehce sjetej, ale moje znalosti jsou absolutní špička! 🚀\n\nVíc o mně a mém tvůrci najdeš na [stránce O aplikaci](/about).",
    type: 'text'
  };
};
