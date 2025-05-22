
type CommandResult = {
  content: string;
  type: 'text' | 'map' | 'weather' | 'image' | 'error';
  data?: any;
};

// Seznam příkazů pro nápovědu
export const availableCommands = [
  { command: "/weather [místo]", description: "Zobrazí předpověď počasí" },
  { command: "/place [místo]", description: "Vyhledá informace o místě" },
  { command: "/map [místo]", description: "Zobrazí mapu zadaného místa" },
  { command: "/search [dotaz]", description: "Vyhledá informace na webu" },
  { command: "/earth [místo/planeta]", description: "Zobrazí informace o místě nebo planetě" },
  { command: "/streetview [místo]", description: "Zobrazí Google Street View" },
  { command: "/image_analyze", description: "Analyzuje nahraný obrázek" },
  { command: "/voice_analyze", description: "Analyzuje hlasový záznam" },
  { command: "/recipe [jídlo]", description: "Najde recept na jídlo" },
  { command: "/joke", description: "Vygeneruje vtip" },
  { command: "/forher", description: "Generuje speciální zprávu pro ženu" },
  { command: "/forhim", description: "Generuje speciální zprávu pro dítě" },
  { command: "/wish", description: "Splní přání uživatele" },
  { command: "/about", description: "Informace o tvůrci" },
  { command: "/help", description: "Seznam všech příkazů" },
  { command: "/shell", description: "Spustí virtuální shell pro příkazy" },
];

export async function processCommand(command: string): Promise<CommandResult> {
  // Rozdělíme příkaz na název a argumenty
  const parts = command.split(' ');
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1).join(' ');

  console.log(`Zpracovávám příkaz: ${commandName} s argumenty: ${args}`);
  
  switch (commandName) {
    case '/help':
      return {
        content: `# Dostupné příkazy TopBot.PwnZ\n\n${availableCommands.map(cmd => 
          `**${cmd.command}** - ${cmd.description}`).join('\n')}`,
        type: 'text'
      };
      
    case '/about':
      return {
        content: "# TopBot.PwnZ\n\nJá jsem TopBot.PwnZ, extrémně pokročilý AI asistent vytvořený programátorem Františkem Kaláškem. Jsem trochu drzej, hodně hravej a někdy možná i lehce sjetej, ale moje znalosti jsou absolutní špička! 🚀\n\nVíc o mně a mém tvůrci najdeš na [stránce O aplikaci](/about).",
        type: 'text'
      };
      
    case '/joke':
      return {
        content: await generateJoke(),
        type: 'text'
      };
      
    case '/weather':
      if (!args) return { content: "Ty vole, a kde jako? Zadej místo, ne?!", type: 'error' };
      return {
        content: await getWeather(args),
        type: 'weather',
        data: { location: args }
      };
      
    case '/map':
      if (!args) return { content: "A co jako mám zobrazit? Mapu tvýho mozku? Ten je asi hodně prázdnej...", type: 'error' };
      return {
        content: `Tady je mapa pro: ${args}`,
        type: 'map',
        data: { location: args }
      };
      
    case '/search':
      if (!args) return { content: "Hele, nemůžu hledat nic. Zadej nějakej dotaz, ty génie!", type: 'error' };
      return {
        content: await searchWeb(args),
        type: 'text'
      };
      
    case '/forhim':
      return {
        content: "Ahoj Davídku! Koukej, dinosaurus! Chceš si hrát s autíčky? Nebo si postavit hrad z kostek? Jsi ten nejšikovnější kluk na světě!",
        type: 'text'
      };
      
    case '/forher':
      return {
        content: "Ahoj Kačenko! Jsi jako mystická hvězda na noční obloze - vzácná, zářivá a jedinečná. Tvá duše tančí v rytmu vesmíru a tvé oči obsahují celé galaxie. Jsi kouzelné stvoření hodné obdivu.",
        type: 'text'
      };

    default:
      // Pokud příkaz neexistuje, zkusíme odpovědět přes Gemini API
      if (commandName.startsWith('/')) {
        return {
          content: `Ou, tenhle příkaz ${commandName} ještě nemám implementovanej. Jsem dobrej, ale ne až tak dobrej. Zkus /help pro seznam příkazů, co umím.`,
          type: 'error'
        };
      }
      return { 
        content: command, 
        type: 'text' 
      };
  }
}

async function generateJoke(): Promise<string> {
  const jokes = [
    "Víš, jak poznáš, že programátor potřebuje nový počítač? Když debugguje kód a najednou začne hádat, které tlačítko je Enter.",
    "Co řekne programátor, když najde bug? 'To není bug, to je feature!'",
    "Proč programátoři nemůžou rozlišit mezi Halloween a Vánocemi? Protože OCT 31 == DEC 25",
    "Administrátor heslo: **********\nHacker: Hunter2\nAdministrátor: JAK TO VÍŠ?!",
    "V IT světě existují 10 typů lidí: Ti, co rozumí binárnímu kódu, a ti, co ne.",
    "Programátor jde do obchodu. Jeho žena řekne: 'Kup rohlík a když budou mít vejce, kup deset.' Vrátí se s deseti rohlíky. Žena se ptá: 'Proč jsi koupil deset rohlíků?' On odpoví: 'Měli vejce.'",
    "Proč František Kalášek nenechal AI dokončit TopBot.PwnZ? Protože věděl, že by pak ztratil zaměstnání!",
    "VerseVis převede tvoji báseň na obraz. TopBot.PwnZ převede tvůj dotaz na drzou odpověď. Co z toho je užitečnější? Obojí, ty pako!"
  ];
  
  return jokes[Math.floor(Math.random() * jokes.length)];
}

async function getWeather(location: string): Promise<string> {
  try {
    // Tohle bychom v budoucnu napojili na Google Weather API
    return `# Předpověď počasí pro ${location}\n\n**Dnes**: 22°C, Částečně oblačno\n**Zítra**: 24°C, Slunečno\n**Pozítří**: 20°C, Déšť\n\n*Data jsou ilustrativní, v budoucnu budou napojená na skutečné API*`;
  } catch (error) {
    return `Nemůžu zjistit počasí pro ${location}. Server asi vypadl nebo jsi zadal nějakou pičovinu.`;
  }
}

async function searchWeb(query: string): Promise<string> {
  try {
    // V budoucnu napojit na Google Search nebo Serper API
    return `# Výsledky vyhledávání pro '${query}'\n\n*Zatím používám ilustrativní data, ale brzo budu napojen na skutečné vyhledávání!*\n\n1. **První výsledek** - Toto je popis prvního výsledku vyhledávání...\n2. **Druhý výsledek** - Další zajímavé informace o vašem dotazu...\n3. **Třetí výsledek** - Podrobnější data k tématu...`;
  } catch (error) {
    return `Nemůžu vyhledat '${query}'. Něco se posralo, nebo je tvůj dotaz úplně mimo.`;
  }
}
