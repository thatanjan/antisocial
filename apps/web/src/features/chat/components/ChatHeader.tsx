import {
  ArrowLeft,
  Info,
  MoreVertical,
  Phone,
  Search,
  Video,
} from "lucide-react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  name: string;
  avatarUrl?: string;
  online?: boolean;
  /** Mobile-only back affordance that returns to the chat list. */
  onBack: () => void;
  onSearch: () => void;
  onVideoCall: () => void;
  onVoiceCall: () => void;
  /** Hidden below `md`, where the header only carries its four primary actions. */
  onInfo: () => void;
  onMore: () => void;
  className?: string;
}

export const ChatHeader = ({
  name,
  avatarUrl,
  online = false,
  onBack,
  onSearch,
  onVideoCall,
  onVoiceCall,
  onInfo,
  onMore,
  className,
}: ChatHeaderProps) => {
  const actions = [
    { label: "Search conversation", icon: Search, onClick: onSearch },
    { label: "Start video call", icon: Video, onClick: onVideoCall },
    { label: "Start voice call", icon: Phone, onClick: onVoiceCall },
    {
      label: "Contact info",
      icon: Info,
      onClick: onInfo,
      className: "hidden md:inline-flex",
    },
    { label: "More options", icon: MoreVertical, onClick: onMore },
  ];

  return (
    <header
      className={cn(
        "bg-card/95 md:bg-card border-border pt-safe sticky top-0 z-30 flex min-h-16 shrink-0 items-center justify-between gap-3 border-b px-4 backdrop-blur-md md:px-6",
        className,
      )}
      data-purpose="chat-header"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Button
          aria-label="Back to chats"
          className="-ml-1 rounded-full md:hidden"
          onClick={onBack}
          size="icon"
          type="button"
          variant="ghost"
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        <Avatar className="size-10">
          <AvatarImage alt="" src={avatarUrl} />
          <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          {online ? <AvatarBadge className="bg-green-500" /> : null}
        </Avatar>
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-sm font-bold md:text-base">{name}</h2>
          {online ? (
            <span className="text-2xs text-muted-foreground flex items-center gap-1 font-medium">
              <span
                aria-hidden="true"
                className="size-1.5 animate-pulse rounded-full bg-green-500"
              />
              Online
            </span>
          ) : null}
        </div>
      </div>
      <div className="text-muted-foreground flex shrink-0 items-center gap-1">
        {actions.map(
          ({ label, icon: ActionIcon, onClick, className: extra }) => (
            <Button
              aria-label={label}
              className={extra}
              key={label}
              onClick={onClick}
              size="icon"
              type="button"
              variant="ghost"
            >
              <ActionIcon aria-hidden="true" />
            </Button>
          ),
        )}
      </div>
    </header>
  );
};
