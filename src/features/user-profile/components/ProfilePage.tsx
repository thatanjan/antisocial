import type { UserProfile } from "../types";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabContent } from "./ProfileTabContent";

interface ProfilePageProps {
  /** The user profile to display */
  profile: UserProfile;
  /** Whether this is the current user's own profile */
  isOwnProfile: boolean;
  /** Whether the current user is following this profile */
  isFollowing: boolean;
  /** The profile user's ID for fetching posts */
  profileUserId: string;
  /** Current user ID for post interactions */
  currentUserId: string;
}

/**
 * Main profile page component that combines header, tabs, and content.
 * Uses URL search parameters for tab state management.
 */
export const ProfilePage = ({
  profile,
  isOwnProfile,
  isFollowing,
  profileUserId,
  currentUserId,
}: ProfilePageProps) => {
  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        isFollowing={isFollowing}
        isOwnProfile={isOwnProfile}
        profile={profile}
      />

      <ProfileTabContent
        currentUserId={currentUserId}
        profileUserId={profileUserId}
      />
    </div>
  );
};
