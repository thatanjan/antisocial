import { Ban, CheckCheck, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "../types";

interface MessageBubbleProps {
  message: ChatMessage;
  avatarUrl?: string;
  className?: string;
}

const initials = (name: string) => name.slice(0, 2).toUpperCase();

export const MessageBubble = ({
  message,
  avatarUrl,
  className,
}: MessageBubbleProps) => {
  const { direction, sender, timestamp, body, deleted, starred, read } =
    message;
  const outgoing = direction === "out";
  const metaName = (
    <span className={cn("text-xs", outgoing ? "font-semibold" : "font-bold")}>
      {sender}
    </span>
  );
  const metaTime = (
    <span className="text-2xs text-muted-foreground font-mono">
      {timestamp}
    </span>
  );

  return (
    <div
      className={cn(
        "motion-safe:animate-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200",
        outgoing
          ? "flex flex-row-reverse items-start gap-3 self-end"
          : "flex items-start gap-3 self-start",
        className,
      )}
    >
      <Avatar className="mt-1 size-7 shrink-0 md:mt-4 md:size-8">
        <AvatarImage alt="" src={avatarUrl} />
        <AvatarFallback>{initials(sender)}</AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex max-w-5/6 min-w-0 flex-1 flex-col gap-1 md:max-w-2xl",
          outgoing ? "items-end" : "items-start",
        )}
      >
        <div className="flex items-center gap-2 px-1">
          {outgoing ? (
            <>
              {metaTime}
              {metaName}
            </>
          ) : (
            <>
              {metaName}
              {metaTime}
            </>
          )}
          {starred ? (
            <Star
              aria-label="Starred"
              className="text-primary size-3 fill-current"
            />
          ) : null}
        </div>
        {deleted ? (
          <div
            className={cn(
              "bg-foreground text-background/90 flex items-center gap-2 rounded-2xl px-4 py-2 shadow-sm",
              outgoing ? "rounded-tr-sm" : "rounded-tl-sm",
            )}
          >
            <Ban aria-hidden="true" className="size-4 shrink-0 opacity-70" />
            <p className="text-xs italic">This message was deleted</p>
          </div>
        ) : (
          <div
            className={cn(
              "flex max-w-full items-center gap-3 rounded-2xl px-4 py-2.5 shadow-sm",
              outgoing
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-card text-card-foreground border-border rounded-tl-sm border",
            )}
          >
            <p className="text-sm">{body}</p>
            {starred ? (
              <Star
                aria-hidden="true"
                className="size-3.5 shrink-0 fill-current opacity-70"
              />
            ) : null}
          </div>
        )}
        {!deleted && outgoing && read ? (
          <span className="text-2xs text-muted-foreground flex items-center gap-1 font-mono">
            Read
            <CheckCheck aria-hidden="true" className="text-primary size-3.5" />
          </span>
        ) : null}
      </div>
    </div>
  );
};
