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

        {/* Left Dummy Spacer */}
        <div className="hidden min-w-col shrink-0 md:block lg:w-col-side lg:max-w-col-side" />

        {/* Main Content Area */}
        <main className="mr-6 flex h-full w-full min-w-col flex-1 flex-col py-6 lg:py-8 xl:mr-0">
          {children}
        </main>

        {/* Right Dummy Spacer */}
        <div className="hidden w-col-side max-w-col-side shrink-0 xl:block" />

        {/* Right Sidebar - Hidden on mobile/tablet, handled by RightSidebar css classes */}
        <RightSidebar />
      </div>
    </div>
  );
}
