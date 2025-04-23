
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Webhook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface SettingsDialogProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  authHeader: Record<string, string>;
  setAuthHeader: (header: Record<string, string>) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  webhookUrl,
  setWebhookUrl,
  authHeader,
  setAuthHeader,
  isDark,
  setIsDark,
  open,
  setOpen,
}) => {
  // Support controlled (open/setOpen) for opening settings popup on load
  const controlledOpen = typeof open === 'boolean';
  const [localOpen, setLocalOpen] = React.useState(false);

  const actualOpen = controlledOpen ? open : localOpen;
  const handleOpenChange = (o: boolean) => {
    if (setOpen) setOpen(o);
    else setLocalOpen(o);
  };

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <DialogTitle>Settings</DialogTitle>
          </div>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div>
            <Label htmlFor="webhook">Webhook URL</Label>
            <Input
              id="webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter webhook URL"
              className="mt-1"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="authHeader">Header Name</Label>
              <Input
                id="authHeader"
                value={Object.keys(authHeader)[0] || ''}
                onChange={(e) => setAuthHeader({ 
                  [e.target.value]: Object.values(authHeader)[0] || '' 
                })}
                placeholder="Name"
                className="mt-1"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="authValue">Header Value</Label>
              <Input
                id="authValue"
                value={Object.values(authHeader)[0] || ''}
                onChange={(e) => setAuthHeader({ 
                  [Object.keys(authHeader)[0] || 'Authorization']: e.target.value 
                })}
                placeholder="Value"
                className="mt-1"
              />
            </div>
          </div>
          <Separator className="my-3" />
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
