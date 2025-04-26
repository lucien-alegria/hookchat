
import React, { useState, useRef, useLayoutEffect, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { AttachmentUploader } from './AttachmentUploader';

export interface ChatInputRef {
  focus: () => void;
}

interface ChatInputProps {
  onSendMessage: (messageText: string, attachments: File[]) => void;
  isLoading: boolean;
  isDark: boolean;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
  onSendMessage,
  isLoading,
  isDark
}, ref) => {
  const [messageText, setMessageText] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [clearCount, setClearCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Fix: Ensure we safely handle focus with proper null checks
  useImperativeHandle(ref, () => ({
    focus: () => {
      // Add a small delay to ensure the DOM is ready
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 10);
    }
  }));

  const handleSendMessage = () => {
    if (messageText.trim() || attachments.length > 0) {
      onSendMessage(messageText, attachments);
      setMessageText('');
      setAttachments([]);
      setClearCount(prev => prev + 1);

      // Fix: Add delay before focusing to ensure DOM is ready
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 10);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  useLayoutEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px';
      const scrollH = textareaRef.current.scrollHeight;
      const maxHeight = 40 * 3; // 3 rows
      textareaRef.current.style.height = Math.min(scrollH, maxHeight) + 'px';
    }
  }, [messageText]);

  return <div className="w-full max-w-2xl">
      <div className={`relative rounded-full bg-white dark:bg-gray-700 ${attachments.length > 0 ? 'p-3' : ''}`}>
        {attachments.length > 0 && <div className="flex flex-wrap items-center gap-2 mb-2">
            {attachments.map((file, idx) => <div key={file.name + idx} className="flex items-center px-2 py-1 rounded bg-gray-100 text-xs dark:bg-gray-600">
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
          <textarea ref={textareaRef} value={messageText} onChange={e => setMessageText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Enter your prompt..." className={`w-full rounded-full border border-input bg-transparent px-12 py-2 text-base focus:outline-none
              ${isDark ? 'text-white border-gray-600' : ''}
              h-12 min-h-[48px] transition-none
              focus:border-black
            `} disabled={isLoading} rows={1} style={{
          resize: 'none',
          overflowY: 'auto'
        }} />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <Button onClick={handleSendMessage} disabled={isLoading || !messageText.trim() && attachments.length === 0} variant="ghost" size="icon" className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600">
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>;
});

ChatInput.displayName = 'ChatInput';
