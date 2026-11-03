import { notFound } from "next/navigation";

import { RoutedChatScreen } from "@/features/chat/components/RoutedChatScreen";
import {
  sampleConversations,
  sampleCurrentUser,
} from "@/features/chat/data/sample-conversations";

interface ChatDetailPageProps {
  params: Promise<{ id: string }>;
}

/** Loads the conversation by route param and renders ChatScreen with sample data. */
const ChatDetailPage = async ({ params }: ChatDetailPageProps) => {
  const { id } = await params;
  const conversation = sampleConversations.find(
    (sampleConversation) => sampleConversation.id === id,
  );

  if (!conversation) {
    notFound();
  }

  return (
    <RoutedChatScreen
      conversation={conversation}
      selfAvatarUrl={sampleCurrentUser.avatarUrl}
    />
  );
};

export default ChatDetailPage;
