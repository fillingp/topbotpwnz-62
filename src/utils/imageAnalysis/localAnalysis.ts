
import { ImageAnalysisResult } from "./types";

// Local image analysis without API calls
export const localImageAnalysis = (imageData: string): ImageAnalysisResult => {
  console.log("Performing local image analysis");
  
  // Extract basic information from image data
  const isPNG = imageData.includes('image/png');
  const isJPG = imageData.includes('image/jpeg');
  const isWebP = imageData.includes('image/webp');
  const isGIF = imageData.includes('image/gif');
  
  // Create a simple format detection
  const format = isPNG ? 'PNG' : isJPG ? 'JPEG' : isWebP ? 'WebP' : isGIF ? 'GIF' : 'neznámý';
  
  // Estimate image size from base64 string
  const base64Data = imageData.split(',')[1] || '';
  const sizeInBytes = Math.ceil((base64Data.length * 3) / 4);
  const sizeInKB = Math.round(sizeInBytes / 1024);
  
  // Create mock analysis result
  const result: ImageAnalysisResult = {
    description: `Obrázek ve formátu ${format} o velikosti přibližně ${sizeInKB} KB.`,
    tags: [format.toLowerCase(), "obrázek"],
    objects: [],
  };
  
  // Add basic color detection based on sample of the base64 data
  // This is not accurate but provides some basic info for the fallback
  const hasLotOfData = base64Data.length > 10000;
  
  if (hasLotOfData) {
    result.tags.push("barevný");
    
    // Very simple mock color analysis
    result.dominantColors = [
      { color: "rgb(120, 120, 120)", score: 0.5 },
      { color: "rgb(200, 200, 200)", score: 0.3 },
    ];
  } else {
    result.tags.push("jednoduchý");
  }
  
  return result;
};
