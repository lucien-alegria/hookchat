
import React, { useState, useRef, useLayoutEffect } from 'react';
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

  const { messages, sendMessage, clearConversation, isLoading } = useWebhookChat(webhookUrl, authHeader);

  // For textarea auto growth (up to 3 lines)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSendMessage = () => {
    if (messageText.trim() || attachments.length > 0) {
      sendMessage(messageText, attachments);
      setMessageText('');
      setAttachments([]);
      setClearCount(prev => prev + 1); // Signal uploader to clear
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  // Make textarea auto-grow up to 3 rows
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
      const scrollH = textareaRef.current.scrollHeight;
      const maxHeight = 40 * 3; // 3 rows
      textareaRef.current.style.height = Math.min(scrollH, maxHeight) + 'px';
    }
  }, [messageText]);

  return (
    <div className={`flex flex-col h-screen w-full shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b w-full">
        <div className="flex items-center gap-3">
          <Webhook size={28} className="text-black dark:text-white" />
          <h2 className="text-xl font-semibold">hookchat</h2>
        </div>
        <div className="flex items-center space-x-2">
          <a href="https://github.com/lucien-alegria/hookchat" target="_blank" rel="noopener noreferrer" title="View on GitHub" className="rounded-full bg-gray-200 hover:bg-gray-300 p-2 transition-colors">
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

      {/* Message list */}
      <MessageList messages={messages} isDark={isDark} />

      {/* Bottom section (input area) */}
      <div className="p-4 border-t flex flex-col gap-2">
        {/* Attachment list (not uploader, just list) */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {attachments.map((file, idx) => (
              <div key={file.name + idx} className="flex items-center px-2 py-1 rounded bg-gray-100 text-xs dark:bg-gray-700">
                {file.name}
                <button
                  type="button"
                  onClick={() => {
                    const updated = attachments.filter((_, i) => i !== idx);
                    setAttachments(updated);
                  }}
                  className="ml-2 hover:text-red-500 transition-colors"
                  tabIndex={-1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2 w-full">
          {/* Attachment icon button inside input row */}
          <AttachmentUploader
            onAttachmentChange={setAttachments}
            clearTrigger={clearCount}
            iconOnly
          />
          {/* Now textarea for input */}
          <textarea
            ref={textareaRef}
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className={`flex-grow resize-none rounded-md border border-input bg-background px-3 py-2 text-base focus:outline-none 
            ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''} 
            scrollbar-none h-10 min-h-[40px] max-h-[120px] transition-none`}
            disabled={isLoading}
            rows={1}
            style={{ minHeight: 40, maxHeight: 120, height: '40px', lineHeight: '20px' }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || (!messageText.trim() && attachments.length === 0)}
            variant="default"
            size="icon"
            className="w-10 h-10 min-w-[44px] min-h-[40px] max-h-[40px] max-w-[44px] rounded-full flex items-center justify-center p-0"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};
