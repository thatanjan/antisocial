"use server";

import type { MarkReadInput, MarkReadResult } from "@/features/notifications/types";
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
