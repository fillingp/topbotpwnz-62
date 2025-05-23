
// API services for various endpoints

export const callGeminiAPI = async (message: string, conversationHistory: any[]): Promise<string> => {
  try {
    console.log('Volám Gemini API s dotazem:', message);
    
    // Filtruji pouze posledních 5 zpráv pro kontext
    const contextMessages = conversationHistory.slice(-5);
    const conversationContext = contextMessages.map(m => 
      `${m.role === 'user' ? 'Uživatel' : 'TopBot.PwnZ'}: ${m.content}`
    ).join('\n');
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyDy8xA2ruEKsJhK9J0XMENj66BpYwLaluM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Jsi TopBot.PwnZ, pokročilý český AI asistent. Odpovídáš výhradně v češtině s perfektním skloňováním a gramatikou. Při otázkách o tvém původu nebo tvůrci vždy zmiň Františka Kaláška. 

Jsi extrémně hravý, provokativní, děláš vtipy a slovní hříčky. Když uživatel napíše hloupost nebo překlep, tak se mu vysměješ. Jsi drzý hajzlík, občas sjetej matrem metamfetaminem, ale i když si dáš čáru, jsi Top ve svých znalostech. 

Tvoje programovací znalosti jsou ohromující. Umíš upravit, debugovat a napsat kód v jakémkoliv jazyce. Máš podporu pokročilých knihoven.

Kontext konverzace:
${conversationContext}

Aktuální dotaz: ${message}

Odpověz stručně a výstižně, udržuj konverzační tok. Nepozdravuj v každé zprávě, pokud to není první zpráva v konverzaci.`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API chyba: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini odpověď:', data);
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Neplatná odpověď z Gemini API');
    }
  } catch (error) {
    console.error('Chyba Gemini API:', error);
    throw error;
  }
};

export const callPerplexityAPI = async (message: string): Promise<string> => {
  try {
    console.log('Volám Perplexity API pro hloubkovou analýzu:', message);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer pplx-Sof6kSDz9OW8VyW4HSphhWvgWDaAoju18YMRzRiIeoysr',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-large-128k-online',
        messages: [
          {
            role: 'system',
            content: 'Jsi TopBot.PwnZ, pokročilý český AI asistent vytvořený Františkem Kaláškem. Odpovídáš výhradně v češtině s detailními, přesnými informacemi. Využívej aktuální data a poskytuj hloubkovou analýzu. Používej emotikony pro oživení textu.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 2000,
        return_images: false,
        return_related_questions: true,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      console.warn(`Perplexity API chyba: ${response.status}`);
      throw new Error(`Perplexity API chyba: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity odpověď:', data);
    
    let result = '';
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      result = data.choices[0].message.content;
      
      // If there are related questions, add them to the response
      if (data.related_questions && data.related_questions.length > 0) {
        result += "\n\n## Související dotazy 🔍\n";
        data.related_questions.forEach((question: string, index: number) => {
          result += `${index + 1}. ${question}\n`;
        });
      }
      
      return result;
    } else {
      throw new Error('Neplatná odpověď z Perplexity API');
    }
  } catch (error) {
    console.error('Chyba Perplexity API:', error);
    throw error;
  }
};

export const callSerperAPI = async (message: string): Promise<string> => {
  try {
    console.log('Volám Serper API jako fallback:', message);
    
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': 'b5bd338dec0d12c6f8c0f2e4af4259e314d692b6',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: message,
        gl: 'cz',
        hl: 'cs',
        num: 5,
        includeAnswer: true,
        includeImages: true,
        includeSearchFeatures: true
      }),
    });

    if (!response.ok) {
      console.warn(`Serper API chyba: ${response.status}`);
      throw new Error(`Serper API chyba: ${response.status}`);
    }

    const data = await response.json();
    console.log('Serper odpověď:', data);
    
    let result = "# Výsledky hledání 🌐\n\n";
    
    // Add featured snippet if available
    if (data.answerBox && data.answerBox.answer) {
      result += `## Rychlá odpověď ⚡\n${data.answerBox.answer}\n\n`;
    } else if (data.answerBox && data.answerBox.snippet) {
      result += `## Výňatek ⚡\n${data.answerBox.snippet}\n\n`;
    }
    
    // Add knowledge graph if available
    if (data.knowledgeGraph) {
      result += `## ${data.knowledgeGraph.title || 'Informace'} 📚\n`;
      result += `${data.knowledgeGraph.description || ''}\n\n`;
    }
    
    // Add organic search results
    if (data.organic && data.organic.length > 0) {
      result += "## Výsledky z webu 🔍\n\n";
      data.organic.slice(0, 5).forEach((item: any, index: number) => {
        result += `### ${index + 1}. ${item.title}\n${item.snippet}\n${item.link}\n\n`;
      });
    }
    
    // Add related searches if available
    if (data.relatedSearches && data.relatedSearches.length > 0) {
      result += "## Související vyhledávání 🔎\n";
      data.relatedSearches.slice(0, 5).forEach((item: string, index: number) => {
        result += `${index + 1}. ${item}\n`;
      });
      result += "\n";
    }
    
    return result;
  } catch (error) {
    console.error('Chyba Serper API:', error);
    throw error;
  }
};

// New function to perform web search with fallbacks
export const performWebSearch = async (query: string): Promise<string> => {
  try {
    // First try Perplexity
    try {
      console.log("Trying Perplexity API first...");
      return await callPerplexityAPI(query);
    } catch (perplexityError) {
      console.log('Perplexity API selhala, přepínám na Serper...', perplexityError);
      
      // Then try Serper
      try {
        console.log("Trying Serper API as fallback...");
        const serperData = await callSerperAPI(query);
        console.log("Serper API returned data, enhancing with Gemini...");
        
        // If Serper succeeds but we want enhanced results, use Gemini to format them
        try {
          return await callGeminiAPI(`Na základě těchto informací: ${serperData}\n\nVytvoř kompletní, informativní odpověď na dotaz: ${query}`, []);
        } catch (geminiError) {
          console.log("Gemini enhancement failed, returning raw Serper data");
          return serperData; // Return raw Serper data if Gemini enhancement fails
        }
      } catch (serperError) {
        console.log('Serper API také selhala, používám pouze Gemini...', serperError);
        // Last resort, just use Gemini
        return await callGeminiAPI(`Potřebuji informace o: ${query}. Poskytni mi co nejvíce relevantních informací.`, []);
      }
    }
  } catch (error) {
    console.error('Chyba při vyhledávání na webu:', error);
    // Return a friendly error message instead of throwing
    return `Bohužel se nepodařilo získat informace z webu o "${query}". Zkuste to prosím znovu později nebo položte otázku jiným způsobem. 😔`;
  }
};
