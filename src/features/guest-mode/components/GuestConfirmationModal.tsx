"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GuestConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const GuestConfirmationModal = ({
  open,
  onOpenChange,
  onConfirm,
}: GuestConfirmationModalProps) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="size-5 text-yellow-500" />
            Continue as Guest?
          </DialogTitle>
          <DialogDescription className="pt-2">
            You&apos;re about to enter as a guest user. Here&apos;s what you
            need to know:
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4 text-muted-foreground text-sm">
          <ul className="flex list-disc flex-col gap-2 pl-4">
            <li>You can browse content but cannot post, like, or comment</li>
            <li>Your session will be deleted after 7 days of inactivity</li>
            <li>
              You can convert to a registered account anytime using Google
            </li>
          </ul>
        </div>

        <DialogFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-0">
          <Button
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <Button className="w-full sm:w-auto" onClick={onConfirm}>
            Continue as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { GuestConfirmationModal };
