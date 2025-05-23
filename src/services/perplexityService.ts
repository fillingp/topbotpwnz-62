
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
