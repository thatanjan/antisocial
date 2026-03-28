"use server";

import { PrismaClientKnownRequestError } from "@/generated/client/internal/prismaNamespace";
import db from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  CheckFollowStatusSchema,
  FollowUserSchema,
  UnfollowUserSchema,
} from "../schemas";
import type {
  CheckFollowStatusResult,
  FollowUserResult,
  UnfollowUserResult,
} from "../types";
import {
  checkFollowExists,
  decrementFollowCounts,
  incrementFollowCounts,
} from "../utils";

/**
 * Follow a user.
 */
export const followUser = async (input: {
  followeeId: string;
}): Promise<FollowUserResult> => {
  const parsed = FollowUserSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { followeeId } = parsed.data;

  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const followerId = session.user.id;

  if (followerId === followeeId) {
    return { success: false, error: "Cannot follow yourself" };
  }

  const exists = await checkFollowExists(followerId, followeeId);
  if (exists) {
    return { success: false, error: "Already following this user" };
  }

  await db.follow.create({
    data: { followerId, followeeId },
  });

  await incrementFollowCounts(followerId, followeeId);

  return {
    success: true,
  };
};

/**
 * Unfollow a user.
 */
export const unfollowUser = async (input: {
  followeeId: string;
}): Promise<UnfollowUserResult> => {
  const parsed = UnfollowUserSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { followeeId } = parsed.data;

  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const followerId = session.user.id;

  try {
    await db.follow.delete({
      where: {
        followerId_followeeId: {
          followerId,
          followeeId,
        },
      },
    });
  } catch (error: unknown) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, error: "Not following this user" };
    }
    throw error;
  }

  await decrementFollowCounts(followerId, followeeId);

  return {
    success: true,
  };
};

/**
 * Check if the current user follows a target user.
 */
export const checkFollowStatus = async (input: {
  userId: string;
}): Promise<CheckFollowStatusResult> => {
  const parsed = CheckFollowStatusSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }

  const { userId } = parsed.data;

  const session = await getSession();
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const followerId = session.user.id;
  const isFollowing = await checkFollowExists(followerId, userId);

  return { success: true, data: { isFollowing } };
};
