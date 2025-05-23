
import React, { useEffect } from 'react';
import { toast } from "sonner";
import { Message } from '@/types/chat';
import { performWebSearch } from '@/services/apiService';

interface WebSearchHandlerProps {
  messages: Message[];
  currentConversation: string | null;
  updateConversation: (id: string, messages: Message[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const WebSearchHandler: React.FC<WebSearchHandlerProps> = ({
  messages,
  currentConversation,
  updateConversation,
  setIsLoading
}) => {
  // Listen for messages that should trigger web search
  useEffect(() => {
    if (!messages.length || !currentConversation) return;
    
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage && lastMessage.role === 'user' && messages.length > 1) {
      const prevMessage = messages[messages.length - 2];
      
      // Check if the previous message was our web search guide
      if (prevMessage && 
          prevMessage.role === 'assistant' && 
          prevMessage.isGuide && 
          prevMessage.content.includes("Web search aktivován")) {
        
        // This is a response to our web search prompt
        (async () => {
          if (!currentConversation) return;
          
          const query = lastMessage.content;
          
          const typingMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: '',
            role: 'assistant',
            timestamp: new Date(),
            isTyping: true
          };
          
          updateConversation(currentConversation, [...messages, typingMessage]);
          setIsLoading(true);
          
          try {
            console.log("Performing web search for query:", query);
            const searchResults = await performWebSearch(query);
            
            const assistantMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: searchResults,
              role: 'assistant',
              timestamp: new Date()
            };
            
            // Remove the guide message and add the search results
            const filteredMessages = messages.filter(m => m.id !== prevMessage.id);
            updateConversation(currentConversation, [...filteredMessages, assistantMessage]);
          } catch (error) {
            console.error("Web search error:", error);
            toast.error("Chyba při vyhledávání na webu");
            
            const errorMessage: Message = {
              id: (Date.now() + 2).toString(),
              content: "Bohužel nastala chyba při vyhledávání. Zkuste to prosím znovu. 😔",
              role: 'assistant',
              timestamp: new Date()
            };
            
            // Remove the guide message and add the error message
            const filteredMessages = messages.filter(m => m.id !== prevMessage.id);
            updateConversation(currentConversation, [...filteredMessages, errorMessage]);
          } finally {
            setIsLoading(false);
          }
        })();
      }
    }
  }, [messages, currentConversation, updateConversation, setIsLoading]);

  return null; // This is a utility component with no UI
};

export default WebSearchHandler;
