/**
 * Result of a follow operation.
 */
export interface FollowUserResult {
  success: boolean;
  data?: {
    followId: string;
    followingCount: number;
    followerCount: number;
  };
  error?: string;
}

/**
 * Result of an unfollow operation.
 */
export interface UnfollowUserResult {
  success: boolean;
  data?: {
    followingCount: number;
    followerCount: number;
  };
  error?: string;
}

/**
 * Result of checking follow status.
 */
export interface CheckFollowStatusResult {
  success: boolean;
  data?: {
    isFollowing: boolean;
  };
  error?: string;
}

/**
 * Result of getting followers list.
 */
export interface GetFollowersResult {
  success: boolean;
  data?: {
    users: FollowUser[];
    nextCursor: string | null;
  };
  error?: string;
}

/**
 * Result of getting following list.
 */
export interface GetFollowingResult {
  success: boolean;
  data?: {
    users: FollowUser[];
    nextCursor: string | null;
  };
  error?: string;
}

/**
 * User info returned in follow-related responses.
 */
export interface FollowUser {
  id: string;
  name: string | null;
  image: string | null;
  followedAt: Date;
}

/**
 * Input for pagination cursor.
 */
export interface PaginationInput {
  cursor?: string;
  limit?: number;
}
