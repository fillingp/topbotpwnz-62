
import { CommandResult } from './types';
import { generateWithThoughts, solveComplexProblem } from '@/services/apiService';
import { toast } from 'sonner';

export const thinkingCommand = async (prompt: string): Promise<CommandResult> => {
  if (!prompt) {
    return { 
      content: "Na co mám myslet, ty géni? Zadej nějaký problém k rozmyšlení! 🧠💭", 
      type: 'error' 
    };
  }
  
  try {
    toast.info("Zapínám myšlenkové procesy, tohle bude chtít chvilku...");
    
    const result = await generateWithThoughts(prompt, true);
    
    const formattedResponse = `
# 🧠 Myšlenkové procesy TopBot.PwnZ

## 💭 Jak jsem nad tím přemýšlel:
${result.thoughts}

## 💡 Moje odpověď:
${result.answer}

---
*Powered by Gemini 2.5 Thinking* 🤖
    `;
    
    return {
      content: formattedResponse.trim(),
      type: 'text'
    };
  } catch (error) {
    console.error('Error with thinking command:', error);
    return {
      content: `Nepodařilo se mi zapnout myšlenkové procesy: ${error instanceof Error ? error.message : "Neznámá chyba"}. Zkus to znovu, možná mi dojde metam. 🤔`,
      type: 'error'
    };
  }
};

export const logicCommand = async (problem: string): Promise<CommandResult> => {
  if (!problem) {
    return { 
      content: "Jaký logický problém mám vyřešit? Dej mi něco na rozlousknutí! 🧩", 
      type: 'error' 
    };
  }
  
  try {
    toast.info("Řeším složitý logický problém, thinking budget na maximum...");
    
    const solution = await solveComplexProblem(problem, 3072);
    
    const formattedResponse = `
# 🧩 Řešení logického problému

## 📝 Problém:
${problem}

## 🔍 Řešení:
${solution}

---
*Vyřešeno pomocí Gemini 2.5 s rozšířeným thinking budgetem* 🎯
    `;
    
    return {
      content: formattedResponse.trim(),
      type: 'text'
    };
  } catch (error) {
    console.error('Error with logic command:', error);
    return {
      content: `Nepodařilo se vyřešit tento logický problém: ${error instanceof Error ? error.message : "Neznámá chyba"}. Zkus to s jednodušším problémem! 🤯`,
      type: 'error'
    };
  }
};
