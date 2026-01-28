import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { currentUser, navItems } from "../utils/mock-data";
import { NavLinkItem } from "./NavLinkItem";
import { ProfileSummary } from "./ProfileSummary";

/**
 * Props for the LeftSidebar component.
 */
interface LeftSidebarProps {
  /** Optional class name for the outer container */
  className?: string;
}

/**
 * The Left Sidebar component which contains the user profile summary
 * and the main navigation links.
 */
export const LeftSidebar = ({ className }: LeftSidebarProps) => {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden bg-card/30 backdrop-blur-md",
        className,
      )}
    >
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-6 p-6">
          {/* Brand/Logo Area placeholder if needed */}
          <div className="px-2 py-4">
            <h1 className="font-bold text-2xl text-primary tracking-tighter">
              Antisocial
            </h1>
          </div>

          {/* Profile Section */}
          <ProfileSummary user={currentUser} />

          {/* Navigation Section */}
          <nav className="mt-4 flex flex-col gap-2">
            <p className="mb-2 px-4 font-semibold text-muted-foreground text-xs uppercase tracking-widest">
              Menu
            </p>
            {navItems.map((item) => (
              <NavLinkItem item={item} key={item.href} />
            ))}
          </nav>
        </div>
      </ScrollArea>
    </div>
  );
};
