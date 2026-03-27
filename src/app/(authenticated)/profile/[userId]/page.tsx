import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProfileHeader } from "@/features/user-profile/components/ProfileHeader";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface ProfilePageProps {
  params: Promise<{
    userId: string;
  }>;
}

/**
 * Profile page that displays user information.
 * Fetches user data and renders the profile header.
 */
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

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
    bio: null, // Bio field doesn't exist in schema yet
    image: user.image,
    createdAt: user.createdAt,
    followerCount: user.followerCount,
    followingCount: user.followingCount,
  };

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        isFollowing={isFollowing}
        isOwnProfile={isOwnProfile}
        profile={profile}
      />
    </div>
  );
}
