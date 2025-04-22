
import React from 'react';
import { Message } from '../hooks/useWebhookChat';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${
            message.sender === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div 
            className={`max-w-[70%] p-3 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-black'
            }`}
          >
            <p>{message.content}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 text-xs">
                Attachments: {message.attachments.map(a => a.name).join(', ')}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
