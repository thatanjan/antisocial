/**
 * Types for the user profile feature.
 */

import type { Post } from "@/features/create-post/types";

/**
 * User profile data displayed on the profile page.
 */
export interface UserProfile {
  /** Unique identifier */
  id: string;
  /** User's display name */
  name: string;
  /** User's username for URL */
  username: string;
  /** User's bio/description */
  bio: string | null;
  /** Profile picture URL */
  image: string | null;
  /** Account creation date */
  createdAt: Date;
  /** Number of followers */
  followerCount: number;
  /** Number of users this user follows */
  followingCount: number;
  /** Whether this is a guest/anonymous user */
  isAnonymous: boolean;
}

/**
 * Profile page data including user info and posts.
 */
export interface ProfilePageData {
  /** The profile owner */
  profile: UserProfile;
  /** Whether the current user is viewing their own profile */
  isOwnProfile: boolean;
  /** Whether the current user is following this profile (only for other users' profiles) */
  isFollowing: boolean;
  /** User's posts */
  posts: Post[];
}

/**
 * Tab identifiers for the profile page.
 */
export type ProfileTab = "posts" | "shorts" | "tags" | "activity";

/**
 * Props for the ProfileHeader component.
 */
export interface ProfileHeaderProps {
  /** The user profile to display */
  profile: UserProfile;
  /** Whether this is the current user's own profile */
  isOwnProfile: boolean;
  /** Whether the current user is following this profile */
  isFollowing: boolean;
}

/**
 * Props for the ProfileTabs component.
 */
export interface ProfileTabsProps {
  /** Currently active tab */
  activeTab: ProfileTab;
  /** Callback when tab changes */
  onTabChange: (tab: ProfileTab) => void;
}
