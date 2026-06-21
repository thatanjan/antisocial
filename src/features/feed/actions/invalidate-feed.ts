"use server";

import { getSession } from "@/lib/session";
import { invalidateFeedCache } from "../lib/feed-service";

export type InvalidateFeedResult =
  | { success: true }
  | { success: false; error: string };

export const invalidateFeedAction = async (): Promise<InvalidateFeedResult> => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return { success: false, error: "NOT_AUTHENTICATED" };
    }

    await invalidateFeedCache(session.user.id);

    return { success: true };
  } catch (error) {
    console.error("Failed to invalidate feed cache:", error);
    return { success: false, error: "INVALIDATE_FAILED" };
  }
};
