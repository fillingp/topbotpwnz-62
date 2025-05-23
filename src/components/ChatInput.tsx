
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Camera, Mic, Image, MicOff, Code } from "lucide-react";
import { toast } from 'sonner';
import { AudioRecorder, recognizeSpeech } from '@/utils/speechService';
import { generateCode } from '@/utils/messageHandler';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
  onImageUploadRequested: () => void;
  onCameraRequested: () => void;
  onCodeGenerationRequested: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  onImageUploadRequested,
  onCameraRequested,
  onCodeGenerationRequested
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const audioRecorder = useRef(new AudioRecorder());

  const handleSend = async () => {
    if (input.trim()) {
      await onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info("Zpracovávám hlasový vstup...");
      
      try {
        const audioBlob = await audioRecorder.current.stop();
        if (audioBlob) {
          const result = await recognizeSpeech(audioBlob);
          if (result.text && result.text !== "Žádný text nebyl rozpoznán") {
            setInput(result.text);
            toast.success(`Rozpoznáno s ${Math.round(result.confidence * 100)}% jistotou`);
          } else {
            toast.error("Nepodařilo se rozpoznat řeč. Zkuste to znovu.");
          }
        }
      } catch (error) {
        console.error("Chyba při zpracování hlasového vstupu:", error);
        toast.error("Chyba při zpracování hlasového vstupu");
      }
    } else {
      try {
        const success = await audioRecorder.current.start();
        if (success) {
          setIsRecording(true);
          toast.success("Nahrávání hlasu zahájeno. Mluvte prosím.");
        } else {
          toast.error("Nepodařilo se spustit nahrávání zvuku. Zkontrolujte prosím oprávnění mikrofonu.");
        }
      } catch (error) {
        console.error("Chyba při zahájení nahrávání:", error);
        toast.error("Chyba při zahájení nahrávání");
      }
    }
  };

  const handleCodeGeneration = () => {
    onCodeGenerationRequested();
  };

  return (
    <div className="p-3 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-lg">
      <div className="max-w-4xl mx-auto flex items-end space-x-2">
        <div className="flex-1 relative">
          <Input
            className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-purple-500 pr-10"
            placeholder="Napiš zprávu nebo použij příkaz (např. /help)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1 text-slate-400">
            {input.startsWith('/') && <span className="text-xs bg-slate-600 px-1 rounded">příkaz</span>}
          </div>
        </div>
        <div className="flex space-x-1 md:space-x-2">
          {/* Code Generation Button */}
          <Button
            variant="outline"
            size="icon"
            className="bg-slate-700 hover:bg-slate-600 hidden sm:flex"
            onClick={handleCodeGeneration}
            disabled={isLoading}
            title="Generovat kód"
          >
            <Code className="w-4 h-4" />
          </Button>

          {/* Mic Button */}
          <Button
            variant="outline"
            size="icon"
            className={`${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-slate-700 hover:bg-slate-600'}`}
            onClick={toggleRecording}
            disabled={isLoading}
            title={isRecording ? "Ukončit nahrávání" : "Nahrát hlas"}
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          {/* Image Upload Button */}
          <Button
            variant="outline"
            size="icon"
            className="bg-slate-700 hover:bg-slate-600"
            onClick={onImageUploadRequested}
            disabled={isLoading}
            title="Nahrát obrázek"
          >
            <Image className="w-4 h-4" />
          </Button>

          {/* Camera Button */}
          <Button
            variant="outline"
            size="icon"
            className="bg-slate-700 hover:bg-slate-600"
            onClick={onCameraRequested}
            disabled={isLoading}
            title="Vyfotit"
          >
            <Camera className="w-4 h-4" />
          </Button>

          {/* Send Button */}
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div className="text-xs text-center text-slate-400 mt-1 hidden sm:block">
        Klávesové zkratky: Alt+H (help), Alt+J (joke), Alt+F (forher), Alt+M (forhim), Alt+I (image), Alt+C (clear), Alt+S (speech)
      </div>
    </div>
  );
};

export default ChatInput;
