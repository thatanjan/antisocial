"use client";

import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { SocialItem } from "../types";

/**
 * Props for the UserSuggestionItem component.
 */
interface UserSuggestionItemProps {
  /** The suggested user data */
  suggestion: SocialItem;
}

/**
 * A horizontal item representing a suggested user to follow.
 */
export const UserSuggestionItem = ({ suggestion }: UserSuggestionItemProps) => {
  return (
    <div className="group hover:bg-accent/50 flex items-center gap-3 rounded-xl p-3 transition-colors">
      <Avatar className="border-background h-10 w-10 border shadow-sm">
        <AvatarImage alt={suggestion.name} src={suggestion.avatar} />
        <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <h4 className="mb-1 truncate text-sm leading-none font-semibold">
          {suggestion.name}
        </h4>
        <p className="text-2xs text-muted-foreground truncate">
          {suggestion.handle}
        </p>
      </div>

      <Button
        className="text-primary hover:bg-primary/10 hover:text-primary group-hover:bg-primary/5 h-8 w-8 rounded-full transition-all"
        onClick={() => console.log(`Followed: ${suggestion.name}`)}
        size="icon"
        variant="ghost"
      >
        <UserPlus className="h-4 w-4" />
      </Button>
    </div>
  );
};
