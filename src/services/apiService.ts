
// Main API service facade - exports all APIs from individual services
export { 
  callGeminiAPI, 
  streamGeminiResponse,
  analyzeImageWithGemini,
  generateImageWithGemini,
  getStructuredResponseFromGemini,
  getRecipeListSchema,
  createGenAI,
  GOOGLE_API_KEY,
  defaultGenerationConfig,
  defaultSafetySettings
} from './geminiService';

export {
  streamGeminiAudio,
  playAudioBuffer
} from './geminiAudioService';

export { 
  callPerplexityAPI 
} from './perplexityService';

export { 
  callSerperAPI 
} from './serperService';

export { 
  performWebSearch 
} from './searchService';

// Export the image analysis services 
export type { 
  ImageAnalysisResult 
} from '../utils/imageAnalysis/types';

export {
  analyzeImage,
  formatAnalysisResult
} from '../utils/imageAnalysis';
