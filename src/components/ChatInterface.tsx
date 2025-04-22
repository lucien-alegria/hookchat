import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebhookChat } from '../hooks/useWebhookChat';
import { MessageList } from './MessageList';
import { AttachmentUploader } from './AttachmentUploader';
import { Send, Trash2 } from 'lucide-react';
interface ChatInterfaceProps {
  webhookUrl: string;
  authHeader?: Record<string, string>;
}
export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  webhookUrl,
  authHeader
}) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
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
    }
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };
  return <div className="flex flex-col h-screen w-full bg-white shadow-lg">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">HookChat</h2>
        <Button variant="ghost" size="icon" onClick={clearConversation} title="Clear Conversation">
          <Trash2 className="text-gray-600" />
        </Button>
      </div>
      
      <MessageList messages={messages} />
      
      <div className="p-4 border-t flex items-center space-x-2">
        <AttachmentUploader onAttachmentChange={setAttachments} />
        <Input value={messageText} onChange={e => setMessageText(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type your message..." className="flex-grow" disabled={isLoading} />
        <Button onClick={handleSendMessage} disabled={isLoading || !messageText.trim() && attachments.length === 0} className="w-10 h-10 p-0">
          <Send size={20} />
        </Button>
      </div>
    </div>;
};