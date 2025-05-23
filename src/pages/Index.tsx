
import React, { useState } from 'react';
import { toast } from "sonner";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatHeader from "@/components/ChatHeader";
import MobileChatHeader from "@/components/MobileChatHeader";
import ConversationSidebar from "@/components/ConversationSidebar";
import ImageUploader from "@/components/ImageUploader";
import CameraCapture from "@/components/CameraCapture";
import ChatContainer from "@/components/ChatContainer";
import WebSearchHandler from "@/components/WebSearchHandler";

const Index = () => {
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const isMobile = useIsMobile();
  
  const {
    isLoading,
    setIsLoading,
    handleSend,
    handleCommand,
    handleImageAnalysis,
    conversations,
    currentConversation,
    getCurrentMessages,
    setCurrentConversation,
    deleteConversation,
    createNewConversation,
    updateConversation
  } = useChatMessages();

  // Handle speech-to-text functionality
  const handleSpeechToText = () => {
    toast.info("Spouštím hlasový vstup...");
    // The functionality is already implemented in ChatInput component
  };

  // Implement web search functionality
  const handleWebSearch = async () => {
    let convId = currentConversation;
    if (!convId) {
      convId = createNewConversation();
    }
    
    toast.info("Zadejte dotaz pro vyhledávání na webu");
    
    // Create a temporary prompt for web search input
    const userMessage = {
      id: Date.now().toString(),
      content: "🔍 *Web search aktivován* - Napište svůj dotaz",
      role: 'assistant',
      timestamp: new Date(),
      isGuide: true
    };
    
    const currentMessages = getCurrentMessages();
    updateConversation(convId, [...currentMessages, userMessage]);
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

  const toggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  const messages = getCurrentMessages();

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
        
        <ChatContainer 
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSend}
          onCommandSelected={handleCommand}
          onImageUploadRequested={() => setShowImageUploader(true)}
          onCameraRequested={() => setShowCameraCapture(true)}
          onSpeechToTextRequested={handleSpeechToText}
          onWebSearchRequested={handleWebSearch}
        />
        
        {/* Web search handler */}
        <WebSearchHandler 
          messages={messages}
          currentConversation={currentConversation}
          updateConversation={updateConversation}
          setIsLoading={setIsLoading}
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
