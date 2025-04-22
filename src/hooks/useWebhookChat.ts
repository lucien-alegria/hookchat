
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
      const formData = new FormData();
      formData.append('message', content);
      
      attachments?.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });

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

      const aiResponse = await response.json();

      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        content: aiResponse.message || 'No response from AI',
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
  }, [webhookUrl, authHeader]);

  const clearConversation = () => {
    setMessages([]);
    toast.success('Conversation cleared');
  };

  return { messages, sendMessage, clearConversation, isLoading };
};
