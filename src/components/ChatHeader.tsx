
import React from 'react';
import { Button } from '@/components/ui/button';
import { Webhook, Github, RotateCcw } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';

interface ChatHeaderProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  clearConversation: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  webhookUrl,
  setWebhookUrl,
  isDark,
  setIsDark,
  settingsOpen,
  setSettingsOpen,
  clearConversation
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b w-full">
      <div className="flex items-center gap-3">
        <Webhook size={28} className="text-black dark:text-white" />
        <h2 className="text-xl font-semibold">hookchat</h2>
      </div>
      <div className="flex items-center space-x-2">
        <a 
          href="https://github.com/lucien-alegria/hookchat" 
          target="_blank" 
          rel="noopener noreferrer" 
          title="View on GitHub" 
          className="rounded-full bg-gray-200 hover:bg-gray-300 p-2 transition-colors"
        >
          <Github size={20} className="text-black" />
        </a>
        <SettingsDialog 
          webhookUrl={webhookUrl}
          setWebhookUrl={setWebhookUrl}
          isDark={isDark}
          setIsDark={setIsDark}
          open={settingsOpen}
          setOpen={setSettingsOpen}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={clearConversation} 
          title="Clear Conversation"
        >
          <RotateCcw className="text-gray-600" />
        </Button>
      </div>
    </div>
  );
};
