"use client";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deletePostAction } from "../actions";

interface DeletePostDialogProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Confirmation dialog for deleting a post.
 * Uses deletePostAction and handles loading/error states.
 */
export function DeletePostDialog({
  postId,
  open,
  onOpenChange,
}: DeletePostDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deletePostAction(postId);

        if (result.success) {
          toast.success("Post deleted successfully!");
          onOpenChange(false);
        } else {
          toast.error(result.error || "Failed to delete post");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        toast.error("An unexpected error occurred. Please try again.");
      }
    });
  };

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your post
            and remove the images from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Deleting..." : "Delete Post"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
