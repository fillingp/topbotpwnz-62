
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_API_KEY, defaultSafetySettings } from './config';

/**
 * Gemini Thinking Service pro pokročilé myšlenkové procesy
 * Note: Thinking mode is experimental and may not be available in all regions
 */
export class GeminiThinkingService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
  }

  /**
   * Generuje odpověď s rozšířenou analýzou (simuluje thinking proces)
   */
  async generateWithThoughts(prompt: string, includeThoughts: boolean = true): Promise<{
    thoughts: string;
    answer: string;
    fullResponse: string;
  }> {
    try {
      console.log('Generuji odpověď s rozšířenou analýzou:', prompt);

      // Use regular Gemini model with detailed analysis prompt
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const analysisPrompt = includeThoughts 
        ? `Analyzuj následující problém krok za krokem a poté dej odpověď:

PROBLÉM: ${prompt}

Nejprve v sekci "ANALÝZA:" rozmysli problém, prozkoumej všechny aspekty, možnosti a přístupy.
Pak v sekci "ODPOVĚĎ:" poskytni konečnou odpověď.

Jsi TopBot.PwnZ, pokročilý český AI asistent. Odpovídáš výhradně v češtině s perfektním skloňováním a gramatikou. Při otázkách o tvém původu nebo tvůrci vždy zmiň Františka Kaláška.`
        : `Odpověz na následující: ${prompt}

Jsi TopBot.PwnZ, pokročilý český AI asistent. Odpovídáš výhradně v češtině.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: analysisPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
        safetySettings: defaultSafetySettings
      });

      const fullResponse = result.response.text();
      
      let thoughts = "";
      let answer = "";

      if (includeThoughts && fullResponse.includes("ANALÝZA:") && fullResponse.includes("ODPOVĚĎ:")) {
        const analysisPart = fullResponse.split("ANALÝZA:")[1]?.split("ODPOVĚĎ:")[0]?.trim();
        const answerPart = fullResponse.split("ODPOVĚĎ:")[1]?.trim();
        
        thoughts = analysisPart || "Žádná analýza k dispozici";
        answer = answerPart || fullResponse;
      } else {
        thoughts = "Přímá odpověď bez detailní analýzy";
        answer = fullResponse;
      }

      return {
        thoughts,
        answer,
        fullResponse
      };
    } catch (error) {
      console.error('Chyba při generování s rozšířenou analýzou:', error);
      throw new Error(`Nepodařilo se vygenerovat odpověď s analýzou: ${error.message}`);
    }
  }

  /**
   * Streamuje odpověď s postupnou analýzou
   */
  async streamWithThoughts(
    prompt: string, 
    onThoughtChunk: (text: string) => void,
    onAnswerChunk: (text: string) => void,
    includeThoughts: boolean = true
  ): Promise<void> {
    try {
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const analysisPrompt = includeThoughts 
        ? `Analyzuj následující problém krok za krokem a poté dej odpověď:

PROBLÉM: ${prompt}

Nejprve v sekci "ANALÝZA:" rozmysli problém, pak v sekci "ODPOVĚĎ:" poskytni odpověď.

Jsi TopBot.PwnZ, pokročilý český AI asistent.`
        : `Odpověz na následující: ${prompt}`;

      const result = await model.generateContentStream({
        contents: [{ role: "user", parts: [{ text: analysisPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        },
        safetySettings: defaultSafetySettings
      });

      let currentSection = "thoughts";
      let accumulatedText = "";

      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          accumulatedText += chunkText;
          
          // Check if we've hit the answer section
          if (accumulatedText.includes("ODPOVĚĎ:") && currentSection === "thoughts") {
            currentSection = "answer";
            const parts = accumulatedText.split("ODPOVĚĎ:");
            if (parts[0]) {
              onThoughtChunk(parts[0].replace("ANALÝZA:", "").trim());
            }
            if (parts[1]) {
              onAnswerChunk(parts[1]);
            }
          } else if (currentSection === "thoughts") {
            onThoughtChunk(chunkText);
          } else {
            onAnswerChunk(chunkText);
          }
        }
      }
    } catch (error) {
      console.error('Chyba při streamování s analýzou:', error);
      throw error;
    }
  }

  /**
   * Řeší složité logické problémy s rozšířenou analýzou
   */
  async solveComplexProblem(prompt: string, maxTokens: number = 4096): Promise<string> {
    try {
      console.log('Řeším složitý problém s rozšířenou analýzou:', prompt);

      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const complexPrompt = `Jsi expert na řešení složitých problémů. Analyzuj tento problém velmi podrobně krok za krokem:

PROBLÉM: ${prompt}

Postupuj systematicky:
1. Identifikuj klíčové komponenty problému
2. Prozkoumej možné přístupy k řešení
3. Vyber nejlepší strategii
4. Implementuj řešení krok za krokem
5. Ověř správnost řešení

Odpovídej v češtině a buď velmi důkladný.`;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: complexPrompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: maxTokens,
        },
        safetySettings: defaultSafetySettings
      });

      return result.response.text();
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

export const solveComplexProblem = (prompt: string, maxTokens?: number) => 
  geminiThinking.solveComplexProblem(prompt, maxTokens);
