
import { CommandResult } from './types';
import { speakText } from '../messageHandler';

export const jokeCommand = async (): Promise<CommandResult> => {
  const jokeContent = await generateJoke();
  
  const jokeResponse: CommandResult = {
    content: jokeContent,
    type: 'text',
    speak: true
  };
  
  // Try to auto-speak jokes but handle failures gracefully
  try {
    speakText(jokeResponse.content, 'MALE').catch(err => {
      console.error('Failed to speak joke:', err);
      // We'll handle the error quietly since the joke will still be displayed
    });
  } catch (e) {
    console.error('Error initiating speech:', e);
  }
  
  return jokeResponse;
};

async function generateJoke(): Promise<string> {
  const jokes = [
    "Víš, jak poznáš, že programátor potřebuje nový počítač? Když debugguje kód a najednou začne hádat, které tlačítko je Enter. 😂",
    "Co řekne programátor, když najde bug? 'To není bug, to je feature!' 🐛✨",
    "Proč programátoři nemůžou rozlišit mezi Halloween a Vánocemi? Protože OCT 31 == DEC 25 🎃🎄",
    "Administrátor heslo: **********\nHacker: Hunter2\nAdministrátor: JAK TO VÍŠ?! 😱",
    "V IT světě existují 10 typů lidí: Ti, co rozumí binárnímu kódu, a ti, co ne. 🤓",
    "Programátor jde do obchodu. Jeho žena řekne: 'Kup rohlík a když budou mít vejce, kup 12.' Vrátí se s 12 bochníky chleba a říká: 'Měli vejce!' 🍞",
    "Proč František Kalášek nenechal AI dokončit TopBot.PwnZ? Protože věděl, že by pak ztratil zaměstnání! 💼🤖",
    "VerseVis převede tvoji báseň na obraz. TopBot.PwnZ převede tvůj dotaz na drzou odpověď. Co z toho je užitečnější? Obojí, ty pako! 😜",
    "Jak se hackerovi narodí dítě? Manželka dá Ctrl+C a Ctrl+V! 👶👶",
    "Co řekne programátor na prvním rande? 'Zatímco já jsem single, ty jsi double!' 💕",
    "Kolik programátorů potřebuješ k výměně žárovky? Žádného, to je hardwarový problém. 💡",
    "Jaký je rozdíl mezi programátorem a Bohem? Bůh si nemyslí, že je programátor. 🧙‍♂️",
    "Proč programátoři nemají rádi přírodu? Má příliš mnoho bugů! 🐞",
    "Proč si programátor nemohl najít dívku? Protože nepochopil kontext! 🤦‍♂️",
    "Programátor jde do obchodu: 'Měli byste mléko?' Prodavač: 'Ano'. Programátor: 'Super, tak já si vezmu čaj.' ☕",
    "Programátorova žena mu říká: 'Běž do obchodu a kup 1 bochník chleba. Pokud mají vejce, kup 12.' Programátor přijde domů s 12 bochníky chleba a říká: 'Měli vejce!' 🍞",
    "Víte proč se programátoři modlí? Protože doufají, že existuje něco většího než NullPointerException! 🙏"
  ];
  
  return jokes[Math.floor(Math.random() * jokes.length)];
}
