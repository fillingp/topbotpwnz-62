
// Main API service facade - exports all APIs from individual services
export { 
  callGeminiAPI, 
  streamGeminiResponse,
  analyzeImageWithGemini 
} from './geminiService';

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
export { 
  analyzeImage, 
  formatAnalysisResult, 
  type ImageAnalysisResult 
} from '../utils/imageAnalysis';
