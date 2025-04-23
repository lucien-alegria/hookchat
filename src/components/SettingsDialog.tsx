
import React, { useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Settings, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface SettingsDialogProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  authHeader: Record<string, string>;
  setAuthHeader: (header: Record<string, string>) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  allowAttachments: boolean;
  setAllowAttachments: (allow: boolean) => void;
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
  allowAttachments,
  setAllowAttachments,
  open,
  setOpen
}) => {
  const controlledOpen = typeof open === 'boolean';
  const [localOpen, setLocalOpen] = React.useState(false);
  const actualOpen = controlledOpen ? open : localOpen;
  
  const handleOpenChange = (o: boolean) => {
    if (setOpen) setOpen(o);
    else setLocalOpen(o);
  };

  const headerName = Object.keys(authHeader)[0] || '';
  const headerValue = Object.values(authHeader)[0] || '';

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenChange(false);
  };

  const getShareableLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('webhook', webhookUrl);
    return url.toString();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getShareableLink());
      toast.success('Link copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] pt-8">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={onSave}>
          <div className="grid gap-3 py-2">
            <div>
              <Label htmlFor="webhook" className="flex items-center">
                Webhook URL <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input 
                id="webhook" 
                value={webhookUrl} 
                onChange={e => setWebhookUrl(e.target.value)} 
                placeholder="Enter webhook URL" 
                className="mt-1" 
                required 
                autoComplete="off"
              />
              {webhookUrl && (
                <div className="mt-2 flex items-center gap-2">
                  <Input 
                    value={getShareableLink()}
                    readOnly
                    className="text-sm text-muted-foreground"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={copyToClipboard}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Label htmlFor="authHeader">Header Name</Label>
                <Input id="authHeader" value={headerName} onChange={e => setAuthHeader({
                [e.target.value]: headerValue
              })} placeholder="Name" className="mt-1" autoComplete="off" />
              </div>
              <div className="flex-1">
                <Label htmlFor="authValue">Header Value</Label>
                <Input id="authValue" value={headerValue} onChange={e => setAuthHeader({
                [headerName || 'Authorization']: e.target.value
              })} placeholder="Value" className="mt-1" autoComplete="off" />
              </div>
            </div>
            <Button type="submit" className="w-full mt-2" variant="default" disabled={!webhookUrl}>
              Save
            </Button>
            <Separator className="my-3" />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="allowAttachments">Allow Attachments</Label>
                <Switch 
                  id="allowAttachments" 
                  checked={allowAttachments} 
                  onCheckedChange={setAllowAttachments}
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
