import { PostCard } from "@/features/create-post/components/PostCard";
import prisma from "@/lib/prisma";

/**
 * Feed page that displays a list of posts from all users.
 * Fetches the latest 20 posts from the database.
 */
export default async function FeedPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      images: {
        orderBy: { orderIndex: "asc" },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl tracking-tight">Your Feed</h2>
      </div>

      <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
            <h3 className="font-semibold text-lg">No posts yet</h3>
            <p className="text-muted-foreground text-sm">
              Be the first one to share something!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
