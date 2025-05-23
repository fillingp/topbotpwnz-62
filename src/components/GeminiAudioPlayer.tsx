
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { streamGeminiAudio, playAudioBuffer } from '@/services/apiService';

interface GeminiAudioPlayerProps {
  text: string;
  onPlayComplete?: () => void;
  autoPlay?: boolean;
}

const GeminiAudioPlayer: React.FC<GeminiAudioPlayerProps> = ({ 
  text, 
  onPlayComplete, 
  autoPlay = false 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioQueue = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);

  const togglePlay = async () => {
    if (isPlaying) {
      setIsPlaying(false);
      isPlayingRef.current = false;
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      setIsLoading(true);

      try {
        // Clear any existing audio queue
        audioQueue.current = [];
        
        // Request audio stream from Gemini
        await streamGeminiAudio(
          text,
          (textChunk) => {
            console.log("Received text chunk:", textChunk);
          },
          async (audioData) => {
            console.log("Received audio chunk");
            
            // If this is our first chunk, we're no longer loading
            if (isLoading) setIsLoading(false);
            
            // Add to queue
            audioQueue.current.push(audioData.buffer);
            
            // If we're the first chunk and we're supposed to be playing, start playing
            if (audioQueue.current.length === 1 && isPlayingRef.current) {
              playNextInQueue();
            }
          }
        );
      } catch (error) {
        console.error("Error streaming Gemini audio:", error);
        toast.error("Nepodařilo se přehrát audio");
        setIsLoading(false);
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    }
  };

  const playNextInQueue = async () => {
    if (!isPlayingRef.current || audioQueue.current.length === 0) {
      return;
    }

    try {
      const nextBuffer = audioQueue.current.shift();
      if (nextBuffer) {
        await playAudioBuffer(nextBuffer);
      }
      
      // Play next in queue if there is one
      if (audioQueue.current.length > 0) {
        playNextInQueue();
      } else if (isPlayingRef.current) {
        // We're done playing all audio
        setIsPlaying(false);
        isPlayingRef.current = false;
        if (onPlayComplete) onPlayComplete();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real implementation, you'd adjust the audio volume here
  };

  // Auto-play when the component loads if requested
  useEffect(() => {
    if (autoPlay && text) {
      togglePlay();
    }
  }, [text, autoPlay]);

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="icon"
        className={`bg-slate-700 hover:bg-slate-600 ${isPlaying ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
        onClick={togglePlay}
        disabled={isLoading}
        title={isPlaying ? "Zastavit přehrávání" : "Přehrát audio"}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <span className="w-4 h-4">▶</span>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="bg-slate-700 hover:bg-slate-600"
        onClick={toggleMute}
        title={isMuted ? "Zapnout zvuk" : "Ztlumit"}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default GeminiAudioPlayer;
