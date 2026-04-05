import { Calendar, VenetianMask } from "lucide-react";
import dynamic from "next/dynamic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ProfileHeaderProps } from "../types";
import {
  formatFollowerCount,
  formatFollowingCount,
  formatJoinDate,
} from "../utils/format-user-stats";

const FollowButton = dynamic(() =>
  import("./FollowButton").then((mod) => mod.FollowButton),
);

/**
 * Displays the profile header with user information and action buttons.
 * Shows avatar, name, username, bio, stats, and follow/edit button.
 * Designed to float over a cover image/gradient.
 */
export const ProfileHeader = ({
  profile: {
    id,
    name,
    username,
    bio,
    image,
    followingCount,
    followerCount,
    createdAt,
    isAnonymous,
  },
  isOwnProfile,
  isFollowing,
}: ProfileHeaderProps) => {
  return (
    <div className="w-full rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="h-14 w-14 sm:h-20 sm:w-20">
            <AvatarImage alt={name} src={image ?? undefined} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h1 className="flex items-center gap-2 font-bold text-lg sm:text-xl">
              {name}
              {isAnonymous && (
                <VenetianMask className="h-4 w-4 text-muted-foreground" />
              )}
            </h1>
            <p className="text-muted-foreground text-sm">@{username}</p>
            {bio && <p className="mt-2 text-sm">{bio}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          {isOwnProfile ? (
            <Button size="sm" variant="outline">
              Edit Profile
            </Button>
          ) : (
            <FollowButton isFollowing={isFollowing} userId={id} />
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm sm:gap-6">
        <div className="flex items-center gap-1.5">
          <span className="font-bold">
            {formatFollowingCount(followingCount)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-bold">
            {formatFollowerCount(followerCount)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatJoinDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
};
