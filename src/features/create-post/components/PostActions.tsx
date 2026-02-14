"use client";

import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeletePostDialog } from "./DeletePostDialog";
import { EditPostDialog } from "./EditPostDialog";

interface PostImage {
  id: string;
  url: string;
}

interface Post {
  id: string;
  content: string | null;
  images: PostImage[];
}

interface PostActionsProps {
  post: Post;
}

/**
 * Dropdown menu for post actions (Edit, Delete).
 * Only renders the trigger and handles the state for action dialogs.
 */
export function PostActions({ post }: PostActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-auto" size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            <span>Edit Post</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Post</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPostDialog
        onOpenChange={setShowEditDialog}
        open={showEditDialog}
        post={post}
      />

      <DeletePostDialog
        onOpenChange={setShowDeleteDialog}
        open={showDeleteDialog}
        postId={post.id}
      />
    </>
  );
}
