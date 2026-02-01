"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPostAction } from "../actions";
import { type CreatePostSchema, createPostSchema } from "../schemas";

/**
 * Modal component for creating a new post.
 * Initially supports text content for US1.
 */
export function PostCreationModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      aspectRatio: "1:1", // Default to 1:1 for now
      images: [],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = form;

  const contentValue = watch("content") || "";
  const charCount = contentValue.length;

  const onSubmit = (data: CreatePostSchema) => {
    startTransition(async () => {
      const result = await createPostAction(data);

      if (result.success) {
        toast.success("Post created successfully!");
        setOpen(false);
        reset();
        router.push(`/post/${result.postId}`);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share your thoughts with the community. Max 1000 characters.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="content">Description</Label>
              <Textarea
                className="min-h-[150px] resize-none"
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

            {/* TODO: ImageUploader (US2) will be integrated here */}
          </div>

          <DialogFooter>
            <Button
              className="w-full sm:w-auto"
              disabled={isPending}
              type="submit"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Creating..." : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
