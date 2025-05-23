import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { processCommand } from "@/utils/commandProcessor";
import ChatHeader from "@/components/ChatHeader";
import ChatInput from "@/components/ChatInput";
import ChatMessageList from "@/components/ChatMessageList";
import ConversationSidebar from "@/components/ConversationSidebar";
import { useConversation } from "@/hooks/useConversation";
import { generateAIResponse, processImageAnalysis, processCodeBlocks } from "@/utils/messageHandler";
import { Message } from "@/types/chat";
import ImageUploader from "@/components/ImageUploader";
import QuickCommands from "@/components/QuickCommands";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import CameraCapture from "@/components/CameraCapture";
import WelcomeBanner from "@/components/WelcomeBanner";
import CodeGenerationModal from "@/components/CodeGenerationModal";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const { toast: showToast } = useToast();
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

    // Add a typing message that will be updated with streaming content
    const typingId = (Date.now() + 1).toString();
    const typingMessage: Message = {
      id: typingId,
      content: '',
      role: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };

    updateConversation(convId, [...newMessages, typingMessage]);
    setIsLoading(true);

    try {
      // Create a function to update the streaming response
      const updateStreamingResponse = (partialResponse: string) => {
        const updatedMessage = {
          id: typingId,
          content: partialResponse,
          role: 'assistant' as const,
          timestamp: new Date(),
          isTyping: true
        };
        
        const currentMsgs = getCurrentMessages();
        const updatedMessages = currentMsgs.map(msg => 
          msg.id === typingId ? updatedMessage : msg
        );
        
        updateConversation(convId, updatedMessages);
        
        // Process code blocks in the streaming response
        const { formattedText, hasCode } = processCodeBlocks(partialResponse);
        if (hasCode) {
          // If code is detected, temporarily update with formatted version for display
          // Note: this is just for display while streaming, the actual content stored will be the markdown
          const formattedMessage = {
            ...updatedMessage,
            content: formattedText,
            hasFormattedContent: true
          };
          
          const formattedMessages = currentMsgs.map(msg => 
            msg.id === typingId ? formattedMessage : msg
          );
          
          updateConversation(convId, formattedMessages);
        }
      };
      
      // Generate AI response with streaming
      const aiResponse = await generateAIResponse(input.trim(), currentMessages, updateStreamingResponse);

      // Process code blocks in the final response
      const { formattedText, hasCode } = processCodeBlocks(aiResponse);
      
      // Create final message
      const assistantMessage: Message = {
        id: typingId,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        // If code was detected, include the formatted version
        ...(hasCode && { formattedContent: formattedText })
      };

      const finalMessages = [...newMessages, assistantMessage];
      updateConversation(convId, finalMessages);
    } catch (error) {
      console.error('Chyba při zpracování zprávy:', error);
      toast.error("Nepodařilo se zpracovat vaši zprávu. Zkuste to prosím znovu.");

      const errorMessage: Message = {
        id: typingId,
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

  const handleSpeechToText = () => {
    toast.info("Spouštím hlasový vstup...");
    // The functionality is already implemented in ChatInput component
  };

  const handleWebSearch = () => {
    toast.info("Vyhledávám na webu...");
    handleSend("Vyhledej nejnovější informace o umělé inteligenci");
  };

  const handleCodeGeneration = (generatedCode: string) => {
    // Handle the generated code as a message from the assistant
    let convId = currentConversation;
    if (!convId) {
      convId = createNewConversation();
    }
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "Vygeneruj kód",
      role: 'user',
      timestamp: new Date()
    };
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: generatedCode,
      role: 'assistant',
      timestamp: new Date(),
      // Process code blocks for display
      formattedContent: processCodeBlocks(generatedCode).formattedText
    };
    
    const currentMessages = getCurrentMessages();
    const newMessages = [...currentMessages, userMessage, assistantMessage];
    updateConversation(convId, newMessages);
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

  // Add these functions for the missing props
  const handleImageUploadRequest = () => {
    setShowImageUploader(true);
  };

  const handleCameraRequest = () => {
    setShowCameraCapture(true);
  };
  
  const handleCodeGenerationRequest = () => {
    setShowCodeGenerator(true);
  };

  const messages = getCurrentMessages();
  const showWelcomeBanner = !messages.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col md:flex-row">
      {/* Sidebar s konverzacemi - hidden on mobile by default */}
      <div className="hidden md:block">
        <ConversationSidebar 
          conversations={conversations}
          currentConversation={currentConversation}
          onCreateNew={createNewConversation}
          onSelectConversation={setCurrentConversation}
          onDeleteConversation={deleteConversation}
        />
      </div>

      {/* Hlavní chatová oblast */}
      <div className="flex-1 flex flex-col h-screen">
        <ChatHeader />
        
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
          onCodeGenerationRequested={handleCodeGenerationRequest}
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
        
        {/* Modal pro generování kódu */}
        {showCodeGenerator && (
          <CodeGenerationModal
            onCodeGenerated={handleCodeGeneration}
            onClose={() => setShowCodeGenerator(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
