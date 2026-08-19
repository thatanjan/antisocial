"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getNotifications } from "@/features/notifications/actions/get-notifications";
import { markAllNotificationsRead } from "@/features/notifications/actions/mark-read";
import { NotificationItem } from "@/features/notifications/components/NotificationItem";
import type { NotificationItem as NotificationItemType } from "@/features/notifications/types";
import { groupNotificationsByDate } from "@/features/notifications/utils/notification-lib";

interface NotificationPanelProps {
  /** The trigger element (e.g. a bell button) that opens the panel. */
  trigger: ReactNode;
}

type LoadState =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success" };

/**
 * Sliding panel that lists the current user's notifications, grouped by date,
 * and offers a "mark all as read" action. The trigger (bell) is supplied by the
 * caller so this panel stays decoupled from the badge/icon (T012).
 */
export const NotificationPanel = ({ trigger }: NotificationPanelProps) => {
  const [items, setItems] = useState<NotificationItemType[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [marking, setMarking] = useState(false);

  const load = useCallback(async (signal?: { cancelled: boolean }) => {
    const result = await getNotifications();
    if (signal?.cancelled) return;
    if (result.success) {
      setItems(result.data.notifications);
      setUnreadCount(result.data.unreadCount);
      setState({ status: "success" });
    } else {
      setState({ status: "error", error: result.error });
    }
  }, []);

  useEffect(() => {
    const signal = { cancelled: false };
    void load(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [load]);

  const handleMarkAll = useCallback(async () => {
    setMarking(true);
    const result = await markAllNotificationsRead();
    if (result.success) {
      void load();
    }
    setMarking(false);
  }, [load]);

  const groups =
    state.status === "success" ? groupNotificationsByDate(items) : [];
  const hasUnread = state.status === "success" && unreadCount > 0;

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
        side="right"
      >
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription className="sr-only">
            Your notifications, grouped by date. Use the list to open the
            related content.
          </SheetDescription>
        </SheetHeader>

        {hasUnread && (
          <div className="flex justify-end border-b px-4 py-2">
            <Button
              disabled={marking}
              onClick={() => void handleMarkAll()}
              size="sm"
              variant="ghost"
            >
              Mark all as read
            </Button>
          </div>
        )}

        <ScrollArea className="flex-1">
          {state.status === "loading" && (
            <p className="px-4 py-8 text-center text-muted-foreground text-sm">
              Loading notifications…
            </p>
          )}

          {state.status === "error" && (
            <p className="px-4 py-8 text-center text-muted-foreground text-sm">
              {state.error}
            </p>
          )}

          {state.status === "success" && items.length === 0 && (
            <p className="px-4 py-8 text-center text-muted-foreground text-sm">
              No notifications yet
            </p>
          )}

          {state.status === "success" &&
            items.length > 0 &&
            groups.map((group) => (
              <div key={group.label}>
                <h3 className="sticky top-0 bg-muted px-4 py-2 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
                  {group.label}
                </h3>
                <div className="divide-y">
                  {group.items.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
                </div>
              </div>
            ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
