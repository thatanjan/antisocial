"use server";

import { subDays } from "date-fns";
import db from "@/lib/prisma";

/**
 * Delete notifications older than 30 days.
 *
 * Authorized by a shared secret (`CRON_SECRET`) passed from the scheduled
 * cron job. Returns the number of notifications deleted.
 */
export const cleanupNotifications = async (
  cronSecret: string,
): Promise<
  { success: true; deletedCount: number } | { success: false; error: string }
> => {
  if (cronSecret !== process.env.CRON_SECRET) {
    return { success: false, error: "Unauthorized" };
  }

  const cutoff = subDays(new Date(), 30);

  try {
    const result = await db.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoff,
        },
      },
    });

    return { success: true, deletedCount: result.count };
  } catch (error) {
    console.error("Failed to clean up old notifications:", error);
    return { success: false, error: "Failed to clean up notifications" };
  }
};
