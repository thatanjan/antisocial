import { Button } from "@/components/ui/button";
import { userSuggestions } from "../utils/mock-data";
import { SearchBar } from "./SearchBar";
import { UserSuggestionItem } from "./UserSuggestionItem";

/**
 * The Right Sidebar component containing search, friend requests, and user suggestions.
 */
export const RightSidebar = () => {
  return (
    <aside className="w-col-side min-w-col max-w-col-side border-border bg-card/30 fixed top-0 z-30 hidden h-screen flex-col overflow-hidden border-l backdrop-blur-md xl:flex">
      <div className="flex flex-col gap-8 p-6">
        {/* Search Section */}
        <section>
          <SearchBar />
        </section>

        {/* User Suggestions Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold tracking-tight">
              Suggestions for you
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            {userSuggestions.map((suggestion) => (
              <UserSuggestionItem key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>

          <Button
            className="text-muted-foreground w-full text-xs transition-colors"
            size="sm"
            variant="ghost"
          >
            Show More
          </Button>
        </section>

        {/* Footer Placeholders */}
        <footer className="border-border/50 mt-auto border-t pt-8">
          <div className="flex flex-wrap gap-x-4 gap-y-1 px-2">
            {[
              "About",
              "Accessibility",
              "Help Center",
              "Privacy & Terms",
              "Advertising",
            ].map((link) => (
              <button
                className="text-2xs text-muted-foreground hover:text-primary transition-colors hover:underline"
                key={link}
                type="button"
              >
                {link}
              </button>
            ))}
          </div>
          <p className="text-2xs text-muted-foreground/60 mt-4 px-2 italic">
            © 2026 Antisocial Inc.
          </p>
        </footer>
      </div>
    </aside>
  );
};
