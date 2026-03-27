"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PostList } from "@/features/create-post/components/PostList";
import type { Post } from "@/features/create-post/types";
import type { ProfileTab } from "../types";
import { ProfileTabs } from "./ProfileTabs";

const isProfileTab = (value: string): value is ProfileTab => {
  return ["posts", "shorts", "tags", "activity"].includes(value);
};

interface ProfileTabContentProps {
  /** User's posts */
  posts: Post[];
  /** Current user ID for post interactions */
  currentUserId: string;
}

/**
 * Client component that handles tab navigation via URL search parameters.
 * Reads the active tab from ?tab= query parameter and updates URL on tab change.
 */
export const ProfileTabContent = ({
  posts,
  currentUserId,
}: ProfileTabContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const activeTab: ProfileTab =
    tabParam && isProfileTab(tabParam) ? tabParam : "posts";

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
        {activeTab === "posts" && (
          <PostList currentUserId={currentUserId} initialPosts={posts} />
        )}

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
