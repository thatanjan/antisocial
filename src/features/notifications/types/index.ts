/**
 * Types and interfaces for the Notification feature.
 */

import type { Notification } from "@prisma-types/models";

/**
 * Base notification row shape — re-exported from the generated Prisma client
 * (`@prisma-types` alias → `src/generated/client/client.ts`).
 */
export type NotificationData = Notification;

/**
 * Type of notification, used to narrow the generated `type: string` field.
 */
export const NotificationType = {
  follow: "follow",
  like: "like",
  comment: "comment",
} as const;

export type NotificationType = keyof typeof NotificationType;

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
 * Notification returned by the get-notifications action — the generated
 * `Notification` row with its `actor` relation and a serialized `createdAt`.
 */
export type NotificationItem = Omit<Notification, "createdAt" | "actor"> & {
  actor: NotificationActor | null;
  createdAt: string;
};

/**
 * Input for the create-notification utility.
 */
export interface CreateNotificationInput {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId?: string;
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
