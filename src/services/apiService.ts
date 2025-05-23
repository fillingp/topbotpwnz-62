
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

// Export the Google Vision services for image analysis
export { 
  analyzeImage, 
  formatAnalysisResult, 
  type ImageAnalysisResult 
} from './visionService';
