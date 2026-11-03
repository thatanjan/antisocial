import { Phone, PhoneOff, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "../types";

interface CallLogCardProps {
  message: ChatMessage;
  avatarUrl?: string;
  /** Invoked by the call-back button. */
  onCallBack: () => void;
  className?: string;
}

const CALL_PRESENTATION = {
  voice: { title: "Voice Call", icon: Phone },
  video: { title: "Video Call", icon: Video },
} as const;

export const CallLogCard = ({
  message,
  avatarUrl,
  onCallBack,
  className,
}: CallLogCardProps) => {
  const {
    sender,
    timestamp,
    callKind = "voice",
    durationText,
    cancelled,
  } = message;
  const { title, icon: CallIcon } = CALL_PRESENTATION[callKind];

  return (
    <div className={cn("flex items-start gap-3 self-start", className)}>
      <Avatar className="mt-1 size-7 shrink-0 md:mt-4 md:size-8">
        <AvatarImage alt="" src={avatarUrl} />
        <AvatarFallback>{sender.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex w-full max-w-sm min-w-0 flex-col gap-1 md:max-w-md">
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs font-bold">{sender}</span>
          <span className="text-2xs text-muted-foreground font-mono">
            {timestamp}
          </span>
        </div>
        <div className="bg-card text-card-foreground border-border flex w-full items-center justify-between gap-3 rounded-2xl rounded-tl-sm border p-3.5 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <span className="bg-secondary text-secondary-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
              <CallIcon aria-hidden="true" />
            </span>
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-semibold">
                {cancelled ? `${title} Cancelled` : title}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {sender} called
              </span>
              {durationText ? (
                <span className="text-2xs text-muted-foreground font-mono">
                  Duration: {durationText}
                </span>
              ) : null}
            </div>
          </div>
          <Button
            aria-label="Call back"
            className="shrink-0 rounded-full"
            onClick={onCallBack}
            size="icon-sm"
            type="button"
            variant="secondary"
          >
            {cancelled ? (
              <PhoneOff aria-hidden="true" />
            ) : (
              <Phone aria-hidden="true" />
            )}
          </Button>
          PUT 15-17? nope
        </div>
      </div>
    </div>
  );
};
