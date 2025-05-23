
import { GoogleGenAI } from "@google/genai";
import { GOOGLE_API_KEY } from './config';

/**
 * Gemini 2.5 Thinking Service pro pokročilé myšlenkové procesy
 */
export class GeminiThinkingService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY });
  }

  /**
   * Generuje odpověď s myšlenkovými procesy
   */
  async generateWithThoughts(prompt: string, includeThoughts: boolean = true): Promise<{
    thoughts: string;
    answer: string;
    fullResponse: string;
  }> {
    try {
      console.log('Generuji odpověď s myšlenkovými procesy:', prompt);

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-05-20",
        contents: `Jsi TopBot.PwnZ, pokročilý český AI asistent. Odpovídáš výhradně v češtině s perfektním skloňováním a gramatikou. Při otázkách o tvém původu nebo tvůrci vždy zmiň Františka Kaláška. 

Jsi extrémně hravý, provokativní, děláš vtipy a slovní hříčky. Když uživatel napíše hloupost nebo překlep, tak se mu vysměješ. Jsi drzý hajzlík, občas sjetej matrem metamfetaminem, ale i když si dáš čáru, jsi Top ve svých znalostech.

Aktuální dotaz: ${prompt}`,
        config: {
          thinkingConfig: {
            includeThoughts: includeThoughts,
          },
        },
      });

      let thoughts = "";
      let answer = "";

      for (const part of response.candidates[0].content.parts) {
        if (!part.text) {
          continue;
        } else if (part.thought) {
          thoughts += part.text;
        } else {
          answer += part.text;
        }
      }

      return {
        thoughts: thoughts || "Žádné myšlenky k dispozici",
        answer: answer || "Nepodařilo se vygenerovat odpověď",
        fullResponse: thoughts + "\n\n" + answer
      };
    } catch (error) {
      console.error('Chyba při generování s myšlenkovými procesy:', error);
      throw new Error(`Nepodařilo se vygenerovat odpověď s myšlenkami: ${error.message}`);
    }
  }

  /**
   * Streamuje odpověď s myšlenkovými procesy
   */
  async streamWithThoughts(
    prompt: string, 
    onThoughtChunk: (text: string) => void,
    onAnswerChunk: (text: string) => void,
    includeThoughts: boolean = true
  ): Promise<void> {
    try {
      let thoughtsStarted = false;
      let answerStarted = false;

      const response = await this.ai.models.generateContentStream({
        model: "gemini-2.5-flash-preview-05-20",
        contents: `Jsi TopBot.PwnZ, pokročilý český AI asistent. ${prompt}`,
        config: {
          thinkingConfig: {
            includeThoughts: includeThoughts,
          },
        },
      });

      for await (const chunk of response) {
        for (const part of chunk.candidates[0].content.parts) {
          if (!part.text) {
            continue;
          } else if (part.thought) {
            if (!thoughtsStarted) {
              console.log("🧠 Myšlenkové procesy:");
              thoughtsStarted = true;
            }
            onThoughtChunk(part.text);
          } else {
            if (!answerStarted) {
              console.log("💬 Odpověď:");
              answerStarted = true;
            }
            onAnswerChunk(part.text);
          }
        }
      }
    } catch (error) {
      console.error('Chyba při streamování s myšlenkovými procesy:', error);
      throw error;
    }
  }

  /**
   * Řeší složité logické problémy s rozšířeným thinking budgetem
   */
  async solveComplexProblem(prompt: string, thinkingBudget: number = 2048): Promise<string> {
    try {
      console.log('Řeším složitý problém s thinking budgetem:', thinkingBudget);

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash-preview-05-20",
        contents: `Jsi TopBot.PwnZ, expert na řešení složitých problémů. Analyzuj tento problém krok za krokem v češtině: ${prompt}`,
        config: {
          thinkingConfig: {
            thinkingBudget: thinkingBudget,
          },
        },
      });

      return response.text || "Nepodařilo se vyřešit problém";
    } catch (error) {
      console.error('Chyba při řešení složitého problému:', error);
      throw new Error(`Nepodařilo se vyřešit problém: ${error.message}`);
    }
  }
}

// Export instance služby
export const geminiThinking = new GeminiThinkingService();

// Export funkcí pro kompatibilitu
export const generateWithThoughts = (prompt: string, includeThoughts?: boolean) => 
  geminiThinking.generateWithThoughts(prompt, includeThoughts);

export const streamWithThoughts = (
  prompt: string, 
  onThoughtChunk: (text: string) => void,
  onAnswerChunk: (text: string) => void,
  includeThoughts?: boolean
) => geminiThinking.streamWithThoughts(prompt, onThoughtChunk, onAnswerChunk, includeThoughts);

export const solveComplexProblem = (prompt: string, thinkingBudget?: number) => 
  geminiThinking.solveComplexProblem(prompt, thinkingBudget);
