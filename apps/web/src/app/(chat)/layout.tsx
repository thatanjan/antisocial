import type { Metadata } from "next";

import { ChatListShell } from "@/features/chat/components/ChatListShell";

export const metadata: Metadata = {
  title: "Chats | Antisocial",
  description: "Browse sample conversations",
};

interface ChatLayoutProps {
  children: React.ReactNode;
  params?: Promise<{ id?: string }>;
}

/** Permanent chat chrome: rail + sidebar (desktop), full-screen list + tabs (mobile). */
const ChatLayout = async ({ children, params }: ChatLayoutProps) => {
  const { id } = (await params) ?? {};

  return <ChatListShell activeId={id}>{children}</ChatListShell>;
};

export default ChatLayout;
