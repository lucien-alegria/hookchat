
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  attachments?: File[];
  timestamp: number;
}

export const useWebhookChat = (webhookUrl: string) => {
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

    const timestamp = Date.now();
    const newMessage: Message = {
      id: `msg-${timestamp}`,
      content,
      sender: 'user',
      attachments,
      timestamp
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const currentThreadId = threadId || crypto.randomUUID();
      
      // Process attachments
      const attachmentsArray = [];
      if (attachments && attachments.length > 0) {
        for (const file of attachments) {
          const base64Data = await fileToBase64(file);
          
          // Add attachment object to array
          attachmentsArray.push({
            attachmentName: file.name,
            attachmentMime: file.type,
            attachmentData: base64Data
          });
        }
      }
      
      // Create the payload without auth header info
      const bundle = {
        message: content,
        threadId: currentThreadId,
        timestamp: timestamp,
        attachmentCount: attachmentsArray.length,
        attachments: attachmentsArray
      };
      
      const finalPayload = [bundle];

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(finalPayload)
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      const responseData = await response.json();
      
      if (responseData.threadId) {
        setThreadId(responseData.threadId);
      } else {
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
  }, [webhookUrl, threadId]);

  const clearConversation = () => {
    setMessages([]);
    setThreadId(null);
    toast.success('Conversation cleared');
  };

  return { messages, sendMessage, clearConversation, isLoading };
};
