"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

/**
 * A search input component with an icon.
 */
export const SearchBar = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="group relative">
      <Search className="text-muted-foreground group-focus-within:text-primary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transition-colors" />
      <Input
        className="bg-accent/30 focus-visible:ring-primary h-10 rounded-xl border-none pl-10 shadow-sm focus-visible:ring-1"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for people, posts..."
        type="text"
        value={query}
      />
    </div>
  );
};
