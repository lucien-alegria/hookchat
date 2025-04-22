import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ChatInterface';
import { toast } from 'sonner';
const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [authHeader, setAuthHeader] = useState<Record<string, string>>({});
  const [isConfigured, setIsConfigured] = useState(false);
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
  const handleConfigure = () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL');
      return;
    }
    setIsConfigured(true);
  };
  if (isConfigured) {
    return <ChatInterface webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} authHeader={authHeader} setAuthHeader={setAuthHeader} isDark={isDark} setIsDark={setIsDark} />;
  }
  return <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100'}`}>
      <div className={`w-full max-w-md ${isDark ? 'bg-gray-700' : 'bg-white'} p-8 rounded-lg shadow-md`}>
        <h1 className="text-2xl font-bold mb-6 text-center">HookChat</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Webhook URL</label>
            <Input value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} placeholder="Enter your webhook URL" className={isDark ? 'bg-gray-600 border-gray-600' : ''} />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Optional Authentication Header</label>
            <div className="flex space-x-2">
              <Input placeholder="Header Name" value={Object.keys(authHeader)[0] || ''} onChange={e => setAuthHeader({
              [e.target.value]: Object.values(authHeader)[0] || ''
            })} className={isDark ? 'bg-gray-600 border-gray-600' : ''} />
              <Input placeholder="Header Value" value={Object.values(authHeader)[0] || ''} onChange={e => setAuthHeader({
              [Object.keys(authHeader)[0] || 'Authorization']: e.target.value
            })} className={isDark ? 'bg-gray-600 border-gray-600' : ''} />
            </div>
          </div>

          <Button onClick={handleConfigure} className="w-full">
            Start Chat
          </Button>
        </div>
      </div>
    </div>;
};
export default Index;