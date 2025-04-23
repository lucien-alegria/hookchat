
import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('webhook') || '';
  });
  const [authHeader, setAuthHeader] = useState<Record<string, string>>({});
  const [isDark, setIsDark] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  const [allowAttachments, setAllowAttachments] = useState(() => {
    const saved = localStorage.getItem('allowAttachments');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('allowAttachments', JSON.stringify(allowAttachments));
  }, [allowAttachments]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (webhookUrl) {
      url.searchParams.set('webhook', webhookUrl);
    } else {
      url.searchParams.delete('webhook');
    }
    window.history.replaceState({}, '', url);
  }, [webhookUrl]);

  return (
    <ChatInterface
      webhookUrl={webhookUrl}
      setWebhookUrl={setWebhookUrl}
      authHeader={authHeader}
      setAuthHeader={setAuthHeader}
      isDark={isDark}
      setIsDark={setIsDark}
      allowAttachments={allowAttachments}
      setAllowAttachments={setAllowAttachments}
    />
  );
};

export default Index;
