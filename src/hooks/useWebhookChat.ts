
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  attachments?: File[];
  timestamp: number;
}

export const useWebhookChat = (webhookUrl: string, authHeader?: Record<string, string>) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string, attachments?: File[]) => {
    if (!content && (!attachments || attachments.length === 0)) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      attachments,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Prepare payload that Make.com can easily parse
      const payload = {
        message: content,
        attachmentNames: attachments ? attachments.map(file => file.name) : [],
        threadId: threadId || undefined,
        timestamp: Date.now()
      };

      const formData = new FormData();
      formData.append('payload', JSON.stringify(payload));
      
      // Append actual files
      if (attachments) {
        attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          ...authHeader,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      const responseData = await response.json();
      
      // Ensure threadId is always tracked
      setThreadId(responseData.threadId || threadId);

      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        content: responseData.response || 'No response from AI',
        sender: 'ai',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast.error('Failed to send message', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl, authHeader, threadId]);

  const clearConversation = () => {
    setMessages([]);
    setThreadId(null);
    toast.success('Conversation cleared');
  };

  return { messages, sendMessage, clearConversation, isLoading };
};
