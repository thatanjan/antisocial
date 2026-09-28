"use client";

import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

const MobileNavSheetContent = dynamic(() => import("./MobileNavSheetContent"));

type MobileNavProps = {
  profileSummary: React.ReactNode;
};

/**
 * Mobile Navigation component using a Sheet (Drawer) to display
 * sidebars on smaller screens.
 */
export const MobileNav = ({ profileSummary }: MobileNavProps) => {
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
          <MobileNavSheetContent profileSummary={profileSummary} />
        </Sheet>
        <span className="font-bold text-lg tracking-tight">Antisocial</span>
      </div>
    </div>
  );
};
