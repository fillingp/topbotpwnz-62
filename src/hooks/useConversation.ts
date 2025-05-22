
import { useState, useEffect } from 'react';
import { Conversation, Message } from '@/types/chat';

export function useConversation() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);

  // Load conversations from localStorage on first load
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem('topbotConversations');
      const savedCurrentConv = localStorage.getItem('topbotCurrentConversation');
      
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        // Convert string date format back to Date objects
        const conversationsWithDates = parsed.map((conv: any) => ({
          ...conv,
          lastUpdated: new Date(conv.lastUpdated),
          messages: conv.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
        setConversations(conversationsWithDates);
      }
      
      if (savedCurrentConv) {
        setCurrentConversation(savedCurrentConv);
      }
    } catch (error) {
      console.error('Chyba při načítání konverzací z localStorage:', error);
    }
  }, []);

  // Save conversations to localStorage on every change
  useEffect(() => {
    try {
      if (conversations.length > 0) {
        localStorage.setItem('topbotConversations', JSON.stringify(conversations));
      }
      
      if (currentConversation) {
        localStorage.setItem('topbotCurrentConversation', currentConversation);
      }
    } catch (error) {
      console.error('Chyba při ukládání konverzací do localStorage:', error);
    }
  }, [conversations, currentConversation]);

  const getCurrentMessages = (): Message[] => {
    if (!currentConversation) return [];
    const conv = conversations.find(c => c.id === currentConversation);
    return conv?.messages || [];
  };

  const createNewConversation = (): string => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: 'Nová konverzace',
      messages: [],
      lastUpdated: new Date()
    };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversation(newConv.id);
    return newConv.id;
  };

  const updateConversation = (convId: string, messages: Message[]) => {
    setConversations(prev => prev.map(conv => 
      conv.id === convId 
        ? { 
            ...conv, 
            messages, 
            lastUpdated: new Date(),
            title: messages.length > 0 ? messages[0].content.slice(0, 30) + '...' : 'Nová konverzace'
          }
        : conv
    ));
  };

  const deleteConversation = (convId: string) => {
    setConversations(prev => prev.filter(c => c.id !== convId));
    if (currentConversation === convId) {
      setCurrentConversation(null);
    }
  };

  return {
    conversations,
    currentConversation,
    getCurrentMessages,
    createNewConversation,
    updateConversation,
    deleteConversation,
    setCurrentConversation
  };
}
