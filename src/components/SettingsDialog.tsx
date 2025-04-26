
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface SettingsDialogProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  webhookUrl,
  setWebhookUrl,
  isDark,
  setIsDark,
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

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleOpenChange(false);
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
            </div>
            <Button type="submit" className="w-full mt-2" variant="default" disabled={!webhookUrl}>
              Save
            </Button>
            <Separator className="my-3" />
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">Dark Mode</Label>
              <Switch id="darkMode" checked={isDark} onCheckedChange={setIsDark} />
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
