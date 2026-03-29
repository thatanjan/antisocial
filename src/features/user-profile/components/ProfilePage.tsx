import type { UserProfile } from "../types";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabContent } from "./ProfileTabContent";

/**
 * Props for the ProfilePage component.
 */
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
 * Main profile page component that combines cover image, header, tabs, and content.
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
      <div className="relative flex h-72 items-end">
        {/* TODO: Add cover image upload and display functionality */}
        <div className="absolute top-0 h-60 w-full rounded-lg bg-red-900" />

        <div className="z-10 flex basis-full justify-center px-6">
          <ProfileHeader
            isFollowing={isFollowing}
            isOwnProfile={isOwnProfile}
            profile={profile}
          />
        </div>
      </div>

      <div className="mt-4">
        <ProfileTabContent
          currentUserId={currentUserId}
          profileUserId={profileUserId}
        />
      </div>
    </div>
  );
};
