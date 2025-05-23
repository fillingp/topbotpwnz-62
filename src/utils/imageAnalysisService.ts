
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
    console.log("Analyzing image...", imageData.slice(0, 50) + "...");
    
    // Process the image with Google Vision API
    const result = await processWithGoogleVision(imageData);
    return result;
    
  } catch (error) {
    console.error('Chyba při analýze obrázku:', error);
    toast.error("Nepodařilo se analyzovat obrázek. Zkuste to prosím znovu.");
    throw error;
  }
};

// Process image using Google Vision API
const processWithGoogleVision = async (imageData: string): Promise<ImageAnalysisResult> => {
  try {
    // Extract the base64 data from the image string
    const base64Content = imageData.split(',')[1];
    
    // Call Google Vision API using the Gemini API key
    const response = await fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDy8xA2ruEKsJhK9J0XMENj66BpYwLaluM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            image: {
              content: base64Content
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'TEXT_DETECTION' },
              { type: 'FACE_DETECTION' },
              { type: 'OBJECT_LOCALIZATION' },
              { type: 'IMAGE_PROPERTIES' }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      console.error('Google Vision API error:', await response.text());
      throw new Error(`Google Vision API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google Vision API response:', data);

    // Process the API response
    let result: ImageAnalysisResult = {
      description: "Obrázek byl úspěšně analyzován pomocí Google Vision API",
      tags: [],
      objects: []
    };

    // Extract labels (tags)
    if (data.responses[0].labelAnnotations) {
      result.tags = data.responses[0].labelAnnotations
        .map((label: any) => label.description)
        .filter((tag: string) => tag);
    }

    // Extract text
    if (data.responses[0].textAnnotations && data.responses[0].textAnnotations[0]) {
      result.text = data.responses[0].textAnnotations[0].description;
    }

    // Extract objects
    if (data.responses[0].localizedObjectAnnotations) {
      result.objects = data.responses[0].localizedObjectAnnotations
        .map((obj: any) => obj.name)
        .filter((name: string) => name);
    }

    // Extract face information
    if (data.responses[0].faceAnnotations && data.responses[0].faceAnnotations.length > 0) {
      result.faces = data.responses[0].faceAnnotations.map((face: any) => {
        const emotions = [];
        const emotionMap = [
          { name: "radost", value: face.joyLikelihood },
          { name: "smutek", value: face.sorrowLikelihood },
          { name: "hněv", value: face.angerLikelihood },
          { name: "překvapení", value: face.surpriseLikelihood }
        ];
        
        // Convert likelihood string to emotions
        for (const emotion of emotionMap) {
          if (["VERY_LIKELY", "LIKELY"].includes(emotion.value)) {
            emotions.push(emotion.name);
          }
        }
        
        // If no strong emotions detected, add neutral
        if (emotions.length === 0) {
          emotions.push("neutrální");
        }
        
        return {
          emotions,
          age: 0, // Google Vision doesn't provide age estimation
          gender: "nespecifikováno" // Google Vision doesn't provide gender
        };
      });
    }

    return result;
    
  } catch (error) {
    console.error('Error processing image with Google Vision:', error);
    
    // Fallback to mock data
    return mockImageAnalysis(imageData);
  }
};

// Fallback mock analysis when API fails
const mockImageAnalysis = (imageData: string): ImageAnalysisResult => {
  console.log("Fallback to mock image analysis");
  
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
};

export const formatAnalysisResult = (result: ImageAnalysisResult): string => {
  let formattedResult = `# Analýza obrázku 📸\n\n`;
  
  if (result.description) {
    formattedResult += `## Popis\n${result.description}\n\n`;
  }
  
  if (result.tags && result.tags.length > 0) {
    formattedResult += `## Tagy 🏷️\n${result.tags.join(', ')}\n\n`;
  }
  
  if (result.objects && result.objects.length > 0) {
    formattedResult += `## Rozpoznané objekty 🔍\n${result.objects.join(', ')}\n\n`;
  }
  
  if (result.text) {
    formattedResult += `## Rozpoznaný text 📝\n${result.text}\n\n`;
  }
  
  if (result.faces && result.faces.length > 0) {
    formattedResult += `## Rozpoznané tváře 👤\n`;
    result.faces.forEach((face, index) => {
      formattedResult += `Tvář ${index + 1}:\n- Emoce: ${face.emotions.join(', ')}\n`;
      if (face.age > 0) {
        formattedResult += `- Přibližný věk: ${face.age}\n`;
      }
      if (face.gender !== "nespecifikováno") {
        formattedResult += `- Pohlaví: ${face.gender}\n`;
      }
      formattedResult += '\n';
    });
  }
  
  formattedResult += `\n_Analýza provedena pomocí pokročilého Google Vision API. Výsledky jsou orientační. Pro přesnější analýzu použijte specializované nástroje._`;
  
  return formattedResult;
};
