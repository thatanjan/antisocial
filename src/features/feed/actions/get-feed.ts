"use server";

import { getSession } from "@/lib/session";
import { getFeedFromFollowees } from "../lib/feed-service";
import { getFeedSchema } from "../schemas";
import type { GetFeedResult } from "../types";

export const getFeedAction = async (
  input: { cursor?: string | null; limit?: number } = {},
): Promise<GetFeedResult> => {
  try {
    const session = await getSession();

    if (!session || !session.user) {
      return { success: false, error: "NOT_AUTHENTICATED" };
    }

    const parsed = getFeedSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues.map((e) => e.message).join(", "),
      };
    }

    const { cursor, limit } = parsed.data;

    const result = await getFeedFromFollowees(session.user.id, cursor, limit);

    return {
      success: true,
      data: {
        posts: result.posts,
        nextCursor: result.nextCursor,
        hasMore: result.hasMore,
        ...(result.emptyReason ? { emptyReason: result.emptyReason } : {}),
      },
    };
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    return { success: false, error: "FEED_FETCH_FAILED" };
  }
};
