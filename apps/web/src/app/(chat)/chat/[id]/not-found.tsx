import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Not-found page for invalid sample conversation ids under /chat/[id]. */
const ChatNotFoundPage = () => (
  <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
    <p className="text-muted-foreground text-sm">
      That conversation doesn&apos;t exist in the sample data.
    </p>
    <Button asChild variant="outline">
      <Link href="/chat">Back to chats</Link>
    </Button>
  </div>
);

export default ChatNotFoundPage;
