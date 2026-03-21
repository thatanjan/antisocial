import db from "@/lib/prisma";

/**
 * Increment follower/following counts atomically.
 */
export async function incrementFollowCounts(
  followerId: string,
  followeeId: string,
): Promise<void> {
  await db.$transaction([
    db.user.update({
      where: { id: followerId },
      data: { followingCount: { increment: 1 } },
    }),
    db.user.update({
      where: { id: followeeId },
      data: { followerCount: { increment: 1 } },
    }),
  ]);
}

/**
 * Decrement follower/following counts atomically.
 */
export async function decrementFollowCounts(
  followerId: string,
  followeeId: string,
): Promise<void> {
  await db.$transaction([
    db.user.update({
      where: { id: followerId },
      data: { followingCount: { decrement: 1 } },
    }),
    db.user.update({
      where: { id: followeeId },
      data: { followerCount: { decrement: 1 } },
    }),
  ]);
}

/**
 * Check if a follow relationship exists.
 */
export async function checkFollowExists(
  followerId: string,
  followeeId: string,
): Promise<boolean> {
  const follow = await db.follow.findUnique({
    where: {
      followerId_followeeId: {
        followerId,
        followeeId,
      },
    },
  });
  return follow !== null;
}
