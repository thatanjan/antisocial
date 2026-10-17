"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CollapsibleDescriptionProps {
  content: string;
  maxLength?: number;
}

/**
 * Component to display post content with a "See more" toggle.
 * Initially shows only the first 2 lines or a character limit.
 */
export function CollapsibleDescription({
  content,
  maxLength = 150,
}: CollapsibleDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Simple heuristic for "long" content
  const shouldCollapse = content.length > maxLength;
  const displayedContent =
    !shouldCollapse || isExpanded
      ? content
      : `${content.slice(0, maxLength)}...`;

  return (
    <div className="space-y-1">
      <p
        className={cn(
          "whitespace-pre-wrap text-sm leading-relaxed transition-all duration-200",
          !isExpanded && "text-foreground",
        )}
      >
        {displayedContent}
        {shouldCollapse && !isExpanded && (
          <button
            className="ml-1 font-semibold text-primary hover:underline focus:outline-none"
            onClick={() => setIsExpanded(true)}
            type="button"
          >
            See more
          </button>
        )}
      </p>
      {isExpanded && (
        <button
          className="font-semibold text-muted-foreground text-xs hover:underline focus:outline-none"
          onClick={() => setIsExpanded(false)}
          type="button"
        >
          Show less
        </button>
      )}
    </div>
  );
}
