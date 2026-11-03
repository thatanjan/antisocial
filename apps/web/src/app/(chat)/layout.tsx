import type { Metadata } from "next";
import { ChatComposerProvider } from "@/features/chat/components/ChatComposerProvider";
import { ChatListShell } from "@/features/chat/components/ChatListShell";

export const metadata: Metadata = {
  title: "Chats | Antisocial",
  description: "Browse sample conversations",
};

interface ChatLayoutProps {
  children: React.ReactNode;
  params?: Promise<{ id?: string }>;
}

/**
 * Permanent chat chrome: rail + sidebar (desktop), full-screen list + tabs
 * (mobile). Wraps pages in the page-session composer store so locally sent
 * messages survive in-tab navigation between /chat/[id] pages.
 */
const ChatLayout = async ({ children, params }: ChatLayoutProps) => {
  const { id } = (await params) ?? {};

  return (
    <ChatComposerProvider>
      <ChatListShell activeId={id}>{children}</ChatListShell>
    </ChatComposerProvider>
  );
};

export default ChatLayout;
