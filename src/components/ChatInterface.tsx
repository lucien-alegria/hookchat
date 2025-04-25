import React, { useState, useRef, useLayoutEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebhookChat } from '../hooks/useWebhookChat';
import { MessageList } from './MessageList';
import { AttachmentUploader } from './AttachmentUploader';
import { Send, RotateCcw, Github, Webhook } from 'lucide-react';
import { SettingsDialog } from './SettingsDialog';
interface ChatInterfaceProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  webhookUrl,
  setWebhookUrl,
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
  } = useWebhookChat(webhookUrl);

  // Check if this is the initial state (no messages)
  const isInitialState = messages.length === 0;

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

  // Auto-grow textarea up to 3 rows
  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
      const scrollH = textareaRef.current.scrollHeight;
      const maxHeight = 40 * 3; // 3 rows
      textareaRef.current.style.height = Math.min(scrollH, maxHeight) + 'px';
    }
  }, [messageText]);
  return <div className={`flex flex-col h-screen w-full shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
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
          <SettingsDialog webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} isDark={isDark} setIsDark={setIsDark} open={settingsOpen} setOpen={setSettingsOpen} />
          <Button variant="ghost" size="icon" onClick={clearConversation} title="Clear Conversation">
            <RotateCcw className="text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Message list */}
      <div className={`flex-grow overflow-y-auto flex flex-col ${isInitialState ? 'justify-center' : 'justify-start'}`}>
        {isInitialState ? <div className="flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-8">Chat with your webhook!</h1>
            <div className="w-full max-w-2xl">
              <div className="relative">
                {/* Attachments above input in initial state */}
                {attachments.length > 0 && <div className="flex flex-wrap items-center gap-2 mb-2">
                    {attachments.map((file, idx) => <div key={file.name + idx} className="flex items-center px-2 py-1 rounded bg-gray-100 text-xs dark:bg-gray-700">
                        {file.name}
                        <button type="button" onClick={() => {
                  const updated = attachments.filter((_, i) => i !== idx);
                  setAttachments(updated);
                }} className="ml-2 hover:text-red-500 transition-colors" tabIndex={-1}>
                          ×
                        </button>
                      </div>)}
                  </div>}
                <div className="relative flex items-center">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    <AttachmentUploader onAttachmentChange={setAttachments} clearTrigger={clearCount} iconOnly />
                  </div>
                  <textarea ref={textareaRef} value={messageText} onChange={e => setMessageText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter your prompt..." className={`w-full rounded-full border border-input bg-background px-12 py-2 text-base focus:outline-none
                      ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}
                      h-12 min-h-[48px] transition-none
                      focus:border-black
                    `} disabled={isLoading} rows={1} style={{
                resize: 'none',
                overflowY: 'auto'
              }} />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    <Button onClick={handleSendMessage} disabled={isLoading || !messageText.trim() && attachments.length === 0} variant="ghost" size="icon" className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div> : <MessageList messages={messages} isDark={isDark} />}
      </div>

      {/* Bottom section (input area) - Only show if not in initial state */}
      {!isInitialState && <div className={`p-4 flex flex-col items-center`}>
          <div className="w-full max-w-2xl">
            <div className="relative">
              {/* Attachments above input in ongoing conversation */}
              {attachments.length > 0 && <div className="flex flex-wrap items-center gap-2 mb-2">
                  {attachments.map((file, idx) => <div key={file.name + idx} className="flex items-center px-2 py-1 rounded bg-gray-100 text-xs dark:bg-gray-700">
                      {file.name}
                      <button type="button" onClick={() => {
                const updated = attachments.filter((_, i) => i !== idx);
                setAttachments(updated);
              }} className="ml-2 hover:text-red-500 transition-colors" tabIndex={-1}>
                        ×
                      </button>
                    </div>)}
                </div>}
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <AttachmentUploader onAttachmentChange={setAttachments} clearTrigger={clearCount} iconOnly />
                </div>
                <textarea ref={textareaRef} value={messageText} onChange={e => setMessageText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter your prompt..." className={`w-full rounded-full border border-input bg-background px-12 py-2 text-base focus:outline-none
                    ${isDark ? 'bg-gray-700 text-white border-gray-600' : ''}
                    h-12 min-h-[48px] transition-none
                    focus:border-black
                  `} disabled={isLoading} rows={1} style={{
              resize: 'none',
              overflowY: 'auto'
            }} />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                  <Button onClick={handleSendMessage} disabled={isLoading || !messageText.trim() && attachments.length === 0} variant="ghost" size="icon" className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>}
    </div>;
};