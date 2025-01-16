import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"; // Assuming you are using ShadCN UI components
import { Share } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ShareButtonWithModal = () => {
  const [publicUrl] = useState(
    "https://nubras-dashify.vercel.app/share/dashboard"
  ); // Replace with your dynamic URL logic
  const [open, setOpen] = useState(false);

  // Copy URL to clipboard
  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("URL copied to clipboard!"); // Optionally use a toast/notification
        })
        .catch((error) => {
          console.error("Failed to copy: ", error);
          alert("Failed to copy URL.");
        });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("URL copied to clipboard!"); // Optionally use a toast/notification
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Share className="h-4 w-4"/>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Copy Public URL</DialogHeader>
        <DialogClose />
        <Input
          value={publicUrl}
          readOnly
          onClick={() => copyToClipboard(publicUrl)}
          className="cursor-pointer"
          placeholder="Click to copy URL"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
