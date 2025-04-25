
import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';

// Always start on chat, with settings dialog open.
const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isDark, setIsDark] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // settings dialog is opened from ChatInterface via prop

  return (
    <ChatInterface
      webhookUrl={webhookUrl}
      setWebhookUrl={setWebhookUrl}
      isDark={isDark}
      setIsDark={setIsDark}
    />
  );
};
export default Index;
