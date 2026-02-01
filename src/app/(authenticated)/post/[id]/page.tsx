import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
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

  // 2. Format date
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-border bg-card shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4 p-4">
          <Avatar>
            <AvatarImage src={post.author.image ?? undefined} />
            <AvatarFallback>
              {post.author.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{post.author.name}</span>
            <span className="text-muted-foreground text-xs">{timeAgo}</span>
          </div>
          <Button className="ml-auto" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {post.content && (
            <p className="whitespace-pre-wrap text-foreground text-sm leading-relaxed">
              {post.content}
            </p>
          )}

          {post.images.length > 0 && (
            <div className="mt-4 flex flex-col gap-4">
              {/* Note: In US3 we will implement the carousel here. 
                  For now, we just list images if they exist. */}
              {post.images.map((image) => (
                <div
                  className="relative w-full overflow-hidden rounded-md border border-border"
                  key={image.id}
                >
                  <img
                    alt="Post content"
                    className="w-full object-cover"
                    src={image.url}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between border-border/50 border-t p-2">
          <Button
            className="gap-2 text-muted-foreground"
            size="sm"
            variant="ghost"
          >
            <Heart className="h-4 w-4" />
            <span>0</span>
          </Button>
          <Button
            className="gap-2 text-muted-foreground"
            size="sm"
            variant="ghost"
          >
            <MessageCircle className="h-4 w-4" />
            <span>0</span>
          </Button>
          <Button
            className="gap-2 text-muted-foreground"
            size="sm"
            variant="ghost"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="py-8 text-center">
        <p className="text-muted-foreground text-sm italic">
          Comments section coming soon...
        </p>
      </div>
    </div>
  );
}
