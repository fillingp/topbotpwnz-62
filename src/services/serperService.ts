
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
