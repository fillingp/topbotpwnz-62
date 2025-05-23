
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, Camera, Mic, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

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

  return (
    <div className="p-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-lg">
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
        <div className="flex space-x-2">
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={handleSend}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      <div className="text-xs text-center text-slate-400 mt-2">
        Klávesové zkratky: Alt+H (help), Alt+J (joke), Alt+F (forher), Alt+I (image), Alt+C (clear)
      </div>
    </div>
  );
};

export default ChatInput;
