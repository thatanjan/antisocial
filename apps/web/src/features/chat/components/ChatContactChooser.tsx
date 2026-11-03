"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { SampleContact } from "../data/sample-conversations";
import { sampleContacts } from "../data/sample-conversations";
import type { ChatPresence } from "./RecentChatsStrip";

interface ChatContactChooserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Invoked with the chosen contact; the caller creates/reuses the thread. */
  onSelect: (contact: SampleContact) => void;
}

/** Presence dot coloring shared with the conversation list rows. */
const presenceClass: Record<ChatPresence, string> = {
  online: "bg-green-500",
  busy: "bg-primary",
};

/**
 * Modal chooser listing the bundled sample contacts (User Story 3). Selecting
 * one hands it to the caller; dismissing changes no state.
 */
export const ChatContactChooser = ({
  open,
  onOpenChange,
  onSelect,
}: ChatContactChooserProps) => {
  const [pendingId, setPendingId] = useState<string | null>(null);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="bg-card text-card-foreground max-w-sm">
        <DialogHeader>
          <DialogTitle>New conversation</DialogTitle>
          <DialogDescription>
            Pick a sample contact to start chatting.
          </DialogDescription>
        </DialogHeader>
        <ul className="max-h-80 space-y-1 overflow-y-auto">
          {sampleContacts.map((contact) => (
            <li key={contact.id}>
              <button
                aria-label={`Start conversation with ${contact.name}`}
                className={cn(
                  "hover:bg-muted flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors",
                  pendingId === contact.id && "bg-muted",
                )}
                onClick={() => {
                  setPendingId(contact.id);
                  onSelect(contact);
                }}
                type="button"
              >
                <Avatar className="size-11 shrink-0">
                  <AvatarImage alt="" src={contact.avatarUrl} />
                  <AvatarFallback>
                    {contact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                  {contact.presence ? (
                    <span
                      className={cn(
                        "ring-background absolute right-0 bottom-0 z-10 size-2.5 rounded-full ring-2",
                        presenceClass[contact.presence],
                      )}
                    />
                  ) : null}
                </Avatar>
                <span className="truncate text-sm font-semibold">
                  {contact.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
};
