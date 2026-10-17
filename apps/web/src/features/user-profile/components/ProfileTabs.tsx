"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProfileTab, ProfileTabsProps } from "../types";

const tabs: { id: ProfileTab; label: string }[] = [
  { id: "posts", label: "Posts" },
  { id: "shorts", label: "Shorts" },
  { id: "tags", label: "Tags" },
  { id: "activity", label: "Activity" },
];

/**
 * Tab navigation component for the profile page.
 * Uses Shadcn Tabs component for consistent styling.
 */
export const ProfileTabs = ({ activeTab, onTabChange }: ProfileTabsProps) => {
  return (
    <Tabs
      onValueChange={(value) => onTabChange(value as ProfileTab)}
      value={activeTab}
    >
      <TabsList className="grid w-full grid-cols-4 rounded-none border-b bg-transparent p-0">
        {tabs.map((tab) => (
          <TabsTrigger
            className="rounded-none border-transparent border-b-2 px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground"
            key={tab.id}
            value={tab.id}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
