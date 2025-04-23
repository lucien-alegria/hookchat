
import React, { useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
  // If open prop is present, we operate as controlled popup. Otherwise, local controlled.
  const controlledOpen = typeof open === 'boolean';
  const [localOpen, setLocalOpen] = React.useState(false);
  const actualOpen = controlledOpen ? open : localOpen;
  const handleOpenChange = (o: boolean) => {
    if (setOpen) setOpen(o);
    else setLocalOpen(o);
  };

  // For save/update button
  const [hasUpdated, setHasUpdated] = React.useState(false);

  // For internal webhook header state tracking
  const firstRender = useRef(true);
  // "Start chatting" the first time if webhookUrl is not set, then "Update"
  const isFirstTime = !webhookUrl;

  // Focus the webhook input on first open if first time setup
  const webhookInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    if (actualOpen && isFirstTime && webhookInputRef.current) {
      setTimeout(() => webhookInputRef.current?.focus(), 100);
    }
  }, [actualOpen, isFirstTime]);

  // Prevent closing on first time setup (no webhookUrl)
  const canClose = !!webhookUrl;

  // Add hotkey: prevent escape when not closable (first time, no webhook)
  useEffect(() => {
    if (!canClose && actualOpen) {
      const handleKeydown = (e: KeyboardEvent) => {
        if (["Escape"].includes(e.key)) e.preventDefault();
      };
      window.addEventListener("keydown", handleKeydown);
      return () => window.removeEventListener("keydown", handleKeydown);
    }
  }, [canClose, actualOpen]);

  // Handle "Update"/"Start chatting" click
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setHasUpdated(true);
    // Nothing else required because updates are live
  };

  // Manage editing header name/value
  const headerName = Object.keys(authHeader)[0] || '';
  const headerValue = Object.values(authHeader)[0] || '';

  return (
    <Dialog open={actualOpen} onOpenChange={canClose ? handleOpenChange : () => {}}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-gray-600">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {isFirstTime ? (
              <>
                <Webhook className="h-5 w-5 text-black dark:text-white" />
                <DialogTitle className="text-xl font-semibold">hookchat</DialogTitle>
              </>
            ) : (
              <>
                <Settings className="h-5 w-5 text-gray-600" />
                <DialogTitle>Settings</DialogTitle>
              </>
            )}
            {/* Hide close button if !canClose */}
            {!isFirstTime && <DialogClose asChild>
              <button aria-label="Close settings" className="absolute right-4 top-4 text-gray-600 hover:text-black focus:outline-none">
                ×
              </button>
            </DialogClose>}
          </div>
        </DialogHeader>
        <form onSubmit={handleUpdate}>
        <div className="grid gap-3 py-2">
          <div>
            <Label htmlFor="webhook" className="flex items-center">Webhook URL <span className="text-red-500 ml-0.5">*</span></Label>
            <Input
              id="webhook"
              ref={webhookInputRef}
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter webhook URL"
              className="mt-1"
              required
              autoComplete="off"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="authHeader">Header Name</Label>
              <Input
                id="authHeader"
                value={headerName}
                onChange={(e) => setAuthHeader({ 
                  [e.target.value]: headerValue
                })}
                placeholder="Name"
                className="mt-1"
                autoComplete="off"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="authValue">Header Value</Label>
              <Input
                id="authValue"
                value={headerValue}
                onChange={(e) => setAuthHeader({ 
                  [headerName || 'Authorization']: e.target.value 
                })}
                placeholder="Value"
                className="mt-1"
                autoComplete="off"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            variant="default"
            disabled={isFirstTime ? !webhookUrl : false}
          >
            {isFirstTime ? 'Start chatting' : 'Update'}
          </Button>

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
        </form>
      </DialogContent>
    </Dialog>
  );
};
