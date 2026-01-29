"use client";

import { Check, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { SocialItem } from "../types";

/**
 * Props for the SocialRequestItem component.
 */
interface SocialRequestItemProps {
  /** The social request data */
  request: SocialItem;
}

/**
 * A horizontal item representing a pending friend or follow request.
 */
export const SocialRequestItem = ({ request }: SocialRequestItemProps) => {
  return (
    <div className="group flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-accent/50">
      <Avatar className="h-10 w-10 border border-background shadow-sm">
        <AvatarImage alt={request.name} src={request.avatar} />
        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <h4 className="mb-1 truncate font-semibold text-sm leading-none">
          {request.name}
        </h4>
        <p className="truncate text-2xs text-muted-foreground italic">
          wants to add you
        </p>
      </div>

      <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          className="h-7 w-7 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => console.log(`Accepted: ${request.name}`)}
          size="icon"
          variant="secondary"
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          className="h-7 w-7 rounded-full bg-muted/50 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
          onClick={() => console.log(`Declined: ${request.name}`)}
          size="icon"
          variant="secondary"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};
