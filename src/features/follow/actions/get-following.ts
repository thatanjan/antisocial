"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
import { GetFollowingSchema } from "../schemas";
import type { GetFollowingResult } from "../types";

/**
 * Get users that a user is following.
 */
export const getFollowing = async (input: {
  userId: string;
  cursor?: string;
  limit?: number;
}): Promise<GetFollowingResult> => {
  const parsed = GetFollowingSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { userId, cursor, limit = 20 } = parsed.data;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const follows = await db.follow.findMany({
    where: { followerId: userId },
    include: {
      followee: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
  });

  const hasMore = follows.length > limit;
  const users = follows.slice(0, limit);
  const nextCursor = hasMore ? (users[users.length - 1]?.id ?? null) : null;

  return {
    success: true,
    data: {
      users: users.map((follow) => ({
        id: follow.followee.id,
        name: follow.followee.name,
        image: follow.followee.image,
        followedAt: follow.createdAt,
      })),
      nextCursor,
    },
  };
};
