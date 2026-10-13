import { notFound } from "next/navigation";
import { ProfilePage } from "@/features/user-profile/components/ProfilePage";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

/**
 * Profile page that displays user information and posts.
 * Fetches user data, posts, and renders the profile page component.
 */
export default async function UserProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;

  const session = await getSession();

  const currentUserId = session?.user?.id;

  // Fetch the profile user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    notFound();
  }

  // Determine if viewing own profile
  const isOwnProfile = currentUserId === user.id;

  // Check follow status if not own profile
  let isFollowing = false;

  if (!isOwnProfile && currentUserId) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followeeId: {
          followerId: currentUserId,
          followeeId: user.id,
        },
      },
    });

    isFollowing = follow !== null;
  }

  // Map user to profile format
  const profile = {
    id: user.id,
    name: user.name,
    username: user.name.toLowerCase().replace(/\s/g, ""),
    bio: null,
    image: user.image,
    createdAt: user.createdAt,
    followerCount: user.followerCount,
    followingCount: user.followingCount,
    isAnonymous: user.isAnonymous,
  };

  return (
    <ProfilePage
      currentUserId={currentUserId ?? ""}
      isFollowing={isFollowing}
      isOwnProfile={isOwnProfile}
      profile={profile}
      profileUserId={user.id}
    />
  );
}
