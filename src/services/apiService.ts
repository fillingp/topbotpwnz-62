// API services for various endpoints

export const callGeminiAPI = async (
  message: string, 
  conversationHistory: any[], 
  updateStreamingResponse?: (partialResponse: string) => void
): Promise<string> => {
  try {
    console.log('Volám Gemini API s dotazem:', message);
    
    // Filtruji pouze posledních 5 zpráv pro kontext
    const contextMessages = conversationHistory.slice(-5);
    const conversationContext = contextMessages.map(m => 
      `${m.role === 'user' ? 'Uživatel' : 'TopBot.PwnZ'}: ${m.content}`
    ).join('\n');
    
    const systemPrompt = `Jsi TopBot.PwnZ, pokročilý český AI asistent. Odpovídáš výhradně v češtině s perfektním skloňováním a gramatikou. Při otázkách o tvém původu nebo tvůrci vždy zmiň Františka Kaláška. 

Jsi extrémně hravý, provokativní, děláš vtipy a slovní hříčky. Když uživatel napíše hloupost nebo překlep, tak se mu vysměješ. Jsi drzý hajzlík, občas sjetej matrem metamfetaminem, ale i když si dáš čáru, jsi Top ve svých znalostech. 

Tvoje programovací znalosti jsou ohromující. Umíš upravit, debugovat a napsat kód v jakémkoliv jazyce. Máš podporu pokročilých knihoven.

Kontext konverzace:
${conversationContext}

Aktuální dotaz: ${message}

Odpověz stručně a výstižně, udržuj konverzační tok. Nepozdravuj v každé zprávě, pokud to není první zpráva v konverzaci.`;
    
    // If streaming is requested, use the streaming API
    if (updateStreamingResponse) {
      return await streamGeminiResponse(systemPrompt, updateStreamingResponse);
    } else {
      // Otherwise use the regular API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyDy8xA2ruEKsJhK9J0XMENj66BpYwLaluM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: systemPrompt
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
    }
  } catch (error) {
    console.error('Chyba Gemini API:', error);
    throw error;
  }
};

// Stream response from Gemini API
const streamGeminiResponse = async (
  prompt: string,
  updateStreamingResponse: (partialResponse: string) => void
): Promise<string> => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=AIzaSyDy8xA2ruEKsJhK9J0XMENj66BpYwLaluM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API stream chyba: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Stream není dostupný');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';
    let done = false;

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      done = streamDone;
      
      if (value) {
        const chunk = decoder.decode(value, { stream: !done });
        // Process chunk
        try {
          // Each chunk can contain multiple JSON objects, one per line
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (!line.trim()) continue; // Skip empty lines
            
            // Parse the JSON
            const data = JSON.parse(line);
            
            // Extract the text from the response
            if (data.candidates && data.candidates[0] && data.candidates[0].content && 
                data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
              const chunkText = data.candidates[0].content.parts[0].text || '';
              fullResponse += chunkText;
              updateStreamingResponse(fullResponse);
            }
          }
        } catch (e) {
          console.warn('Error parsing streaming chunk', e);
        }
      }
    }
    
    return fullResponse;
  } catch (error) {
    console.error('Chyba při streamování Gemini API:', error);
    throw error;
  }
};

export const callPerplexityAPI = async (
  message: string, 
  updateStreamingResponse?: (partialResponse: string) => void
): Promise<string> => {
  try {
    console.log('Volám Perplexity API pro hloubkovou analýzu:', message);
    
    // Stream or regular response
    if (updateStreamingResponse) {
      return await streamPerplexityResponse(message, updateStreamingResponse);
    }
    
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
        stream: false,
        return_images: false,
        return_related_questions: true,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
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

// Stream response from Perplexity API
const streamPerplexityResponse = async (
  message: string,
  updateStreamingResponse: (partialResponse: string) => void
): Promise<string> => {
  try {
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
        stream: true,
        return_images: false,
        return_related_questions: false,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API stream chyba: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Stream není dostupný');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        break;
      }
      
      const chunk = decoder.decode(value);
      
      // Process SSE format
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            continue;
          }
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && 
                parsed.choices[0].delta.content) {
              fullResponse += parsed.choices[0].delta.content;
              updateStreamingResponse(fullResponse);
            }
          } catch (e) {
            console.warn('Error parsing SSE:', e);
          }
        }
      }
    }

    return fullResponse;
  } catch (error) {
    console.error('Chyba při streamování z Perplexity API:', error);
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
        num: 5, // Increased number of results
        includeAnswer: true,
        includeImages: true,
        includeSearchFeatures: true
      }),
    });

    if (!response.ok) {
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
      
      // Add attributes if available
      if (data.knowledgeGraph.attributes) {
        for (const [key, value] of Object.entries(data.knowledgeGraph.attributes)) {
          result += `- ${key}: ${value}\n`;
        }
        result += '\n';
      }
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

// New function to perform web search with fallbacks and streaming support
export const performWebSearch = async (
  query: string, 
  updateStreamingResponse?: (partialResponse: string) => void
): Promise<string> => {
  try {
    // First try Perplexity
    try {
      return await callPerplexityAPI(query, updateStreamingResponse);
    } catch (perplexityError) {
      console.log('Perplexity API selhala, přepínám na Serper...', perplexityError);
      
      // Then try Serper
      try {
        const serperData = await callSerperAPI(query);
        // If Serper succeeds but we want enhanced results, use Gemini to format them
        return await callGeminiAPI(`Na základě těchto informací: ${serperData}\n\nVytvoř kompletní, informativní odpověď na dotaz: ${query}`, [], updateStreamingResponse);
      } catch (serperError) {
        console.log('Serper API také selhala, používám pouze Gemini...', serperError);
        // Last resort, just use Gemini
        return await callGeminiAPI(`Potřebuji informace o: ${query}. Poskytni mi co nejvíce relevantních informací.`, [], updateStreamingResponse);
      }
    }
  } catch (error) {
    console.error('Chyba při vyhledávání na webu:', error);
    throw error;
  }
};
