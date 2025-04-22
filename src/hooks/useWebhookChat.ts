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

  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };

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
      // Important: For Make.com to parse correctly, place values at the root level
      // of the bundle, not deeply nested
      const currentThreadId = threadId || crypto.randomUUID();
      
      // Create a flattened structure that Make.com can parse properly
      const bundle = {
        message: content,
        threadId: currentThreadId
      };
      
      // Process attachments
      if (attachments && attachments.length > 0) {
        for (let i = 0; i < attachments.length; i++) {
          const file = attachments[i];
          const base64Data = await fileToBase64(file);
          
          // Add each attachment directly to the bundle with a unique key
          bundle[`attachment_${i}_name`] = file.name;
          bundle[`attachment_${i}_mime`] = file.type;
          bundle[`attachment_${i}_data`] = base64Data;
        }
      }
      
      // Webhook structure that works well with Make.com
      const finalPayload = [bundle];

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
        body: JSON.stringify(finalPayload)
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      const responseData = await response.json();
      
      // Update threadId if one is returned
      if (responseData.threadId) {
        setThreadId(responseData.threadId);
      } else {
        // If no threadId in response, store the one we created
        setThreadId(currentThreadId);
      }

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