
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { processCommand } from "@/utils/commandProcessor";
import ChatHeader from "@/components/ChatHeader";
import MobileChatHeader from "@/components/MobileChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessageList from "@/components/ChatMessageList";
import ConversationSidebar from "@/components/ConversationSidebar";
import { useConversation } from "@/hooks/useConversation";
import { generateAIResponse, processImageAnalysis } from "@/utils/messageHandler";
import { Message } from "@/types/chat";
import ImageUploader from "@/components/ImageUploader";
import QuickCommands from "@/components/QuickCommands";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import CameraCapture from "@/components/CameraCapture";
import WelcomeBanner from "@/components/WelcomeBanner";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const { toast: showToast } = useToast();
  const isMobile = useIsMobile();
  
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
      setShowImageUploader(false);
    }
  };

  // Implement speech-to-text functionality
  const handleSpeechToText = () => {
    toast.info("Spouštím hlasový vstup...");
    // The functionality is already implemented in ChatInput component
  };

  // Implement web search functionality
  const handleWebSearch = () => {
    toast.info("Tato funkce ještě není plně implementována.");
    // This would be implemented in a future update
  };

  // Klávesové zkratky
  useKeyboardShortcuts({
    onHelp: () => handleCommand('/help'),
    onJoke: () => handleCommand('/joke'),
    onForHer: () => handleCommand('/forher'),
    onForHim: () => handleCommand('/forhim'),
    onImageAnalysis: () => setShowImageUploader(true),
    onClearChat: () => handleCommand('/clear'),
    onSpeechToText: handleSpeechToText,
    onSearchWeb: handleWebSearch,
  });

  const handleQuickCommand = (command: string) => {
    handleCommand(command);
  };

  const handleImageUploadRequest = () => {
    setShowImageUploader(true);
  };

  const handleCameraRequest = () => {
    setShowCameraCapture(true);
  };

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  const messages = getCurrentMessages();
  const showWelcomeBanner = !messages.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Sidebar s konverzacemi - na mobilních zařízeních je skrytá a zobrazí se pouze při tapnutí */}
      <div className={`${isMobile ? 'fixed z-30 top-0 bottom-0 left-0 transition-transform duration-300' : ''} 
                       ${(isMobile && showSidebar) ? 'translate-x-0' : (isMobile ? '-translate-x-full' : '')}
                       ${isMobile ? 'w-4/5 max-w-xs' : ''}
                       ${isMobile ? 'shadow-lg' : ''}`}>
        <ConversationSidebar 
          conversations={conversations}
          currentConversation={currentConversation}
          onCreateNew={createNewConversation}
          onSelectConversation={(id) => {
            setCurrentConversation(id);
            if (isMobile) {
              setShowSidebar(false);
            }
          }}
          onDeleteConversation={deleteConversation}
        />
      </div>

      {/* Overlay pro zavření sidebar na mobilních zařízeních */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 z-20 bg-black/50" 
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Hlavní chatová oblast */}
      <div className="flex-1 flex flex-col relative">
        <MobileChatHeader 
          onToggleSidebar={toggleSidebar}
          showSidebarToggle={isMobile}
        />
        
        {showWelcomeBanner ? (
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <WelcomeBanner />
          </div>
        ) : (
          <ChatMessageList messages={messages} />
        )}
        
        {/* Rychlé příkazy */}
        <QuickCommands 
          onCommandSelected={handleQuickCommand}
          onImageAnalysisRequested={() => setShowImageUploader(true)}
          onSpeechToTextRequested={handleSpeechToText}
          onWebSearchRequested={handleWebSearch}
        />
        
        <ChatInput 
          onSendMessage={handleSend} 
          isLoading={isLoading} 
          onImageUploadRequested={handleImageUploadRequest}
          onCameraRequested={handleCameraRequest}
        />
        
        {/* Modal pro nahrání obrázku */}
        {showImageUploader && (
          <ImageUploader 
            onImageSelected={handleImageAnalysis} 
            onClose={() => setShowImageUploader(false)} 
          />
        )}

        {/* Modal pro vyfocení */}
        {showCameraCapture && (
          <CameraCapture
            onImageCaptured={handleImageAnalysis}
            onClose={() => setShowCameraCapture(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
