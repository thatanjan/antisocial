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
import { cn } from "@/lib/utils";
import { createPostAction } from "../actions";
import { type CreatePostSchema, createPostSchema } from "../schemas";
import type { AspectRatio, ImageKitUploadResponse } from "../types";
import { compressImage } from "../utils/image-compression";
import { ImageUploader } from "./ImageUploader";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
const AUTH_ENDPOINT = "/api/upload-auth";

/**
 * Modal component for creating a new post.
 * Handles deferred image uploads to ImageKit upon post submission.
 */
export function PostCreationModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const router = useRouter();

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      aspectRatio: "1:1",
      images: [],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = form;

  const contentValue = watch("content") || "";
  const aspectRatio = watch("aspectRatio") as AspectRatio;
  const charCount = contentValue.length;

  const uploadImagesToImageKit = async (
    files: File[],
    postId: string,
  ): Promise<ImageKitUploadResponse[]> => {
    if (!PUBLIC_KEY) throw new Error("ImageKit public key is not configured.");

    const uploadPromises = files.map(async (file) => {
      // 1. Compress Image
      const compressedFile = await compressImage(file);

      // 2. Get Auth Params
      const authRes = await fetch(AUTH_ENDPOINT);
      const authData = await authRes.json();

      // 3. Upload to ImageKit
      const formData = new FormData();
      formData.append("file", compressedFile);
      formData.append(
        "fileName",
        `post_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`,
      );
      formData.append("publicKey", PUBLIC_KEY);
      formData.append("signature", authData.signature);
      formData.append("expire", authData.expire.toString());
      formData.append("token", authData.token);
      formData.append("useUniqueFileName", "true");
      formData.append("folder", `/posts/${postId}`);

      const uploadRes = await fetch(
        `https://upload.imagekit.io/api/v1/files/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      return (await uploadRes.json()) as ImageKitUploadResponse;
    });

    return Promise.all(uploadPromises);
  };

  const onSubmit = (data: CreatePostSchema) => {
    startTransition(async () => {
      try {
        let finalImages = data.images;
        // Pre-generate the post ID to use for folder structure
        const generatedPostId = crypto
          .randomUUID()
          .replace(/-/g, "")
          .substring(0, 24);

        // Perform uploads if there are local files selected
        if (selectedFiles.length > 0) {
          toast.loading("Uploading images...", { id: "posting-status" });
          const uploadedResults = await uploadImagesToImageKit(
            selectedFiles,
            generatedPostId,
          );
          finalImages = uploadedResults.map((img, index) => ({
            url: img.url,
            fileId: img.fileId,
            orderIndex: index,
          }));
          toast.success("Images uploaded!", { id: "posting-status" });
        }

        const result = await createPostAction({
          ...data,
          id: generatedPostId,
          images: finalImages,
        });

        if (result.success) {
          toast.success("Post created successfully!");
          setOpen(false);
          reset();
          setSelectedFiles([]);
          router.push(`/post/${result.postId}`);
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        console.error("Submission failed:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.";
        toast.error(errorMessage);
      }
    });
  };

  const handleFilesChange = (files: File[]) => {
    setSelectedFiles(files);
    // Sync with form for validation (min count if needed)
    // We set dummy data to satisfy the schema's image array requirement if there is any,
    // though the actual data will be set on submit.
    // For now, our schema allows optional content/images as long as one exists.
    // We need to make sure the schema doesn't fail just because files haven't been uploaded yet.
    // Actually, let's keep the form thinking it has images so validation passes.
    setValue(
      "images",
      files.map((_, i) => ({
        url: "pending",
        fileId: "pending",
        orderIndex: i,
      })),
      { shouldValidate: true },
    );
  };

  const handleAspectRatioChange = (ratio: AspectRatio) => {
    setValue("aspectRatio", ratio);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form className="relative" onSubmit={handleSubmit(onSubmit)}>
          {isPending && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="font-medium text-xs">
                  Processing your post...
                </span>
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
            <DialogDescription>
              Share your thoughts and photos with the community.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="content">Description</Label>
              <Textarea
                className="min-h-[120px] resize-none"
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

            <div className={cn(isPending && "pointer-events-none opacity-50")}>
              <ImageUploader
                aspectRatio={aspectRatio}
                onAspectRatioChange={handleAspectRatioChange}
                onFilesChange={handleFilesChange}
              />
            </div>
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
