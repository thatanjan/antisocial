import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Share2 } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { LikeButton } from "@/features/likes/components/LikeButton";
import type { AspectRatio, Post } from "../types";
import { CarouselDisplay } from "./CarouselDisplay";
import { CollapsibleDescription } from "./CollapsibleDescription";
import { PostActions } from "./PostActions";

interface PostCardProps {
  post: Post;
  currentUserId: string;
}

/**
 * Main component to display a post in the feed or detail page.
 * Combines author info, images (in a carousel), and collapsible description.
 */
export function PostCard({ post, currentUserId }: PostCardProps) {
  const isOwner = currentUserId === post.author.id;
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Link href={`/profile/${post.author.id}`}>
          <Avatar>
            <AvatarImage src={post.author.image ?? undefined} />
            <AvatarFallback>
              {post.author.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex flex-col">
          <Link className="hover:underline" href={`/profile/${post.author.id}`}>
            <span className="font-semibold text-sm">{post.author.name}</span>
          </Link>
          <span className="text-muted-foreground text-xs">{timeAgo}</span>
        </div>
        {isOwner && <PostActions post={post} />}
      </CardHeader>

      <CardContent className="space-y-4 p-4 pt-0">
        {post.images.length > 0 && (
          <CarouselDisplay
            aspectRatio={(post.aspectRatio as AspectRatio) || "1:1"}
            images={post.images}
          />
        )}

        {post.content && <CollapsibleDescription content={post.content} />}
      </CardContent>

      <CardFooter className="flex items-center justify-between border-border/50 border-t p-2">
        <div className="flex items-center gap-1">
          <LikeButton
            initialIsLiked={!!post.isLiked}
            initialLikeCount={post.likeCount}
            postId={post.id}
          />
          <Button
            className="gap-2 text-muted-foreground hover:text-primary"
            size="sm"
            variant="ghost"
          >
            <MessageCircle className="h-4 w-4" />
            <span>0</span>
          </Button>
        </div>
        <Button
          className="gap-2 text-muted-foreground"
          size="sm"
          variant="ghost"
        >
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
