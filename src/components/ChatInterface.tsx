
import React, { useState, useRef, useEffect } from 'react';
import { useWebhookChat } from '../hooks/useWebhookChat';
import { MessageList } from './MessageList';
import { ChatHeader } from './ChatHeader';
import { ChatInput, ChatInputRef } from './ChatInput';

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
  const [settingsOpen, setSettingsOpen] = useState(true);
  const chatInputRef = useRef<ChatInputRef>(null);
  const {
    messages,
    sendMessage,
    clearConversation,
    isLoading
  } = useWebhookChat(webhookUrl);

  // Check if this is the initial state (no messages)
  const isInitialState = messages.length === 0;

  const handleSendMessage = (messageText: string, attachments: File[]) => {
    sendMessage(messageText, attachments);
  };

  // Focus handler that can be called after settings close
  const focusInput = () => {
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  // Auto-focus when settings close
  useEffect(() => {
    if (!settingsOpen) {
      focusInput();
    }
  }, [settingsOpen]);
  
  // Auto-focus when the component mounts (if not initial state)
  useEffect(() => {
    if (!isInitialState && !settingsOpen) {
      focusInput();
    }
  }, [isInitialState]);

  return (
    <div className={`flex flex-col h-screen w-full shadow-lg ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <ChatHeader
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        isDark={isDark}
        setIsDark={setIsDark}
        settingsOpen={settingsOpen}
        setSettingsOpen={(open) => {
          setSettingsOpen(open);
          if (!open) {
            // Focus input when settings dialog closes
            setTimeout(focusInput, 100);
          }
        }}
        clearConversation={clearConversation}
      />

      <div className={`flex-grow overflow-y-auto flex flex-col ${isInitialState ? 'justify-center' : 'justify-start'}`}>
        {isInitialState ? (
          <div className="flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold mb-8">Hello 👋</h1>
            <div className="w-full max-w-2xl">
              <ChatInput
                ref={chatInputRef}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isDark={isDark}
              />
            </div>
          </div>
        ) : (
          <MessageList messages={messages} isDark={isDark} />
        )}
      </div>

      {!isInitialState && (
        <div className="p-4 flex flex-col items-center">
          <ChatInput
            ref={chatInputRef}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            isDark={isDark}
          />
        </div>
      )}
    </div>
  );
};
