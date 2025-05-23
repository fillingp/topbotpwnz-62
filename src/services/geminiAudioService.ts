
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';

const GOOGLE_API_KEY = "AIzaSyBxCuohw8PKDi5MkKlRd4eqN9QaFJTwrlk";

// Interface for a simple audio buffer
interface AudioData {
  buffer: ArrayBuffer;
  mimeType: string;
}

// Interface for audio response options
interface AudioResponseOptions {
  voiceName?: string;
}

export const streamGeminiAudio = async (
  message: string, 
  onTextChunk: (text: string) => void,
  onAudioChunk: (audioData: AudioData) => void,
  options: AudioResponseOptions = {}
): Promise<void> => {
  try {
    console.log('Spouštím Gemini Audio API s dotazem:', message);
    
    // Setup Gemini API
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    
    // Use the appropriate model for audio generation
    // For web contexts we'll use the standard model as the live API requires Node.js
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ]
    });
    
    const prompt = `Jsi TopBot.PwnZ, pokročilý český AI asistent. Odpovídáš výhradně v češtině s perfektním skloňováním a gramatikou. 
      ${message}
      
      Odpověz stručně a výstižně, udržuj konverzační tok.`;
    
    // Generate content stream from Gemini
    const result = await model.generateContentStream({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    // Process the text stream
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        onTextChunk(chunkText);
        
        // Since we can't directly get audio from this API in browser,
        // we'll use the Web Speech API as a fallback
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(chunkText);
          utterance.lang = 'cs-CZ';
          
          // Convert voice data to ArrayBuffer (simulated for this example)
          // In production, you'd use a proper TTS service
          utterance.onend = () => {
            // Simulate audio data for this example
            // In a real implementation, you'd get actual audio data
            const dummyBuffer = new ArrayBuffer(0);
            onAudioChunk({
              buffer: dummyBuffer,
              mimeType: 'audio/wav'
            });
          };
          
          window.speechSynthesis.speak(utterance);
        }
      }
    }

    console.log('Gemini audio stream dokončen');
  } catch (error) {
    console.error('Chyba při streamování Gemini Audio:', error);
    throw error;
  }
};

// Helper function to convert base64 to ArrayBuffer
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Helper function to play audio from ArrayBuffer
export const playAudioBuffer = (buffer: ArrayBuffer, mimeType: string = 'audio/wav'): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const audioContext = new AudioContext();
      audioContext.decodeAudioData(buffer, (audioBuffer) => {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => resolve();
        source.start(0);
      }, (err) => {
        console.error('Error decoding audio data', err);
        reject(err);
      });
    } catch (error) {
      console.error('Error playing audio buffer', error);
      reject(error);
    }
  });
};
