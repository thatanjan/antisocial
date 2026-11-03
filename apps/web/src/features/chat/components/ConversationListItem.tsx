import { CheckCheck, Phone, PhoneOff, Pin, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChatPresence } from "./RecentChatsStrip";

export type ConversationCallKind = "video" | "voice" | "voice-cancelled";

export type ConversationPreview =
  | { kind: "text"; text: string }
  | { kind: "call"; call: ConversationCallKind };

import Link from "next/link";

const CALL_PRESENTATION = {
  video: { icon: Video, label: "Video Call" },
  voice: { icon: Phone, label: "Voice Call" },
  "voice-cancelled": { icon: PhoneOff, label: "Voice Call Cancelled" },
} as const;

export interface ConversationItem {
  id: string;
  name: string;
  timestamp: string;
  avatarUrl?: string;
  presence?: ChatPresence;
  preview: ConversationPreview;
  read?: boolean;
  pinned?: boolean;
  active?: boolean;
}

interface ConversationListItemProps {
  conversation: ConversationItem;
  /** Qualified href for this conversation (e.g. from buildChatHref). */
  href: string;
  className?: string;
}

export const ConversationListItem = ({
  conversation,
  href,
  className,
}: ConversationListItemProps) => {
  const {
    name,
    timestamp,
    avatarUrl,
    presence,
    preview,
    read,
    pinned,
    active,
  } = conversation;

  const call = preview.kind === "call" ? CALL_PRESENTATION[preview.call] : null;
  const cancelled =
    preview.kind === "call" && preview.call === "voice-cancelled";
  const CallIcon = call?.icon;

  return (
    <Link
      aria-current={active ? "true" : undefined}
      className={cn(
        "focus-visible:ring-ring/50 flex w-full items-center gap-3 rounded-2xl px-2 py-2.5 text-left transition-colors focus-visible:ring-3 focus-visible:outline-none md:rounded-xl md:p-2.5",
        active
          ? "bg-primary/10 border-primary/20 border shadow-xs"
          : "hover:bg-muted",
        className,
      )}
      href={href}
    >
      <Avatar className="size-11 shrink-0">
        <AvatarImage alt="" src={avatarUrl} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
        {presence ? (
          <>
            <span
              className={cn(
                "ring-background absolute right-0 bottom-0 z-10 size-2.5 rounded-full ring-2",
                presence === "online" ? "bg-green-500" : "bg-primary",
              )}
            />
            <span className="sr-only">
              {presence === "online" ? "Online" : "Busy"}
            </span>
          </>
        ) : null}
      </Avatar>
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm",
            active ? "font-bold" : "font-semibold",
          )}
        >
          {name}
        </span>
        <span
          className={cn(
            "mt-0.5 flex items-center gap-1.5 text-xs",
            active || cancelled ? "text-primary" : "text-muted-foreground",
            active && "font-medium",
          )}
        >
          {call && CallIcon ? (
            <CallIcon aria-hidden="true" className="size-3.5 shrink-0" />
          ) : null}
          <span className="truncate">
            {preview.kind === "text" ? preview.text : call?.label}
          </span>
        </span>
      </div>
      <span className="text-muted-foreground flex shrink-0 flex-col items-end gap-1">
        <span
          className={cn(
            "text-2xs font-mono",
            active ? "text-primary font-semibold" : "text-muted-foreground",
          )}
        >
          {timestamp}
        </span>
        {pinned ? (
          <>
            <Pin
              aria-hidden="true"
              className="size-3.5 rotate-45 fill-current"
            />
            <span className="sr-only">Pinned</span>
          </>
        ) : read ? (
          <>
            <CheckCheck aria-hidden="true" className="size-3.5" />
            <span className="sr-only">Read</span>
          </>
        ) : null}
      </span>
    </Link>
  );
};
