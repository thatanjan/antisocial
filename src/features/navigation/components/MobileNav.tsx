"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  currentUser,
  navItems,
  socialRequests,
  userSuggestions,
} from "../utils/mock-data";
import { NavLinkItem } from "./NavLinkItem";
import { ProfileSummary } from "./ProfileSummary";
import { SearchBar } from "./SearchBar";
import { SocialRequestItem } from "./SocialRequestItem";
import { UserSuggestionItem } from "./UserSuggestionItem";

/**
 * Mobile Navigation component using a Sheet (Drawer) to display
 * sidebars on smaller screens.
 */
export const MobileNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-border border-b bg-background/80 px-4 py-3 backdrop-blur-md lg:hidden">
      <div className="flex items-center gap-2">
        <Sheet onOpenChange={setOpen} open={open}>
          <SheetTrigger asChild>
            <Button className="-ml-2" size="icon" variant="ghost">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] p-0 sm:w-[350px]" side="left">
            <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu for accessing profile, links, and social features.
            </SheetDescription>
            <ScrollArea className="h-full">
              <div className="flex flex-col gap-6 p-6">
                <div className="px-2">
                  <h2 className="font-bold text-primary text-xl tracking-tighter">
                    Antisocial
                  </h2>
                </div>

                <ProfileSummary user={currentUser} />

                <nav className="flex flex-col gap-1">
                  <p className="mb-2 px-4 font-semibold text-2xs text-muted-foreground uppercase tracking-widest">
                    Menu
                  </p>
                  {navItems.map((item) => (
                    <NavLinkItem item={item} key={item.href} />
                  ))}
                </nav>

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
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg tracking-tight">Antisocial</span>
      </div>
    </div>
  );
};
