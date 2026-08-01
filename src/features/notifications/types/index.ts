/**
 * Types and interfaces for the Notification feature.
 */

/**
 * Type of notification, matching the Notification model's `type` field.
 */
export const NotificationType = {
  follow: "follow",
  like: "like",
  comment: "comment",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

/**
 * Kind of content a notification links to.
 */
export const TargetType = {
  post: "post",
  user: "user",
} as const;

export type TargetType = (typeof TargetType)[keyof typeof TargetType];

/**
 * Notification record shape, matching the Prisma Notification model.
 */
export interface NotificationData {
  id: string;
  recipientId: string;
  actorId: string | null;
  type: NotificationType;
  read: boolean;
  targetType: TargetType | null;
  targetId: string | null;
  preview: string | null;
  createdAt: Date;
}

/**
 * Actor info included when fetching notifications.
 * Null when the actor has been deleted.
 */
export interface NotificationActor {
  id: string;
  name: string;
  image: string | null;
}

/**
 * Notification returned by the get-notifications action.
 */
export interface NotificationItem {
  id: string;
  type: NotificationType;
  read: boolean;
  preview: string | null;
  createdAt: string;
  actor: NotificationActor | null;
  targetType: TargetType | null;
  targetId: string | null;
}

/**
 * Input for the create-notification utility.
 */
export interface CreateNotificationInput {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  targetType: TargetType;
  targetId: string;
  preview?: string;
}

/**
 * Result of the create-notification utility.
 * `skipped` is true when the notification was suppressed (self-action or dedup).
 */
export type CreateNotificationResult =
  | { success: true; skipped?: never }
  | { success: false; skipped: true };

/**
 * Result of the get-notifications server action.
 */
export type GetNotificationsResult =
  | {
      success: true;
      data: { notifications: NotificationItem[]; unreadCount: number };
      error?: never;
    }
  | { success: false; error: string };

/**
 * Input for the mark-notification-read server action.
 */
export interface MarkReadInput {
  notificationId: string;
}

/**
 * Result of the mark-notification-read server action.
 */
export type MarkReadResult =
  | { success: true; error?: never }
  | { success: false; error: string };

/**
 * Result of the mark-all-notifications-read server action.
 */
export type MarkAllReadResult =
  | { success: true; count: number; error?: never }
  | { success: false; error: string };

/**
 * Result of the get-unread-count server action.
 */
export type GetUnreadCountResult =
  | { success: true; count: number; error?: never }
  | { success: false; error: string };

/**
 * Input for the cleanup-old-notifications server action.
 */
export interface CleanupInput {
  cronSecret: string;
}

/**
 * Result of the cleanup-old-notifications server action.
 */
export type CleanupResult =
  | { success: true; deletedCount: number; error?: never }
  | { success: false; error: string };
