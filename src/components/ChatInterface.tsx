
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebhookChat } from '../hooks/useWebhookChat';
import { MessageList } from './MessageList';
import { AttachmentUploader } from './AttachmentUploader';
import { Send, RefreshCcw, Github, Webhook, Settings as SettingsIcon } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';
import { Separator } from '@/components/ui/separator';

interface ChatInterfaceProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  authHeader: Record<string, string>;
  setAuthHeader: (header: Record<string, string>) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  webhookUrl,
  setWebhookUrl,
  authHeader,
  setAuthHeader,
  isDark,
  setIsDark
}) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [clearCount, setClearCount] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const {
    messages,
    sendMessage,
    clearConversation,
    isLoading
  } = useWebhookChat(webhookUrl, authHeader);

  const handleSendMessage = () => {
    if (messageText.trim() || attachments.length > 0) {
      sendMessage(messageText, attachments);
      setMessageText('');
      setAttachments([]);
      // Signal uploader to clear
      setClearCount(prev => prev + 1);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col h-screen w-full shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <div className="flex justify-between items-center p-4 border-b w-full">
        <div className="flex items-center gap-3">
          <Webhook size={28} className="text-black dark:text-white" />
          <h2 className="text-xl font-semibold">HookChat</h2>
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
            authHeader={authHeader}
            setAuthHeader={setAuthHeader}
            isDark={isDark}
            setIsDark={setIsDark}
            open={settingsOpen}
            setOpen={setSettingsOpen}
          />
          <Button variant="ghost" size="icon" onClick={clearConversation} title="Clear Conversation">
            <RefreshCcw className="text-gray-600" />
          </Button>
        </div>
      </div>
      
      <MessageList messages={messages} isDark={isDark} />

      <div className="p-4 border-t flex items-center space-x-2">
        <AttachmentUploader onAttachmentChange={setAttachments} clearTrigger={clearCount} />
        <Input
          value={messageText}
          onChange={e => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className={`flex-grow ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}`}
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={isLoading || (!messageText.trim() && attachments.length === 0)}
          className="w-12 h-12 p-0 rounded-full flex items-center justify-center"
          variant="default"
          size="icon"
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};
