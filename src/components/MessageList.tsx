
import React, { useEffect, useRef } from 'react';
import { Message } from '../hooks/useWebhookChat';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  isDark: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isDark }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the most recent message
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-4 space-y-4 w-full flex flex-col items-center">
      <div className="w-full max-w-2xl">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            } mb-4`}
          >
            <div 
              className={`max-w-[70%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-[#222] text-white' // User msg: always very dark gray
                  : isDark
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-200 text-black'
              }`}
            >
              <p style={{ whiteSpace: 'pre-line' }}>{message.content}</p>
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
        {/* This div serves as a target for scrolling to the end of messages */}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
};
