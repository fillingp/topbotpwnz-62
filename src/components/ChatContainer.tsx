
import React, { useState } from 'react';
import ChatMessageList from '@/components/ChatMessageList';
import ChatInput from '@/components/ChatInput';
import QuickCommands from '@/components/QuickCommands';
import WelcomeBanner from '@/components/WelcomeBanner';
import { Message } from '@/types/chat';

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onCommandSelected: (command: string) => void;
  onImageUploadRequested: () => void;
  onCameraRequested: () => void;
  onSpeechToTextRequested: () => void;
  onWebSearchRequested: () => void;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onCommandSelected,
  onImageUploadRequested,
  onCameraRequested,
  onSpeechToTextRequested,
  onWebSearchRequested
}) => {
  const showWelcomeBanner = !messages.length;

  return (
    <>
      {showWelcomeBanner ? (
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <WelcomeBanner />
        </div>
      ) : (
        <ChatMessageList messages={messages} />
      )}
      
      {/* Rychlé příkazy */}
      <QuickCommands 
        onCommandSelected={onCommandSelected}
        onImageAnalysisRequested={onImageUploadRequested}
        onSpeechToTextRequested={onSpeechToTextRequested}
        onWebSearchRequested={onWebSearchRequested}
      />
      
      <ChatInput 
        onSendMessage={onSendMessage} 
        isLoading={isLoading} 
        onImageUploadRequested={onImageUploadRequested}
        onCameraRequested={onCameraRequested}
      />
    </>
  );
};

export default ChatContainer;
