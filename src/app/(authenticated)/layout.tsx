import type { Metadata } from "next";
import { LeftSidebar } from "@/features/navigation/components/LeftSidebar";
import { MobileNav } from "@/features/navigation/components/MobileNav";
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
      <MobileNav />

      {/* Main Grid Layout */}
      <div className="mx-auto flex w-full max-w-layout justify-center lg:gap-6">
        {/* Left Sidebar - Hidden on mobile, handled by LeftSidebar css classes */}
        <LeftSidebar />

        {/* Main Content Area */}
        <main className="flex h-full w-full min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 lg:max-w-3xl lg:px-8 lg:py-8">
          {children}
        </main>

        {/* Right Sidebar - Hidden on mobile/tablet, handled by RightSidebar css classes */}
        <RightSidebar />
      </div>
    </div>
  );
}
