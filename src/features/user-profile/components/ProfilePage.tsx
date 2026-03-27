"use client";

import { useState } from "react";
import { PostList } from "@/features/create-post/components/PostList";
import type { Post } from "@/features/create-post/types";
import type { ProfileTab, UserProfile } from "../types";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";

interface ProfilePageProps {
  /** The user profile to display */
  profile: UserProfile;
  /** Whether this is the current user's own profile */
  isOwnProfile: boolean;
  /** Whether the current user is following this profile */
  isFollowing: boolean;
  /** User's posts */
  posts: Post[];
  /** Current user ID for post interactions */
  currentUserId: string;
}

/**
 * Main profile page component that combines header, tabs, and content.
 * Manages tab state and displays appropriate content for each tab.
 */
export const ProfilePage = ({
  profile,
  isOwnProfile,
  isFollowing,
  posts,
  currentUserId,
}: ProfilePageProps) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        isFollowing={isFollowing}
        isOwnProfile={isOwnProfile}
        profile={profile}
      />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {activeTab === "posts" && (
          <PostList currentUserId={currentUserId} initialPosts={posts} />
        )}

        {activeTab === "shorts" && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
            <h3 className="font-semibold text-lg">No shorts yet</h3>
            <p className="text-muted-foreground text-sm">Shorts coming soon!</p>
          </div>
        )}

        {activeTab === "tags" && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
            <h3 className="font-semibold text-lg">No tags yet</h3>
            <p className="text-muted-foreground text-sm">Tags coming soon!</p>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
            <h3 className="font-semibold text-lg">No activity yet</h3>
            <p className="text-muted-foreground text-sm">
              Activity coming soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
