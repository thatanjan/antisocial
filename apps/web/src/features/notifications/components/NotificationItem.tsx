"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { markNotificationRead } from "@/features/notifications/actions/mark-read";
import type {
  NotificationItem as NotificationItemType,
  NotificationType,
} from "@/features/notifications/types";
import {
  formatNotificationText,
  formatRelativeTime,
} from "@/features/notifications/utils/notification-lib";
import { cn } from "@/lib/utils";

/**
 * Props for the NotificationItem component.
 */
interface NotificationItemProps {
  notification: NotificationItemType;
  closePanel: () => void;
}

/**
 * Renders a single notification row: actor avatar (with "Deleted User"
 * fallback), formatted text, relative timestamp, and a read/unread visual
 * distinction. Clicking navigates to the target content and marks the
 * notification as read.
 */
export const NotificationItem = ({
  notification,
  closePanel,
}: NotificationItemProps) => {
  const router = useRouter();
  const actorName = notification.actor?.name ?? "Deleted User";

  const handleClick = async () => {
    if (!notification.read) {
      await markNotificationRead({ notificationId: notification.id });
    }

    closePanel();

    const navigate = (path: string) => {
      try {
        router.push(path);
      } catch {
        toast.error("This content is no longer available");
      }
    };

    if (notification.type === "follow") {
      if (notification.actor) {
        navigate(`/profile/${notification.actor.id}`);
      } else {
        toast.error("This content is no longer available");
      }
      return;
    }

    if (notification.postId) {
      navigate(`/post/${notification.postId}`);
    } else {
      toast.error("This content is no longer available");
    }
  };

  return (
    <button
      className={cn(
        "hover:bg-accent/50 flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors",
        !notification.read && "bg-primary/5",
      )}
      onClick={handleClick}
      type="button"
    >
      <Avatar className="border-border/50 mt-0.5 h-8 w-8 rounded-full border shadow-sm">
        <AvatarImage
          alt={actorName}
          src={notification.actor?.image ?? undefined}
        />
        <AvatarFallback className="bg-secondary text-2xs text-secondary-foreground font-semibold">
          {actorName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col">
        <p
          className={cn(
            "text-foreground/90 text-sm leading-snug",
            !notification.read && "text-foreground font-semibold",
          )}
        >
          {formatNotificationText(
            notification.type as NotificationType,
            actorName,
          )}
        </p>
        <span className="text-muted-foreground mt-0.5 text-xs">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>

      {!notification.read && (
        <span
          aria-hidden
          className="bg-primary mt-1.5 h-2 w-2 shrink-0 rounded-full"
          role="presentation"
        >
          <span className="sr-only">Unread</span>
        </span>
      )}
    </button>
  );
};
