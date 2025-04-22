
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatInterface } from '@/components/ChatInterface';
import { toast } from 'sonner';

const Index = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [authHeader, setAuthHeader] = useState<Record<string, string>>({});
  const [isConfigured, setIsConfigured] = useState(false);

  const handleConfigure = () => {
    if (!webhookUrl) {
      toast.error('Please enter a webhook URL');
      return;
    }
    setIsConfigured(true);
  };

  const handleReset = () => {
    setIsConfigured(false);
    setWebhookUrl('');
    setAuthHeader({});
  };

  if (isConfigured) {
    return (
      <ChatInterface 
        webhookUrl={webhookUrl} 
        authHeader={Object.keys(authHeader).length ? authHeader : undefined} 
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Configure Webhook Chat</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Webhook URL</label>
            <Input 
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter your Make.com webhook URL"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Optional Authentication Header</label>
            <div className="flex space-x-2">
              <Input 
                placeholder="Header Name" 
                value={Object.keys(authHeader)[0] || ''}
                onChange={(e) => setAuthHeader({ 
                  [e.target.value]: Object.values(authHeader)[0] || '' 
                })}
              />
              <Input 
                placeholder="Header Value" 
                value={Object.values(authHeader)[0] || ''}
                onChange={(e) => setAuthHeader({ 
                  [Object.keys(authHeader)[0] || 'Authorization']: e.target.value 
                })}
              />
            </div>
          </div>

          <Button onClick={handleConfigure} className="w-full">
            Start Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
