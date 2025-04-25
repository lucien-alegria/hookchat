
import React, { useEffect, useRef } from 'react';
import { Paperclip } from 'lucide-react';

interface AttachmentUploaderProps {
  onAttachmentChange: (files: File[]) => void;
  clearTrigger?: number; // incrementing number for clearing
  iconOnly?: boolean; // if true, render only the icon button (used in main input row)
}

export const AttachmentUploader: React.FC<AttachmentUploaderProps> = ({ onAttachmentChange, clearTrigger, iconOnly }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // If clearTrigger changes, empty attachment state
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [clearTrigger]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    onAttachmentChange(newFiles); // only selected files, not accumulated
  };

  if (iconOnly) {
    // Only render the icon button (used in chat line)
    return (
      <div className="flex items-center justify-center">
        <label className="cursor-pointer p-2 rounded-full transition-colors flex items-center justify-center" tabIndex={0}>
          <Paperclip size={20} className="text-gray-600" />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
            tabIndex={-1}
          />
        </label>
      </div>
    );
  }

  // For completeness: fallback version (not used in current design)
  return null;
};
