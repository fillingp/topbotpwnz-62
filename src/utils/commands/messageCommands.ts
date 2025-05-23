
import { CommandResult } from './types';
import { speakText } from '../messageHandler';
import { toast } from 'sonner';

export const messageCommands = {
  forHim: async (): Promise<CommandResult> => {
    const forHimResponse: CommandResult = {
      content: generateForHimMessage(),
      type: 'text',
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
  },
  
  forHer: async (): Promise<CommandResult> => {
    const forHerResponse: CommandResult = {
      content: generateForHerMessage(),
      type: 'text',
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
  }
};

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
    "Neuvěřitelná krásko! 💞 Tvá energie je nakažlivá a tvůj duch nezlomný. Jsi jako ranní rosa - svěží, čistá a dokonalá. Každý tvůj krok zanechává stopu v mém srdci. 👣",
    "Moje všechno! 💝 Jsi začátek i konec mých dnů, píseň, která hraje v mém srdci. Tvá duše je čistá jako křišťálový potok a tvá mysl fascinující jako nejhlubší oceán. 🌊",
    "Božská ženo! 👑 Jsi dokonalá kombinace síly a něžnosti, moudrosti a hravosti. Tvá přítomnost je jako parfém, který omámí smysly a zůstane v paměti navždy. 🌺"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}
