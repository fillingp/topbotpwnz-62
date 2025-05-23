
// Speech Service using Google's Speech-to-Text and Text-to-Speech APIs

// Interface for Speech Recognition Result
export interface SpeechRecognitionResult {
  text: string;
  confidence: number;
  language?: string;
}

// Interface for Text-to-Speech Result
export interface TextToSpeechResult {
  audio: ArrayBuffer;
  success: boolean;
}

// Speech-to-Text function
export const recognizeSpeech = async (audioBlob: Blob): Promise<SpeechRecognitionResult> => {
  try {
    // Convert the audio blob to base64
    const base64Audio = await blobToBase64(audioBlob);
    const audioContent = base64Audio.split(',')[1];
    
    // Call Google Speech-to-Text API
    const response = await fetch('https://speech.googleapis.com/v1/speech:recognize?key=AIzaSyDy8xA2ruEKsJhK9J0XMENj66BpYwLaluM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'cs-CZ',
          alternativeLanguageCodes: ['en-US'],
          model: 'default',
          enableAutomaticPunctuation: true,
          enableSpokenPunctuation: true
        },
        audio: {
          content: audioContent
        }
      })
    });

    if (!response.ok) {
      console.error('Google Speech-to-Text API error:', await response.text());
      throw new Error(`Google Speech API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Speech recognition result:', data);

    if (data.results && data.results.length > 0) {
      const result = data.results[0].alternatives[0];
      return {
        text: result.transcript,
        confidence: result.confidence || 0.8,
        language: data.results[0].languageCode || 'cs-CZ'
      };
    } else {
      return {
        text: "Žádný text nebyl rozpoznán",
        confidence: 0,
        language: 'cs-CZ'
      };
    }
  } catch (error) {
    console.error('Error in speech recognition:', error);
    return {
      text: "Chyba při rozpoznávání řeči",
      confidence: 0,
      language: 'cs-CZ'
    };
  }
};

// Text-to-Speech function
export const synthesizeSpeech = async (text: string, voiceType: 'FEMALE' | 'MALE' = 'FEMALE'): Promise<TextToSpeechResult> => {
  try {
    // Configure voice gender and language based on input
    const voiceParams = voiceType === 'FEMALE' 
      ? { languageCode: 'cs-CZ', name: 'cs-CZ-Wavenet-A', ssmlGender: 'FEMALE' }
      : { languageCode: 'cs-CZ', name: 'cs-CZ-Wavenet-B', ssmlGender: 'MALE' };

    // Call Google Text-to-Speech API
    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyDy8xA2ruEKsJhK9J0XMENj66BpYwLaluM', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          text: text
        },
        voice: voiceParams,
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
          volumeGainDb: 0.0
        }
      })
    });

    if (!response.ok) {
      console.error('Google Text-to-Speech API error:', await response.text());
      throw new Error(`Google TTS API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Text-to-Speech synthesis successful');

    // Convert the base64 audio to ArrayBuffer
    const audioContent = data.audioContent;
    const audioArrayBuffer = base64ToArrayBuffer(audioContent);

    return {
      audio: audioArrayBuffer,
      success: true
    };
  } catch (error) {
    console.error('Error in speech synthesis:', error);
    return {
      audio: new ArrayBuffer(0),
      success: false
    };
  }
};

// Helper function to play audio from ArrayBuffer
export const playAudio = async (audioBuffer: ArrayBuffer): Promise<void> => {
  const audioContext = new AudioContext();
  try {
    const audioSource = await audioContext.decodeAudioData(audioBuffer);
    const source = audioContext.createBufferSource();
    source.buffer = audioSource;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error('Error playing audio:', error);
  }
};

// Helper function to convert Blob to Base64
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Helper function to convert Base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Audio recorder for speech-to-text
export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async start(): Promise<boolean> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];
      
      this.mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      });
      
      this.mediaRecorder.start();
      return true;
    } catch (error) {
      console.error('Error starting audio recording:', error);
      return false;
    }
  }

  async stop(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve(null);
        return;
      }
      
      this.mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.stopStream();
        resolve(audioBlob);
      });
      
      this.mediaRecorder.stop();
    });
  }

  private stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }
}
