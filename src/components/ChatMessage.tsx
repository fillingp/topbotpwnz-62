
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start space-x-3`}>
        <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
          <AvatarFallback className={message.role === 'user' ? 'bg-blue-600' : 'bg-gradient-to-r from-purple-500 to-blue-500'}>
            {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
          </AvatarFallback>
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
                <span className="text-sm">TopBot.PwnZ píše...</span>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                {message.content.split('\n').map((line, index) => (
                  <p key={index} className="mb-2 last:mb-0 leading-relaxed">{line}</p>
                ))}
              </div>
            )}
            <div className="text-xs opacity-70 mt-2">
              {message.timestamp.toLocaleTimeString('cs-CZ', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatMessage;
