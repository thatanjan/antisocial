import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getSession } from "@/lib/session";
import type { MockUser } from "../types";
import { currentUser as dummyUser } from "../utils/mock-data";

/**
 * Displays a summary of the user's profile.
 * Server component that fetches the session directly.
 */
export const ProfileSummary = async () => {
  const session = await getSession();

  // Map session user to MockUser interface, falling back to dummy data
  const user: MockUser = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        handle: `@${session.user.name.toLowerCase().replace(/\s/g, "")}`,
        avatar:
          session.user.image ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
        location: "Global Wanderer", // Dummy as it's not in DB yet
        stats: {
          posts: 0, // Dummy for now
          followers: 0,
          following: 0,
        },
      }
    : dummyUser;

  return (
    <Link
      className="block rounded-2xl border border-border bg-card p-5"
      href={`/profile/${user.id}`}
    >
      <div className="mb-4 flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage alt={user.name} src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div>
          <h3 className="font-medium text-base">{user.name}</h3>
          <p className="text-muted-foreground text-sm">{user.handle}</p>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <div className="flex-1 text-center">
          <p className="font-medium">{formatCount(user.stats.posts)}</p>
          <p className="text-muted-foreground text-xs">Posts</p>
        </div>
        <div className="flex-1 border-border border-x text-center">
          <p className="font-medium">{formatCount(user.stats.followers)}</p>
          <p className="text-muted-foreground text-xs">Followers</p>
        </div>
        <div className="flex-1 text-center">
          <p className="font-medium">{formatCount(user.stats.following)}</p>
          <p className="text-muted-foreground text-xs">Following</p>
        </div>
      </div>
    </Link>
  );
};

/**
 * Helper to format large numbers (e.g., 122100 -> 122.1K)
 */
const formatCount = (count: number): string => {
  if (count >= 1000000)
    return `${(count / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return count.toString();
};
