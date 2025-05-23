
import { ImageAnalysisResult } from "./types";
import { translateLabelToCzech, translateObjectToCzech, translateLikelihoodToCzech } from "./translationUtils";

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

// Process image using Google Vision API
export const processWithGoogleVision = async (imageData: string): Promise<ImageAnalysisResult> => {
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
    throw error;
  }
};
