
import { useState } from 'react';
import { toast } from "sonner";
import { Message } from '@/types/chat';
import { useConversation } from '@/hooks/useConversation';
import { generateAIResponse, processImageAnalysis } from '@/utils/messageHandler';
import { processCommand } from '@/utils/commandProcessor';

export function useChatMessages() {
  const [isLoading, setIsLoading] = useState(false);
  
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
      toast.error("Nepodařilo se zpracovat vaši zprávu. Zkuste to prosím znovu.");

      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Omlouvám se, ale došlo k chybě při zpracování vaší zprávy. Zkuste to prosím znovu. 😞",
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
    
    // Special case for clear command
    if (commandText === '/clear') {
      updateConversation(convId, []);
      return;
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
      console.log("Processing command:", commandText);
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
        content: "Nemůžu zpracovat tento příkaz. Zkus to znovu nebo napiš /help pro seznam příkazů. 😕",
        role: 'assistant',
        timestamp: new Date()
      };
      
      const finalMessages = [...newMessages, errorMessage];
      updateConversation(convId, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageAnalysis = async (imageData: string) => {
    let convId = currentConversation;
    if (!convId) {
      convId = createNewConversation();
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "📸 *Analýza obrázku*",
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
      const analysisResult = await processImageAnalysis(imageData);
      
      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: analysisResult,
        role: 'assistant',
        timestamp: new Date()
      };
      
      const finalMessages = [...newMessages, assistantMessage];
      updateConversation(convId, finalMessages);
    } catch (error) {
      console.error('Chyba při zpracování analýzy obrázku:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        content: "Bohužel došlo k chybě při analýze obrázku. Zkuste to prosím znovu. 😞",
        role: 'assistant',
        timestamp: new Date()
      };
      
      const finalMessages = [...newMessages, errorMessage];
      updateConversation(convId, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLoading,
    handleSend,
    handleCommand,
    handleImageAnalysis,
    conversations,
    currentConversation,
    getCurrentMessages,
    setCurrentConversation,
    deleteConversation,
    createNewConversation
  };
}
