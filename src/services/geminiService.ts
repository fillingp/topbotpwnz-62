
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_API_KEY } from './gemini/config';

// Re-export gemini functions from their proper modules
export { 
  callGeminiAPI, 
  streamGeminiResponse,
  getStructuredResponseFromGemini 
} from './gemini/textService';

export { 
  analyzeImageWithGemini,
  generateImageWithGemini 
} from './gemini/imageService';

export { getRecipeListSchema } from './gemini/schemaService';

// Export thinking functions
export { 
  geminiThinking,
  generateWithThoughts,
  streamWithThoughts,
  solveComplexProblem,
  GeminiThinkingService
} from './gemini/thinkingService';

// Export the configuration
export { GOOGLE_API_KEY, defaultGenerationConfig, defaultSafetySettings } from './gemini/config';

/**
 * Helper function to create a new instance of GoogleGenerativeAI
 */
export const createGenAI = () => {
  return new GoogleGenerativeAI(GOOGLE_API_KEY);
};
