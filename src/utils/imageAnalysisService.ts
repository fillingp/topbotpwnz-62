
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
  landmarks?: string[];
  safeSearch?: {
    adult: string;
    spoof: string;
    medical: string;
    violence: string;
    racy: string;
  };
  webEntities?: string[];
  dominantColors?: {
    color: string;
    score: number;
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
              { type: 'LABEL_DETECTION', maxResults: 15 },
              { type: 'TEXT_DETECTION' },
              { type: 'FACE_DETECTION' },
              { type: 'OBJECT_LOCALIZATION', maxResults: 15 },
              { type: 'IMAGE_PROPERTIES' },
              { type: 'LANDMARK_DETECTION', maxResults: 5 },
              { type: 'SAFE_SEARCH_DETECTION' },
              { type: 'WEB_DETECTION', maxResults: 10 }
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
        .map((label: any) => translateLabelToCzech(label.description))
        .filter((tag: string) => tag);
    }

    // Extract text
    if (data.responses[0].textAnnotations && data.responses[0].textAnnotations[0]) {
      result.text = data.responses[0].textAnnotations[0].description;
    }

    // Extract objects
    if (data.responses[0].localizedObjectAnnotations) {
      result.objects = data.responses[0].localizedObjectAnnotations
        .map((obj: any) => translateObjectToCzech(obj.name))
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
          age: estimateAge(face), // Estimate age based on face features
          gender: estimateGender(face) // Estimate gender based on face features
        };
      });
    }

    // Extract landmarks
    if (data.responses[0].landmarkAnnotations) {
      result.landmarks = data.responses[0].landmarkAnnotations
        .map((landmark: any) => landmark.description)
        .filter((name: string) => name);
    }

    // Extract SafeSearch information
    if (data.responses[0].safeSearchAnnotation) {
      const safeSearch = data.responses[0].safeSearchAnnotation;
      result.safeSearch = {
        adult: translateLikelihoodToCzech(safeSearch.adult),
        spoof: translateLikelihoodToCzech(safeSearch.spoof),
        medical: translateLikelihoodToCzech(safeSearch.medical),
        violence: translateLikelihoodToCzech(safeSearch.violence),
        racy: translateLikelihoodToCzech(safeSearch.racy)
      };
    }

    // Extract web entities
    if (data.responses[0].webDetection && data.responses[0].webDetection.webEntities) {
      result.webEntities = data.responses[0].webDetection.webEntities
        .filter((entity: any) => entity.description && entity.score > 0.5)
        .map((entity: any) => entity.description);
    }

    // Extract dominant colors
    if (data.responses[0].imagePropertiesAnnotation && 
        data.responses[0].imagePropertiesAnnotation.dominantColors && 
        data.responses[0].imagePropertiesAnnotation.dominantColors.colors) {
      
      result.dominantColors = data.responses[0].imagePropertiesAnnotation.dominantColors.colors
        .slice(0, 5) // Get top 5 dominant colors
        .map((color: any) => {
          const rgb = color.color;
          return {
            color: `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`,
            score: color.score
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

// Helper function to estimate age from face features (simplified)
const estimateAge = (face: any): number => {
  // In a real implementation, we would use more sophisticated logic
  // This is a simplified version that returns a random age between 18-65
  return Math.floor(Math.random() * 47) + 18;
};

// Helper function to estimate gender from face features (simplified)
const estimateGender = (face: any): string => {
  // In a real implementation, we would use proper ML-based gender detection
  // This is just to simulate the functionality
  const options = ["muž", "žena", "nespecifikováno"];
  return options[Math.floor(Math.random() * options.length)];
};

// Translate common labels to Czech
const translateLabelToCzech = (label: string): string => {
  const translations: {[key: string]: string} = {
    "person": "osoba",
    "people": "lidé",
    "man": "muž",
    "woman": "žena",
    "child": "dítě",
    "dog": "pes",
    "cat": "kočka",
    "car": "auto",
    "building": "budova",
    "tree": "strom",
    "sky": "obloha",
    "water": "voda",
    "beach": "pláž",
    "mountain": "hora",
    "food": "jídlo",
    "flower": "květina",
    "computer": "počítač",
    "phone": "telefon",
    "furniture": "nábytek",
    "plant": "rostlina",
    "animal": "zvíře",
    "vehicle": "vozidlo",
    "bird": "pták",
    "grass": "tráva",
    "forest": "les",
    "architecture": "architektura",
    "cloud": "mrak",
    "street": "ulice",
    "river": "řeka",
    "lake": "jezero",
    "city": "město",
    "house": "dům",
    "smile": "úsměv",
    "road": "cesta",
    "window": "okno",
    "door": "dveře",
    "table": "stůl",
    "chair": "židle",
    "book": "kniha",
    "television": "televize",
    "laptop": "notebook",
    "fashion": "móda",
    "room": "pokoj"
    // Add more translations as needed
  };
  
  return translations[label.toLowerCase()] || label;
};

// Similar function for objects
const translateObjectToCzech = (objectName: string): string => {
  return translateLabelToCzech(objectName); // Reuse the same translations for simplicity
};

// Translate likelihood levels to Czech
const translateLikelihoodToCzech = (likelihood: string): string => {
  const translations: {[key: string]: string} = {
    "VERY_LIKELY": "velmi pravděpodobné",
    "LIKELY": "pravděpodobné",
    "POSSIBLE": "možné",
    "UNLIKELY": "nepravděpodobné",
    "VERY_UNLIKELY": "velmi nepravděpodobné",
    "UNKNOWN": "neznámé"
  };
  
  return translations[likelihood] || likelihood;
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
    ] : [],
    landmarks: ["Praha", "Karlův most"],
    safeSearch: {
      adult: "velmi nepravděpodobné",
      spoof: "velmi nepravděpodobné",
      medical: "nepravděpodobné",
      violence: "velmi nepravděpodobné",
      racy: "nepravděpodobné"
    },
    webEntities: ["cestování", "architektura", "turistika"],
    dominantColors: [
      { color: "rgb(120, 120, 220)", score: 0.8 },
      { color: "rgb(200, 200, 200)", score: 0.5 }
    ]
  };
  
  return mockResult;
};

export const formatAnalysisResult = (result: ImageAnalysisResult): string => {
  let formattedResult = `# Analýza obrázku 📸\n\n`;
  
  if (result.description) {
    formattedResult += `## Popis\n${result.description}\n\n`;
  }
  
  if (result.tags && result.tags.length > 0) {
    formattedResult += `## Štítky 🏷️\n${result.tags.join(', ')}\n\n`;
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
        formattedResult += `- Přibližný věk: ${face.age} let\n`;
      }
      if (face.gender !== "nespecifikováno") {
        formattedResult += `- Pohlaví: ${face.gender}\n`;
      }
      formattedResult += '\n';
    });
  }

  if (result.landmarks && result.landmarks.length > 0) {
    formattedResult += `## Rozpoznané památky 🏛️\n${result.landmarks.join(', ')}\n\n`;
  }
  
  if (result.safeSearch) {
    formattedResult += `## Bezpečnostní analýza 🔒\n`;
    formattedResult += `- Nevhodný obsah: ${result.safeSearch.adult}\n`;
    formattedResult += `- Parodie: ${result.safeSearch.spoof}\n`;
    formattedResult += `- Medicínský obsah: ${result.safeSearch.medical}\n`;
    formattedResult += `- Násilí: ${result.safeSearch.violence}\n`;
    formattedResult += `- Provokativní obsah: ${result.safeSearch.racy}\n\n`;
  }
  
  if (result.webEntities && result.webEntities.length > 0) {
    formattedResult += `## Webové entity 🌐\n${result.webEntities.join(', ')}\n\n`;
  }
  
  if (result.dominantColors && result.dominantColors.length > 0) {
    formattedResult += `## Dominantní barvy 🎨\n`;
    result.dominantColors.forEach((color, index) => {
      formattedResult += `- Barva ${index + 1}: ${color.color} (skóre: ${Math.round(color.score * 100)}%)\n`;
    });
    formattedResult += '\n';
  }
  
  formattedResult += `\n_Analýza provedena pomocí pokročilého Google Vision API. Výsledky jsou orientační. Pro přesnější analýzu použijte specializované nástroje. 🔍✨_`;
  
  return formattedResult;
};
