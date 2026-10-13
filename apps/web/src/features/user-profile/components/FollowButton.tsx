"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  followUser,
  unfollowUser,
} from "@/features/follow/actions/follow-actions";

interface FollowButtonProps {
  /** The user ID to follow/unfollow */
  userId: string;
  /** Whether the current user is following this user */
  isFollowing: boolean;
}

/**
 * Follow/Unfollow button component with loading and error states.
 * Handles follow/unfollow actions and updates UI accordingly.
 */
export const FollowButton = ({ userId, isFollowing }: FollowButtonProps) => {
  const [isFollowingState, setIsFollowingState] =
    useState<boolean>(isFollowing);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const result = await followUser({ followeeId: userId });
      if (result.success) {
        setIsFollowingState(true);
      } else {
        toast.error(result.error ?? "Failed to follow user");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to follow user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setIsLoading(true);
    try {
      const result = await unfollowUser({ followeeId: userId });
      if (result.success) {
        setIsFollowingState(false);
      } else {
        toast.error(result.error ?? "Failed to unfollow user");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to unfollow user",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end">
      {isLoading ? (
        <Button disabled size="sm" variant="outline">
          {isFollowingState ? "Unfollowing..." : "Following..."}
        </Button>
      ) : (
        <Button
          onClick={isFollowingState ? handleUnfollow : handleFollow}
          size="sm"
          variant={isFollowingState ? "outline" : "default"}
        >
          {isFollowingState ? "Unfollow" : "Follow"}
        </Button>
      )}
    </div>
  );
};
