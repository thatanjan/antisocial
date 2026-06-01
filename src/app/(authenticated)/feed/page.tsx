import { PostList } from "@/features/create-post/components/PostList";
import { getFeedAction } from "@/features/feed/actions/get-feed";
import { getSession } from "@/lib/session";

/**
 * Feed page that displays posts from followed users.
 * Delegates to getFeedAction which handles cache + DB fallback.
 */
export default async function FeedPage() {
  const session = await getSession();

  const currentUserId = session?.user?.id || "";

  const result = await getFeedAction();

  if (!result.success) {
    throw new Error(result.error);
  }

  const posts = result.data.posts.map((p) => ({
    id: p.id,
    content: p.content,
    aspectRatio: p.aspectRatio,
    author: { id: p.author.id, name: p.author.name, image: p.author.image },
    images: p.images.map((img) => ({ id: img.id, url: img.url })),
    likeCount: p.likeCount,
    commentCount: p.commentCount,
    isLiked: p.isLiked,
    createdAt: p.createdAt,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl tracking-tight">Your Feed</h2>
      </div>

      <PostList
        currentUserId={currentUserId}
        emptyReason={result.data.emptyReason}
        initialPosts={posts}
      />
    </div>
  );
}
