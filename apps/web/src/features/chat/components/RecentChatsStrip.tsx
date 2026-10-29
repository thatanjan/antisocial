import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ChatPresence = "online" | "busy";

export interface RecentChatItem {
  id: string;
  name: string;
  avatarUrl?: string;
  presence?: ChatPresence;
  active?: boolean;
}

interface RecentChatsStripProps {
  items: RecentChatItem[];
  onSelect: (id: string) => void;
  onMore: () => void;
  label?: string;
  className?: string;
}

export const RecentChatsStrip = ({
  items,
  onSelect,
  onMore,
  label = "Recent Chats",
  className,
}: RecentChatsStripProps) => {
  return (
    <section className={cn("px-4 py-3", className)} data-purpose="recent-chats">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="text-2xs text-muted-foreground font-bold tracking-wider uppercase">
          {label}
        </h2>
        <Button
          aria-label={`${label} options`}
          className="text-muted-foreground"
          onClick={onMore}
          size="icon-xs"
          type="button"
          variant="ghost"
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </div>
      <ul className="no-scrollbar flex items-center gap-3.5 overflow-x-auto py-1">
        {items.map(({ id, name, avatarUrl, presence, active }) => (
          <li key={id}>
            <button
              aria-current={active ? "true" : undefined}
              className="group flex flex-col items-center gap-1"
              onClick={() => onSelect(id)}
              type="button"
            >
              <Avatar
                className={cn(
                  "ring-offset-background size-12 ring-2 ring-offset-1",
                  active
                    ? "ring-primary"
                    : "ring-border group-hover:ring-primary",
                )}
              >
                <AvatarImage alt="" src={avatarUrl} />
                <AvatarFallback>
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
                {presence ? (
                  <span
                    className={cn(
                      "ring-background absolute right-0 bottom-0 z-10 size-3 rounded-full ring-2",
                      presence === "online" ? "bg-green-500" : "bg-primary",
                    )}
                  />
                ) : null}
              </Avatar>
              <span className="text-2xs font-medium">{name}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};
