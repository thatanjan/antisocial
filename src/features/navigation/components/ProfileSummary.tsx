import { MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { MockUser } from "../types";

/**
 * Props for the ProfileSummary component.
 */
interface ProfileSummaryProps {
  /** The user data to display */
  user: MockUser;
}

/**
 * Displays a summary of the user's profile including avatar, name, and social metrics.
 */
export const ProfileSummary = ({ user }: ProfileSummaryProps) => {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 shadow-sm">
      <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
        <AvatarImage alt={user.name} src={user.avatar} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="mt-4 text-center">
        <h3 className="max-w-social-name truncate font-bold text-lg">
          {user.name}
        </h3>
        <p className="text-muted-foreground text-xs">{user.handle}</p>
      </div>

      <div className="mt-2 flex items-center gap-1 rounded-full bg-secondary/50 px-2 py-1 text-2xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span className="max-w-social-name truncate">{user.location}</span>
      </div>

      <div className="mt-8 grid w-full grid-cols-3 gap-4 border-border/50 border-t pt-6">
        <div className="text-center">
          <p className="font-bold text-sm">{formatCount(user.stats.posts)}</p>
          <p className="text-2xs text-muted-foreground uppercase tracking-wider">
            Posts
          </p>
        </div>
        <div className="border-border/50 border-x text-center">
          <p className="font-bold text-sm">
            {formatCount(user.stats.followers)}
          </p>
          <p className="text-2xs text-muted-foreground uppercase tracking-wider">
            Followers
          </p>
        </div>
        <div className="text-center">
          <p className="font-bold text-sm">
            {formatCount(user.stats.following)}
          </p>
          <p className="text-2xs text-muted-foreground uppercase tracking-wider">
            Following
          </p>
        </div>
      </div>
    </div>
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
