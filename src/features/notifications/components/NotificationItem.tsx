"use client";

import { useRouter } from "next/navigation";
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
  /** The notification to render. */
  notification: NotificationItemType;
}

/**
 * Renders a single notification row: actor avatar (with "Deleted User"
 * fallback), formatted text, relative timestamp, and a read/unread visual
 * distinction. Clicking navigates to the target content and marks the
 * notification as read.
 */
export const NotificationItem = ({ notification }: NotificationItemProps) => {
  const router = useRouter();
  const actorName = notification.actor?.name ?? "Deleted User";

  const handleClick = async () => {
    if (!notification.read) {
      await markNotificationRead({ notificationId: notification.id });
    }

    if (notification.type === "follow") {
      if (notification.actor) {
        router.push(`/profile/${notification.actor.id}`);
      }
      return;
    }

    if (notification.postId) {
      router.push(`/post/${notification.postId}`);
    }
  };

  return (
    <button
      className={cn(
        "flex w-full cursor-pointer items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50",
        !notification.read && "bg-primary/5",
      )}
      onClick={handleClick}
      type="button"
    >
      <Avatar className="mt-0.5 h-8 w-8 rounded-full border border-border/50 shadow-sm">
        <AvatarImage
          alt={actorName}
          src={notification.actor?.image ?? undefined}
        />
        <AvatarFallback className="bg-secondary font-semibold text-2xs text-secondary-foreground">
          {actorName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col">
        <p
          className={cn(
            "text-foreground/90 text-sm leading-snug",
            !notification.read && "font-semibold text-foreground",
          )}
        >
          {formatNotificationText(
            notification.type as NotificationType,
            actorName,
          )}
        </p>
        <span className="mt-0.5 text-muted-foreground text-xs">
          {formatRelativeTime(notification.createdAt)}
        </span>
      </div>

      {!notification.read && (
        <span
          aria-hidden
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary"
          role="presentation"
        >
          <span className="sr-only">Unread</span>
        </span>
      )}
    </button>
  );
};
