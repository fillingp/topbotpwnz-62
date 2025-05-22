
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { processCommand } from "@/utils/commandProcessor";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessageList from "@/components/ChatMessageList";
import ConversationSidebar from "@/components/ConversationSidebar";
import { useConversation } from "@/hooks/useConversation";
import { generateAIResponse } from "@/utils/messageHandler";
import { Message } from "@/types/chat";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const {
    conversations,
    currentConversation,
    getCurrentMessages,
    createNewConversation,
    updateConversation,
    deleteConversation,
    setCurrentConversation
  } = useConversation();

  const handleSend = async (input: string) => {
    if (!input.trim()) return;
    
    // Check if it's a command
    if (input.trim().startsWith('/')) {
      await handleCommand(input.trim());
      return;
    }

    let convId = currentConversation;
    if (!convId) {
      convId = createNewConversation();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date()
    };

    const currentMessages = getCurrentMessages();
    const newMessages = [...currentMessages, userMessage];
    updateConversation(convId, newMessages);

    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };

    updateConversation(convId, [...newMessages, typingMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(input.trim(), currentMessages);

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, assistantMessage];
      updateConversation(convId, finalMessages);
    } catch (error) {
      console.error('Chyba při zpracování zprávy:', error);
      toast({
        title: "Chyba",
        description: "Nepodařilo se zpracovat vaši zprávu. Zkuste to prosím znovu.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Omlouvám se, ale došlo k chybě při zpracování vaší zprávy. Zkuste to prosím znovu.",
        role: 'assistant',
        timestamp: new Date()
      };

      const finalMessages = [...newMessages, errorMessage];
      updateConversation(convId, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommand = async (commandText: string) => {
    let convId = currentConversation;
    if (!convId) {
      convId = createNewConversation();
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: commandText,
      role: 'user',
      timestamp: new Date()
    };
    
    const currentMessages = getCurrentMessages();
    const newMessages = [...currentMessages, userMessage];
    updateConversation(convId, newMessages);
    
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    
    updateConversation(convId, [...newMessages, typingMessage]);
    setIsLoading(true);
    
    try {
      const result = await processCommand(commandText);
      
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: result.content,
        role: 'assistant',
        timestamp: new Date()
      };
      
      const finalMessages = [...newMessages, assistantMessage];
      updateConversation(convId, finalMessages);
      
    } catch (error) {
      console.error('Chyba při zpracování příkazu:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Nemůžu zpracovat tento příkaz. Zkus to znovu nebo napiš /help pro seznam příkazů.",
        role: 'assistant',
        timestamp: new Date()
      };
      
      const finalMessages = [...newMessages, errorMessage];
      updateConversation(convId, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar s konverzacemi */}
      <ConversationSidebar 
        conversations={conversations}
        currentConversation={currentConversation}
        onCreateNew={createNewConversation}
        onSelectConversation={setCurrentConversation}
        onDeleteConversation={deleteConversation}
      />

      {/* Hlavní chatová oblast */}
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatMessageList messages={getCurrentMessages()} />
        <ChatInput onSendMessage={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
