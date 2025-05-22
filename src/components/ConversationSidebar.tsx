
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Trash2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  lastUpdated: Date;
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversation: string | null;
  onCreateNew: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  conversations,
  currentConversation,
  onCreateNew,
  onSelectConversation,
  onDeleteConversation,
}) => {
  return (
    <div className="w-80 bg-slate-800/50 backdrop-blur-lg border-r border-slate-700/50 flex flex-col">
      <div className="p-4 border-b border-slate-700/50">
        <Button 
          onClick={onCreateNew}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Nová konverzace
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {conversations.map((conv) => (
            <Card 
              key={conv.id}
              className={`cursor-pointer transition-all duration-200 hover:bg-slate-700/50 ${
                currentConversation === conv.id ? 'bg-slate-700/70 ring-2 ring-blue-500/50' : 'bg-slate-800/30'
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-slate-200 truncate">
                      {conv.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {conv.lastUpdated.toLocaleDateString('cs-CZ')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="ml-2 h-8 w-8 p-0 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3 h-3 text-slate-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationSidebar;
