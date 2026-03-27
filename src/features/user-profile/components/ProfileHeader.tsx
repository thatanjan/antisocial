"use client";

import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ProfileHeaderProps } from "../types";
import {
  formatFollowerCount,
  formatFollowingCount,
  formatJoinDate,
} from "../utils/format-user-stats";

/**
 * Displays the profile header with user information and action buttons.
 * Shows avatar, name, username, bio, stats, and follow/edit button.
 */
export const ProfileHeader = ({
  profile: {
    name,
    username,
    bio,
    image,
    followingCount,
    followerCount,
    createdAt,
  },
  isOwnProfile,
  isFollowing,
}: ProfileHeaderProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage alt={name} src={image ?? undefined} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h1 className="font-bold text-xl">{name}</h1>
            <p className="text-muted-foreground text-sm">@{username}</p>
            {bio && <p className="mt-2 text-sm">{bio}</p>}
          </div>
        </div>

        <div>
          {isOwnProfile ? (
            <Button size="sm" variant="outline">
              Edit Profile
            </Button>
          ) : (
            <Button size="sm" variant={isFollowing ? "outline" : "default"}>
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm">
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
