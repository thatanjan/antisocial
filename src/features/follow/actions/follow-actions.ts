"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/prisma";
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

  const session = await auth.api.getSession({ headers: await headers() });
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

  const follow = await db.follow.create({
    data: { followerId, followeeId },
  });

  await incrementFollowCounts(followerId, followeeId);

  const [follower, followee] = await Promise.all([
    db.user.findUnique({
      where: { id: followerId },
      select: { followingCount: true },
    }),
    db.user.findUnique({
      where: { id: followeeId },
      select: { followerCount: true },
    }),
  ]);

  return {
    success: true,
    data: {
      followId: follow.id,
      followingCount: follower?.followingCount ?? 0,
      followerCount: followee?.followerCount ?? 0,
    },
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

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const followerId = session.user.id;

  const exists = await checkFollowExists(followerId, followeeId);
  if (!exists) {
    return { success: false, error: "Not following this user" };
  }

  await db.follow.delete({
    where: {
      followerId_followeeId: {
        followerId,
        followeeId,
      },
    },
  });

  await decrementFollowCounts(followerId, followeeId);

  const [follower, followee] = await Promise.all([
    db.user.findUnique({
      where: { id: followerId },
      select: { followingCount: true },
    }),
    db.user.findUnique({
      where: { id: followeeId },
      select: { followerCount: true },
    }),
  ]);

  return {
    success: true,
    data: {
      followingCount: follower?.followingCount ?? 0,
      followerCount: followee?.followerCount ?? 0,
    },
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

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const followerId = session.user.id;
  const isFollowing = await checkFollowExists(followerId, userId);

  return { success: true, data: { isFollowing } };
};
