import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatsListHeaderProps {
  title: string;
  onNewChat: () => void;
  onMore: () => void;
}

export const ChatsListHeader = ({
  title,
  onNewChat,
  onMore,
}: ChatsListHeaderProps) => {
  return (
    <header className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-bold md:text-xl">{title}</h1>
      <div className="flex items-center gap-1">
        <Button
          aria-label="New chat"
          onClick={onNewChat}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Plus aria-hidden="true" />
        </Button>
        <Button
          aria-label="More chat options"
          onClick={onMore}
          size="icon"
          type="button"
          variant="ghost"
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </div>
    </header>
  );
};
