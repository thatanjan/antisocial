"use server";

import type { GetUnreadCountResult } from "@/features/notifications/types";
import db from "@/lib/prisma";
import { getSession } from "@/lib/session";

/**
 * Fetch the current user's unread notification count.
 */
export const getUnreadCount = async (): Promise<GetUnreadCountResult> => {
  const session = await getSession();
  if (!session?.user) return { success: false, error: "Unauthorized" };

  try {
    const recipient = await db.user.findUnique({
      where: { id: session.user.id },
      select: { unreadNotifications: true },
    });

    return { success: true, count: recipient?.unreadNotifications ?? 0 };
  } catch (error) {
    console.error("Failed to fetch unread notification count:", error);
    return { success: false, error: "Failed to load unread count" };
  }
};
