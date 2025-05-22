
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
            content: 'Jsi TopBot.PwnZ, pokročilý český AI asistent vytvořený Františkem Kaláškem. Odpovídáš výhradně v češtině s detailními, přesnými informacemi. Využívej aktuální data a poskytuj hloubkovou analýzu.'
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
        return_related_questions: false,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API chyba: ${response.status}`);
    }

    const data = await response.json();
    console.log('Perplexity odpověď:', data);
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
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
        hl: 'cs'
      }),
    });

    if (!response.ok) {
      throw new Error(`Serper API chyba: ${response.status}`);
    }

    const data = await response.json();
    console.log('Serper odpověď:', data);
    
    let result = "Zde jsou nejnovější informace z internetu:\n\n";
    
    if (data.organic) {
      data.organic.slice(0, 3).forEach((item: any, index: number) => {
        result += `${index + 1}. **${item.title}**\n${item.snippet}\n${item.link}\n\n`;
      });
    }
    
    return result;
  } catch (error) {
    console.error('Chyba Serper API:', error);
    throw error;
  }
};
