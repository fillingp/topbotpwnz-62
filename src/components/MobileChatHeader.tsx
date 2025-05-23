
import React from 'react';
import { Menu } from "lucide-react";
import ChatHeader from './ChatHeader';
import { Button } from './ui/button';

interface MobileChatHeaderProps {
  onToggleSidebar: () => void;
  showSidebarToggle: boolean;
}

const MobileChatHeader: React.FC<MobileChatHeaderProps> = ({ 
  onToggleSidebar,
  showSidebarToggle
}) => {
  return (
    <div className="relative safe-top notch-padding-top">
      {showSidebarToggle && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 min-h-[40px] w-10 h-10"
          onClick={onToggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      )}
      <ChatHeader />
    </div>
  );
};

export default MobileChatHeader;
