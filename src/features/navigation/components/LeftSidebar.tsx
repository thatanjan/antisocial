import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { PostCreationModal } from "@/features/create-post/components/PostCreationModal";
import { navItems } from "../utils/mock-data";
import { NavLinkItem } from "./NavLinkItem";
import { ProfileSummary } from "./ProfileSummary";

/**
 * The Left Sidebar component which contains the user profile summary
 * and the main navigation links.
 */
export const LeftSidebar = () => {
  return (
    <aside className="fixed top-0 z-30 hidden h-screen min-w-col flex-col overflow-hidden border-border border-r bg-card/30 backdrop-blur-md md:flex lg:w-col-side lg:max-w-col-side">
      <div className="flex grow flex-col gap-6 p-6 pb-20">
        {/* Brand/Logo Area placeholder if needed */}
        <div className="px-2 py-4">
          <h1 className="font-bold text-2xl text-primary tracking-tighter">
            Antisocial
          </h1>
        </div>

        {/* Profile Section */}
        <ProfileSummary />

        {/* Navigation Section */}
        <nav className="mt-4 flex flex-col gap-2">
          <p className="mb-2 px-4 font-semibold text-2xs text-muted-foreground uppercase tracking-widest">
            Menu
          </p>
          {navItems.map((item) => (
            <NavLinkItem item={item} key={item.href} />
          ))}
        </nav>

        {/* Create Post Button Section */}
        <div className="mt-4 px-2">
          <PostCreationModal className="w-full justify-start rounded-xl py-6 shadow-md" />
        </div>

        {/* Logout Section */}
        <div className="mt-auto px-2">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
};
