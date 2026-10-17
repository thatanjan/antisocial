"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { PostList } from "@/features/create-post/components/PostList";
import type { Post } from "@/features/create-post/types";
import { getUserPosts } from "../actions/get-user-posts";
import type { ProfileTab } from "../types";
import { ProfileTabs } from "./ProfileTabs";

const isProfileTab = (value: string): value is ProfileTab => {
  return ["posts", "shorts", "tags", "activity"].includes(value);
};

interface ProfileTabContentProps {
  /** The profile user's ID for fetching posts */
  profileUserId: string;
  /** Current user ID for post interactions */
  currentUserId: string;
}

/**
 * Client component that handles tab navigation via URL search parameters.
 * Reads the active tab from ?tab= query parameter and updates URL on tab change.
 * Fetches posts with pagination support using PostList component.
 */
export const ProfileTabContent = ({
  profileUserId,
  currentUserId,
}: ProfileTabContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const activeTab: ProfileTab =
    tabParam && isProfileTab(tabParam) ? tabParam : "posts";

  useEffect(() => {
    async function fetchInitialPosts() {
      const result = await getUserPosts({ userId: profileUserId });
      setPosts(result.posts);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
      setIsLoading(false);
    }

    fetchInitialPosts();
  }, [profileUserId]);

  const loadMore = () => {
    startTransition(async () => {
      const result = await getUserPosts({
        userId: profileUserId,
        cursor: cursor ?? undefined,
      });
      setPosts((prev) => [...prev, ...result.posts]);
      setCursor(result.nextCursor);
      setHasMore(result.hasMore);
    });
  };

  const handleTabChange = (tab: ProfileTab) => {
    const params = new URLSearchParams(searchParams);
    if (tab === "posts") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const query = params.toString();
    const newUrl = query ? `${pathname}?${query}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  return (
    <>
      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="mt-4">
        {activeTab === "posts" &&
          (isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <PostList currentUserId={currentUserId} initialPosts={posts} />
              {hasMore && (
                <div className="flex justify-center py-4">
                  <button
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
                    disabled={isPending}
                    onClick={loadMore}
                    type="button"
                  >
                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {isPending ? "Loading..." : "Load More"}
                  </button>
                </div>
              )}
            </>
          ))}

        {activeTab === "shorts" && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
            <h3 className="font-semibold text-lg">No shorts yet</h3>
            <p className="text-muted-foreground text-sm">Shorts coming soon!</p>
          </div>
        )}

        {activeTab === "tags" && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
            <h3 className="font-semibold text-lg">No tags yet</h3>
            <p className="text-muted-foreground text-sm">Tags coming soon!</p>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-border border-dashed py-12 text-center">
            <h3 className="font-semibold text-lg">No activity yet</h3>
            <p className="text-muted-foreground text-sm">
              Activity coming soon!
            </p>
          </div>
        )}
      </div>
    </>
  );
};
