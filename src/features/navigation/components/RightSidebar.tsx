import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socialRequests, userSuggestions } from "../utils/mock-data";
import { SearchBar } from "./SearchBar";
import { SocialRequestItem } from "./SocialRequestItem";
import { UserSuggestionItem } from "./UserSuggestionItem";

/**
 * The Right Sidebar component containing search, friend requests, and user suggestions.
 */
export const RightSidebar = () => {
  return (
    <aside className="sticky top-0 hidden h-screen w-sidebar-right flex-col overflow-hidden border-border border-l bg-card/30 backdrop-blur-md xl:flex">
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-8 p-6">
          {/* Search Section */}
          <section>
            <SearchBar />
          </section>

          {/* Social Requests Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-bold text-sm tracking-tight">Requests</h2>
              {socialRequests.length > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-bold text-2xs text-primary">
                  {socialRequests.length}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              {socialRequests.map((request) => (
                <SocialRequestItem key={request.id} request={request} />
              ))}
              {socialRequests.length === 0 && (
                <p className="py-4 text-center text-muted-foreground text-xs">
                  No pending requests
                </p>
              )}
            </div>

            <Button
              className="w-full text-muted-foreground text-xs transition-colors hover:text-primary"
              size="sm"
              variant="ghost"
            >
              View All
            </Button>
          </section>

          {/* User Suggestions Section */}
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="font-bold text-sm tracking-tight">
                Suggestions for you
              </h2>
            </div>

            <div className="flex flex-col gap-1">
              {userSuggestions.map((suggestion) => (
                <UserSuggestionItem
                  key={suggestion.id}
                  suggestion={suggestion}
                />
              ))}
            </div>

            <Button
              className="w-full text-muted-foreground text-xs transition-colors hover:text-primary"
              size="sm"
              variant="ghost"
            >
              Show More
            </Button>
          </section>

          {/* Footer Placeholders */}
          <footer className="mt-auto border-border/50 border-t pt-8">
            <div className="flex flex-wrap gap-x-4 gap-y-1 px-2">
              {[
                "About",
                "Accessibility",
                "Help Center",
                "Privacy & Terms",
                "Advertising",
              ].map((link) => (
                <button
                  className="text-2xs text-muted-foreground transition-colors hover:text-primary hover:underline"
                  key={link}
                  type="button"
                >
                  {link}
                </button>
              ))}
            </div>
            <p className="mt-4 px-2 text-2xs text-muted-foreground/60 italic">
              © 2026 Antisocial Inc.
            </p>
          </footer>
        </div>
      </ScrollArea>
    </aside>
  );
};
