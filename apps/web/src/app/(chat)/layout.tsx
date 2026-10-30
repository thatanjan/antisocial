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
  searchParams?: Promise<{ q?: string; filter?: string }>;
}

/**
 * Permanent chat chrome: rail + sidebar (desktop), full-screen list + tabs
 * (mobile). Wraps pages in the page-session composer store so locally sent
 * messages survive in-tab navigation between /chat/[id] pages.
 */
const ChatLayout = async ({
  children,
  params,
  searchParams,
}: ChatLayoutProps) => {
  const { id } = (await params) ?? {};
  const { q = "", filter = "all" } = (await searchParams) ?? {};

  return (
    <ChatComposerProvider>
      <ChatListShell activeId={id} query={{ q, filter }}>
        {children}
      </ChatListShell>
    </ChatComposerProvider>
  );
};

export default ChatLayout;
