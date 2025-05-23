
import { toast } from "sonner";

// Interface for the image analysis response
export interface ImageAnalysisResult {
  description: string;
  tags: string[];
  objects: string[];
  text?: string;
  faces?: {
    emotions: string[];
    age: number;
    gender: string;
  }[];
}

export const analyzeImage = async (imageData: string): Promise<ImageAnalysisResult> => {
  try {
    // Demonstrative function - in a production environment, this would call an actual API
    // This is a mockup of what the function would do with a real API
    console.log("Analyzing image...", imageData.slice(0, 50) + "...");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulated response - in reality, this would come from Google Vision API or similar
    const mockResult: ImageAnalysisResult = {
      description: "Obrázek obsahuje osoby a objekty v prostředí.",
      tags: ["osoba", "město", "budova", "modrá", "denní světlo"],
      objects: ["osoba", "budova", "auto", "strom"],
      text: imageData.includes("text") ? "Nějaký rozpoznaný text z obrázku" : undefined,
      faces: imageData.includes("face") ? [
        {
          emotions: ["neutrální", "mírný úsměv"],
          age: 30,
          gender: "nespecifikováno"
        }
      ] : []
    };
    
    return mockResult;
    
    /* Real implementation would be something like:
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: imageData.split(',')[1]
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'TEXT_DETECTION' },
              { type: 'FACE_DETECTION' },
              { type: 'OBJECT_LOCALIZATION' }
            ]
          }
        ]
      })
    });
    
    const result = await response.json();
    // Process result and return formatted data
    */
  } catch (error) {
    console.error('Chyba při analýze obrázku:', error);
    toast.error("Nepodařilo se analyzovat obrázek. Zkuste to prosím znovu.");
    throw error;
  }
};

export const formatAnalysisResult = (result: ImageAnalysisResult): string => {
  let formattedResult = `# Analýza obrázku 📸\n\n`;
  
  formattedResult += `## Popis\n${result.description}\n\n`;
  
  if (result.tags && result.tags.length > 0) {
    formattedResult += `## Tagy\n${result.tags.join(', ')}\n\n`;
  }
  
  if (result.objects && result.objects.length > 0) {
    formattedResult += `## Rozpoznané objekty\n${result.objects.join(', ')}\n\n`;
  }
  
  if (result.text) {
    formattedResult += `## Rozpoznaný text\n${result.text}\n\n`;
  }
  
  if (result.faces && result.faces.length > 0) {
    formattedResult += `## Rozpoznané tváře\n`;
    result.faces.forEach((face, index) => {
      formattedResult += `Tvář ${index + 1}:\n- Emoce: ${face.emotions.join(', ')}\n- Přibližný věk: ${face.age}\n- Pohlaví: ${face.gender}\n\n`;
    });
  }
  
  formattedResult += `\n_Výsledky analýzy jsou pouze orientační. Pro přesnější analýzu použijte specializované nástroje._`;
  
  return formattedResult;
};
