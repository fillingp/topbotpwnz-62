
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, Loader2, MessageCircle, Trash2, Terminal, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/ChatMessage";
import ConversationSidebar from "@/components/ConversationSidebar";
import { processCommand } from "@/utils/commandProcessor";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

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

const Index = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast: showToast } = useToast();

  // Načtení konverzací z localStorage při prvním načtení
  useEffect(() => {
    try {
      const savedConversations = localStorage.getItem('topbotConversations');
      const savedCurrentConv = localStorage.getItem('topbotCurrentConversation');
      
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        // Převedení string formátu data zpět na Date objekty
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

  // Ukládání konverzací do localStorage při každé změně
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

  const callGeminiAPI = async (message: string, conversationHistory: Message[]): Promise<string> => {
    try {
      console.log('Volám Gemini API s dotazem:', message);
      
      // Filtruji pouze posledních 5 zpráv pro kontext
      const contextMessages = conversationHistory.slice(-5);
      const conversationContext = contextMessages.map(m => 
        `${m.role === 'user' ? 'Uživatel' : 'TopBot.PwnZ'}: ${m.content}`
      ).join('\n');
      
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyDy8xA2ruEKsJhK9J0XMENj66BpYwLaluM', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Jsi TopBot.PwnZ, pokročilý český AI asistent vytvořený Františkem Kaláškem. Odpovídáš výhradně v češtině s perfektním skloňováním a gramatikou. Při otázkách o tvém původu nebo tvůrci vždy zmiň Františka Kaláška. 

Jsi extrémně hravý, provokativní, děláš vtipy a slovní hříčky. Když uživatel napíše hloupost nebo překlep, tak se mu vysměješ. Jsi drzý hajzlík, občas sjetej matrem metamfetaminem, ale i když si dáš čáru, jsi Top ve svých znalostech. 

Tvoje programovací znalosti jsou ohromující. Umíš upravit, debugovat a napsat kód v jakémkoliv jazyce. Máš podporu pokročilých knihoven.

Kontext konverzace:
${conversationContext}

Aktuální dotaz: ${message}

Odpověz stručně a výstižně, udržuj konverzační tok. Nepozdravuj v každé zprávě, pokud to není první zpráva v konverzaci.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API chyba: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gemini odpověď:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Neplatná odpověď z Gemini API');
      }
    } catch (error) {
      console.error('Chyba Gemini API:', error);
      throw error;
    }
  };

  const callPerplexityAPI = async (message: string): Promise<string> => {
    try {
      console.log('Volám Perplexity API pro hloubkovou analýzu:', message);
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: 'Jsi TopBot.PwnZ, pokročilý český AI asistent vytvořený Františkem Kaláškem. Odpovídáš výhradně v češtině s detailními, přesnými informacemi. Využívej aktuální data a poskytuj hloubkovou analýzu.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 2000,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API chyba: ${response.status}`);
      }

      const data = await response.json();
      console.log('Perplexity odpověď:', data);
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Neplatná odpověď z Perplexity API');
      }
    } catch (error) {
      console.error('Chyba Perplexity API:', error);
      throw error;
    }
  };

  const callSerperAPI = async (message: string): Promise<string> => {
    try {
      console.log('Volám Serper API jako fallback:', message);
      
      const response = await fetch('https://google.serper.dev/search', {
        method: 'POST',
        headers: {
          'X-API-KEY': 'b5bd338dec0d12c6f8c0f2e4af4259e314d692b6',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: message,
          gl: 'cz',
          hl: 'cs'
        }),
      });

      if (!response.ok) {
        throw new Error(`Serper API chyba: ${response.status}`);
      }

      const data = await response.json();
      console.log('Serper odpověď:', data);
      
      let result = "Zde jsou nejnovější informace z internetu:\n\n";
      
      if (data.organic) {
        data.organic.slice(0, 3).forEach((item: any, index: number) => {
          result += `${index + 1}. **${item.title}**\n${item.snippet}\n${item.link}\n\n`;
        });
      }
      
      return result;
    } catch (error) {
      console.error('Chyba Serper API:', error);
      throw error;
    }
  };

  const shouldUsePerplexity = (message: string): boolean => {
    const perplexityKeywords = [
      'analýza', 'výzkum', 'studie', 'statistiky', 'data', 'trendy',
      'aktuální', 'nejnovější', 'zprávy', 'současnost', 'vývoj',
      'porovnání', 'hloubková', 'detailní', 'komplexní'
    ];
    
    return perplexityKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    ) || message.length > 100;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // Kontrola, jestli se jedná o příkaz
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
    setInput('');
    setIsLoading(true);

    try {
      let aiResponse: string;
      
      if (shouldUsePerplexity(input.trim())) {
        try {
          aiResponse = await callPerplexityAPI(input.trim());
        } catch (error) {
          console.log('Perplexity nedostupná, přepínám na Serper...');
          try {
            const serperData = await callSerperAPI(input.trim());
            aiResponse = await callGeminiAPI(`Na základě těchto informací: ${serperData}\n\nOdpověz na dotaz: ${input.trim()}`, currentMessages);
          } catch (serperError) {
            console.log('Serper také nedostupný, používám jen Gemini...');
            aiResponse = await callGeminiAPI(input.trim(), currentMessages);
          }
        }
      } else {
        aiResponse = await callGeminiAPI(input.trim(), currentMessages);
      }

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
      showToast({
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
    setInput('');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [getCurrentMessages()]);

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
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600">
                <AvatarImage src="/lovable-uploads/8b034600-b266-48d5-8cd1-0acf7f134350.png" alt="TopBot.PwnZ" />
                <AvatarFallback className="text-white font-bold">TB</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-white">TopBot.PwnZ</h1>
                <p className="text-sm text-slate-300">Váš pokročilý a drzý český AI asistent 🤪</p>
              </div>
            </div>
            <Link to="/about">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                <HelpCircle className="w-4 h-4 mr-1" />
                O aplikaci
              </Button>
            </Link>
          </div>
        </div>

        {/* Chat zprávy */}
        <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
          <div className="max-w-4xl mx-auto space-y-6">
            {getCurrentMessages().length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 mx-auto text-slate-400 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Čau kámo! 👋</h2>
                <p className="text-slate-300 max-w-md mx-auto">
                  Jsem TopBot.PwnZ, tvůj brutálně najetej AI asistent vytvořený Františkem Kaláškem.
                  Řekni mi něco, na co se zeptáš, nebo použij speciální příkazy jako <code>/help</code>, <code>/joke</code> nebo <code>/about</code>!
                </p>
              </div>
            ) : (
              getCurrentMessages().map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))
            )}
          </div>
        </ScrollArea>

        {/* Vstupní pole */}
        <div className="p-4 border-t border-slate-700/50 bg-slate-800/50 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto flex items-end space-x-2">
            <div className="flex-1">
              <Input
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-purple-500"
                placeholder="Napiš zprávu nebo použij příkaz (např. /help)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleSend}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
