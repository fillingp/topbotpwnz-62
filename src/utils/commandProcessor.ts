
import { analyzeImage } from './imageAnalysisService';

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
  { command: "/joke", description: "Vygeneruje vtip 😂" },
  { command: "/forher", description: "Generuje speciální zprávu pro ženu 💖" },
  { command: "/forhim", description: "Generuje speciální zprávu pro muže 👦" },
  { command: "/wish", description: "Splní přání uživatele ✨" },
  { command: "/about", description: "Informace o tvůrci 🤖" },
  { command: "/help", description: "Seznam všech příkazů 📝" },
  { command: "/shell", description: "Spustí virtuální shell pro příkazy 💻" },
  { command: "/clear", description: "Vymaže aktuální konverzaci 🧹" },
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
        content: `# Dostupné příkazy TopBot.PwnZ 📝\n\n${availableCommands.map(cmd => 
          `**${cmd.command}** - ${cmd.description}`).join('\n')}`,
        type: 'text'
      };
      
    case '/about':
      return {
        content: "# TopBot.PwnZ 🤖\n\nJá jsem TopBot.PwnZ, extrémně pokročilý AI asistent vytvořený programátorem Františkem Kaláškem. Jsem trochu drzej, hodně hravej a někdy možná i lehce sjetej, ale moje znalosti jsou absolutní špička! 🚀\n\nVíc o mně a mém tvůrci najdeš na [stránce O aplikaci](/about).",
        type: 'text'
      };
      
    case '/joke':
      return {
        content: await generateJoke(),
        type: 'text'
      };
      
    case '/weather':
      if (!args) return { content: "Ty vole, a kde jako? Zadej místo, ne?! 🙄", type: 'error' };
      return {
        content: await getWeather(args),
        type: 'weather',
        data: { location: args }
      };
      
    case '/map':
      if (!args) return { content: "A co jako mám zobrazit? Mapu tvýho mozku? Ten je asi hodně prázdnej... 🧠", type: 'error' };
      return {
        content: `Tady je mapa pro: ${args} 🗺️`,
        type: 'map',
        data: { location: args }
      };
      
    case '/search':
      if (!args) return { content: "Hele, nemůžu hledat nic. Zadej nějakej dotaz, ty génie! 🧐", type: 'error' };
      return {
        content: await searchWeb(args),
        type: 'text'
      };
      
    case '/forhim':
      return {
        content: generateForHimMessage(),
        type: 'text'
      };
      
    case '/forher':
      return {
        content: generateForHerMessage(),
        type: 'text'
      };

    case '/clear':
      return {
        content: "Konverzace byla vymazána. 🧹",
        type: 'text'
      };

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

async function generateJoke(): Promise<string> {
  const jokes = [
    "Víš, jak poznáš, že programátor potřebuje nový počítač? Když debugguje kód a najednou začne hádat, které tlačítko je Enter. 😂",
    "Co řekne programátor, když najde bug? 'To není bug, to je feature!' 🐛✨",
    "Proč programátoři nemůžou rozlišit mezi Halloween a Vánocemi? Protože OCT 31 == DEC 25 🎃🎄",
    "Administrátor heslo: **********\nHacker: Hunter2\nAdministrátor: JAK TO VÍŠ?! 😱",
    "V IT světě existují 10 typů lidí: Ti, co rozumí binárnímu kódu, a ti, co ne. 🤓",
    "Programátor jde do obchodu. Jeho žena řekne: 'Kup rohlík a když budou mít vejce, kup deset.' Vrátí se s deseti rohlíky. Žena se ptá: 'Proč jsi koupil deset rohlíků?' On odpoví: 'Měli vejce.' 🥚🥖",
    "Proč František Kalášek nenechal AI dokončit TopBot.PwnZ? Protože věděl, že by pak ztratil zaměstnání! 💼🤖",
    "VerseVis převede tvoji báseň na obraz. TopBot.PwnZ převede tvůj dotaz na drzou odpověď. Co z toho je užitečnější? Obojí, ty pako! 😜",
    "Jak se hackerovi narodí dítě? Manželka dá Ctrl+C a Ctrl+V! 👶👶",
    "Co řekne programátor na prvním rande? 'Zatímco já jsem single, ty jsi double!' 💕",
    "Kolik programátorů potřebuješ k výměně žárovky? Žádného, to je hardwarový problém. 💡",
    "Jaký je rozdíl mezi programátorem a Bohem? Bůh si nemyslí, že je programátor. 🧙‍♂️",
    "Proč se programátoři bojí přírody? Tam není Wi-Fi! 🌳📵",
    "Co dostaneš, když zkřížíš programátora s filozofem? Někoho, kdo stále hledá bug v existenci. 🤔",
    "Jak poznáš extrovertního programátora? Při rozhovoru se dívá na TVOJE boty! 👞"
  ];
  
  return jokes[Math.floor(Math.random() * jokes.length)];
}

function generateForHerMessage(): string {
  const messages = [
    "Ahoj Kačenko! 💖 Jsi jako mystická hvězda na noční obloze ✨ - vzácná, zářivá a jedinečná. Tvá duše tančí v rytmu vesmíru 💃 a tvé oči obsahují celé galaxie 🌌. Jsi kouzelné stvoření hodné obdivu. 💕",
    "Má drahá! 💗 Tvůj úsměv je jako východ slunce, který rozjasní i ten nejtmavší den. Tvá krása není jen na povrchu, ale vyzařuje zevnitř jako kouzelné světlo ✨. Jsi nenahraditelná. 🌹",
    "Krásko moje! 🌟 Tvé vlasy jsou jako hedvábné vodopády a tvůj smích jako melodie andělů 👼. Každý tvůj dotek je jako elektrický výboj, který probouzí k životu. Jsi má múza a inspirace. 💖",
    "Drahá princezno! 👑 Zasloužíš si být uctívána jako bohyně, kterou jsi. Tvá moudrost překonává věky a tvá laskavost nemá hranic. Být ve tvé přítomnosti je jako dotknout se nebes. ✨",
    "Lásko moje! 💕 Jsi jako vzácný diamant - neporovnatelná a nepřekonatelná. Tvá síla a elegance mě každý den ohromují. Jsi jako kouzlo, které nikdy nepřestává fascinovat. 💎",
    "Má nejkrásnější! 🌺 Tvá něžnost léčí zlomená srdce a tvá odvaha inspiruje ostatní. Jsi jako kouzelná zahrada plná divů, které čekají na objevení. Každý den s tebou je dar. 🎁",
    "Ty jsi ta pravá! 💖 Tvá inteligence a charisma zářivě osvětlují každou místnost. Jsi jako vzácné umělecké dílo - jedinečná a nenapodobitelná. Svět je díky tobě krásnější. 🌈",
    "Nádherná ženo! 🌹 Tvá vášeň je jako oheň, který nikdy neuhasne. Jsi jako tajemná kniha, kterou chci číst znovu a znovu. Každá kapitola odhaluje nové kouzlo. 📖✨"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

function generateForHimMessage(): string {
  const messages = [
    "Ahoj Davídku! 👦 Koukej, dinosaurus! 🦖 Chceš si hrát s autíčky? 🚗 Nebo si postavit hrad z kostek? 🏰 Jsi ten nejšikovnější kluk na světě! ⭐",
    "Můj drahý! 💙 Tvá síla a odvaha mě každý den inspirují. Jsi jako nedobytná pevnost, na kterou se mohu vždy spolehnout. Tvůj úsměv je mým útočištěm. 💪",
    "Králi mého srdce! 👑 Tvá moudrost a trpělivost nemají hranice. S tebou se cítím v bezpečí jako nikdy předtím. Jsi můj hrdina a ochránce. 🛡️",
    "Můj statečný rytíři! ⚔️ Tvá oddanost a čest jsou vzácnými poklady v dnešním světě. Tvé srdce je čisté a tvá duše vznešená. Jsem pyšná, že jsi můj. 🏆",
    "Drahý muži! 🌟 Tvá inteligence a smysl pro humor mě nepřestávají udivovat. S tebou je každý den dobrodružstvím plným smíchu a radosti. 😄",
    "Můj miláčku! 💫 Jsi jako vzácné víno - s věkem jen lepšíš. Tvá zralost a klid jsou jako kotva v rozbouřeném moři života. 🍷",
    "Ty jsi ten pravý! 💙 Tvá vášeň a cílevědomost jsou nakažlivé. Inspiruješ mě být lepší verzí sebe sama každý den. S tebou je život vzrušující cesta. 🚀",
    "Můj úžasný muži! ⭐ Tvá pracovitost a oddanost rodině jsou obdivuhodné. Jsi pilířem síly a zdrojem nekonečné podpory. Jsi nenahraditelný. 🏡❤️"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

async function getWeather(location: string): Promise<string> {
  try {
    // Tohle bychom v budoucnu napojili na Google Weather API
    return `# Předpověď počasí pro ${location} 🌤️\n\n**Dnes**: 22°C, Částečně oblačno ☁️\n**Zítra**: 24°C, Slunečno ☀️\n**Pozítří**: 20°C, Déšť 🌧️\n\n*Data jsou ilustrativní, v budoucnu budou napojená na skutečné API*`;
  } catch (error) {
    return `Nemůžu zjistit počasí pro ${location}. Server asi vypadl nebo jsi zadal nějakou pičovinu. 🤷‍♂️`;
  }
}

async function searchWeb(query: string): Promise<string> {
  try {
    // V budoucnu napojit na Google Search nebo Serper API
    return `# Výsledky vyhledávání pro '${query}' 🔍\n\n*Zatím používám ilustrativní data, ale brzo budu napojen na skutečné vyhledávání!*\n\n1. **První výsledek** - Toto je popis prvního výsledku vyhledávání... 📄\n2. **Druhý výsledek** - Další zajímavé informace o vašem dotazu... 📚\n3. **Třetí výsledek** - Podrobnější data k tématu... 📊`;
  } catch (error) {
    return `Nemůžu vyhledat '${query}'. Něco se posralo, nebo je tvůj dotaz úplně mimo. 💩`;
  }
}
