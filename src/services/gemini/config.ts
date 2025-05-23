
// Configuration for Gemini API
export const GOOGLE_API_KEY = "AIzaSyBxCuohw8PKDi5MkKlRd4eqN9QaFJTwrlk";

export const defaultGenerationConfig = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

export const defaultSafetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_MEDIUM_AND_ABOVE"
  }
];
