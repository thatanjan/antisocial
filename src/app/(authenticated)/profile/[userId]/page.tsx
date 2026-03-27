import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ProfilePage } from "@/features/user-profile/components/ProfilePage";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

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

  // Fetch user's posts
  const postsData = await prisma.post.findMany({
    where: { authorId: user.id },
    include: {
      author: true,
      images: {
        orderBy: { orderIndex: "asc" },
      },
      postLikes: {
        where: {
          userId: currentUserId,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  // Map posts to include isLiked
  const posts = postsData.map((post) => ({
    ...post,
    isLiked: post.postLikes.length > 0,
  }));

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
    <ProfilePage
      currentUserId={currentUserId ?? ""}
      isFollowing={isFollowing}
      isOwnProfile={isOwnProfile}
      posts={posts}
      profile={profile}
    />
  );
}
