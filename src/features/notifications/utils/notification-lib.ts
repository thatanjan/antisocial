import { isThisMonth, isThisWeek, isToday, isYesterday } from "date-fns";
import type {
  NotificationItem,
  NotificationType,
} from "@/features/notifications/types";

/** Date buckets used when grouping a user's notification list. */
export type DateBucket =
  | "Today"
  | "Yesterday"
  | "This Week"
  | "This Month"
  | "Older";

/** One date group in the notification list: a label plus its items. */
export interface NotificationGroup {
  label: DateBucket;
  items: NotificationItem[];
}

const BUCKETS: DateBucket[] = [
  "Today",
  "Yesterday",
  "This Week",
  "This Month",
  "Older",
];

const bucketFor = (date: Date): DateBucket => {
  switch (true) {
    case isToday(date):
      return "Today";
    case isYesterday(date):
      return "Yesterday";
    case isThisWeek(date):
      return "This Week";
    case isThisMonth(date):
      return "This Month";
    default:
      return "Older";
  }
};

export const formatNotificationText = (
  type: NotificationType,
  actorName: string,
  preview?: string | null,
): string => {
  switch (type) {
    case "follow":
      return `${actorName} started following you`;
    case "like":
      return `${actorName} liked your post`;
    case "comment":
      return preview
        ? `${actorName} commented: ${preview}`
        : `${actorName} commented on your post`;
  }
};

/**
 * Group a flat notification list into date buckets ("Today", "Yesterday",
 * "This Week", "This Month", "Older"), preserving newest-first order.
 * Empty buckets are omitted.
 */
export const groupNotificationsByDate = (
  notifications: NotificationItem[],
): NotificationGroup[] => {
  const groups = new Map<DateBucket, NotificationItem[]>();

  for (const notification of notifications) {
    const bucket = bucketFor(new Date(notification.createdAt));
    const items = groups.get(bucket);
    if (items) {
      items.push(notification);
    } else {
      groups.set(bucket, [notification]);
    }
  }

  return BUCKETS.flatMap((label) => {
    const items = groups.get(label);
    return items ? [{ label, items }] : [];
  });
};

/**
 * Compact relative timestamp: "now", "2m ago", "1h ago", "3d ago".
 */
export const formatRelativeTime = (date: string | Date): string => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
