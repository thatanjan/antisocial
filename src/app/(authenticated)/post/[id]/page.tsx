import { notFound } from "next/navigation";
import { PostCard } from "@/features/create-post/components/PostCard";
import prisma from "@/lib/prisma";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Page showing the details of a specific post.
 * Fetches post data including author and images.
 */
export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;

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

  return (
    <div className="flex flex-col gap-6">
      <PostCard post={post} />

      <div className="py-8 text-center">
        <p className="text-muted-foreground text-sm italic">
          Comments section coming soon...
        </p>
      </div>
    </div>
  );
}
