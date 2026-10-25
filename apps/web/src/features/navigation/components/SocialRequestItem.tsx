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
    <div className="group hover:bg-accent/50 flex items-center gap-3 rounded-xl p-3 transition-colors">
      <Avatar className="border-background h-10 w-10 border shadow-sm">
        <AvatarImage alt={request.name} src={request.avatar} />
        <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <h4 className="mb-1 truncate text-sm leading-none font-semibold">
          {request.name}
        </h4>
        <p className="text-2xs text-muted-foreground truncate italic">
          wants to add you
        </p>
      </div>

      <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground h-7 w-7 rounded-full"
          onClick={() => console.log(`Accepted: ${request.name}`)}
          size="icon"
          variant="secondary"
        >
          <Check className="h-3.5 w-3.5" />
        </Button>
        <Button
          className="bg-muted/50 text-muted-foreground hover:bg-destructive hover:text-destructive-foreground h-7 w-7 rounded-full"
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
