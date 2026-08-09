"use server";

import type {
  GetNotificationsResult,
  NotificationItem,
} from "@/features/notifications/types";
import db from "@/lib/prisma";
import { getSession } from "@/lib/session";

/**
 * Fetch the current user's notifications, newest first.
 *
 * Includes the actor relation (id, name, image) and the recipient's cached
 * `unreadNotifications` counter from the User table.
 */
export const getNotifications = async (): Promise<GetNotificationsResult> => {
  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const [notifications, recipient] = await Promise.all([
      db.notification.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: "desc" },
        include: {
          actor: {
            select: { id: true, name: true, image: true },
          },
        },
      }),
      db.user.findUnique({
        where: { id: userId },
        select: { unreadNotifications: true },
      }),
    ]);

    const items: NotificationItem[] = notifications.map((notification) => ({
      ...notification,
      createdAt: notification.createdAt.toISOString(),
    }));

    return {
      success: true,
      data: {
        notifications: items,
        unreadCount: recipient?.unreadNotifications ?? 0,
      },
    };
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return { success: false, error: "Failed to load notifications" };
  }
};
