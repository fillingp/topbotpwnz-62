
import { useEffect } from 'react';

type KeyboardShortcutProps = {
  onHelp: () => void;
  onJoke: () => void;
  onForHer: () => void;
  onForHim?: () => void;
  onImageAnalysis: () => void;
  onClearChat: () => void;
  onSpeechToText?: () => void;  // New feature for speech recognition
  onSearchWeb?: () => void;     // New feature for web search
};

export const useKeyboardShortcuts = ({
  onHelp,
  onJoke,
  onForHer,
  onForHim,
  onImageAnalysis,
  onClearChat,
  onSpeechToText,
  onSearchWeb
}: KeyboardShortcutProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore key events when user is typing in an input field
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Check for Alt + key combinations
      if (event.altKey) {
        switch (event.key) {
          case 'h':
            onHelp();
            event.preventDefault();
            break;
          case 'j':
            onJoke();
            event.preventDefault();
            break;
          case 'f':
            onForHer();
            event.preventDefault();
            break;
          case 'm':
            if (onForHim) {
              onForHim();
              event.preventDefault();
            }
            break;
          case 'i':
            onImageAnalysis();
            event.preventDefault();
            break;
          case 'c':
            onClearChat();
            event.preventDefault();
            break;
          case 's':
            if (onSpeechToText) {
              onSpeechToText();
              event.preventDefault();
            }
            break;
          case 'w':
            if (onSearchWeb) {
              onSearchWeb();
              event.preventDefault();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onHelp, onJoke, onForHer, onForHim, onImageAnalysis, onClearChat, onSpeechToText, onSearchWeb]);
};
