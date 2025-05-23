import { analyzeImage } from '../services/apiService';
import { speakText } from './messageHandler';
import { toast } from 'sonner';
import { generateImageWithGemini, getStructuredResponseFromGemini, getRecipeListSchema } from '../services/apiService';

type CommandResult = {
  content: string;
  type: 'text' | 'map' | 'weather' | 'image' | 'error';
  data?: any;
  speak?: boolean; // Whether to speak the result
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
  { command: "/speak [text]", description: "Přečte text nahlas 🔊" },
  { command: "/image [popis]", description: "Vygeneruje obrázek podle popisu 🖼️" },
  { command: "/recept [jídlo]", description: "Najde strukturovaný recept na jídlo 🍽️" },
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
      const jokeResponse = {
        content: await generateJoke(),
        type: 'text' as const,
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
      const forHimResponse = {
        content: generateForHimMessage(),
        type: 'text' as const,
        speak: true
      };
      
      // Try to speak but handle failures gracefully
      try {
        speakText(forHimResponse.content, 'FEMALE').catch(err => {
          console.error('Failed to speak message:', err);
          // We'll handle the error quietly since the message will still be displayed
          if (err.message && err.message.includes('403')) {
            toast.info("Hlasový přednes je momentálně nedostupný");
          }
        });
      } catch (e) {
        console.error('Error initiating speech:', e);
      }
      
      return forHimResponse;
      
    case '/forher':
      const forHerResponse = {
        content: generateForHerMessage(),
        type: 'text' as const,
        speak: true
      };
      
      // Try to speak but handle failures gracefully
      try {
        speakText(forHerResponse.content, 'MALE').catch(err => {
          console.error('Failed to speak message:', err);
          // We'll handle the error quietly since the message will still be displayed
          if (err.message && err.message.includes('403')) {
            toast.info("Hlasový přednes je momentálně nedostupný");
          }
        });
      } catch (e) {
        console.error('Error initiating speech:', e);
      }
      
      return forHerResponse;

    case '/clear':
      return {
        content: "Konverzace byla vymazána. 🧹",
        type: 'text'
      };
      
    case '/speak':
      if (!args) return { content: "A co jako mám říct? Zadej nějaký text! 🔊", type: 'error' };
      
      // Try to speak the provided text
      try {
        const spoken = await speakText(args, 'FEMALE');
        
        return {
          content: spoken 
            ? `Přečetl jsem: "${args}" 🔊` 
            : "Hlasový výstup je momentálně nedostupný. Text je zobrazen níže: " + args,
          type: 'text'
        };
      } catch (error) {
        console.error('Error with speak command:', error);
        return {
          content: "Hlasový výstup je momentálně nedostupný. Text je: " + args,
          type: 'text'
        };
      }

    // Nový příkaz pro generování obrázků pomocí Gemini API
    case '/image':
      if (!args) return { content: "A co jako mám vygenerovat? Zadej popis obrázku, ty chytrolíne! 🖼️", type: 'error' };
      
      try {
        // Začátek generování - informovat uživatele
        toast.info("Generuji obrázek, může to chvíli trvat...");
        
        const imageData = await generateImageWithGemini(args);
        
        return {
          content: `## Vygenerovaný obrázek 🖼️\n\n### Zadání: "${args}"\n\n![${args}](${imageData})`,
          type: 'image',
          data: { imageUrl: imageData, prompt: args }
        };
      } catch (error) {
        console.error('Error generating image:', error);
        return {
          content: `Nepodařilo se vygenerovat obrázek: ${error.message || "Neznámá chyba"}. Zkus to znovu s jiným zadáním. 🤔`,
          type: 'error'
        };
      }

    // Nový příkaz pro generování strukturovaných receptů
    case '/recept':
      if (!args) return { content: "A na co jako chceš recept? Zadej název jídla! 🍲", type: 'error' };
      
      try {
        toast.info(`Hledám recept na ${args}, trpělivost chvíli...`);
        
        const recipeQuery = `Najdi recept na ${args}. Uveď název receptu, všechny ingredience s množstvím a podrobný postup přípravy krok za krokem.`;
        
        const recipes = await getStructuredResponseFromGemini(recipeQuery, getRecipeListSchema());
        
        // Bezpečné ověření, zda recipes je pole a zda má položky
        if (!Array.isArray(recipes) || recipes.length === 0) {
          return {
            content: `Bohužel jsem nenašel recept na ${args}. Zkus to s jiným jídlem. 😕`,
            type: 'text'
          };
        }
        
        // Formátování receptu pro markdown
        const recipe = recipes[0]; // Bereme první recept
        const formattedRecipe = `
# 🍽️ ${recipe.recipeName}

## Ingredience
${recipe.ingredients.map(ing => `- ${ing}`).join('\n')}

## Postup
${recipe.instructions.map((step, index) => `${index + 1}. ${step}`).join('\n')}

Dobrou chuť! 😋
        `;
        
        return {
          content: formattedRecipe.trim(),
          type: 'text'
        };
      } catch (error) {
        console.error('Error getting recipe:', error);
        return {
          content: `Nepodařilo se získat recept: ${error.message || "Neznámá chyba"}. Zkus to znovu později. 🤔`,
          type: 'error'
        };
      }

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

function generateForHerMessage(): string {
  const messages = [
    "Ahoj Kačenko! 💖 Jsi jako mystická hvězda na noční obloze ✨ - vzácná, zářivá a jedinečná. Tvá duše tančí v rytmu vesmíru 💃 a tvé oči obsahují celé galaxie 🌌. Jsi kouzelné stvoření hodné obdivu. 💕",
    "Má drahá! 💗 Tvá vášeň je jako východ slunce, který rozjasní i ten nejtmavší den. Tvá krása není jen na povrchu, ale vyzařuje zevnitř jako kouzelné světlo ✨. Jsi nenahraditelná. 🌹",
    "Krásko moje! 🌟 Tvá vlasy jsou jako hedvábné vodopády a tvé smích jako melodie andělů 👼. Každý tvůj dotek je jako elektrický výboj, který probouzí k životu. Jsi má múza a inspirace. 💖",
    "Drahá princezno! 👑 Zaslouží si být uctívána jako bohyně, kterou jsi. Tvá moudrost překonává věky a tvá laskavost nemá hranice. Být ve tvé přítomnosti je jako dotknout se nebes. ✨",
    "Lásko moje! 💕 Jsi jako vzácný diamant - neporovnatelná a nepřekonatelná. Tvá síla a elegance mě každý den ohromují. Jsi jako kouzlo, které nikdy nepřestává fascinovat. 💎",
    "Má nejkrásnější! 🌺 Tvá něžnost léčí zlomená srdce a tvá odvaha inspiruje ostatní. Jsi jako kouzelná zahrada plná divů, které čekají na objevení. Každý den s tebou je dar. 🎁",
    "Ty jsi ta pravá! 💖 Tvá vášeň je jako oheň, který nikdy neuhasne. Jsi jako tajemná kniha, kterou chci číst navždy. 📖✨",
    "Nádherná ženo! 🌹 Tvá vášeň je jako východ slunce, který rozjasní i ten nejtmavší den. Jsi jako tajemná kniha, kterou chci číst navždy. 📖✨",
    "Jsi víc než krásná! 🌈 Tvá inteligence a charisma zářivě osvětlují každou místnost. Jsi jako vzácné umělecké dílo - jedinečná a nenapodobitelná. Svět je díky tobě krásnější. 🌈",
    "Neuvěřitelná krásko! 💓 Tvá energie je nakažlivá a tvůj duch nezlomný. Jsi jako ranní rosa - svěží, čistá a dokonalá. Každý tvůj krok zanechává stopu v mém srdci. 👣",
    "Moje všechno! 💝 Jsi začátek i konec mých dnů, píseň, která hraje v mém srdci. Tvá duše je čistá jako křišťálový potok a tvá mysl fascinující jako nejhlubší oceán. 🌊",
    "Božská ženo! 👑 Jsi dokonalá kombinace síly a něžnosti, moudrosti a hravosti. Tvá přítomnost je jako parfém, který omámí smysly a zůstane v paměti navždy. 🌺"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

function generateForHimMessage(): string {
  const messages = [
    "Ahoj Davídku! 👦 Koukej, dinosaurus! 🦖 Chceš si hrát s autíčky? 🚗 Nebo si postavit hrad z kostek? 🏰 Jsi ten nejšikovnější kluk na světě! ⭐",
    "Můj drahý! 💙 Tvá síla a odvaha mě každý den inspirují. Jsi jako nedobytná pevnost, na kterou se mohu vždy spolehnout. Tvůj úsměv je mým útočištěm. 💪",
    "Králi mého srdce! 👑 Tvá moudrost a trpělivost nemají hranice. S tebou se cítím v bezpečí jako nikdy předtím. Jsi můj hrdina a ochránce. 🛡️",
    "Můj statečný rytíři! ⚔️ Tvá oddanost a čest jsou vzácnými poklady v dnešním světě. Tvá srdce je čisté a tvá duše vznešená. Jsem pyšná, že jsi můj. 🏆",
    "Drahý muži! 🌟 Tvá inteligence a smysl pro humor mě nepřestávají udivovat. S tebou je každý den dobrodružstvím plným smíchu a radosti. 😄",
    "Můj miláčku! 💫 Jsi jako vzácné víno - s věkem jen lepšíš. Tvá zralost a klid jsou jako kotva v rozbouřeném moři života. 🍷",
    "Ty jsi ten pravý! 💙 Tvá vášeň a cílevědomost jsou nakažlivé. Inspiruješ mě být lepší verzí sebe sama každý den. S tebou je život vzrušující cesta. 🚀",
    "Můj úžasný muži! ⭐ Tvá pracovitost a oddanost rodině jsou obdivuhodné. Jsi pilířem síly a zdrojem nekonečné podpory. Jsi nenahraditelný. 🏡❤️",
    "Drahý hrdino mého příběhu! 🌠 Tvá odvaha čelit výzvám a tvá schopnost řešit problémy jsou obdivuhodné. Jsi jako kapitán, který bezpečně řídí loď i v bouři. ⚓",
    "Můj dokonalý partnere! 💎 Tvá intuice a schopnost porozumět mi bez slov mě každý den udivuje. Jsi jako kniha, kterou chci číst navždy. 📚",
    "Jedinečný muži! 🌈 Tvá kreativita a vášeň pro život jsou jako ohňostroj - oslnivé a nezapomenutelné. S tebou je každý moment plný barev a energie. 🎨",
    "Má životní lásko! 💞 Tvá oddanost a péče jsou jako teplý plášť v chladném dni. Jsi jako hvězda na mém nebi - jasná, zářivá a věčná. ⭐"
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
    // Import the function directly to avoid circular references
    const { performWebSearch } = await import('@/services/apiService');
    return await performWebSearch(query);
  } catch (error) {
    console.error('Error searching web:', error);
    return `Nemůžu vyhledat '${query}'. Něco se posralo, nebo je tvůj dotaz úplně mimo. 💩`;
  }
}
