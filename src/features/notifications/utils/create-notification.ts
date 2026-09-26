import type {
  CreateNotificationInput,
  CreateNotificationResult,
} from "@/features/notifications/types";
import prisma from "@/lib/prisma";

/**
 * Create a notification for a recipient user.
 *
 * Skips creation (returns `{ success: false, skipped: true }`) when the actor
 * is also the recipient (self-action guard, FR-004). Only ever called
 * server-side from follow/like/comment actions — not a direct server action.
 */
export const createNotification = async (
  input: CreateNotificationInput,
): Promise<CreateNotificationResult> => {
  const { recipientId, actorId, type, postId } = input;

  if (actorId === recipientId) {
    return { success: false, skipped: true };
  }

  await prisma.notification.create({
    data: { recipientId, actorId, type, postId },
  });

  return { success: true };
};
