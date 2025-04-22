
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface SettingsDialogProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  authHeader: Record<string, string>;
  setAuthHeader: (header: Record<string, string>) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  webhookUrl,
  setWebhookUrl,
  authHeader,
  setAuthHeader,
  isDark,
  setIsDark,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter webhook URL"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="authHeader">Auth Header Name</Label>
            <Input
              id="authHeader"
              value={Object.keys(authHeader)[0] || ''}
              onChange={(e) => setAuthHeader({ 
                [e.target.value]: Object.values(authHeader)[0] || '' 
              })}
              placeholder="Header name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="authValue">Auth Header Value</Label>
            <Input
              id="authValue"
              value={Object.values(authHeader)[0] || ''}
              onChange={(e) => setAuthHeader({ 
                [Object.keys(authHeader)[0] || 'Authorization']: e.target.value 
              })}
              placeholder="Header value"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <Switch
              id="darkMode"
              checked={isDark}
              onCheckedChange={setIsDark}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
