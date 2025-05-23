
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GOOGLE_API_KEY, defaultGenerationConfig, defaultSafetySettings } from './gemini/config';

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

/**
 * Helper function to create a new instance of GoogleGenerativeAI
 */
export const createGenAI = () => {
  return new GoogleGenerativeAI(GOOGLE_API_KEY);
};
