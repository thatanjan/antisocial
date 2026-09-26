"use server";

import type {
  MarkAllReadResult,
  MarkReadInput,
  MarkReadResult,
} from "@/features/notifications/types";
import db from "@/lib/prisma";
import { getSession } from "@/lib/session";

/**
 * Mark a single notification as read.
 *
 * Validates ownership (recipientId === session.user.id), sets `read: true`,
 * and decrements the recipient's `unreadNotifications` counter only if the
 * notification was previously unread.
 */
export const markNotificationRead = async (
  input: MarkReadInput,
): Promise<MarkReadResult> => {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;
  const { notificationId } = input;

  try {
    const notification = await db.notification.findUnique({
      where: { id: notificationId },
      select: { recipientId: true, read: true },
    });

    if (!notification) {
      return { success: false, error: "Notification not found" };
    }

    if (notification.recipientId !== userId) {
      return { success: false, error: "Unauthorized" };
    }

    if (notification.read) {
      return { success: true };
    }

    await db.$transaction([
      db.notification.update({
        where: { id: notificationId },
        data: { read: true },
      }),
      db.user.update({
        where: { id: userId },
        data: { unreadNotifications: { decrement: 1 } },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
};

/**
 * Mark all unread notifications as read for the current user.
 *
 * Runs `updateMany` where recipientId === session.user.id AND read === false,
 * returns count of updated rows, and resets `unreadNotifications` to 0.
 */
export const markAllNotificationsRead =
  async (): Promise<MarkAllReadResult> => {
    const session = await getSession();
    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;

    try {
      const result = await db.notification.updateMany({
        where: { recipientId: userId, read: false },
        data: { read: true },
      });

      await db.user.update({
        where: { id: userId },
        data: { unreadNotifications: 0 },
      });

      return { success: true, count: result.count };
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      return {
        success: false,
        error: "Failed to mark all notifications as read",
      };
    }
  };
