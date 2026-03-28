import { notFound } from "next/navigation";
import { PostCard } from "@/features/create-post/components/PostCard";
import type { Post } from "@/features/create-post/types";
import { getCommentsAction } from "@/features/post-comments/actions/comments";
import { CommentList } from "@/features/post-comments/components/CommentList";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Page showing the details of a specific post.
 * Fetches post data including author and images.
 */
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;
  const session = await getSession();

  // 1. Fetch post data
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      images: {
        orderBy: { orderIndex: "asc" },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // 2. Fetch initial comments for first paint
  const { comments: initialComments, total: initialTotalCount } =
    await getCommentsAction(post.id, 5, 0);

  return (
    <div className="mx-auto flex w-full flex-col gap-6 px-4 sm:px-0">
      <PostCard
        currentUserId={session?.user?.id || ""}
        post={post as unknown as Post}
      />

      <CommentList
        initialComments={initialComments}
        initialTotalCount={initialTotalCount}
        postId={post.id}
      />
    </div>
  );
}
