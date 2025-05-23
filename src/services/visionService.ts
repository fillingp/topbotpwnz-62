
import { 
  analyzeImage as analyzeImageUtil,
  formatAnalysisResult as formatAnalysisResultUtil,
  ImageAnalysisResult
} from '../utils/imageAnalysis';

// Re-export the image analysis functionality
export const analyzeImage = analyzeImageUtil;
export const formatAnalysisResult = formatAnalysisResultUtil;
export type { ImageAnalysisResult };
