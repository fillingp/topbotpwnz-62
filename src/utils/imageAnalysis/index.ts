
import { toast } from "sonner";
import { ImageAnalysisResult } from "./types";
import { processWithGoogleVision } from "./googleVisionAnalysis";
import { localImageAnalysis } from "./localAnalysis";
import { formatAnalysisResult } from "./formatter";

export const analyzeImage = async (imageData: string): Promise<ImageAnalysisResult> => {
  try {
    console.log("Analyzing image...", imageData.slice(0, 50) + "...");
    
    // First attempt with Google Vision API
    try {
      const result = await processWithGoogleVision(imageData);
      return result;
    } catch (visionError) {
      console.error('Google Vision API error, falling back to local analysis:', visionError);
      // If Google Vision fails, fall back to local analysis
      return localImageAnalysis(imageData);
    }
    
  } catch (error) {
    console.error('Chyba při analýze obrázku:', error);
    toast.error("Nepodařilo se analyzovat obrázek. Zkuste to prosím znovu.");
    // Return basic analysis result even on error
    return {
      description: "Nepodařilo se provést analýzu obrázku. Zkuste to prosím znovu.",
      tags: ["chyba"],
      objects: []
    };
  }
};

// Export everything needed for the image analysis service
export type { ImageAnalysisResult } from "./types";
export { formatAnalysisResult } from "./formatter";
