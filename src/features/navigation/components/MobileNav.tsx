import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { PostCreationModal } from "@/features/create-post/components/PostCreationModal";
import { navItems, socialRequests, userSuggestions } from "../utils/mock-data";
import { NavLinkItem } from "./NavLinkItem";
import { SearchBar } from "./SearchBar";
import { SocialRequestItem } from "./SocialRequestItem";
import { UserSuggestionItem } from "./UserSuggestionItem";

/**
 * Mobile Navigation component using a Sheet (Drawer) to display
 * sidebars on smaller screens.
 */
export const MobileNav = ({
  profileSummary,
}: {
  profileSummary: React.ReactNode;
}) => {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-border border-b bg-background/80 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="-ml-2" size="icon" variant="ghost">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            className="min-w-full max-w-none p-0 md:hidden"
            showCloseButton={false}
            side="left"
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Mobile Navigation</SheetTitle>
              <SheetDescription>
                Navigation menu for accessing profile, links, and social
                features.
              </SheetDescription>
            </SheetHeader>
            <SheetClose asChild>
              <Button
                className="absolute top-4 right-4 z-10"
                size="icon"
                variant="ghost"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </SheetClose>
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-6 p-6">
                <div className="px-2">
                  <h2 className="font-bold text-primary text-xl tracking-tighter">
                    Antisocial
                  </h2>
                </div>

                {profileSummary}

                <nav className="flex flex-col gap-1">
                  <p className="mb-2 px-4 font-semibold text-2xs text-muted-foreground uppercase tracking-widest">
                    Menu
                  </p>
                  {navItems.map((item) => (
                    <NavLinkItem item={item} key={item.href} />
                  ))}
                </nav>

                <div className="px-4">
                  <PostCreationModal className="w-full justify-start rounded-xl py-6" />
                </div>

                <div className="border-border/50 border-t pt-6">
                  <p className="mb-4 px-4 font-semibold text-2xs text-muted-foreground uppercase tracking-widest">
                    Social
                  </p>
                  <div className="flex flex-col gap-4">
                    <SearchBar />

                    {/* Mobile compacted requests view */}
                    {socialRequests.length > 0 && (
                      <div className="flex flex-col gap-2">
                        <h3 className="px-2 font-medium text-xs">Requests</h3>
                        {socialRequests.slice(0, 2).map((req) => (
                          <SocialRequestItem key={req.id} request={req} />
                        ))}
                      </div>
                    )}

                    {/* Mobile compacted suggestions view */}
                    <div className="flex flex-col gap-2">
                      <h3 className="px-2 font-medium text-xs">Suggestions</h3>
                      {userSuggestions.slice(0, 2).map((sugg) => (
                        <UserSuggestionItem key={sugg.id} suggestion={sugg} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-border/50 border-t pt-6">
                  <LogoutButton />
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg tracking-tight">Antisocial</span>
      </div>
    </div>
  );
};
