
// Types for image analysis service
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
