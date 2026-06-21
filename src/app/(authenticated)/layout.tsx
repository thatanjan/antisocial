import type { Metadata } from "next";
import { LeftSidebar } from "@/features/navigation/components/LeftSidebar";
import { MobileNav } from "@/features/navigation/components/MobileNav";
import { ProfileSummary } from "@/features/navigation/components/ProfileSummary";
import { RightSidebar } from "@/features/navigation/components/RightSidebar";

export const metadata: Metadata = {
  title: "Feed | Antisocial",
  description: "Your social feed",
};

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Mobile Navigation Header */}
      <MobileNav profileSummary={<ProfileSummary />} />

      {/* Main Grid Layout */}
      <div className="mx-4 flex w-full max-w-layout justify-center lg:mx-auto lg:gap-6">
        {/* Left Sidebar - Hidden on mobile, handled by LeftSidebar css classes */}
        <LeftSidebar />

        {/* Main Content Area */}
        <main className="flex h-full w-full min-w-col flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8 lg:pl-col-side xl:pr-col-side">
          {children}
        </main>

        {/* Right Sidebar - Hidden on mobile/tablet, handled by RightSidebar css classes */}
        <RightSidebar />
      </div>
    </div>
  );
}
