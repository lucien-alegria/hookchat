
import React from 'react';
import { Message } from '../hooks/useWebhookChat';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  isDark: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isDark }) => {
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
                ? isDark
                  ? 'bg-[#222] text-white' // Dark gray for user msg on dark
                  : 'bg-[#333] text-white' // Dark gray for user msg on light
                : isDark
                  ? 'bg-gray-700 text-white'
                  : 'bg-gray-200 text-black'
            }`}
          >
            <p>{message.content}</p>
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 text-xs">
                Attachments: {message.attachments.map(a => a.name).join(', ')}
              </div>
            )}
            <div className={`text-xs mt-1 ${
              message.sender === 'user' 
                ? isDark ? 'text-blue-200' : 'text-blue-100'
                : isDark ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {format(message.timestamp, 'HH:mm')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
