
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { Message } from '@/types/chat';
import GeminiAudioPlayer from './GeminiAudioPlayer';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
          {message.role === 'user' ? (
            <AvatarFallback className="bg-blue-600">
              <User className="w-4 h-4" />
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage src="/lovable-uploads/919269ed-b648-431b-8bf2-99352022aff3.png" alt="Topwnz" />
              <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </>
          )}
        </Avatar>
        <Card className={`${
          message.role === 'user' 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
            : 'bg-slate-800/70 text-slate-100 border-slate-700'
        } backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}>
          <CardContent className="p-4">
            {message.isTyping ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Topwnz píše...</span>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString('cs-CZ', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
              
              {message.role === 'assistant' && !message.isTyping && (
                <GeminiAudioPlayer text={message.content} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;
