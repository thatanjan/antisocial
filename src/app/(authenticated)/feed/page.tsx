import { PostList } from "@/features/create-post/components/PostList";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

/**
 * Feed page that displays a list of posts from all users.
 * Fetches the latest 20 posts from the database.
 */
export default async function FeedPage() {
  const session = await getSession();

  const currentUserId = session?.user?.id || "";

  const postsData = await prisma.post.findMany({
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

  // Map the Prisma data to our Post view model
  const posts = postsData.map((post) => ({
    ...post,
    isLiked: post.postLikes.length > 0,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl tracking-tight">Your Feed</h2>
      </div>

      <PostList currentUserId={currentUserId} initialPosts={posts} />
    </div>
  );
}
