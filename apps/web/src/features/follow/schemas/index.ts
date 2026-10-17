import { z } from "zod";

/**
 * Zod schema for follow user input validation.
 */
export const FollowUserSchema = z.object({
  followeeId: z.string().min(1, "Followee ID is required"),
});

/**
 * Zod schema for unfollow user input validation.
 */
export const UnfollowUserSchema = z.object({
  followeeId: z.string().min(1, "Followee ID is required"),
});

/**
 * Zod schema for check follow status input validation.
 */
export const CheckFollowStatusSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});

/**
 * Zod schema for get followers input validation.
 */
export const GetFollowersSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

/**
 * Zod schema for get following input validation.
 */
export const GetFollowingSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});
