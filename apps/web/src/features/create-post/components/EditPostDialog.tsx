"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import NextImage from "next/image";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { updatePostAction } from "../actions";
import { type UpdatePostSchema, updatePostSchema } from "../schemas";

interface PostImage {
  id: string;
  url: string;
}

interface Post {
  id: string;
  content: string | null;
  images: PostImage[];
}

interface EditPostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Dialog component for editing an existing post's text.
 * Displays a small preview of existing images (non-editable).
 * Uses updatePostAction for persisting changes.
 */
export function EditPostDialog({
  post,
  open,
  onOpenChange,
}: EditPostDialogProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<UpdatePostSchema>({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      postId: post.id,
      content: post.content || "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const contentValue = watch("content") || "";
  const charCount = contentValue.length;

  const onSubmit = (data: UpdatePostSchema) => {
    startTransition(async () => {
      try {
        const result = await updatePostAction(data);

        if (result.success) {
          toast.success("Post updated successfully!");
          onOpenChange(false);
        } else {
          toast.error(result.error || "Failed to update post");
        }
      } catch (error) {
        console.error("Update failed:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
              Update your post's text. You cannot change the images.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Image Preview Section */}
            {post.images.length > 0 && (
              <div className="flex flex-col gap-2">
                <Label>Images</Label>
                <ScrollArea className="w-full whitespace-nowrap rounded-md border p-2">
                  <div className="flex w-max space-x-2">
                    {post.images.map((image) => (
                      <div
                        className="relative h-20 w-20 overflow-hidden rounded-md border"
                        key={image.id}
                      >
                        <NextImage
                          alt="Post preview"
                          className="object-cover"
                          fill
                          sizes="80px"
                          src={image.url}
                        />
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="content">Description</Label>
              <Textarea
                className="min-h-[150px] resize-none"
                disabled={isPending}
                id="content"
                placeholder="What's on your mind?"
                {...register("content")}
              />
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span className={errors.content ? "text-destructive" : ""}>
                  {errors.content?.message || ""}
                </span>
                <span
                  className={
                    charCount > 1000 ? "font-bold text-destructive" : ""
                  }
                >
                  {charCount}/1000
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full sm:w-auto"
              disabled={isPending}
              type="submit"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
