
import React, { useEffect, useState } from 'react';
import { Paperclip, X } from 'lucide-react';

interface AttachmentUploaderProps {
  onAttachmentChange: (files: File[]) => void;
  clearTrigger?: number; // incrementing number for clearing
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({ onAttachmentChange, clearTrigger }) => {
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    setAttachments(prev => [...prev, ...newFiles]);
    onAttachmentChange([...attachments, ...newFiles]);
  };

  const removeAttachment = (index: number) => {
    const updatedAttachments = attachments.filter((_, i) => i !== index);
    setAttachments(updatedAttachments);
    onAttachmentChange(updatedAttachments);
  };

  // If clearTrigger changes, empty attachments
  useEffect(() => {
    setAttachments([]);
    onAttachmentChange([]);
  }, [clearTrigger]);

  return (
    <div className="flex items-center space-x-2">
      <label className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors">
        <Paperclip size={20} className="text-gray-600" />
        <input 
          type="file" 
          multiple 
          className="hidden" 
          onChange={handleFileChange} 
        />
      </label>
      {attachments.length > 0 && (
        <div className="flex space-x-1">
          {attachments.map((file, index) => (
            <div key={file.name + index} className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
              {file.name}
              <button 
                onClick={() => removeAttachment(index)} 
                className="ml-2 hover:text-red-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
